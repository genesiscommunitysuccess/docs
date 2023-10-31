---
title: 'Migration guide: version 6.0 to 7.0'
sidebar_label: 'Migration guide'
sidebar_position: 2
id: migration-6-7
keywords: [operations, release notes, OCT 2023]
tags:
- operations
- release notes
- migration
---

Version 7.0.0 of the Genesis platform requires Java version 17 and gradle version 8.3.
:::info
If you have an existing application running on version 6 of the Genesis platform and you are using gradle, these instructions will enable you to migrate to version 7 of the platform without difficulties.
For applications running on older versions of the platform, please contact your Genesis representative.
:::
## Upgrade references to the artifacts
To migrate an existing application to version 7.0.0:
1. In your **gradle.properties** file, bump up `genesisVersion` and all modules in the application to 7.0.0.
```
genesisVersion=7.0.0
authVersion=7.0.0
deployPluginVersion=7.0.0
```
## Modify the build
1. Update your **server/jvm/build.gradle.kts** file so that it references Java 17 (including compiler options) and Kotlin 1.9.

![](/img/java-refs.png)

2. configure the `copyDependencies` task in this file:

```
afterEvaluate {
	        val copyDependencies = tasks.findByName("copyDependencies") ?: return@afterEvaluate

            tasks.withType<Jar> {
                dependsOn(copyDependencies)
            }
        }
```

![](/img/gradle-properties-copyd.png)

3. In the ** server/jvm/-application_-site-specific/build.gradle.kts ** file, configure the `copyDependencies` task:

```
copyDependencies {
	    enabled = false
    }
```

![](/img/java-refs.png)

4. In the file **server/jvm/-application_- distribution/build.gradle.kts** file, configure the `distTar` task:

```
distTar {
	    mustRunAfter(":alpha-deploy:copyDependencies")
    }
```

![](/img/disttar.png)

## Finishing
After modifying the gradle files, open a terminal in the folder where you have your project; then upgrade the gradle wrapper:

```
gradle wrapper --gradle-version=8.3
```
Then you need to repeat the command in the **server/jvm** folder:

```
cd server/jvm
gradle wrapper --gradle-version=8.3
```

After you have done this:
-	If everything has worked, a distribution will be generated - congratulations! You have migrated your application to Genesis 7.
-	If there are errors, you need to search through the release notes for all your modules to check for breaking changes.
