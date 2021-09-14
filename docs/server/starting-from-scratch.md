---
id: from-zero
title: Starting from scratch
sidebar_label: Starting from scratch

---
This section walks you though how to set up a Genesis project using Maven archetype. At the end you will have generated fields that can be .used in tables and views.

You must have  JDK Maven and IntelliJIDEA in order to do this. These ainstructions are based on JDK 11.0.11, Maven 3.8.1 and IntelliJIDEA 2021.2.

## 1.Generate a new project

Genesis provides a Maven archetype to generate a skeleton project. This will host all the necessary modules and configuration for an application. To use it, open a terminal and execute:

**mvn archetype:generate -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=<group_id> -Dversion=1.0.0-SNAPSHOT -DinteractiveMode=true -DarchetypeVersion=5.2.0 -DartifactId=<artifact_id>**

Note that if your terminal is PowerShell, you must wrap the arguments in quotes:

**mvn archetype:generate "-DarchetypeArtifactId=genesis-archetype" "-DarchetypeGroupId=global.genesis" "-DgroupId=<group_id>" "-Dversion=1.0.0-SNAPSHOT" "-DinteractiveMode=true" "-DarchetypeVersion=5.2.0" "-DartifactId=<artifact_id>"**

Here, we use  **sample.trade** for **groupId** and **trade-101** for **artifactId**. This gives the command:

mvn archetype:generate "-DarchetypeArtifactId=genesis-archetype" "-DarchetypeGroupId=global.genesis" "-DgroupId=sample.trade" "-Dversion=1.0.0-SNAPSHOT" "-DinteractiveMode=true" "-DarchetypeVersion=5.2.0-SNAPSHOT" "-DartifactId=trade-101"

Build the project

Once the project is generated change directory to it and execute mvn package

cd trade-101

mvn package

This will download all necessary dependencies and generate Genesis files required for development

Build Project

Open the project in IntelliJIDEA

Once the project is built you can open it in IntelliJIDEA. The DSL that is used is based on Kotlin and IntelliJIDEA is the recommended IDE. If another one is used the autocompletion and type safety will not be present during development unless additional plugins are installed. Once the project is open you will notice that it's multi module maven project. The README.md contains high level overview of the generated projects.

Project in IntellijIDEA

Starting from the top let's open trade-101-config. It contains all the configuration. Navigate to trade-101-config/src/main/resources/config/ to explore them. Each file is initially empty contain only the skeleton structure. Let's add few fields.

Add Fields

Open trade-101-config/src/main/resources/config/trade-101-fields-dictionary.kts. It's empty looking like this initially.

fields {

}

Go and add the following:

fields {

field("CODE", STRING)

field("CREATED", DATE)

field("PRICE", DOUBLE)

}

While coding you can notice that there is autocompletion that helps with the configuration and its arguments

Fields Code Completion

Generate the Fields

The next project to explore is trade-101-dictionary-cache. It depends on trade-101-config and contains the generated code based on the configuration. To explore the generated code navigate to trade-101-dictionary-cache/target/generated/sources/fields/global/genesis/gen/config/fields/Fields.kt. You will find Fields object with pre-generated literals - those are fields that are commonly used in trading applications so they get generated out of the box for faster development (is this true?). To see the fields you just added generated you will have to build the project again:

mvn package

Going back to the Fields object you will see the new generated fields at the bottom of the file.

New Generated Fields

Next steps

Add tables and views