---
id: fields-from-scratch
sidebar_label: Generate fields from scratch
sidebar_position: 10
title: Generate fields from scratch

---
## Introduction

This exercise walks you though how to set up a Genesis project using a [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html). At the end, you will have generated fields that can be  used later in tables and views.

## Prerequisites

You will need between 5 and 10 minutes to finish this exercise.

Required software:

* JDK 11
* Maven
* IntelliJ IDEA

Versions used while writing this guide:

* JDK 11.0.11
* Maven 3.8.1
* IntelliJ IDEA 2021.2.1

:::note
You will need access to the Maven repository that provides the Genesis Platform.
:::

## Steps

This exercise has the following steps:
1. Generate the project.
2. Build the project.
3. Open the project in IntelliJ.
4. Add the fields.
5. Rebuild the project to generate the fields.

### Generate the project

Genesis provides a [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html) to generate a skeleton project that will host all the necessary modules and configuration for an application. To use it, open a terminal and execute:

```bash
mvn archetype:generate -DarchetypeArtifactId=genesis-archetype -DarchetypeGroupId=global.genesis -DgroupId=<group_id> -Dversion=1.0.0-SNAPSHOT -DinteractiveMode=true -DarchetypeVersion=5.2.0 -DartifactId=<artifact_id>
```

Note that if your terminal is PowerShell you will have to wrap the arguments in quotes, like this:

```powershell
mvn archetype:generate "-DarchetypeArtifactId=genesis-archetype" "-DarchetypeGroupId=global.genesis" "-DgroupId=<group_id>" "-Dversion=1.0.0-SNAPSHOT" "-DinteractiveMode=true" "-DarchetypeVersion=5.2.0" "-DartifactId=<artifact_id>"
```

For this guide `sample.trade` for `groupId` and `trade-101` for `artifactId` will be used. The final command would be:

```powershell
mvn archetype:generate "-DarchetypeArtifactId=genesis-archetype" "-DarchetypeGroupId=global.genesis" "-DgroupId=sample.trade" "-Dversion=1.0.0-SNAPSHOT" "-DinteractiveMode=true" "-DarchetypeVersion=5.2.0" "-DartifactId=trade-101"
```

### Build the project

Once the project is generated, change directory to it and execute `mvn package`.

```bash
cd trade-101
mvn package
```

This will download all the necessary dependencies and generate the Genesis files that are required for development

:::note
Make sure you have access to the Maven repository that provides the Genesis Platform;  otherwise, this step will fail
:::

![Build Project](/img/built_project.png)

### Open the project in IntelliJ IDEA

Once the project is built, you can open it in IntelliJ IDEA. The DSL that is used is based on Kotlin and IntelliJ IDEA is the recommended IDE. If a different IDE is used, you win't have access to the autocompletion and type safety during development, unless additional plugins are installed.

Once the project is open, you will notice that it is a [multi module maven project](https://maven.apache.org/guides/mini/guide-multiple-modules.html). The `README.md` contains a high-level overview of the generated projects.

![Project in Intellij IDEA](/img/open_generated_project.png)

Starting from the top, let's open `trade-101-config`. It contains all the configuration. Navigate to `trade-101-config/src/main/resources/config/` to explore them. Each file is initially empty, containing only the skeleton structure. Let's add a few fields.

### Add Fields

Open `trade-101-config/src/main/resources/config/trade-101-fields-dictionary.kts`. It's empty, and looks like this initially.

```kotlin
fields {
}
```

Add three fields, as you see below:

```kotlin
fields {
    field("CODE", STRING)
    field("CREATED", DATE)
    field("PRICE", DOUBLE)
}
```

While coding, note that autocompletion helps with the configuration and its arguments.

![Fields Code Completion](/img/field_autocompletion.png)

### Generate the Fields

Now look at the `trade-101-dictionary-cache`. This depends on `trade-101-config` and contains the generated code based on the configuration. 
To explore the generated code, navigate to `trade-101-dictionary-cache/target/generated/sources/fields/global/genesis/gen/config/fields/Fields.kt`. You will find the `Fields` object with pre-generated literals. These are fields that are commonly used in trading application,s so they get generated out-of-the-box for faster development. To see the fields you have just added, you will have to build the project again:

```bash
mvn package
```

Going back to the `Fields` object, you will now see the new generated fields at the bottom of the file.

![New Generated Fields](/img/the_new_generated_fields.png)

## Conclusion

Congratulations! You just created a Genesis project from scratch, added few fields and generated the code for them.