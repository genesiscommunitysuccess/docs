---
title: 'Fields - examples'
sidebar_label: 'Fields - examples'
id: fields-examples
keywords: [database, fields, examples]
tags:
    - database
    - fields
    - examples
---

 

There is no complexity to a **fields-dictionary.kts** file.

As you can see, each field is named in its own row and given a type, all within a `fields` statement. 

Some of the fields in the example below have extra parameters. For example, `DESCRIPTION` is given a `maxSize`of 255.

```kotlin
fields {
    field(name = "ACTIVE", type = BOOLEAN)
    field(name = "ALERT_ID", type = STRING)
    field(name = "ATTRIBUTES", type = STRING)
    field(name = "AUDIT_CODE", type = STRING)
    field(name = "AUDIT_TEXT", type = STRING)
    field(name = "CLIENT_ORDER_ID", type = STRING)
    field(name = "RIGHT_CODE", type = STRING)
    field(name = "CREATED_AT", type = DATETIME)
    field(name = "CREATED_BY", type = STRING)
    field(name = "DESCRIPTION", type = STRING, maxSize = 255)
    field(name = "ENTITY_ID", type = STRING)
    field(name = "EVENT_DATETIME", type = DATETIME)
    field(name = "EVENT_TYPE", type = STRING)
    field(name = "EXTERNAL_ID", type = STRING)
    field(name = "FIELD_NAME", type = STRING)
    field(name = "FIELD_VALUE", type = STRING)
    field(name = "HOST", type = STRING)
    field(name = "LAST_ACCESS_TIME", type = DATETIME)
    field(name = "MESSAGE_TYPE", type = STRING)
    field(name = "NAME", type = STRING)
    field(name = "NODE", type = STRING)
    field(name = "NOTIFICATION_CODE", type = STRING)
    field(name = "NOTIFICATION_ID", type = STRING)
    field(name = "NOTIFICATION_TIMESTAMP", type = DATETIME)
    field(name = "QUERY_NAME", type = STRING)
    field(name = "REF", type = STRING)
    field(name = "REJECT_REASON", type = STRING)
    field(name = "RESULT_EXPRESSION", type = STRING)
    field(name = "RULE_EXPRESSION", type = STRING)
    field(name = "RULE_STATUS", type = ENUM("ENABLED", "DISABLED", default = "DISABLED"))
    field(name = "RULE_TABLE", type = STRING)
    field(name = "RX_SEQUENCE", type = LONG)
    field(name = "SESSION_AUTH_TOKEN", type = STRING)
    field(name = "SESSION_ID", type = STRING)
    field(name = "SOURCE_ID", type = STRING)
    field(name = "RULE_START_TIME", type = STRING)
    field(name = "RULE_END_TIME", type = STRING)
    field(name = "START_TIMESTAMP", type = DATETIME)
    field(name = "SYSTEM_KEY", type = STRING)
    field(name = "SYSTEM_VALUE", type = STRING)
    field(name = "TEXT", type = STRING)
    field(name = "TIMEOUT", type = LONG)
    field(name = "USER_NAME", type = STRING)
    field(name = "VERSION", type = INT)
    field(name = "TABLE_OPERATION", type = STRING, default = "INSERT")
    field(name = "PROCESS", type = STRING)
    field(name = "PROCESS_NAME", type = STRING)
    field(name = "PROCESS_STATUS", type = BOOLEAN)
    field(name = "PROCESS_STATUS_MESSAGE", type = STRING)
    field(name = "PROCESS_STATE_TEXT", type = ENUM("DOWN", "ERROR", "WARNING", "STANDBY", "UP", default = "DOWN"))
    field(name = "PROCESS_RESOURCES", type = STRING, maxSize = dbMaxSize(target = 5000))
    field(name = "PROCESS_HOSTNAME", type = STRING)
    field(name = "PROCESS_CPU_USAGE", type = DOUBLE)
    field(name = "PROCESS_MEM_USAGE", type = DOUBLE)
    field(name = "PROCESS_SECURE", type = BOOLEAN)
    field(name = "PROCESS_PORT", type = INT)
    field(name = "RESOURCE_TYPES", type = STRING)
    field(name = "LOG_LEVEL", type = STRING)
    field(name = "DATADUMP", type = BOOLEAN)
    field(name = "START_TIME", type = DATETIME)
    field(name = "HOST_NAME", type = STRING)
    field(name = "SYSTEM_CPU_LOAD", type = DOUBLE)
    field(name = "TOTAL_PHYSICAL_MEMORY_SIZE", type = LONG)
    field(name = "FREE_PHYSICAL_MEMORY_SIZE", type = LONG)
    field(name = "CRON_EXPRESSION", type = STRING)
    field(name = "TIME_ZONE", type = STRING)
    field(name = "APPROVAL_ID", type = STRING)
    field(name = "APPROVAL_KEY", type = STRING)
    field(
        name = "APPROVAL_STATUS",
        type = ENUM("PENDING", "APPROVED", "CANCELLED", "REJECTED_BY_USER", "REJECTED_BY_SERVICE", default = "PENDING")
    )
    field(name = "APPROVAL_MESSAGE", type = STRING)
    field(name = "DESTINATION", type = STRING)
    field(name = "EVENT_MESSAGE", type = STRING)
    field(name = "EVENT_DETAILS", type = STRING)
    field(name = "ENTITY_TABLE", type = STRING)
    field(name = "AWAITING_COUNTER", type = INT)
    field(name = "APPROVED_COUNTER", type = INT)
    field(name = "CANCELLED_COUNTER", type = INT)
    field(name = "REJECTED_BY_USER_COUNTER", type = INT)
    field(name = "REJECTED_BY_SERVER_COUNTER", type = INT)
    field(name = "MONITOR_NAME", type = STRING)
    field(name = "MONITOR_MESSAGE", type = STRING)
    field(name = "MONITOR_STATE", type = STRING)
}
```
