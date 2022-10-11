---
id: genesis-6.1.6
title: 'Genesis-6.1.6'
sidebar_label: 'Genesis-6.1.6'
sidebar_position: 4

---

## **What's Changed**

- fix: Merging to release version 6.1.6 which includes fixes that enable H2 support in tutorials as per [PTC-298](https://genesisglobal.atlassian.net/browse/PTC-298). by **[@mikhaelwade](https://github.com/mikhaelwade)** in [#603](https://github.com/genesislcap/genesis-server/pull/603)
- [GSF-5670](https://genesisglobal.atlassian.net/browse/GSF-5670) - Specifying a column name for the result returned by the SQL query in SQLDictionaryStore.kt. ([#586](https://github.com/genesislcap/genesis-server/pull/586))
- [PTC-337](https://genesisglobal.atlassian.net/browse/PTC-337) - Fixes for failing SQL tests in dataserver2. ([#591](https://github.com/genesislcap/genesis-server/pull/591))
- fix: the wsl user home is not the same as the user home on the host [PTC-301](https://genesisglobal.atlassian.net/browse/PTC-301) ([#583](https://github.com/genesislcap/genesis-server/pull/583))
- [GSF-5615](https://genesisglobal.atlassian.net/browse/GSF-5615): Removing double quotes from field value parameters.
- [PTC-243](https://genesisglobal.atlassian.net/browse/PTC-243): Moving com.h2database:h2 from testImplementation to api in genesis-db.

Co-authored-by: nenko-tabakov [nenko.tabakov@gmail.com](mailto:nenko.tabakov@gmail.com)Co-authored-by: J Shattu [jason.shattu@genesis.global](mailto:jason.shattu@genesis.global)