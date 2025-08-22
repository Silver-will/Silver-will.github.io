---
title: GPU driven rendering and bindless resources. A modern approach to generating draw commands.
excerpt: Blog post detailing my engine wide refactor earlier this year with the purpose of switching to a completely GPU Driven approach to rendering meshes and some of my musings on bindless engine design
publishDate: 'Aug 7 2025'
tags:
  - Graphics programming
  - Vulkan
seo:
  image:
    src: '/post-1.jpg'
    alt: A person standing at the window
---

![A person standing at the window](/renderdoc.png)

In recent years, the way rendering engines schedule and create work has evolved, gone are the days of culling, sorting and generating draw commands on the CPU while the GPU waits for work. Nowadays with the advent of the Draw indirect API and compute shaders, we can just perform all our mesh culling work on the GPU via a compute shader dispatch, feed our output into a buffer and use that buffer as an argument to our vkCmdDrawIndirect call.

## wip