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
The GenX CLI comes up bundled with several application seeds. An application seed is a scaffolded project that can be used as a starting point for future development. To run the `positions-app-tutorial` with all the code generated for you, select `Positions App Seed` from the GenX CLI tool and then select [See it work](/getting-started/go-to-the-next-level/see-it-work/).

```
? Create a app in current directory Yes
? App name positions-app-tutorial
? App seed Positions Application
```
