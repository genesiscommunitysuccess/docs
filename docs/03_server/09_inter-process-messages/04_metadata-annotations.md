---
title: 'Inter-process messages - metadata annotations'
sidebar_label: 'Metadata annotations'
id: metadata-annotations
keywords: [server, inter-process messages, metadata, annotations, json schema]
tags:
  - server
  - inter-process messages
  - metadata
  - annotations
  - json schema
---

# Metadata annotations

The following annotations are found in the package `global.genesis.message.core.annotation` and can be applied when defining Kotlin data classes to be used as input `I` message types.

As an example, these input types can be used in Event Handlers and custom Request Servers (see [type-safe messages](../../../server/inter-process-messages/type-safe-messages/)). 

It is important to note that these annotations will influence the automatic generation of relevant [Json schema](https://json-schema.org/) definitions within the backend metadata system, as well as enforcing transparent validation checks.

:::caution

The `UniqueItems` annotation will generate a Json schema `uniqueItems` definition. Unfortunately, the current specification of `uniqueItems` means that only primitive values will be checked for uniqueness (i.e. string, integer, etc), as opposed to fully fledged object definitions. One of the consequences is that it is currently impossible to use Json Schema and allow for advanced `uniqueItems` checks, including unique `id` checks. See discussions around key-based uniqueness in [here](https://github.com/json-schema-org/json-schema-vocabularies/issues/22).

:::

| Annotation name | Targets | Parameters | Description |
|----|----|----| --- |
| Title | Property and class | title: String | Suggests a human readable name for the annotated class or property
| Description | Property and class | description: String | Suggests a human description for the annotated class or property
| StringConstant | Property | constant: String | Defines a constant value, which is always expected for a property
| MinItems | Property | minItems: Int | Defines a minimum number of items for a list type property
| MaxItems | Property | maxItems: Int | Defines a maximum number of items for a list type property
| UniqueItems | Property | none | Marks a list type property as unique items only
| MinLength | Property | minLength: Int | Defines a minimum number of characters in a String property
| MaxLength | Property | maxLength: Int | Defines a maximum number of characters in a String property
| Pattern | Property | pattern: String | Defines an expected regular expression pattern for a String property
| ShortMin | Property | min: Short | Defines the minimum value expected for a Short property 
| ShortMax | Property | max: Short | Defines the maximum value expected for a Short property 
| IntMin | Property | min: Int | Defines the minimum value expected for an Int property 
| IntMax | Property | max: Int | Defines the maximum value expected for an Int property
| LongMin | Property | min: Long | Defines the minimum value expected for a Long property
| LongMax | Property | max: Long | Defines the maximum value expected for a Long property
| DoubleMin | Property | min: Double | Defines the minimum value expected for a Double property
| DoubleMax | Property | max: Double | Defines the maximum value expected for a Double property
| BigDecimalMin | Property | min: String | Defines the minimum value expected for a BigDecimal property
| BigDecimalMax | Property | max: String | Defines the maximum value expected for a BigDecimal property
