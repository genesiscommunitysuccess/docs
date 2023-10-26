---
id: classpaths
title: Process classpaths
sidebar_label: Process classpaths
sidebar_position: 1

---
# Process classpaths

## Introduction
This article is a deep dive into how we go from the **processes.xml** file created by the `genesisInstall` command, to the `java` command that starts the process.
It explains some of the steps that happen under the covers.

For most use cases, you don't need to understand how the `startProcess` command builds the runtime classpath for each defined process, but it is useful if you want to:

- write extensions to existing platform microservices
- use extension plugins in platform modules outside the core framework

:::note
If you are reading this article, you have probably already built your first application on the Genesis low-code platform; and you have either run it locally using the IntelliJ plugin or deployed it to a server and started it using the server commands.

If you have not, we highly recommend that you do so before continuing to read this article. To understand this section, you must have a working knowledge of the platform's project structure and the key configuration files. 
:::

## Building the classpath
Before we look into what the `startProcess` script does, we need to explain what happens when you build a module on the platform, and what happens when you package all those modules into a distribution for deploying on a server.

### Building a module
When you create a new Genesis project from a seed, every seed template applies the `Genesis Build Plugin`. This plugin is responsible for creating and registering the custom gradle tasks that are required by each module in the project. 

```kotlin
plugins {
    ...
    id("global.genesis.build")
	...
}
```

The task we are particularly interested in here is called `Manifest Creation`. This task creates, populates and adds a manifest file to the resulting jar for each module in the project. The manifest file has an element that is the runtime classpath for that particular module, which is calculated from the gradle dependency tree.

If you want to see what this manifest file looks like, then you can look inside the jar file. A [jar file](https://www.geeksforgeeks.org/jar-files-java/) is just a fancy zip file, so you can unpack or open it with any standard archive manipulation tool, like WinZip or 7Zip on Windows, or the zip command-line utility on Unix.

The manifest can be found in the **META-INF/MANIFEST.MF** file in the jar root.

### Building the distribution
The project distribution module contains all the configuration for creating a Genesis server distribution. The distribution is basically just a zip/tar file (both are produced, although the tar is less widely used) with a specific structure.

It has four directories:

- bin - (Binaries) - contains the jars for each module of the project.
- lib - (Libraries) - contains the jars that are the direct and transitive dependencies of the jars in the bin directory.
- cfg - (Config) - contains the config files for your application.
- scripts - contains the script files for your application.

The distribution module should have a direct dependency on each of the other modules in the project, to ensure their inclusion in the final distribution.

The **lib** directory is built in exactly the same way as the manifest for each individual module -  except that it is specifically the runtime classpath of the distribution module.

### Building the runtime classpath for a process
In the **processess.xml** file, there is a `module` tag; note that the value of this tag corresponds to a specific jar file bundled as part of the framework.

The `startProcess` command uses the `module` tag to work out which jars to add to the classpath of the Java process. All jar files are resolved from the **bin** or **lib** directories in your application's **$GENESIS_HOME/** directory. Every installed distribution is a potential lookup location to find jar files.
This is what happens:

1. The `startProcess` command first resolves the jar file specified in the `module` tag for each process definition; it then reads the manifest of that jar file in order to construct the classpath by looking in the **bin** and **lib** directories of each installed distribution. If a particular jar file specified in the manifest cannot be found, then an error will be thrown.

2. It then does the same thing for any additional jars specified in the `classpath` tag of the process definition. Note that if the jar was not built using the Genesis tools, it will not have a classpath in the manifest and will therefore only add the single jar to the classpath.

This gives you two ways of creating a module, such as an Event Handler:

- You can use the standard pal-eventhandler jar in the framework as the base module, and add custom types using the `classpath` tag.
- Or, you can create a custom module in your project. You then add dependencies on the eventhandler jar from the framework, as well as any custom jars that the module needs. You can then use that jar as the base module in the process definition without any need for a `classpath` tag.

Both these methods are equally valid.

## Wildcard matching
Now that you know how the runtime classpath is built when `startProcess` is called, you may be wondering, "how am I able to upgrade the framework with patch versions without recompiling my apps?".

Good question. The answer is the *wildcard matching* mechanism.

When the `startProcess` command is called and the classpath is being calculated, if the jar is a framework jar (anything matching the pattern __genesis-\*.jar__), then the name of the jar is modified to use a wildcard for the maintenance version.

As an example, if an application is compiled against version 6.7.0 of the platform, then it has this dependency:

```
genesis-db-6.7.0.jar
```

This will be converted to:
```
genesis-db-6.7.*.jar
```

So, if you upgrade the host to a patch version, for example, 6.7.1, then **genesis-db-6.7.1.jar** will still match the pattern and it will be added to the classpath. In this way, apps built using the framework can take framework bug fixes without having to recompile.

The Genesis low-code platform has a strict policy on changes to dependencies or breaking API changes within the same minor version. Any maintenance version within the same minor version always has the same dependency tree to ensure that there are no breaking changes.

## Generated jars
The final thing to mention regarding classpaths is the way that we handle generated code. Each Genesis app has a dictionary-cache module that produces several generated jars:

- *-generated-sysdef.jar
- *-generated-fields.jar
- *-generated-dao.jar
- *-generated-view.jar
- *-generated-hft.jar

These jars are handled separately and are automatically added to the classpath of every process. *So, make sure that they are excluded from the manifest of any custom module in your project*.

This is because the jars built when your project is built might not necessarily contain all the required information, depending on what project configuration you are using. 

### Build-time code generation (recommended)
If you are generating your DAOs as part of the app at build time, they need to be given a specific versioning scheme as part of the build. The runtime environment has a separate mechanism for resolving these specific jars, *so they must still be excluded from module manifests*.

### runtime code generation (remap)
If you are using `remap` to generate code at runtime, the number of external distributions (and therefore, tables that are part of the codegen process) might not be known until the application is deployed. *So, these jars must still be excluded from module manifests*.

### Creating a reusable component
If you are working on a re-usable platform component, then the schema defined in your module is designed to be composed into a larger application schema. *So, the generated jars must still be excluded from module manifests.*

To ensure that generated jars are excluded from the module manifests when building, use the `compileOnly` scope in gradle.

```
compileOnly(project(path = ":<project>-dictionary-cache", configuration = "codeGen"))
```
