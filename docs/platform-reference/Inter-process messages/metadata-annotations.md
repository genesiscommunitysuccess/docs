---
id: metadata-annotations
title: Metadata annotations
sidebar_label: Metadata annotations
sidebar_position: 3
---

# Metadata annotations

The following annotations are found in the package `global.genesis.message.core.annotation` and can be applied when defining Kotlin data classes to be used as input `I` message types. As an example, these input types can be used in event handlers and custom request replies (see [type-safe messages document](type-safe-messages.md)). IMPORTANT! These annotations do not currently enforce validation checks in the backend and are informative only. As an example, if `MinLength` and `MaxLength` is used to annotate a metadata property for a String, the backend will not be checking the size of it automatically.

| Annotation name | Targets | Parameters | Description |
|----|----|----| --- |
| Title | Property and class | title: String | Suggests a human readable name for the annotated class or property.
| Description | Property and class | description: String | Suggests a human description for the annotated class or property.
| StringConstant | Property | constant: String | Defines a constant values which is always expected for a property.
| MinItems | Property | minItems: Int | Defines a minimum number of items for a list type property.
| MaxItems | Property | maxItems: Int | Defines a maximum number of items for a list type property.
| UniqueItems | Property | none | Marks a list type property as unique items only.
| MinLength | Property | minLength: Int | Defines a minimum number of characters in a String property.
| MaxLength | Property | maxLength: Int | Defines a maximum number of characters in a String property.
| Pattern | Property | pattern: String | Defines an expected regular expression pattern for a String property.
| ShortMin | Property | min: Short | Defines the minimum value expected for a Short property.
| ShortMax | Property | max: Short | Defines the maximum value expected for a Short property.
| IntMin | Property | min: Int | Defines the minimum value expected for an Int property.
| IntMax | Property | max: Int | Defines the maximum value expected for an Int property.
| LongMin | Property | min: Long | Defines the minimum value expected for a Long property.
| LongMax | Property | max: Long | Defines the maximum value expected for a Long property.
| DoubleMin | Property | min: Double | Defines the minimum value expected for a Double property.
| DoubleMax | Property | max: Double | Defines the maximum value expected for a Double property.
| BigDecimalMin | Property | min: String | Defines the minimum value expected for a BigDecimal property.
| BigDecimalMax | Property | max: String | Defines the maximum value expected for a BigDecimal property.
