---
title: 'Overview'
id: overview
---

# Overview

We believe that developers should be able to create and deploy rich, compliant and high-performance applications in days, not weeks. GPALX is our full-stack low-code platform aimed at delivering that vision.

Developers are facing a number of challenges today:
* Multiple languages, tools and conventions to learn
* High level of technical expertise required
* Familiarity with Genesis-specific concepts

GPALX addresses these issues in several ways. Firstly, it provides a holistic full-stack framework for implementing both UI and server functionality. It also favours declarative approach over imperative allowing developers to focus on their business domain rather than implementation details. Finally, it leverages standard industry terms and knowledge. In summary, GPALX aims to be:

* **Productive** - declarative, typesafe and debuggable
* **Familiar** - uses established concepts in event-driven systems and database design
* **Extensible** - can be extended with new components and capabilities
* **Open** - designed as an open standard and based on [Kotlin](https://kotlinlang.org/)

## Origin

GPALX builds on [GPAL](../../../server/GPAL/introduction/) (Genesis Platform Abstraction Language). GPAL allows you to define your application layer (with an exception of user interface) as well as configure aspects of runtime layer:

* **Application layer**: data model, logic, integrations and UI​
* **Runtime layer**: configurable high-performance services

![](/img/layers.png)

With GPAL you use a combination of low-code and pro-code approaches to deliver an application (for example you can only build user interfaces in pro-code mode). On the other hand, GPALX enables you to use low-code approach across the whole stack - both server and UI. This dramatically reduces the amount of boilerplate code, which leads to increased productivity.

GPALX also comes with an improved DSL (domain-specific language), which is more consistent and employs standard industry concepts.

## Features

GPALX supports a number features common in financial applications:

### Integrations

You can leverage external data sources and real-time or request / reply​ servers:

* **Abstracted data pipeline paradigm**: integrations are abstracted into a pipeline paradigm of sources, sinks and mappings
* **Custom transforms**: transform functions can be used for complex type conversions, data obfuscation or enriching values
* **Real-time and request / reply**: data can be consumed as a continuous stream or as a snapshot

### Data model

You can define and map business objects as fields, tables and state machines:

* **Relational database paradigm**: business objects are defined as fields and tables, composed into reusable modules
* **Built-in sequence and audit**: changes to tables are fully-audited with native support for sequenced and auto-incrementable fields
* **Manually or automatically created**: can be created manually in low-code or automatically from relational databases and Excel files

### Business logic

You can create business logic as well-defined events, transitions and materialised views:

* **Events**: well-defined events with two-phase validation, triggered by user actions or conditions
* **Views**: real-time materialised views across any connected data sources with in-line calculations and aggregation
* **Transitions**: object states and their transitions are centrally-described and coupled to events

### User interface

You can design rich, interactive UIs with the Genesis design system:

* **Pages**: applications are organised as discrete pages with built-in state management
* **Components**: suite of UI components from basic controls through to complete microfrontends, bound to data sources and events
* **Design systems**: out-of-the-box design system tailored for data dense financial markets applications, or use existing design assets

## Recap

* GPALX provides seamless full-stack tooling for Web and server
* It provides a declarative DSL (domain-specific language) which leverages standard industry concepts
* It supports many common financial application features out of the box
