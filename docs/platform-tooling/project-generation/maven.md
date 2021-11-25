---
id: maven
title: Maven
sidebar_label: Maven
sidebar_position: 2
---

# Maven

## Genesis Archetype 

Using a [maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html) is a common way of scaffolding a maven project with bare minimum input from the user. In order to accelerate app development, genesis provides an archetype which can be used to create a skeleton application in just a few steps.


### Command line

The easiest way to create a new server side projec is to use this mvn command: 


`mvn archetype:generate -B -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=global.genesis -Dversion=1.0.0-SNAPSHOT -DinteractiveMode=false -DarchetypeVersion=genesis.version -DartifactId=productName`

This should be run a single line command, the new line is there to make it easier to read. Also the parameters on the second row are the only ones you should change.

| Parameter      | Description |
| ----------- | ----------- |
| `-DinteractiveMode`      | If true will ask to confirm input       |
| `-DarchetypeVersion`   | This will be the framework version used in the new project  |
| `-DartifactId`   | This will be the new project name  |

Just make sure to replace productName with the name of the product, and genesis.version with the framework version.

Running this will create a new folder with the specified productName and you should be able to open the project in intellij.

### IntelliJ

You can also add the archetype in Intellij using the archetype maven coordinates mentioned above. This is not as straightfoward however, as it needs to be added again everytime you want to generate a project from IntelliJ.

