---
title: 'Data Structures'
sidebar_label: 'Data Structures'
id: data-structures
---



The Genesis database supports:
- [tables](/database/fields-tables-views/tables/)
- [views](/database/fields-tables-views/views/)

 Tables contain rows of data of the same type. The data in tables support read, write and subscribe operations. 
 
 A view represents a number of tables joined together. Views support read and subscribe operations.

|  | [Tables](/database/data-structures/tables/)  | [Indices](/database/data-structures/indices/) | [View](/database/data-structures/views/)  |
| --- | :-- | :-- | :-- |
| Has typesafe entity | ✔️ | ✔️ | ✔️ |
| Can be represented as `DbRecord` | ✔️ | ✔️ | ❌ |
| Supports [read operations](/database/database-concepts/read/) | ✔️ | ✔️ | ✔️ |
| Supports [write operations](/database/database-concepts/write/) | ✔️ | Delete Only | ❌ |
| Supports [subscribe operations](/database/database-concepts/subscribe/) | ✔️ | ❌ | [single cardinality only](/database/data-structures/views/#cardinality) |
| [Defined in](/database/fields-tables-views/fields-tables-views/) | [`*-tables-dictionary.kts`](/database/fields-tables-views/tables/tables-basics/) | [`*-tables-dictionary.kts`](/database/fields-tables-views/tables/tables-basics/) | [`*-view-dictionary.kts`](/database/fields-tables-views/views/views-examples/) |
| Supports indices | ✔️ | ❌ | ✔️ (root table only) |