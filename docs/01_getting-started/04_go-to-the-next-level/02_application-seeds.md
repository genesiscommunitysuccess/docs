---
title: 'Application seeds'
sidebar_label: 'Application seeds'
id: application-seeds
---
````mermaid
flowchart LR
   a1[Blank Seed] -->|Genx - Gsf Version,etc...|b1[Blank Application]
   a2[Position App Seed] -->|Genx|b2[Position Application]
    subgraph  Artifactory
    a1
    a2
    end
    subgraph Workstation
    b1
    b2
    end
````
The GenX CLI comes up bundled with several application seeds. An application seed is scaffolded project that can be used as a starting point for future development. If you are eager to see `positions-app-tutorial` running with all the code generated for you then you can select `Positions App Seed` from the GenX CLI tool and head to [See it work](/getting-started/go-to-the-next-level/see-it-work/)

```
? Create a app in current directory Yes
? App name positions-app-tutorial
? App seed Positions Application
```
