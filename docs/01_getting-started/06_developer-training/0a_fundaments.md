---
id: fundamentals
title: Fundamentals
sidebar_label: Fundamentals
sidebar_position: 1

---

Creating financial markets technology today is fundamentally broken – too slow, expensive and high-risk. Genesis is revolutionising software delivery within the financial markets so that any coder can create reactive, performant and compliant applications in days.

The aim of this page is to give you a high-level understanding of the Genesis low-code development platform, taking you through what it is, why it is and what it does. This will include the following topics: 

- Motivation of the Genesis Platform.
- What is the Genesis Low-Code Platform?
- Building Blocks and Components.
- Platform Tooling.
- Architecture & Technology.
- Application Elements.
- Demo

## Genesis Low-Code Platform

### What is a platform?

Originally, a complete software programming development environment and underlying subsystem (Forbes, 2015). This could be a combination of language, runtime, libraries, and supporting tooling. It's more than just a framework but might include one. In practice, it is anything that you can build upon. 

The Genesis Low-code Platform is opinionated about software architecture, application design, deployment, monitoring and levels of abstraction available. These opinions help accelerate developers, which retains as much flexibility for use-cases as possible.

### What is a low-code platform?

"A low-code application platform is an application platform that supports rapid application development, one-step deployment, and execution and management using declarative, high-level programming abstractions, such as model-driven and metadata-based programming languages. They support the development of user interfaces, business logic and data services; improve productivity; and are typically delivered as cloud services."

Gartner, 2022

The Genesis Platform is targeted at developers.

With this, we aim to increase time to market speed, application velocity and lower the cost of development.


### What can I build with the Genesis Platform?

While being flexible enough to cover most application use-cases, it also provides some foundational components for high-performance, low-latency applications. Central to our architecture is an event-driven system that can scale to millions of events per day with easy fan-out to connected web clients.

Here are some examples:

#### Non-functional

- Real-time data subscriptions. 
- Low latency feed ingestion. 
- High transaction volume. 
- Secure APIs. 
- High availability and clustering. 
- Integration with LDAP or SAML (SSO).

#### Data

- Aggregated data views.
- Ad-hoc req/response queries.
- Stream data from/to external relational databases.
- Full audit trail is automatically provided.

#### Application

- Event handlers for applying custom business logic.
- Permissioned access. 
- Workflow & auditing requirements. 
- Responsive, rich user workflows and UI.

#### Functional

- Process financial instruments.
- Event-driven processing triggered by user actions or rules. 
- Calculation of positions, data consolidation in general.

## Building Blocks

### Back to the Definition

A low-code application platform is an application platform that supports rapid application development, one-step deployment, and execution and management using declarative, high-level programming abstractions, such as model-driven and metadata-based programming languages. They support the development of user interfaces, business logic and data services; improve productivity; and are typically delivered as cloud services.

The components in the library enable quick, flexible and scalable application development.

### Core Platform Components

The core platform components form a common base and work with other platform elements to enable enterprise-ready features with little or no build effort.

Here are some examples for you to consider:

| BUILDING BLOCKS / COMPONENTS	        |                                 CAPABILITIES                              | 
|--------------------------------------|:-------------------------------------------------------------------------:|
| Auth Manager, Perms Manager	         |   Provides industrial-strength authentication and entitlements management.|
| Cluster                              |               Enables high-availability and horizontal scaling            |
| Router, Connect, Services Repository |            UI connectivity and load balancing to server services.         |
| Database API, NOSQL, SQL             |High-performance persistence supporting next-generation database technologies.|

### Technical Components

The technical components enable development of scalable apps quickly and efficiently, leveraging event-driven architecture and real-time data distribution.

Examples of technical components can be found in the table below:

| EXAMPLE BUILDING BLOCKS / COMPONENTS	 |                                     CAPABILITIES                                      | 
|---------------------------------------|:-------------------------------------------------------------------------------------:|
| Transactional, Handler                |               Process high throughput and highly complex transactions.                |
| Event Handler                         |            Allows event-driven architecture and complex event processing.             |
| Data Server                           | Real-time data distribution in highly performant, low latency and complex structures. |
| Consolidation Manager                 |                      Efficient data consolidation and analytics.                      |

### Business Components

Business components combine with technical components for financial markets-specific integration and functionality.

These components and their capabilities can be seen here:

