---
id: genesis-6.1
title: 'Genesis-6.1'
sidebar_label: 'Genesis-6.1'
sidebar_position: 3

---
# Genesis 6.1

## 6.1.7

- Fix: added genesis-notify to the bom.
- Feat: added viewHistory param to symphony create channel PA-180.

## 6.1.6

- Fix: Merging to release version 6.1.6 which includes fixes that enable H2 support in tutorials.
- Specifying a column name for the result returned by the SQL query in SQLDictionaryStore.kt.
- Fixes for failing SQL tests in dataserver2.
- Fix: the wsl user home is not the same as the user home on the host.
- Removing double quotes from field value parameters.
- Moving com.h2database:h2 from testImplementation to api in genesis-db.

## 6.1.4

- Fix: Allow resolution of kts script files from src/main/resources/script directory for backwards compatibility.
- Fix: Fix remap cache.
- Feat: Allow processing of HTTP headers without underscores.
- Fix: Changing our H2 support from using the MODIFY keyword to using ALTER in the 6.1.4 maintenance release.

## 6.1.3

- Fix: remove unnecessary folder deletion in killServer script PA-58.
- Fix: fix issues in build from previous PR changes including break to processes which use internal dataservers.
- Fix(genesis-environment): Call InitSysDef.init() as part of RenameFields script startup.
- 
## 6.1.2

- Fix: field size handling in genesis-datasever2 and genesis-pal-dataserver.
- Feat: Moving data pipeline features and fixes to the 6.1 release.
- Fix: Ensure *-data-pipeline.kts files work with IntelliSense.
- Fix: Added genesis-camel subcore modules to the genesis-bom dependencies.
- build(genesis-conventions): add camel-bom to genesis-dependencies bom creation.

## 6.1.1

- Bug in view generation when joining on index with enum.
- ColdStart of GPAL consolidator throws exception when multiple permanent consolidations target same table.
- Add int to date converters in DataTypeConverter.
- pal-streamerclient: fix source ref and subscription handling.


