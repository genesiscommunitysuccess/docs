---
title: 'DbEntity'
sidebar_label: 'DbEntity'
id: dbentity
---

[Introduction](/database/data-types/data-types/) |
[Table entities](/database/data-types/table-entities/) | 
[Index entities](/database/data-types/index-entities/) | 
[Views entities](/database/data-types/views-entities/) | 
[DbRecord](/database/data-types/dbrecord/) | 
[DbEntity](/database/data-types/dbentity/) 

DbEntity is the common interface implemented by table entities and view entities.

The DbEntity methods are described below:

|  Name  | Signature | Description |
|---------------|-------------|-------------|
| toDbRecord | `fun toDbRecord(entity: E): DbRecord` | Converts entity to [DbRecord](/database/data-types/dbrecord/) |
| toGenesisSetFormatted | `fun toGenesisSetFormatted(entity: E, configs: Collection<ColumnConfig>? = null): GenesisSet` | converts a view to [GenesisSet](/server-modules/inter-process-messages/genesisSet/) and applies any formatter/aliases assigned to the fields |
| toGenesisSet | `fun toGenesisSet(entity: E, columns: Collection<String>): GenesisSet` | converts view to [GenesisSet](/server-modules/inter-process-messages/genesisSet/). This is the plain representation of view fields |
| get | `operator fun get(field: String): Any?` | gets the provided field value |