| EXAMPLE BUILDING BLOCKS / COMPONENTS	 |                    CAPABILITIES                    | 
|---------------------------------------|:--------------------------------------------------:|
| FIX                                   |                   FIX messaging.                   |
| Bloomberg TOMS                        |        Bloomberg TOMS for treasury trading.        |
| Murex                                 |       Integration with legacy vendor Murex.        |
| ION Trading                           |        Integration to the Fidessa OMS.             |
| Pershing                              |        Comprehensive integration to Nexus.         |
| SS&C Geneva                           | Trades, positions, balances & margin requirements. |
### Custom Components

Custom components configure purpose-specific microservice components that extend functionality while remaining scalable.
This allows you to do the following:

- Create using your choice of languages including Java, Python, Groovy, or R.
- Enable seamless app functionality with database access, component management, and component orchestration.
- Deliver lasting benefits with resiliency and scalability.

## Platform Tooling

Genesis tools allow developers to bring their visions to life, quickly.

In the table below we can see a number of Genesis tools, their uses and capabilities. 

| USE	    | EXAMPLE TOOLS	    |                                        CAPABILITIES                                         |
|---------|-------------------|:-------------------------------------------------------------------------------------------:|
| Create  | Genesis Studio    |            Graphical environment for building Genesis applications with No Code.            |
| Create  | Genesis SDK       | Framework for building Genesis applications in Low Code with the Genesis Platform Language. |
| Migrate | Excel Integration |  Transform Excel worksheets into Genesis applications and synchronize cells in real-time.   |
| Migrate | DB Integration    | Transform relational databases into Genesis applications and synchronize data in real-time. |
| Operate | GEM               |               Cloud-agnostic management and auditing of Genesis environments.               |
| Operate | Console           |            Monitoring status, exploring log files and querying application data.            |

## Platform Architecture

The Genesis low-code platform has a real-time event-driven architecture built with microservices:

- Scale and fail independently.
- Develop with agility.
- Audit with ease.

Below we have a diagram demonstrating the components within the User Interface as well as the server. 

![](/img/platform-architecture.png)

## Application Elements

### Elements of any Application

When it comes to creating applications using the Genesis Platform, there are some elements that an application usually consists of and steps that we would recommend following. These are as follows:

- Define your Data Model.
- Define you Business Logic.
- Integrate with other Systems.
- Create User Interfaces.
- Control Access.

These five steps are a roadmap for creating and application and will be the five steps used in the tutorials following this page.

### The Elements of any Application

#### GPAL

The elements of any Genesis Platform app are powered by a type-safe layered system which combines an easy to learn Kotlin-based Domain Specific Language (DSL) with transparent references between layers to ensure code changes are minimal when working with our technical components (e.g. dataservers, event handlers, request replies, etc) and our data schema layer.

- The different layers of the architecture are: configuration | fields schema, tables schema | view schema | runtime.
- Each layer has its own Kotlin DSL plus specific code generation attached to it. 
- Each layer also builds on top of the previous one, so changes in the bottom can be propagated to the next layers on top (i.e. changes in the fields schema could affect runtime DSL).

#### Why GPAL?

- To accelerate development with a concise and integrated way to declare configuration and even business logic. 
- Any changes in a component are reflected automatically in the metadata exposed by our server endpoints, so any consumer of them (including our Web framework) can understand exactly what each endpoint expects as an input and provides as an output. 
- This is incredibly useful when building a solution, as it allows us to self-inflate grids and forms automatically using our tools (i.e. Genesis Console) so we can discover, test and visualize a whole server environment without writing a single line of UI code.

## GPAL

Let’s see how it works with some practical examples.

### Configuration file

````kotlin
systemDefinition {
    global {
        item(name = "NULLABILITY_FOR_TRADE_FIELDS", value = "false")
    }
}
````
### Fields File

```Kotlin
fields {
    field(name = "COUNTERPARTY_ID", type = STRING) 
    field(name = "COUNTERPARTY_CODE", type = STRING, nullable = false)
    field(name = "INSTRUMENT_ID", type = STRING)
    field(name = "INSTRUMENT_CODE", type = STRING)
    field(name = "ALTERNATE_TYPE", type = STRING, nullable = false)
    field(name = "NAME", type = STRING)
    field(name = "ENABLED", type = BOOLEAN)
    field(name = "COUNTERPARTY_LEI", type = STRING)
    field(name = "MARKET_ID", type = STRING)
    field(name = "COUNTRY_CODE", type = STRING)
    field(name = "CURRENCY_ID", type = STRING)
    field(name = "ASSET_CLASS", type = STRING)
}
```

### Data Model and Configuration

As seen in the code sample below, automatic auditing and the reuse of fields with intellisense are allowed for. As well as this, data model changes can be made without DBA.

