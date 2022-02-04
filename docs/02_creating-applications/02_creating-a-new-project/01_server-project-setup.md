---
id: server-project-setup
title: Server project setup
sidebar_label: Server project setup
sidebar_position: 1

---

If you want to start a new Genesis project from scratch, you can do this using a predefined maven archetype. This page takes you through the steps to achieve this. When you have finished, you will have a standard project structure and you will have generated fields that can be used in tables and views.


You must have JDK Maven and IntelliJ IDEA in order to do this. These instructions are based on JDK 11.0.11, Maven 3.8.1 and IntelliJ IDEA 2021.2.

## 1. Generate a new project

Genesis provides a Maven archetype to generate a skeleton project. This will host all the necessary modules and configuration for an application. To use it, open a terminal and execute:

```bash
mvn archetype:generate -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=<group_id> -Dversion=1.0.0-SNAPSHOT -DinteractiveMode=true -DarchetypeVersion=5.2.0 -DartifactId=<artifact_id>
```

Note that if your terminal is PowerShell, you must wrap the arguments in quotes:

```bash
mvn archetype:generate "-DarchetypeArtifactId=genesis-archetype" "-DarchetypeGroupId=global.genesis" "-DgroupId=<group_id>" "-Dversion=1.0.0-SNAPSHOT" "-DinteractiveMode=true" "-DarchetypeVersion=5.2.0" "-DartifactId=<artifact_id>"
```

Here, we use  **sample.trade** for **groupId** and **trade-101** for **artifactId**. This gives the command:

```
mvn archetype:generate "-DarchetypeArtifactId=genesis-archetype" "-DarchetypeGroupId=global.genesis" "-DgroupId=sample.trade" "-Dversion=1.0.0-SNAPSHOT" "-DinteractiveMode=true" "-DarchetypeVersion=5.2.0" "-DartifactId=trade-101"
```

## 2. Build the project

Once the project has been generated, change directory to the new directory and execute the mvn package:

```bash
cd trade-101
mvn package
```

This downloads all the necessary dependencies and generates Genesis files you need for development.

## 3. Open the project in IntelliJ IDEA

Once the project has been built, you can open it in IntelliJ IDEA. This is the recommended IDE, which ensures you can use autocompletion and type safety - really important tools for speedy development.

Once the project is open, note that it is multi-module Maven project. The README.md contains a high-level overview of the generated projects.

Starting from the top, let's open **trade-101-config**. It contains all the configuration. Navigate to **trade-101-config/src/main/resources/config/** to explore them. Each file is initially empty, and contains only the skeleton structure. 

## 4. Add some fields

Open **trade-101-config/src/main/resources/config/trade-101-fields-dictionary.kts**. The empty files looks like this:

```kotlin
fields {

}
```

We can add three simple fields to make a start:

```kotlin
fields {
    field(name = "CODE", type = STRING)
    field(name = "CREATED", type = DATE)
    field(name = "PRICE", type = DOUBLE)
}
```

While coding, note that autocompletion helps with the configuration and its arguments.

So that was easy. Now you know what your fields file looks like.

## 5. Generate the Fields

Now look at **trade-101-dictionary-cache**. It depends on **trade-101-config** and contains the generated code based on the configuration. To explore the generated code, navigate to **trade-101-dictionary-cache/target/generated/sources/fields/global/genesis/gen/config/fields/Fields.kts**. 

Here, you will find a Fields object with pre-generated literals - these are fields that are commonly used in trading applications; they have been generated out-of-the box to help you develop faster. To see the fields you have just added, you need to build the project again:

```bash
mvn package
```

Go back to the Fields object. You can now see the newly generated fields at the bottom of the file.

After this, you will be able to look at your tables and views.