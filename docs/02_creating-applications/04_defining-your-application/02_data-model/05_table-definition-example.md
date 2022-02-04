---
title: 'Table definition example'
sidebar_label: 'Table definition example'
sidebar_position: 5
id: table-example
---

Here is an example of a complete set of table definitions from GPAL.

```kotlin
tables {
    table(name = "AUDIT_TRAIL", id = 0) {
        sequence(ID, "AT")
        ENTITY_ID
        AUDIT_CODE
        AUDIT_TEXT
        USER_NAME
        VERSION
        CLIENT_ORDER_ID
        REJECT_REASON
        RX_SEQUENCE
        primaryKey {
            ID
        }
        indices {
            nonUnique {
                ENTITY_ID
            }
            nonUnique {
                USER_NAME
            }
            nonUnique {
                TIMESTAMP
            }
        }
    }
    table(name = "SYSTEM", id = 1) {
        SYSTEM_KEY
        SYSTEM_VALUE
        primaryKey {
            SYSTEM_KEY
        }
    }
    table(name = "USER_SESSION", id = 2) {
        USER_NAME
        SESSION_ID
        START_TIMESTAMP
        LAST_ACCESS_TIME
        SESSION_AUTH_TOKEN
        TIMEOUT
        HOST
        ATTRIBUTES
        primaryKey {
            SESSION_ID
        }
        indices {
            nonUnique {
                USER_NAME
            }
            unique {
                SESSION_AUTH_TOKEN
            }
        }
    }
    table(name = "NOTIFICATION", id = 4) {
        NOTIFICATION_ID
        PROCESS
        NODE
        TEXT
        NOTIFICATION_CODE
        NOTIFICATION_TIMESTAMP
        ACTIVE
        primaryKey {
            NOTIFICATION_ID
        }
    }
    table(name = "RIGHT_SUMMARY", id = 5) {
        USER_NAME
        RIGHT_CODE
        primaryKey {
            USER_NAME
            RIGHT_CODE
        }
    }
    table(name = "PROCESS_REF", id = 6) {
        SOURCE_ID
        REF
        primaryKey {
            SOURCE_ID
        }
    }
    table(name = "PUBLISHER_SUBSCRIPTION", id = 7) {
        QUERY_NAME
        FIELD_NAME
        FIELD_VALUE
        primaryKey(name = "PUBLISHER_SUBSCRIPTION_BY_QUERY_NAME_FIELD_NAME", id = 1) {
            QUERY_NAME
            FIELD_NAME
            FIELD_VALUE
        }
    }
    table(name = "DYNAMIC_RULE", id = 8) {
        sequence(ID, "DR")
        NAME
        DESCRIPTION
        USER_NAME
        RULE_TABLE
        RULE_STATUS
        RULE_EXPRESSION
        PROCESS_NAME
        MESSAGE_TYPE
        RESULT_EXPRESSION
        TABLE_OPERATION
        primaryKey {
            ID
        }
        indices {
            nonUnique {
                NAME
            }
        }
    }
    table(name = "DYNAMIC_RULE_AUDIT", id = 9) {
        ID
        NAME
        DESCRIPTION
        RULE_TABLE
        RULE_STATUS
        RULE_EXPRESSION
        PROCESS_NAME
        MESSAGE_TYPE
        RESULT_EXPRESSION
        EVENT_TYPE
        EVENT_DATETIME
        USER_NAME
        TABLE_OPERATION
        primaryKey {
            ID
            EVENT_DATETIME
        }
        indices {
            nonUnique {
                EVENT_DATETIME
            }
        }
    }
    table("TIME_RULE", id = 10) {
        sequence(ID, "TU")
        NAME
        DESCRIPTION
        USER_NAME
        RULE_START_TIME
        RULE_END_TIME
        RULE_STATUS
        RULE_EXPRESSION
        PROCESS_NAME
        MESSAGE_TYPE
        RESULT_EXPRESSION
        primaryKey {
            ID
        }
        indices {
            nonUnique {
                NAME
            }
        }
    }
    table(name = "TIME_RULE_AUDIT", id = 11) {
        ID
        NAME
        DESCRIPTION
        RULE_START_TIME
        RULE_END_TIME
        RULE_STATUS
        PROCESS_NAME
        MESSAGE_TYPE
        RESULT_EXPRESSION
        EVENT_TYPE
        EVENT_DATETIME
        USER_NAME
        primaryKey {
            ID
            EVENT_DATETIME
        }
        indices {
            nonUnique {
                EVENT_DATETIME
            }
        }
    }

    table(name = "GENESIS_PROCESS", id = 12) {
        PROCESS_NAME
        PROCESS_STATUS
        PROCESS_STATUS_MESSAGE
        PROCESS_STATE_TEXT
        PROCESS_RESOURCES
        PROCESS_HOSTNAME
        PROCESS_CPU_USAGE
        PROCESS_MEM_USAGE
        PROCESS_SECURE
        PROCESS_PORT
        LOG_LEVEL
        DATADUMP
        START_TIME
        RESOURCE_TYPES
        primaryKey {
            PROCESS_NAME
            PROCESS_HOSTNAME
        }
        subTables {
            fields(PROCESS_HOSTNAME, PROCESS_NAME)
                .joiningNewTable(name = "GENESIS_PROCESS_MONITOR", id = 20) {
                    MONITOR_NAME
                    MONITOR_MESSAGE
                    MONITOR_STATE

                    primaryKey(name = "GENESIS_PROCESS_MONITOR_BY_HOSTNAME", id = 1) {
                        PROCESS_HOSTNAME
                        PROCESS_NAME
                        MONITOR_NAME
                    }
                }
        }
    }
    table(name = "SYSTEM_STATUS", id = 13) {
        HOST_NAME
        SYSTEM_CPU_LOAD
        TOTAL_PHYSICAL_MEMORY_SIZE
        FREE_PHYSICAL_MEMORY_SIZE
        primaryKey {
            HOST_NAME
        }
    }
    table(name = "CRON_RULE", id = 14) {
        NAME
        DESCRIPTION
        USER_NAME
        CRON_EXPRESSION
        TIME_ZONE
        RULE_STATUS
        PROCESS_NAME
        MESSAGE_TYPE
        RESULT_EXPRESSION
        primaryKey {
            NAME
        }
    }
    table(name = "CRON_RULE_AUDIT", id = 15) {
        NAME
        DESCRIPTION
        USER_NAME
        CRON_EXPRESSION
        TIME_ZONE
        RULE_STATUS
        PROCESS_NAME
        MESSAGE_TYPE
        RESULT_EXPRESSION
        EVENT_TYPE
        EVENT_DATETIME
        primaryKey {
            NAME
            EVENT_DATETIME
        }
        indices {
            nonUnique {
                EVENT_DATETIME
            }
        }
    }
    table(name = "APPROVAL", id = 16, audit = details(id = 17, sequence = "AA")) {
        sequence(APPROVAL_ID, "AP")
        uuid(APPROVAL_KEY, "AK")
        APPROVAL_STATUS
        APPROVAL_MESSAGE
        USER_NAME
        MESSAGE_TYPE
        DESTINATION
        EVENT_MESSAGE
        EVENT_DETAILS
        primaryKey {
            APPROVAL_ID
        }
        indices {
            unique {
                APPROVAL_KEY
            }
        }
    }
    table(name = "APPROVAL_ENTITY", id = 18) {
        APPROVAL_ID
        ENTITY_TABLE
        ENTITY_ID
        primaryKey(name = "APPROVAL_ENTITY_BY_ID_ENTITY", id = 1) {
            APPROVAL_ID
            ENTITY_TABLE
            ENTITY_ID
        }
    }
    table(name = "APPROVAL_ENTITY_COUNTER", id = 19) {
        ENTITY_TABLE
        ENTITY_ID
        AWAITING_COUNTER
        APPROVED_COUNTER
        CANCELLED_COUNTER
        REJECTED_BY_USER_COUNTER
        REJECTED_BY_SERVER_COUNTER
        primaryKey(name = "APPROVAL_ENTITY_COUNTER_BY_ENTITY", id = 1) {
            ENTITY_TABLE
            ENTITY_ID
        }
    }
}
```
 