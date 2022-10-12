---
id: genesis-5.6
title: 'Genesis-5.6'
sidebar_label: 'Genesis-5.6'
sidebar_position: 9

---
# Genesis 5.6

## 5.6.2

### Server Release

- Genesis Integration with Symphony, for listing members of a Symphony Room. 
    - `LIST_MEMBERS_OF_CHANNEL`(RequestReply)
        - Request:

          `ChannelName`  Symphony Stream Id

        - Response, an array of:

          `USER_EMAIL`

          `USER_ID` - Symphony User Id

- Set up Github action that will trigger on a pull request.
- Create a release script based on the existing action flow but for Gradle projects.
- Add support for JSON_SCHEMA_REQUEST routing in genesis-router.
- GPAL Dataserver: auth perms real-time updates are not processed correctly.
- Router: when using the SAML login approach router stores UNKNOWN as the current session USER_NAME.

## 5.6.1

- Perms: changes in USER or USER_ATTRIBUTES table are not taken into account in every scenario.