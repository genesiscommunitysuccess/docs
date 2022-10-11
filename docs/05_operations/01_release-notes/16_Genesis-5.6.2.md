---
id: genesis-5.6.2
title: 'Genesis-5.6.2'
sidebar_label: 'Genesis-5.6.2'
sidebar_position: 16

---

# Server Release

- Genesis Integration with Symphony, for listing members of a Symphony Room. ([GSF-5258](https://genesisglobal.atlassian.net/browse/GSF-5258))
    - `LIST_MEMBERS_OF_CHANNEL` (RequestReply)
        - Request:

          `ChannelName`  Symphony Stream Id

        - Response, an array of:-

          `USER_EMAIL`

          `USER_ID` - Symphony User Id

- Set up Github action that will trigger on a pull request ([GSF-4880](https://genesisglobal.atlassian.net/browse/GSF-4880))
- Create a release script based on the existing action flow but for Gradle projects ([GSF-5183](https://genesisglobal.atlassian.net/browse/GSF-5183))
- Add support for JSON_SCHEMA_REQUEST routing in genesis-router ([GSF-5256](https://genesisglobal.atlassian.net/browse/GSF-5256))
- GPAL Dataserver: auth perms real-time updates are not processed correctly ([GSF-5281](https://genesisglobal.atlassian.net/browse/GSF-5281))
- Router: when using the SAML login approach router stores UNKNOWN as the current session USER_NAME (GSF-5282)

# Auth Release 5.6.1

- Perms: changes in USER or USER_ATTRIBUTES table are not taken into account in every scenario ([AUTH-225](https://genesisglobal.atlassian.net/browse/AUTH-225))