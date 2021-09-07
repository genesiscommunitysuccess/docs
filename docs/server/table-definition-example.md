---
sidebar_label: 'Table definition example'
---

# Table definition example

Here is an example of a complete set of table definitions from GPAL.

```sql
tables {
    table(name = "AUDIT_TRAIL", id = 0) {
        sequence(Fields.ID, "AT")
        Fields.ENTITY_ID
        Fields.AUDIT_CODE
        Fields.AUDIT_TEXT
        Fields.USER_NAME
        Fields.VERSION
        Fields.CLIENT_ORDER_ID
        Fields.REJECT_REASON
        Fields.RX_SEQUENCE
        primaryKey {
            Fields.ID
        }
        indices {
            nonUnique {
                Fields.ENTITY_ID
            }
            nonUnique {
                Fields.USER_NAME
            }
            nonUnique {
                Fields.TIMESTAMP
            }
        }
    }
    table(name = "SYSTEM", id = 1) {
        Fields.SYSTEM_KEY
        Fields.SYSTEM_VALUE
        primaryKey {
            Fields.SYSTEM_KEY
        }
    }
    table(name = "USER_SESSION", id = 2) {
        Fields.USER_NAME
        Fields.SESSION_ID
        Fields.START_TIMESTAMP
        Fields.LAST_ACCESS_TIME
        Fields.SESSION_AUTH_TOKEN
        Fields.TIMEOUT
        Fields.HOST
        Fields.ATTRIBUTES
        primaryKey {
            Fields.SESSION_ID
        }
        indices {
            nonUnique {
                Fields.USER_NAME
            }
            unique {
                Fields.SESSION_AUTH_TOKEN
            }
        }
    }
    table(name = "NOTIFICATION", id = 4) {
        Fields.NOTIFICATION_ID
        Fields.PROCESS
        Fields.NODE
        Fields.TEXT
        Fields.NOTIFICATION_CODE
        Fields.NOTIFICATION_TIMESTAMP
        Fields.ACTIVE
        primaryKey {
            Fields.NOTIFICATION_ID
        }
    }
    table(name = "RIGHT_SUMMARY", id = 5) {
        Fields.USER_NAME
        Fields.RIGHT_CODE
        primaryKey {
            Fields.USER_NAME
            Fields.RIGHT_CODE
        }
    }
    table(name = "PROCESS_REF", id = 6) {
        Fields.SOURCE_ID
        Fields.REF
        primaryKey {
            Fields.SOURCE_ID
        }
    }
    table(name = "PUBLISHER_SUBSCRIPTION", id = 7) {
        Fields.QUERY_NAME
        Fields.FIELD_NAME
        Fields.FIELD_VALUE
        primaryKey(name = "PUBLISHER_SUBSCRIPTION_BY_QUERY_NAME_FIELD_NAME", id = 1) {
            Fields.QUERY_NAME
            Fields.FIELD_NAME
            Fields.FIELD_VALUE
        }
    }
    table(name = "DYNAMIC_RULE", id = 8) {
        sequence(Fields.ID, "DR")
        Fields.NAME
        Fields.DESCRIPTION
        Fields.USER_NAME
        Fields.RULE_TABLE
        Fields.RULE_STATUS
        Fields.RULE_EXPRESSION
        Fields.PROCESS_NAME
        Fields.MESSAGE_TYPE
        Fields.RESULT_EXPRESSION
        Fields.TABLE_OPERATION
        primaryKey {
            Fields.ID
        }
        indices {
            nonUnique {
                Fields.NAME
            }
        }
    }
    table(name = "DYNAMIC_RULE_AUDIT", id = 9) {
        Fields.ID
        Fields.NAME
        Fields.DESCRIPTION
        Fields.RULE_TABLE
        Fields.RULE_STATUS
        Fields.RULE_EXPRESSION
        Fields.PROCESS_NAME
        Fields.MESSAGE_TYPE
        Fields.RESULT_EXPRESSION
        Fields.EVENT_TYPE
        Fields.EVENT_DATETIME
        Fields.USER_NAME
        Fields.TABLE_OPERATION
        primaryKey {
            Fields.ID
            Fields.EVENT_DATETIME
        }
        indices {
            nonUnique {
                Fields.EVENT_DATETIME
            }
        }
    }
    table("TIME_RULE", id = 10) {
        sequence(Fields.ID, "TU")
        Fields.NAME
        Fields.DESCRIPTION
        Fields.USER_NAME
        Fields.RULE_START_TIME
        Fields.RULE_END_TIME
        Fields.RULE_STATUS
        Fields.RULE_EXPRESSION
        Fields.PROCESS_NAME
        Fields.MESSAGE_TYPE
        Fields.RESULT_EXPRESSION
        primaryKey {
            Fields.ID
        }
        indices {
            nonUnique {
                Fields.NAME
            }
        }
    }
    table(name = "TIME_RULE_AUDIT", id = 11) {
        Fields.ID
        Fields.NAME
        Fields.DESCRIPTION
        Fields.RULE_START_TIME
        Fields.RULE_END_TIME
        Fields.RULE_STATUS
        Fields.PROCESS_NAME
        Fields.MESSAGE_TYPE
        Fields.RESULT_EXPRESSION
        Fields.EVENT_TYPE
        Fields.EVENT_DATETIME
        Fields.USER_NAME
        primaryKey {
            Fields.ID
            Fields.EVENT_DATETIME
        }
        indices {
            nonUnique {
                Fields.EVENT_DATETIME
            }
        }
    }

    table(name = "GENESIS_PROCESS", id = 12) {
        Fields.PROCESS_NAME
        Fields.PROCESS_STATUS
        Fields.PROCESS_STATUS_MESSAGE
        Fields.PROCESS_STATE_TEXT
        Fields.PROCESS_RESOURCES
        Fields.PROCESS_HOSTNAME
        Fields.PROCESS_CPU_USAGE
        Fields.PROCESS_MEM_USAGE
        Fields.PROCESS_SECURE
        Fields.PROCESS_PORT
        Fields.LOG_LEVEL
        Fields.DATADUMP
        Fields.START_TIME
        Fields.RESOURCE_TYPES
        primaryKey {
            Fields.PROCESS_NAME
            Fields.PROCESS_HOSTNAME
        }
        subTables {
            fields(Fields.PROCESS_HOSTNAME, Fields.PROCESS_NAME)
                .joiningNewTable(name = "GENESIS_PROCESS_MONITOR", id = 20) {
                    Fields.MONITOR_NAME
                    Fields.MONITOR_MESSAGE
                    Fields.MONITOR_STATE

                    primaryKey(name = "GENESIS_PROCESS_MONITOR_BY_HOSTNAME", id = 1) {
                        Fields.PROCESS_HOSTNAME
                        Fields.PROCESS_NAME
                        Fields.MONITOR_NAME
                    }
                }
        }
    }
    table(name = "SYSTEM_STATUS", id = 13) {
        Fields.HOST_NAME
        Fields.SYSTEM_CPU_LOAD
        Fields.TOTAL_PHYSICAL_MEMORY_SIZE
        Fields.FREE_PHYSICAL_MEMORY_SIZE
        primaryKey {
            Fields.HOST_NAME
        }
    }
    table(name = "CRON_RULE", id = 14) {
        Fields.NAME
        Fields.DESCRIPTION
        Fields.USER_NAME
        Fields.CRON_EXPRESSION
        Fields.TIME_ZONE
        Fields.RULE_STATUS
        Fields.PROCESS_NAME
        Fields.MESSAGE_TYPE
        Fields.RESULT_EXPRESSION
        primaryKey {
            Fields.NAME
        }
    }
    table(name = "CRON_RULE_AUDIT", id = 15) {
        Fields.NAME
        Fields.DESCRIPTION
        Fields.USER_NAME
        Fields.CRON_EXPRESSION
        Fields.TIME_ZONE
        Fields.RULE_STATUS
        Fields.PROCESS_NAME
        Fields.MESSAGE_TYPE
        Fields.RESULT_EXPRESSION
        Fields.EVENT_TYPE
        Fields.EVENT_DATETIME
        primaryKey {
            Fields.NAME
            Fields.EVENT_DATETIME
        }
        indices {
            nonUnique {
                Fields.EVENT_DATETIME
            }
        }
    }
    table(name = "APPROVAL", id = 16, audit = details(id = 17, sequence = "AA")) {
        sequence(Fields.APPROVAL_ID, "AP")
        uuid(Fields.APPROVAL_KEY, "AK")
        Fields.APPROVAL_STATUS
        Fields.APPROVAL_MESSAGE
        Fields.USER_NAME
        Fields.MESSAGE_TYPE
        Fields.DESTINATION
        Fields.EVENT_MESSAGE
        Fields.EVENT_DETAILS
        primaryKey {
            Fields.APPROVAL_ID
        }
        indices {
            unique {
                Fields.APPROVAL_KEY
            }
        }
    }
    table(name = "APPROVAL_ENTITY", id = 18) {
        Fields.APPROVAL_ID
        Fields.ENTITY_TABLE
        Fields.ENTITY_ID
        primaryKey(name = "APPROVAL_ENTITY_BY_ID_ENTITY", id = 1) {
            Fields.APPROVAL_ID
            Fields.ENTITY_TABLE
            Fields.ENTITY_ID
        }
    }
    table(name = "APPROVAL_ENTITY_COUNTER", id = 19) {
        Fields.ENTITY_TABLE
        Fields.ENTITY_ID
        Fields.AWAITING_COUNTER
        Fields.APPROVED_COUNTER
        Fields.CANCELLED_COUNTER
        Fields.REJECTED_BY_USER_COUNTER
        Fields.REJECTED_BY_SERVER_COUNTER
        primaryKey(name = "APPROVAL_ENTITY_COUNTER_BY_ENTITY", id = 1) {
            Fields.ENTITY_TABLE
            Fields.ENTITY_ID
        }
    }
}
```
 