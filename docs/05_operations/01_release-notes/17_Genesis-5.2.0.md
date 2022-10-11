---
id: genesis-5.6.0
title: 'Genesis-5.6.0'
sidebar_label: 'Genesis-5.6.0'
sidebar_position: 17

---

## Feature highlights

### **Integrated IDE included within the Genesis Platform**

The integrated IDE enables users to access the pro/low code capabilities of the platform even in environments that won’t allow a locally installed IDE.

### **Seamless integration between Genesis Studio no-code tooling and pro-code**(local IDE)

This integration enables switching between a pro-code developer using an IDE (e.g. IntelliJ), and a no-code user (Genesis Studio), so both can work together on the same project concurrently, with both IDE pro-code and Genesis Studio no-code options integrated in a single user interface.

Genesis Integrated IDE and Integrated no-code tooling in side-by-side mode on the desktop

![image002.png](/img/G520-illustration-1.png)

In a browser

![image003.png](/img/G520-illustration-2.png)

### **Improved documentation**

Improvements  across the entire platform, with **additional tutorials and examples** like the Positions App helping the learning curve towards building great applications using Genesis.

### **New** **GPAL file definition for Genesis Notify**

Enables simpler configuration of the Genesis Notify microservice (used to send e-mails, Symphony notifications, e.t.c.) and brings it inline with our latest GPAL system

### New View database API

All the Views now have database API usage which worked previously for tables now works exactly the same way for views now. Having a consistent approach makes this easier to learn and use, and simplifies the documentation.

### New database API operations

There are 2 **new database API operations**, “updateAll” and “updateBy” giving more flexibility and simplicity to building solutions.

A **new criteria evaluator for dataservers** which greatly simplifies applying filters on a data server query, with automatic field mapping between different types. For example if you use text to describe a "date" type filter (e.g. "2015-03-01") we automatically transform it to the required internal date type and still perform the correct filter operation, making this much easier to use.

### HashiCorp Vault

Native integration with HashiCorp Vault within the GPAL system definition file, so you can link and use secret values directly within the genesis property system.
This can be done by adding a `vault` tag in the `global`, `system` or `host`
tags. The vault tag has three sub tags, `config`, `sslConfig` and `readSecrets`. Of
these three, `config` and `readSecrets` are required:

```kotlin
vault {
  config {
    ...
  }
  sslConfig {
    ...
  }
  readSecrets {
    ...
  }
}

```

### Positions Demo App

Positions app now has FIX Drop Copy integration and will have Refinitiv market data within a few days.  We have integrated web and server side into a single repository with a unified toolchain to ease development, and within a few days will have the whole project runnable from a combined deployment.  We will pick up documentation and a video over Christmas and likely first week of new year.

Comprehensive release notes are available on the following link:

[https://genesisglobal.atlassian.net/wiki/spaces/DTASERVER/pages/2687533059/5.2.0+Release+Key+Features+Breaking+changes](https://genesisglobal.atlassian.net/wiki/spaces/DTASERVER/pages/2687533059/5.2.0+Release+Key+Features+Breaking+changes)

## Marketing

### Genesis Studio now accessible from VS Code

Genesis Studio, the visual development environment for the Genesis platform, is now accessible directly from the VS Code IDE. Implemented as an IDE plug-in, this new capability enables professional developers to seamlessly switch between pro-code and no-code within VS Code, with planned support for additional IDEs such as IntelliJ in future.

Developed in close collaboration with our fledgling developer community, this release continues our commitment to supercharging developer productivity and is the foundation for further enhancements to IDE-centric workflows.

### Vault integration

The Genesis platform now integrates with HashiCorp Vault, an identity-based secrets and encryption management system. All secrets such as API keys or database credentials can now be sourced securely from Vault, further enhancing security and control of Genesis applications, particularly in cloud-based environments.

This development is part of a broader initiative around Genesis’ already class-leading enterprise security, with further development planned across authorisation and authentication.

### Data processing and distribution enhancements

The Genesis database API and dataserver have been enhanced, bringing further simplicity and efficiency to building high-performance Low Code / No Code applications. New operations for updating objects provide greater flexibility, while new filter criteria give greater precision when querying data for UI consumption.

Data processing and distribution is at the heart of complex, financial markets applications - these investments further enhance performance and simplicity for all use cases.