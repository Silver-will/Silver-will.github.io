---
title: 'Clustered Forward shading'
description: Optimizing point light rendering with the end result of having thousands of point lights in a scene on an low range intel IGPU at interactive rates! 
publishDate: 'Aug 1 2025'
isFeatured: true
seo:
  image:
    src: '/clustered_lights.png'
    alt: 'Project preview'
---

![Project preview](/clustered_lights.png)
[Source code can be found within my rendering engine](https://github.com/Silver-will/Black_Key)

**Project Overview:**
Last month i thought i'd work on optimising the pixel shader invocation cost for the forward lighting pass in my renderer.
This effort took me from implementing a Z-Prepass(Which did cut down my Pixel shader invocation cost quite significantly with MSAA 8X enabled) and finally converged on refactoring my forward renderer into a clustered forward one.

# Classical forward shading
The classical approach of rendering objects would normally have the GPU perform all lighting calculations on every generated fragment even those to be discarded after the depth test, this is because depth testing only occurs during the ouptut merger
phase after the fragment shader pass, this may already seem wasteful but rather pales in comparison to the heavy pixel shaders
lighting calculations being carried out on fragments completely outside each lights effective radius for none directional lights even if the effect of said light is completely being attenuated.
In Pseudo Code a forward renderer would effectively be doing this:

```
vec4 lightContribution;

for(int i = 0; i < pointLightCount; i++)
{
  PointLight pl = pointLights[i];
  lightContribution += CalculatePointlightContribution(N,V,pl,WorldPos);
}

for(int i = 0; i < spotLightCount; i++)
{
  SpotLight sl = spotLights[i];
  lightContribution += CalculateSpotlightContribution(N,V,sl,WorldPos);
}

```

For every single generated Fragment.
This may not seems so bad until you have maybe a complex game level with a few dozen lights  

## Clustered forward shading


## WIP