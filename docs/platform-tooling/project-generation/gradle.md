---
id: gradle
title: Gradle
sidebar_label: Gradle
sidebar_position: 1
---
# Gradle

Unlike Maven, Gradle does not have a standard approach to scaffolding projects. The easiest way to scaffold a Genesis Gradle project is to use the *Genesis Maven Plugin*. This plugin requires similar inputs to the [maven archetype](./maven.md), and it is able to create a variety of Gradle project structures. Alternatively, we provide a CLI tool which is available as part of the platform distribution zip file.

The current supported Gradle project templates are:

- GRADLE_PRO_CODE: Generates a backend multi-module project with .kts files (sysdef, fields, tables and views) for configuration. This follow the traditional server development approach,

- GRADLE_NO_CODE: Generates a backend multi-module project with .json files  (module-config, fields, tables and views) for configuration. The .json files are compatible with the format Genesis Studio expects, and hence could be used in a project that uses the Genesis no-code tooling.

- GRADLE_SITE_SPECIFIC: Generates a server side simplified site-specific project

- GRADLE_MULTI_PRO_CODE: Generates a frontend/backend project structure using Gradle to combine both projects into a single build. The server side configuration will use .kts files.

- GRADLE_MULTI_NO_CODE: Same as the previous one, but using .json files.

Additionally, all projects can optionally be generated with artifactory publication configuration (see `--artifactoryEnabled` argument in the table below), and the projects with GRADLE_MULTI flavour can also generate a site-specific module when using the `--siteSpecificEnabled` argument.

## CLI/Maven plugin arguments

The available CLI arguments and maven plugin JVM properties are the following:

| Arg Short name     | Arg Long name | JVM Property | Required | Description | Default
| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| `-a` | `--artifactId` | `-DartifactId` | yes | Artifact ID (i.e. name of application) |  |
| `-g` | `--groupId` | `-DgroupId` | no | Project group ID | global.genesis |
| `-v` | `--version` | `-Dversion` | no | Project version | 1.0.0-SNAPSHOT |
| `-gv` | `--genesisVersion` | `-DgenesisVersion` | no | Genesis server version to use | Same version as maven/cli tool |
| `-kv` | `--kotlinVersion` | `-DkotlinVersion` | no | Kotlin version to use | Same Kotlin version used in maven/cli tool |
| `-grv` | `--gradleVersion` | `-DgradleVersion` | no | Gradle version | Same gradle version used in Genesis build |
| `-t` | `--templateChoice` | `-DtemplateChoice` | no | Template project to generate. Available choices are: `GRADLE_NO_CODE`, `GRADLE_PRO_CODE`, `GRADLE_SITE_SPECIFIC`, `GRADLE_MULTI_NO_CODE`, `GRADLE_MULTI_PRO_CODE` | `GRADLE_PRO_CODE` |
| `-b` | `--basepath` | `-Dbasepath` | no | The base path in which the project will be generated | The base path will be a new folder in the local directory with the following name based on the artifactId provided value. If `GRADLE_MULTI`: `artifactId`; If `GRADLE_NO_CODE` or `GRADLE_PRO_CODE`: `artifactId-server`; If `GRADLE_SITE_SPECIFIC`: `artifactId-site-specific`. |
| `-ae` | `--artifactoryEnabled` | `-DartifactoryEnabled` | no | If enabled, this option will generate artifactory deployment configuration for the gradle server artifacts based on the internal genesis repositories. | false |
| `-se` | `--siteSpecificEnabled` | `-DsiteSpecificEnabled` | no | If enabled, this option will generate a site-specific project if a `GRADLE_MULTI` template is chosen. | false |
| `-njsv` | `--nodeJsVersion` | `-DnodeJsVersion` | no | The nodejs version to use when generating `GRADLE_MULTI` projects | 16.13.0 |
| `-npmv` | `--npmVersion` | `-DnpmVersion` | no | The npm version to use when generating `GRADLE_MULTI` projects | 8.1.0 |
| `-djs` | `--downloadNodeJs` | `-downloadNodeJs` | no | Enables an automatic download of NodeJS if not installed locally. The instalation will be done locally to the project as part of the the gradle build initialisation. | false |

### Sample CLI usage

`GenerateProject -a test -t GRADLE_MULTI_PRO_CODE`

### Sample Maven plugin usage

`mvn global.genesis:genesis-maven-plugin:createProject -DartifactId=test -DtemplateChoice="GRADLE_MULTI_PRO_CODE"`