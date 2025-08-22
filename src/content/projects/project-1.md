---
title: 'Black key.'
description: Black key is a rendering engine written in vulkan with the goal of building out a modern and modular framework for my experiments in realtime rendering and computer graphics.
publishDate: 'Aug 05 2025'
image: 'sponza.jpg'
seo:
  image:
    src: '/sponza.png'
    alt: Project preview
---

![Project preview](/sponza.png)
[Rendering Engine Source Code](https://github.com/Silver-will/Black_Key)


**Project Overview:**
A 3D rendering engine written in vulkan, utliziing modern features such as Dynamic rendering and vertex pulling with an entirely GPU Driven pipeline and bindless resources to maximize performance and much more.
This post will serve as a frame analysis describing anatomy of a rendered frame in black key and some of the logical reasoning behind the architectural decisions i've taken.

## Table of Contents
0. [Engine Architecture](#engine-architecture)
1. [Asset Loading and Mesh merging](#asset-loading-and-mesh-merging)
2. [Pre-Process passes](#pre-process-passes)
    - [IBL irradiance map and brdf lut generation](#ibl-setup)
    - [View Frustum AABB cluster Generation](#cluster-generation)
3. [GPU Culling](#compute-cull)
    - [Frustum culling](#frustum-cull)
    - [Occlusion culling](#occlusion-cull)
4. [Indirect Draw Call generation](#Indirect-draw-command-recording)
5. [Z Pre-Pass](#z-pre-pass)
6. [Cascaded Shadow Maps + PCF filtering](#csm)
7. [Clustered light culling](#clustered-light-culling)
8. [Forward Pass](#forward-pass)
    - [Bindless material Indexing](#material-indexing)
    - [PBR + IBL](#pbr-and-ibl)
    - [Clustered Shading](#clustered-shading)
8. [Draw-Sky-Box](#draw-sky-box)
9. [Depth-Reduction](#depth-reduce)
10. [Draw Post process](#draw-post-process)

# Engine Architecture

Black key was designed from the ground up to Be an entirely GPU driven and bindless renderer with the end goal of maximizing GPU performance while siginificantly reducing CPU overhead.
I wrote it to allow easy protoyping of several Graphics techniques / Demo scenes by allowing the declaration of individual renderers inherited from the **BaseRenderer** class similar to legit engine.
Something like:

```
    
struct VoxelConeTracingRenderer : public BaseRenderer
{
	void Init(VulkanEngine* engine) override;
	void Cleanup() override;

	void Draw() override;
	void DrawUI() override;
	void Run() override;

	void InitImgui() override;

	void LoadAssets() override;
	void UpdateScene() override;

};
```

This allows for quite the clean main loop when running and initializing individual renders:
```
int main(int argc, char* argv[])
{
	auto engine = std::make_shared<VulkanEngine>();
	
	std::unique_ptr<BaseRenderer> VXGIDemo = std::make_unique<VoxelConeTracingRenderer>();
	
	VXGIDemo->Init(engine.get());
	VXGIDemo->Run();
	VXGIDemo->Cleanup();
	engine->cleanup();	

	return 0;
}
	
```
The engine is structured quite simply, the class **VulkanEngine** serves as the main abstraction over the vulkan instance and device at initialization and is a required argument for any renderer inheriting from **BaseRenderer** base class.
At startup the engine class is the first to be initiated by passing requested vulkan features and function.
Alongside the VulkanEngine, our ResourceManager and SceneManager are passed our engine variable and initialized. The former handling all asset loading, buffer allocation and deallocation alongside image allocation and deallocation.
This would look something like

```

//Request required GPU features and extensions
//vulkan 1.3 features
VkPhysicalDeviceVulkan13Features features{ .sType = VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_3_FEATURES };
features.dynamicRendering = true;

//vulkan 1.2 features
VkPhysicalDeviceVulkan12Features features12{ .sType = VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_2_FEATURES };
features12.bufferDeviceAddress = true;

VkPhysicalDeviceVulkan11Features features11{ .sType = VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_1_FEATURES };
features11.shaderDrawParameters = true;
	
VkPhysicalDeviceFeatures baseFeatures{};
baseFeatures.geometryShader = true;
	
engine->init(baseFeatures, features11, features12, features);
resource_manager = std::make_shared<ResourceManager>(engine);
scene_manager = std::make_shared<SceneManager>();
scene_manager->Init(resource_manager, engine);
this->assets_path = GetAssetPath();
```

# Asset Loading and Mesh merging
The engine currently only supports 3d models of the gltf2.0 file type and uses fastgltf on the backend for quick loading.
Immediately after all our meshes are loaded in, we then begin preparation for GPU driven rendering by merging all our vertex and index buffers into singular large buffers. This is done to accomodate the usage of **VkCmdDrawIndexedIndirect** which expects a buffer this also has the advantage of allowing us to bind vertex and index buffers only once! For geometry with similar material properties at least(PBR materials, phong materials or objects with just diffuse).

The mesh merging is handles by our **SceneManager** within 2 for loop that looks something like:

```
for (auto& m : renderables)
{
	m.firstIndex = static_cast<uint32_t>(total_indices);
	m.firstVertex = static_cast<uint32_t>(total_vertices);

	total_vertices += m.vertexCount;
	total_indices += m.indexCount;
	if (mesh_buffer == m.meshBuffer)
	{
		last_mesh_vert_size += m.vertexCount;
		last_mesh_indice_size += m.indexCount;

		m.meshBuffer->mesh_info.mesh_vert_count = last_mesh_vert_size;
		m.meshBuffer->mesh_info.mesh_indice_count = last_mesh_indice_size;
	}
}

for (auto& m : renderables)
{			
	VkBufferCopy vertex_copy;
	vertex_copy.dstOffset = sizeof(Vertex) * m.firstVertex;
	vertex_copy.size = sizeof(Vertex) * m.vertexCount;
	vertex_copy.srcOffset = 0;
	vkCmdCopyBuffer(cmd, m.vertexBuffer, merged_vertex_buffer.buffer, 1, &vertex_copy);
		
		
	VkBufferCopy index_copy;
	index_copy.dstOffset = sizeof(uint32_t) * m.firstIndex;
	index_copy.size = sizeof(uint32_t) * m.indexCount;
	index_copy.srcOffset = 0;
	vkCmdCopyBuffer(cmd, m.indexBuffer, merged_index_buffer.buffer, 1, &index_copy);
}

```

# Pre Process Passes
Before we even start rendering the frame we dispatch a few compute shaders and regular to compute some offline work.

The first of these is our IBL pre-computations including the usual Prefilter, irradiance map and brdf Lut texture generation, there are currently 2 implemenations of this process. The first using compute shaders dispatch and the second with the traditional graphics pipeline and a full screen quad.
Not really much to compare here since both are offline computations.
