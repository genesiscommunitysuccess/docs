"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[47319],{79916:function(e){e.exports=JSON.parse('{"label":"database","permalink":"/next/tags/database","allTagsPath":"/next/tags","count":55,"items":[{"id":"database/api-reference/authorisation-api","title":"API Reference - Authorisation API","description":"The authorisation API consists of two main classes that enable you to add permission checks to your custom component.","permalink":"/next/database/api-reference/authorisation-api"},{"id":"database/api-reference/dependency-injection","title":"API Reference - Dependency Injection","description":"Genesis supports some of the key annotations from javax.annotation and javax.inject, defined in Java Platform Enterprise Edition, using Google Guice as the internal dependency injection mechanism. In addition, Genesis provides some of its own annotations.","permalink":"/next/database/api-reference/dependency-injection"},{"id":"database/api-reference/event-handler-api","title":"API Reference - Event Handler API","description":"In most cases, you will create Event Handlers in a kts file using GPAL. This offers a method with succinct code and a good degree of flexibility.","permalink":"/next/database/api-reference/event-handler-api"},{"id":"database/api-reference/network-api","title":"API Reference - Network API","description":"Use these APIs to send and receive messages between micro-services.","permalink":"/next/database/api-reference/network-api"},{"id":"database/api-reference/overview","title":"API Reference - Overview","description":"Genesis is a low-code solution for financial markets. We try to provide as much of the platform via GPAL as possible, while allowing you to extend the platform with more powerful custom components and functionality.","permalink":"/next/database/api-reference/overview"},{"id":"database/api-reference/service-provider-api","title":"API Reference - Service provider API","description":"In this page, we look at details of the functions that enable you to interact with the Genesis services that can be specified in the\xa0service-definition.xml\xa0file.","permalink":"/next/database/api-reference/service-provider-api"},{"id":"database/api-reference/system-definition-api","title":"API Reference - System definition API","description":"The\xa0system-definition\xa0file is the basis of all configurations. In this page, we describe the different functions available to get properties specified in the system-definition.kts file. Default methods have implementations to provide default values for each property.","permalink":"/next/database/api-reference/system-definition-api"},{"id":"database/data-structures/data-structures","title":"Data Structures","description":"The Genesis database supports:","permalink":"/next/database/data-structures/data-structures"},{"id":"database/data-structures/indices","title":"Data Structures - Indices","description":"Indices are key components of any database. In the Genesis low-code platform, they are mandatory when you define a  table. Every table should have at least one index, the primary key. This is vital for controlling how data is read by an application.","permalink":"/next/database/data-structures/indices"},{"id":"database/data-structures/tables","title":"Data Structures - Tables","description":"A table is a data structure that organises data into rows and columns.","permalink":"/next/database/data-structures/tables"},{"id":"database/data-structures/views","title":"Data Structures - Views","description":"Views are defined in the -view-dictionary.kts files as discussed","permalink":"/next/database/data-structures/views"},{"id":"database/data-types/data-types","title":"Data types","description":"The following objects and classes encapsulate your data within your Genesis application, so that you can process it and add value as you see fit.","permalink":"/next/database/data-types/data-types"},{"id":"database/data-types/dbentity","title":"Data types - DbEntity","description":"DbEntity is the common interface implemented by table entities and view entities.","permalink":"/next/database/data-types/dbentity"},{"id":"database/data-types/dbrecord","title":"Data types - DbRecord","description":"Using\xa0DbRecord\xa0instead of\xa0entities will circumvent compile-time validation of database interactions. This means that errors might not appear until runtime or might lead to unexpected results.","permalink":"/next/database/data-types/dbrecord"},{"id":"database/data-types/index-entities","title":"Data types - Index entities","description":"Index entities are nested in\xa0table\xa0and\xa0view entities. The name will be based on the index name. The entity can be constructed by passing in the field values in order. The first field of the index must always be provided, and the others are optional.","permalink":"/next/database/data-types/index-entities"},{"id":"database/data-types/table-entities","title":"Data types - Table entities","description":"Table entities are classes generated by Genesis that match your applications\'s\xa0data model. The generated entity name is based on the table name, but will be camel case.","permalink":"/next/database/data-types/table-entities"},{"id":"database/data-types/views-entities","title":"Data types - Views entities","description":"View entities are classes generated by Genesis that match your application\'s\xa0data model. The name of the view entity that is generated will be the name specified in its definition, but it is converted from snake case to camel case; for example,\xa0VIEW_NAME\xa0becomes\xa0ViewName. All table/view entities implement a common interface called\xa0DbEntity.","permalink":"/next/database/data-types/views-entities"},{"id":"database/database-concepts/database-concepts","title":"Database concepts","description":"This section provides you with details about the three types of operation that you can perform on the database.","permalink":"/next/database/database-concepts/database-concepts"},{"id":"database/database-concepts/read","title":"Database concepts - Read","description":"Genesis supports a number of different read operations. Although the specifics vary between the different\xa0interfaces, the underlying principles remain the same. This page explains these principles, without going into specific calls.","permalink":"/next/database/database-concepts/read"},{"id":"database/database-concepts/subscribe","title":"Database concepts - Subscribe","description":"Subscribe operations enable code to react to database changes, rather than polling for changes. Code can either listen to changes, or use a combined read/subscribe operation. These mixed read/subscribe operations are useful.","permalink":"/next/database/database-concepts/subscribe"},{"id":"database/database-concepts/write","title":"Database concepts - Write","description":"The following database operations are available:","permalink":"/next/database/database-concepts/write"},{"id":"database/database-interface/database-interface","title":"Database interface","description":"Introduction  | EntityDb |  Generated repositories | RxDb","permalink":"/next/database/database-interface/database-interface"},{"id":"database/database-interface/entity-db","title":"Database interface - Entity Db","description":"Introduction  | EntityDb |  Generated repositories | RxDb","permalink":"/next/database/database-interface/entity-db"},{"id":"database/database-interface/generated-repositories","title":"Database interface - Generated repositories","description":"Introduction  | EntityDb |  Generated repositories | RxDb","permalink":"/next/database/database-interface/generated-repositories"},{"id":"database/database-interface/rxdb","title":"Database interface - RxDb","description":"Introduction  | EntityDb |  Generated repositories | RxDb","permalink":"/next/database/database-interface/rxdb"},{"id":"database/database-technology/aerospike","title":"Database Technology - Aerospike","description":"Genesis supports\xa0Aerospike. To connect to Aerospike, use the\xa0system definition items listed below.","permalink":"/next/database/database-technology/aerospike"},{"id":"database/database-technology/faqs","title":"Database Technology - FAQs","description":"Frequently asked questions","permalink":"/next/database/database-technology/faqs"},{"id":"database/database-technology/foundationdb","title":"Database Technology - FoundationDb","description":"Genesis provides two database solutions built on FoundationDB.","permalink":"/next/database/database-technology/foundationdb"},{"id":"database/database-technology/overview","title":"Database Technology - Overview","description":"Your Genesis application data model can be configured without any concern about the database technology used to store the model and the data.","permalink":"/next/database/database-technology/overview"},{"id":"database/database-technology/sql","title":"Database Technology - SQL","description":"SQL support covers PostgreSQL, MS SQL Server and Oracle.","permalink":"/next/database/database-technology/sql"},{"id":"database/fields-tables-views/fields/fields-advanced","title":"Fields - advanced","description":"Modularity","permalink":"/next/database/fields-tables-views/fields/fields-advanced"},{"id":"database/fields-tables-views/fields/fields-basics","title":"Fields - basics","description":"Field types","permalink":"/next/database/fields-tables-views/fields/fields-basics"},{"id":"database/fields-tables-views/fields/fields-examples","title":"Fields - examples","description":"There is no complexity to a fields-dictionary.kts file.","permalink":"/next/database/fields-tables-views/fields/fields-examples"},{"id":"database/fields-tables-views/genesisDao","title":"Generating DAOs","description":"Introduction  | Fields  | Tables  |","permalink":"/next/database/fields-tables-views/genesisDao"},{"id":"database/helper-classes/helper-classes","title":"Helper classes","description":"Helper classes allow you to access common functionality and domain state within the Genesis platform.","permalink":"/next/database/helper-classes/helper-classes"},{"id":"database/helper-classes/modify-details","title":"Helper classes - ModifyDetails","description":"Entity Modify details","permalink":"/next/database/helper-classes/modify-details"},{"id":"database/helper-classes/write-result","title":"Helper classes - WriteResult","description":"Entity write result","permalink":"/next/database/helper-classes/write-result"},{"id":"getting-started/learn-the-basics/building-the-database","title":"Learn the Basics - Building the database","description":"Once you are happy with your data model, you can build your database.","permalink":"/next/getting-started/learn-the-basics/building-the-database"},{"id":"operations/clustering/clusters","title":"Operations - Clusters","description":"The Genesis low-code platform is highly resilient and easy to cluster for a High Availability (HA) setup. This area takes you through the steps required to establish a HOT-HOT setup.","permalink":"/next/operations/clustering/clusters"},{"id":"operations/commands/server-commands","title":"Operations - Server Commands","description":"Genesis has numerous built-in commands that have their own individual functions.","permalink":"/next/operations/commands/server-commands"},{"id":"operations/server-setup/config-management","title":"Server Setup - Config Management","description":"This document describes the recommended uses of config management with Genesis frameworks.  It is written for a reader with some","permalink":"/next/operations/server-setup/config-management"},{"id":"operations/server-setup/host-preparation","title":"Server Setup - Host Preparation","description":"This document describes preparing a host to run applications built with Genesis frameworks.  It is written for a","permalink":"/next/operations/server-setup/host-preparation"},{"id":"operations/server-setup/initial-application-install","title":"Server Setup - Initial Application Install","description":"This document describes installing an application built with Genesis frameworks.  It is written for a reader with some","permalink":"/next/operations/server-setup/initial-application-install"},{"id":"database/helper-classes/subscription/overview","title":"Subscription -  - Overview","description":"When database updates are distributed, they are wrapped in helper classes:","permalink":"/next/database/helper-classes/subscription/overview"},{"id":"database/helper-classes/subscription/bulk","title":"Subscription - Bulk","description":"Bulk objects are published to listeners of mixed read/subscribe operations. Like\xa0Record Update,\xa0Bulk\xa0is a\xa0sealed Kotlin class. It has the following class hierarchy:","permalink":"/next/database/helper-classes/subscription/bulk"},{"id":"database/helper-classes/subscription/record-update","title":"Subscription - Record update","description":"Generic record update","permalink":"/next/database/helper-classes/subscription/record-update"},{"id":"database/fields-tables-views/tables/tables-advanced","title":"Tables - advanced","description":"Subtables","permalink":"/next/database/fields-tables-views/tables/tables-advanced"},{"id":"database/fields-tables-views/tables/tables-basics","title":"Tables - basics","description":"In your application\'s tables-dictionary.kts file, you need to define every table that your application needs. Let us go back to the very simple example definition that we started with. This contains a single table with three fields in it.","permalink":"/next/database/fields-tables-views/tables/tables-basics"},{"id":"database/fields-tables-views/tables/tables-examples","title":"Tables - examples","description":"Our example below shows an application\'s tables-dictionary.kts file containing two tables. The first contains trades and the second contains simple position information for each instrument.","permalink":"/next/database/fields-tables-views/tables/tables-examples"},{"id":"database/types-of-api/types-of-api","title":"Types of API","description":"This section outlines two types of API for interacting with the database:","permalink":"/next/database/types-of-api/types-of-api"},{"id":"database/types-of-api/async","title":"Types of API - Async API","description":"Async |","permalink":"/next/database/types-of-api/async"},{"id":"database/types-of-api/rxjava","title":"Types of API - RxJava API","description":"Async |","permalink":"/next/database/types-of-api/rxjava"},{"id":"database/fields-tables-views/views/views-advanced","title":"Views - advanced","description":"Fields","permalink":"/next/database/fields-tables-views/views/views-advanced"},{"id":"database/fields-tables-views/views/views-basics","title":"Views - basics","description":"A view definition is made up of joins and fields.","permalink":"/next/database/fields-tables-views/views/views-basics"},{"id":"database/fields-tables-views/views/views-examples","title":"Views - examples","description":"Here is an example view-dictionary.kts from our tutorial.","permalink":"/next/database/fields-tables-views/views/views-examples"}]}')}}]);