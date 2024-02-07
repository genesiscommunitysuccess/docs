---
title: 'Migration guide: version 6.0 to 7.0'
sidebar_label: 'Migration guide'
sidebar_position: 3
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

In your **gradle.properties** file, bump up `genesisVersion` and all modules in the application to 7.0.0.

```
genesisVersion=7.0.0
authVersion=7.0.0
deployPluginVersion=7.0.0
```
## Modify the build
1. Update your **server/jvm/build.gradle.kts** file so that it references Java 17 (including compiler options) and Kotlin 1.9.

![](/img/java-refs.png)

Still in the **server/jvm/build.gradle.kts** file, add the required directives to support Junit 5 and properties to run tests.

```kotlin {10,14-25} title="server/jvm/build.gradle.kts"
...
subprojects  {
    ...
    tasks {
        ...
        test {
            systemProperty("DbLayer", "SQL")
            systemProperty("DbHost", "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1")
            systemProperty("DbQuotedIdentifiers", "true")
            useJUnitPlatform()

            // Add exports and opens so ChronicleQueue can continue working in JDK 17.
            // More info in: https://chronicle.software/chronicle-support-java-17/
            jvmArgs = jvmArgs!! + listOf(
                "--add-exports=java.base/jdk.internal.ref=ALL-UNNAMED",
                "--add-exports=java.base/sun.nio.ch=ALL-UNNAMED",
                "--add-exports=jdk.unsupported/sun.misc=ALL-UNNAMED",
                "--add-exports=jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED",
                "--add-opens=jdk.compiler/com.sun.tools.javac=ALL-UNNAMED",
                "--add-opens=java.base/java.lang=ALL-UNNAMED",
                "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED",
                "--add-opens=java.base/java.io=ALL-UNNAMED",
                "--add-opens=java.base/java.util=ALL-UNNAMED",
                "--add-opens=java.base/java.nio=ALL-UNNAMED" // this one is opened for LMDB
            )
        }
        ...
    }
}
...
```
![](/img/junit5-directives.png)

Lastly, configure the `copyDependencies` task and replace JavaLanguageVersion.

```kotlin {13-19,28-30,34-36} title="server/jvm/build.gradle.kts"
...
subprojects  {
    ...
    tasks {
        ...
        //testing should use H2 mem db
        test {
            systemProperty("DbLayer", "SQL")
            systemProperty("DbHost", "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1")
            systemProperty("DbQuotedIdentifiers", "true")
        } 

        afterEvaluate {
	        val copyDependencies = tasks.findByName("copyDependencies") ?: return@afterEvaluate

            tasks.withType<Jar> {
                dependsOn(copyDependencies)
            }
        }           
    }
}
tasks {
    ...
}
allprojects {
    ...
    kotlin {
        jvmToolchain {
            (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(17))
        }
    }
    ...
    java {
        toolchain {
            languageVersion.set(JavaLanguageVersion.of(17))
        }
    }
    ...
}
```

![](/img/gradle-properties-copyd.png)

2. In the ** server/jvm/-application_-site-specific/build.gradle.kts ** file, configure the `copyDependencies` task:

```kotlin {4-6}
...
// To give custom name to the distribution package
tasks {
    copyDependencies {
        enabled = false
    }    
    distZip {
        archiveBaseName.set("alpha-site-specific")
        archiveClassifier.set("bin")
        archiveExtension.set("zip")
    }
}
...
```

![](/img/copy-dependencies.png)

3. In the file **server/jvm/-application_- distribution/build.gradle.kts** file, configure the `distTar` task:

```kotlin {3-5}
...
tasks {
    distTar {
        mustRunAfter(":alpha-deploy:copyDependencies")
    }    
    distZip {
        ...
    }
    ...
}
...
```

![](/img/disttar.png)

## Finishing
:::warning Double check
Before running the final commands, make sure your Java and Gradle are running using the required versions (Java 17 and Gradle 8.3).

```bash
java -version
gradle -version
```

Also, make sure your environment variables are set properly, specially `JAVA_HOME` and `PATH`.
:::

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
