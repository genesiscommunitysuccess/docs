---
title: 'Prerequisites'
id: 'prerequisites'
---

# Prerequisites

Flow has the same requirements as our other Genesis platform options. Therefore, before progressing with our guides please refer to the below pages to ensure you have the initial set up:

- [Hardware and Software](/getting-started/prerequisites/hardware-and-software/)
- [Do you need WSL?](/getting-started/prerequisites/do-you-need-wsl/)
- [The Gradle deploy plugin](/getting-started/prerequisites/you-can-now-run-genx/)

Additionally: <span style={{color:'red'}}>Should this be in our main prereqs?</span> 

- Credentials for accessing Genesis Artifactory. If necessary, contact your administrator, or [contact us](mailto:support@genesis.global?subject=Quick%20Start%20-%20Artifactory%20Login)
- A gradle.properties file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in clear text:

```shell
genesisArtifactoryUser=<your-artifactory-user>
genesisArtifactoryPassword=<your-artifactory-password>
```
## GenX CLI
####
GenX is a CLI tool that enables you to pull seed projects that adhere to best practices for development on the Genesis low-code platform.
### Expected Result
By the end of this step, you should have:
- GenX CLI installed and available on any terminal

This will start you on your journey to building application functionality.


### Installation
Let's start by installing GenX using the following command in your terminal:
:::note
Our Flow seed is currently only available on a particular version, therefore we need to uninstall any previous version and specify the one we need.
:::

```shell
npm uninstall -g @genesislcap/foundation-cli
npm install -g @genesislcap/foundation-cli@2.0.1-alpha-4ce6685.0+4ce6685
```