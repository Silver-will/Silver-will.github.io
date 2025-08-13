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

For every single generated Fragment. This may not seems so bad until you have maybe a complex game level with a few dozen lights  

## Clustered forward shading


## Implementation details

1. **Dynamic Destination Timelines:**

- Users can explore destinations through dynamic timelines, showcasing significant historical events, cultural developments, and architectural milestones.
- Interactive sliders allow users to navigate through different eras, providing a visual representation of the historical evolution of each location.

2. **Interactive Historical Events:**

- Users can click on specific points in the timeline to reveal detailed information about key historical events related to the chosen destination.
- Rich multimedia content, including images, videos, and articles, provides a comprehensive understanding of each event.

3. **Personalized Time Travel Planner:**

- A personalized planner feature enables users to create their time travel itineraries by selecting specific eras and destinations.
- The system suggests thematic experiences, such as attending historical events or meeting famous personalities.

4. **Time-Port Virtual Reality Experience:**

- For an extra layer of immersion, users can opt for the Time-Port VR experience, allowing them to virtually step into different time periods and explore the surroundings in 360 degrees.

5. **Chronicle Explorer Blog:**

- A blog section, "Chronicle Explorer," offers in-depth articles and stories about various historical periods and their impact on the destinations featured on the platform.
- Users can engage with the content, comment, and share their own historical insights.

## Technology Stack

- **Frontend:** [Astro.js](https://astro.build/) for a dynamic and responsive user interface and [Tailwind CSS](https://tailwindcss.com/) for styling.
- **Backend:** Node.js for handling server-side logic and API integration.
- **Database:** MongoDB for efficient storage and retrieval of historical data.
- **VR Integration:** A-Frame framework for creating immersive virtual reality experiences.

## Outcome

The TimeWarp Travel Agency Website successfully brings the concept of time travel to life, providing users with a captivating and educational experience. The website not only serves as a travel planning tool but also as an interactive platform that encourages users to explore and appreciate the rich tapestry of human history.

**Note:** This case study is entirely fictional and created for the purpose of showcasing [Dante Astro.js theme functionality](https://justgoodui.com/astro-themes/dante/).
