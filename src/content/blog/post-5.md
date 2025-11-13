---
title: A waltz with Voxel Global Illumination.
excerpt: My experience, tips and common pitfalls to watch out for when implemenenting voxel cone traced global illumination in your rendering engine.
publishDate: 'November 15 2025'
tags:
  - Graphics programming
  - Vulkan
seo:
  image:
    src: '/vxgi_diffuse.png'
    alt: Diffuse GI example
---

![Cone traced Diffuse GI](/vxgi_diffuse.png)

# Introduction to Global illumination
If your goal with your renderer's visuals is realism, then most would agree that cannot be achieved without global illumination or at least an accurate enough approximation of the effect.

To understand Global illumination we must be able to understand  direct illumination.

Direct illumination simply refers to the effect of radiance transmitted from an emitter / light source directly to the 3D object being illuminated. This "Direct" lighting has been transmitted straight to the target object without being reflected or refracted by other objects in the scene.
Below we can see the popular crytek Sponza with the effect of direct illumination.

![Direct Illumination](/direct.png)

In comparison Global illumination takes into account the radiance that is not only directly transmitted from an emitter but light that has been reflected and bounced around the scene.
It accounts for the contribution of the reflected color from other items in the scene when computing the final irradiance at a point.

The above property naturally makes your scene look far more realistic as in the real world 

![Indirect Diffuse Contribution](/vxgi_diffuse.png)
## wip