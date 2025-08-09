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


**Project Overview:**
A 3D rendering engine written in vulkan, utliziing modern features such as Dynamic rendering and vertex pulling with an entirely GPU Driven pipeline and bindless resources to maximize performance and much more.
This post will serve as a frame analysis describing anatomy of a rendered frame in black key and some of the logical reasoning behind the architectural decisions i've taken.

## Table of Contents
0. [Engine Architecture](#engine-architecture)
1. [Asset Loading and Mesh merging](#gpu-driven-preparation)
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
    - [light cluster indexing](#clustered-shading)
8. [Draw-Sky-Box](#draw-sky-box)
9. [Depth-Reduction](#depth-reduce)
10. [Draw Post process](#draw-post-process)

# Engine Architecture