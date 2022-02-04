---
sidebar_position: 0
title: Data Structures
sidebar_label: Overview
id: overview

---

The genesis database supports [table](../tables) or [view](../views). Tables contain rows of data of the same type. 
The data in tables support read, write and subscribe operations. A view represents a number of tables joined together.
Views support read and subscribe operations. 

|                                                             | [Tables](../tables)                                               | [Indices](../indices)                                             | [View](../views)                                               |
|-------------------------------------------------------------|:------------------------------------------------------------------|:------------------------------------------------------------------|:---------------------------------------------------------------|
| Has typesafe entity                                         | ✔️                                                                | ✔️                                                                | ✔️                                                             |
| Can be represented as `DbRecord`                            | ✔️                                                                | ✔️                                                                | ❌                                                              |
| Supports [read operations](../../operations/read)           | ✔️                                                                | ✔️                                                                | ✔️                                                             |
| Supports [write operations](../../operations/write)         | ✔️                                                                | Delete Only                                                       | ❌                                                              |
| Supports [subscribe operations](../../operations/subscribe) | ✔️                                                                | ❌                                                                 | [single cardinality only](../views/#cardinality)               |
| [Defined in](../../../../data-model/define)                 | [`*-tables-dictionary.kts`](../../../../data-model/define#tables) | [`*-tables-dictionary.kts`](../../../../data-model/define#tables) | [`*-view-dictionary.kts`](../../../../data-model/define#views) |
| Supports indices                                            | ✔️                                                                | ❌                                                                 | ✔️ (root table only)                                           |
