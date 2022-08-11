---
title: 'gpl-server-ksp README'
sidebar_label: 'gpl-server-ksp README'
id: gpl-server-ksp
---

# Debugging

You can use the below command to help debug the gpl-ksp module.
For example, if running kspKotlin in gpl-test project, you would use below command:

`gradlew.bat kspKotlin --no-daemon -Dorg.gradle.debug=true -Dkotlin.compiler.execution.strategy=in-process`