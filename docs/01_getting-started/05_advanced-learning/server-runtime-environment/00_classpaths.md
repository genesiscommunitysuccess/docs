---
id: classpaths
title: Process Classpaths
sidebar_label: Process Classpaths
sidebar_position: 1

---
# Process Classpaths

## Introduction
If you are reading this article, you have likely built your first application using the Genesis Platform, and have either run it locally using the IntelliJ plugin or deployed it to a server and started it using the server commands.

If you have not, we highly recommend you go and do so before continuing to read this article. Understanding the content here requires a working knowledge of the platform project structure and some of the configuration files. 

For most basic uses cases, it is not necessary to understand how the `startProcess` command builds the runtime classpath for each defined process, but it is useful if you want to write extensions to existing platform microservices, or use extension plugins in platform modules outside of the core framework.

This article will do a deep dive into how we go from the processes.xml file created by the `genesisInstall` command, to the `java` command that starts the process, and explain some of the steps that happen under the covers.

## Building the Classpath
Before we dive into what the `startProcess` script does, we first need to explain what happens when you build a module with the Genesis framework, and what happens when you package all those modules into a distribution for server deployment.

### Building a Module
When you create a new Genesis project from a seed, every seed template will apply something called the `Genesis Build Plugin`:

```kotlin
plugins {
    ...
    id("global.genesis.build")
	...
}
```

This plugin is responsible for creating and registering the custom gradle tasks required for each of the modules in the project. The one we are particularly interested in here is called `Manifest Creation`. 

This task will create, populate and add a manifest file to the resulting jar for each module in the project. The manifest file has an element which is the runtime classpath for that particular module, calculated from the gradle dependency tree.

If you want to see what this manifest file looks like, then you can peek inside the jar file. A jar file is just a fancy zip file, so you can unpack or open it with any standard archive manipulation tool, like WinZip or 7Zip on Windows, or the zip command line utility on Unix.

The manifest can be found in the META-INF/MANIFEST.MF file in the jar root.

### Building the Distribution
The project distribution module contains all the configuration for creating a Genesis server distribution. The distribution is basically just a zip/tar file (both are produced, although the tar is less widely used) with a specific, known structure.

It has four directories:
- bin - (Binaries) - contains the jars for each module of the project
- lib - (Libraries) - contains the jars which are the direct and transitive dependencies of the jars in the bin directory
- cfg - (Config) - contains the config files for your application
- scripts - contains the script files for your application.

The distribution module should have a direct dependency on each of the other modules in the project, to ensure their inclusion in the final distribution.
The lib directory is built in exactly the same way as the manifest for each individual module, except it is specifically the runtime classpath of the distribution module.

### Building the Runtime Classpath for a Process
In the processess.xml file, you will see that there is a `module` tag, and may have also noticed that the value of this tag corresponds to a specific jar file bundled as part of framework.

The way the `startProcess` command works out which jars to add to the classpath of the java process starts with this tag. All jar files are resolved from the `$GENESIS_HOME/<product>/bin|lib` directories. Every installed distribution is a potential lookup location to find jar files.

The `startProcess` first resolves the jar file specified in the `module` tag for each process definition, then reads the manifest of that jar file in order to construct the classpath by looking in the `bin` and `lib` directories of each installed distribution. If a particular jar file specified in the manifest cannot be found, then an error will be thrown.

Additionally, it will do the same thing for any additional jars specified in the `classpath` tag of the process definition. Note that if the jar was not built using the genesis tools, it will not have a classpath in the manifest and will therefore only add the single jar to the classpath.

In this way, you can either create an event handler using the standard pal-eventhandler jar in the framework as the base module, and add custom types using the `classpath` tag, or create a custom module in your project. You would add dependencies on the eventhandler jar from the framework, as well as custom jars you want to add. You would then use that jar as the base module in the process definition without any need for a `classpath` tag. Both are equally valid.

## Wildcard Matching
Now that you know how the runtime classpath is built when `startProcess` is called, you may be wondering: "How am I able to upgrade the framework with patch versions without recompiling my apps?".
Good question. The answer is the *wildcard matching* mechanism.

When the `startProcess` command is called and the classpath is being calculated, if the jar is a framework jar (anything matching the pattern *genesis-\*.jar*) then the name of the jar is modified to use a wildcard for the maintenance version.

As an example, if an application was compiled against version 6.7.0 of the platform, then it would have as a dependency:
```
genesis-db-6.7.0.jar
```

This will be converted to:
```
genesis-db-6.7.*.jar
```

So if you upgrade the host to a patch version, for example, 6.7.1, then genesis-db-6.7.1.jar which still match the pattern and it will be added to the classpath. In this way apps built using the framework can take framework bug fixes without having to recompile.
This does mean however that we have to have a strict policy on any changes to dependencies or breaking API changes within the same minor version.

## Generated Jars
The final thing to mention regarding classpaths is the way that we handle generated code. Each genesis app has a dictionary-cache modules, that produces several generated jars:
- *-generated-sysdef.jar
- *-generated-fields.jar
- *-generated-dao.jar
- *-generated-view.jar
- *-generated-hft.jar

These jars are handled separately and are always added to the classpath of every process. For this reason, it is important to make sure that these jars are always excluded from the manifest of the modules you build.

This is because the jars built when your project is built may or may not contain all the required information depending on what project configuration you are using. 

If you are using a new project structure, then DAOs are generated as part of the app at build time, however they need to be given a specific versioning scheme as part of the build. The runtime environment has a separate mechanism for resolving these specific jars, so they still should be excluded from module manifests.

If you are using an older project setup, your project may expect that code generation happens on the host as part of the remap process. In this case the number of external distributions and therefore tables that are part of the codegen process may not be known until the application is deployed.

If you are working on a re-usable platform component, then the schema defined in your module is designed to be composed into a larger application schema, and the jars definitely should not be shipped as part of the distribution.

The way to ensure that generated jars are exlcluded from the module manifests when building is to use the `compileOnly` scope in gradle.

```
compileOnly(project(path = ":<project>-dictionary-cache", configuration = "codeGen"))
```