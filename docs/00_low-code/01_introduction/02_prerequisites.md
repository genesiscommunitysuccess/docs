---
title: 'Prerequisites'
id: 'prerequisites'
---

# Prerequisites

Our Unified Low-Code offering has the same requirements as our other Low-Code options. Therefore, before progressing with our guides please refer to the below pages to ensure you have the initial set up:

- [Hardware and Software](/low-code/secure/getting-started/prerequisites/hardware-and-software/)
- [Do you need WSL?](/low-code/secure/getting-started/prerequisites/do-you-need-wsl/)
- [The Gradle deploy plugin](/low-code/secure/getting-started/prerequisites/you-can-now-run-genx/)

Additionally: <span style={{color:'red'}}>Should this be in our main prereqs?</span> 

- Credentials for accessing Genesis Artifactory. If necessary, contact your administrator, or [contact us](mailto:support@genesis.global?subject=Quick%20Start%20-%20Artifactory%20Login)
- A gradle.properties file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in clear text:

```shell
genesisArtifactoryUser=<your-artifactory-user>
genesisArtifactoryPassword=<your-artifactory-password>
```