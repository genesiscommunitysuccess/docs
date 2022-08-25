---
title: 'Prerequisites'
id: 'prerequisites'
---

# Prerequisites

Flow has the same requirements as our other Genesis platform options. Therefore, before progressing with our guides please refer to the below pages to ensure we have the initial set up:

- [Hardware and Software](/getting-started/prerequisites/hardware-and-software/)
- [Do you need WSL?](/getting-started/prerequisites/do-you-need-wsl/)
- [The Gradle deploy plugin](/getting-started/prerequisites/you-can-now-run-genx/)

Additionally:

- Credentials for accessing Genesis Artifactory. If necessary, contact your administrator, or [contact us](mailto:support@genesis.global?subject=Quick%20Start%20-%20Artifactory%20Login)
- A gradle.properties file inside a **.gradle** folder in the user directory; this file must contain your Genesis Artifactory password in clear text:

```shell
genesisArtifactoryUser=<your-artifactory-user>
genesisArtifactoryPassword=<your-artifactory-password>
```
## GenX CLI
####
GenX is a CLI tool that enables the use of seed projects that adhere to best practices for development on the Genesis low-code platform.


### Installation
To install GenX, use the following command in the terminal:
:::important
Our Flow seed is currently only available on a particular version, therefore we need to uninstall any previous version and specify the one we need.
:::

```shell
npm uninstall -g @genesislcap/foundation-cli
npm install -g @genesislcap/foundation-cli@2.0.1-alpha-4ce6685.0+4ce6685
```