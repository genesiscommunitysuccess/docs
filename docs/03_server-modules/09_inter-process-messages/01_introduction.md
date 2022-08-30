---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
---

In this area, we'll look at the standardised message format sent between Genesis processes.


- [GenesisSet](/server-modules/inter-process-messages/genesisSet/) - a generic message format sent between Genesis processes
- [Type-safe messages](/server-modules/inter-process-messages/type-safe-messages/) that perform message serialization and deserialization. These extract metadata information and expose it to the front end. 
- [Metadata annotations](/server-modules/inter-process-messages/metadata-annotations/) that can be applied when defining Kotlin data classes to be used as input `I` message types.

:::info
GenesisSet is a builder class which builds out a standardised message format. It is not a message client. We use an internal messaging component (`genesis-net`) to send these messages (`GenesisSet`).
:::