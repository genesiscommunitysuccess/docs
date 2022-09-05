---
title: 'Application seeds'
sidebar_label: 'Application seeds'
id: application-seeds
---
````mermaid
flowchart LR
   a1[Quick Start Application Seed] -->|Genx|b1[Quick Start Application]
   a2[Position App Seed] -->|Genx|b2[Position Application]
   a3[Hello World App Seed] -->|Genx|b3[Hello World Application]
   a4[Foundation App Seed] -->|Genx|b4[Foundation Application]
    subgraph  Artifactory
    a1
    a2
    a3
    a4
    end
    subgraph Workstation
    b1
    b2
    b3
    b4
    end
````
The GenX CLI provides several application seeds. An application seed is a scaffolded project that can be used as a starting point for future development. For this tutorial, we are going to select the `Quick Start Application` seed when prompoted by the genX CLI.

```
? Create a app in current directory Yes
? App name positions-app-tutorial
? App seed Quick Start Application
```