```kotlin
  table(name = "TRADE", id = 11000, audit = details(id = 11000, sequence = "TA", tsKey = true)) {
      sequence(TRADE_ID, "TR")
      INSTRUMENT_ID
      COUNTERPARTY_ID
      QUANTITY
      SIDE
      PRICE
      TRADE_DATETIME
      ENTERED_BY
      TRADE_STATUS
      
      primaryKey{
          TRADE_ID
      }
  }

table(name = "INSTRUMENT", id = 11001, audit = details(id = 11001, sequence = "IA", tsKey = true)) {
    sequence(INSTRUMENT_ID, "IN")
    INSTRUMENT_NAME
    primaryKey{
        INSTRUMENT_ID
    }
}

table(name = "COUNTERPARTY", id = 11002, audit = details(id = 11002, sequence = "CA", tsKey = true)) {
    sequence(COUNTERPARTY_ID, "CP")
    COUNTERPARTY_NAME
    primaryKey{
        COUNTERPARTY_ID
    }
}
```

### Data Views

```kotlin
view ("TRADE_VIEW", TRADE) {

    joins {
      joining(COUNTERPARTY) {
        on(TRADE.COUNTERPARTY_ID to COUNTERPARTY.COUNTERPARTY_ID)
      }
      joining(INSTRUMENT) {
        on(TRADE.INSTRUMENT_ID to INSTRUMENT.INSTRUMENT_ID)
      }
    }

    fields {
      TRADE.allFields()
      COUNTERPARTY.NAME withPrefix COUNTERPARTY
      INSTRUMENT.NAME withPrefix INSTRUMENT
        
      derivedField("CONSIDERATION", DOUBLE) {
        withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->
          QUANTITY * PRICE
        }
      }
    }
  }
```
### Distributing Data

As can be seen via the code snippets below, the platform handles connection management and data streaming out of the box and binds actions to event handlers.

```kotlin
dataServer{
    query("ALL_TRADES", TRADE_VIEW)
}
```

```xml
<zero-ag-grid rowHeight="45">
    <ag-genesis-datasource resourceName="ALL_TRADES" orderBy="TRADE_DATETIME" />
</zero-ag-grid>
```

![](/img/UI.png)

### Business Logic

A typical event handler file can be seen below:

```kotlin
eventHandler{
    eventHandler<Trade>(name = "TRADE_INSERT"){
        onValidate { event->
            val trade = event.details
            verfiy{
                entityDb hasEntry Counterparty.ById(trade.counterpartyId)
                entityDb hasEntry Instrument.ById(trade.instrumentId)
            }
            ack()
        }
        onCommit { event ->
            val trade = event.details
            trade.enteredBy = event.userName
            entityDb.insert(trade)
            ack()
        }
    }
}
```
:::note
With GPAL all layers are well integrated and a single change is propagated to the others.

This makes it easy to learn and removes a lot of unnecessary code.
:::

### Automatic Integration

Microservices and resources built as part of any Genesis application will have automatic and native API support.
![](/img/automatic-integration.png)

### Integrations

Genesis supports a wide range of 3rd party integrations. Some of these are listed here:

![](/img/integrations-2.png)

### Data Model Configuration

- Built for the financial markets.
- Based on Web Components (leveraging Microsoft FAST) for performance & accessibility.
- Composed into micro front-ends.

Web Components allow us to provide reusable building blocks and app functionality which work seamlessly with today’s popular web frameworks and any that may become popular in the future.


### Platform Capabilities

- Supercharging developers: Enhancing productivity of professional developers with full-stack development expertise.
- Powerful framework, runtime & tools: Full-featured framework and tools for building financial markets applications.
- Proven enterprise-grade solutions: Range of standalone applications in production across use cases, from spreadsheet replacements to high-performance core applications.

The Genesis Platform has been developed on the back of years of experience delivering software applications for some of the largest financial firms in the world. There was a clear need for a more targeted approach to support the requirements of financial markets software.​

Custom logic and behavior can be added where needed and being built on the JVM, it enables access to a mature ecosystem of libraries used in the industry.

The platform includes a modern, high-performance web application solution, enabling developers to build branded UIs quickly while leveraging data models and real-time features of the server.

Our web stack is built using modern web platform features, integrating easily with existing web stacks such as Angular and React.

As well as this, the Genesis Platform provides some foundational components for high-performance, low-latency applications. Central to our architecture is an event-driven system that can scale to millions of events per day with easy fan-out to connected web clients.

### Next Steps

Let's get you set up!