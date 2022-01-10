---
id: dependencies
title: Dependencies on other Genesis modules
sidebar_label: Dependencies
sidebar_position: 20

---


If you want to include dictionaries from other Genesis applications or modules in your application, you must include these when you create your Maven pom files - both the root pom and the pom for the dictionary cache.

Many applications need to use the Genesis AUTH module, for example. The example below shows the dictionary cache pom for an application called echo, which is adding a dependency on AUTH. This must be specified in the pom in two separate places:

- The **auth-config** folder is identifed in the `Project` block. This ensures that the tables and fields kts files for auth are accessible.
- The **auth-dictionary-cache** is identified in the `Build` block. This sub-module is responsible for most of the DAO generation. 



```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <artifactId>genesisproduct-echo</artifactId>
        <groupId>global.genesis</groupId>
        <version>5.1.0</version>
    </parent>
    <artifactId>echo-dictionary-cache</artifactId>
    <dependencies>
        <!-- depend on config to ensure tables and fields are included in code generation -->
        <dependency>
            <groupId>global.genesis</groupId>
            <artifactId>auth-config</artifactId>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>global.genesis</groupId>
                <artifactId>codegen-maven-plugin</artifactId>
                <version>${genesis.version}</version>
                <inherited>false</inherited>
                <configuration>
                    <generateCache>true</generateCache>
                </configuration>
                <executions>
                    <execution>
                        <phase>generate-sources</phase>
                        <goals>
                            <goal>generateSysDef</goal>
                            <goal>generateFields</goal>
                            <goal>generateDao</goal>
                            <goal>generateView</goal>
                        </goals>
                        <inherited>false</inherited>
                    </execution>
                </executions>
                <dependencies>
                    <!-- depend on dictionary caches in the plugin to speed up compilation -->
                    <dependency>
                        <groupId>global.genesis</groupId>
                        <artifactId>genesis-dictionary-cache</artifactId>
                        <version>${genesis.version}</version>
                    </dependency>
                    <dependency>
                        <groupId>global.genesis</groupId>
                        <artifactId>auth-dictionary-cache</artifactId>
                        <version>${auth.version}</version>
                    </dependency>
                </dependencies>
            </plugin>
        </plugins>
    </build>
</project>
```
You can include multiple dependencies, of course. If our application Echo wants to add a dependency on anoter application, called Foxtrot, we would add these two code blocks in the relevant places. 

In the `Project` codebloack:

```xml
        
        <dependency>
            <groupId>global.genesis</groupId>
            <artifactId>foxtrot-config</artifactId>
        </dependency>

```


In the `Build` codeblock:

```xml
                    <dependency>
                        <groupId>global.genesis</groupId>
                        <artifactId>foxtrot-dictionary-cache</artifactId>
                        <version>${foxtrot.version}</version>
                    </dependency>

```

Now, when you run Maven CodeGen for Echo, it will look inside the dictionary caches for AUTH and Foxtrot, and pull the relevant information. When you run remap on Echo, all the relevant dictionaries are included.

### Dependency scenarios
Deoendencies on ther Genesis applications requires a little care. The Genesis application you are depending on might itself have dependencies. If this is the case, then you must include those dependencies in the pom.

Note that you (obviously) cannot have cirular dependencies.

#### Scenario 1: simple hierarchy
FOXTROT depends on ECHO 

ECHO has no Genesis dependencies 

Foxtrot must specify Echo as adependency.

#### Scenario 2: simple hierarchy with multiple dependencies
FOXTROT depends on ECHO and DELTA

ECHO and DELTA have no Genesis dependencies 

Foxtrot must specify Echo and Delta as dependencies.

#### Scenario 3: tiered hierarchy 
FOXTROT depends on ECHO 

ECHO depends on DELTA

Foxtrot must specify Echo and Delta as dependencies.

#### Scenario 4: Circular dependency - error
FOXTROT depends on ECHO 

ECHO depends on FOXTROT

This will not succeed.

## Changes to the dependencies
If you make any changes to the dictionary of one of these dependencies, it is important to publish the changes or install them locally in your Maven repository. This ensures that the relevant updates are loaded to the application.
