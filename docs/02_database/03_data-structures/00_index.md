---
title: 'Data Structures'
sidebar_label: 'Data Structures'
id: data-structures
---

[Introduction](/database/data-structures/data-structures/)  | [Tables](/database/data-structures/tables/) |  [Indices](/database/data-structures/indices/) | [Views](/database/data-structures/views/) 

The genesis database supports [table](https://internal-web/secure/reference/developer/api/database/concepts/data-structure/tables/) or [view](https://internal-web/secure/reference/developer/api/database/concepts/data-structure/views/). Tables contain rows of data of the same type. The data in tables support read, write and subscribe operations. A view represents a number of tables joined together. Views support read and subscribe operations.

|  | [Tables](https://internal-web/secure/reference/developer/api/database/concepts/data-structure/tables/) | [Indices](https://internal-web/secure/reference/developer/api/database/concepts/data-structure/indices/) | [View](https://internal-web/secure/reference/developer/api/database/concepts/data-structure/views/) |
| --- | :-- | :-- | :-- |
| Has typesafe entity | ✔️ | ✔️ | ✔️ |
| Can be represented as `DbRecord` | ✔️ | ✔️ | ❌ |
| Supports [read operations](https://internal-web/secure/reference/developer/api/database/concepts/operations/read/) | ✔️ | ✔️ | ✔️ |
| Supports [write operations](https://internal-web/secure/reference/developer/api/database/concepts/operations/write/) | ✔️ | Delete Only | ❌ |
| Supports [subscribe operations](https://internal-web/secure/reference/developer/api/database/concepts/operations/subscribe/) | ✔️ | ❌ | [single cardinality only](https://internal-web/secure/reference/developer/api/database/concepts/data-structure/views/#cardinality) |
| [Defined in](https://internal-web/secure/creating-applications/defining-your-application/data-model/data-model-overview/) | [`*-tables-dictionary.kts`](https://internal-web/secure/creating-applications/defining-your-application/data-model/tables/tables-define/) | [`*-tables-dictionary.kts`](https://internal-web/secure/creating-applications/defining-your-application/data-model/tables/tables-define/) | [`*-view-dictionary.kts`](https://internal-web/secure/creating-applications/defining-your-application/data-model/views/views-define/) |
| Supports indices | ✔️ | ❌ | ✔️ (root table only) |