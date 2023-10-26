---
title: 'Notify - email'
sidebar_label: 'Email'
id: email
keywords: [server, integration, notify, email]
tags:
  - server
  - integration
  - notify
  - email
---

## Email routes
The email gateway that comes as part of the standard Notify package supports two rule types:

- email user routes
- email distribution routes

### Email user routes
These routes are used to send email notifications to the email addresses of users defined within the Genesis system. There must be a valid email address on the USER_ATTRIBUTES record.

### Email distribution routes
These routes are used to send email notifications to external email addresses that are not associated with users in the Genesis system. You can configure addresses to send to, as well as addresses to copy in (both CC and BCC).
It is possible to configure a static distribution on the gateway definition in the **notify.kts** GPAL script file. If this is specified, the static distribution will be merged with the distributions specified on the matching routes. This can be useful for testing, or to ensure that all emails are sent to a specific set of addresses, regardless of the route configuration.

## Email Gateway configuration

You can define the following configuration items in order to provide SMTP server connection details, and to configure email service-related features.

Include the following in your application's **notify.kts** file:

```kotlin
notify {
    gateways {
        email(id = "email1") {
            // Default Linux Email SMTP Server
            smtpHost = "localhost"
            smtpPort = 587
            smtpUser = "notifications@genesis.global"
            smtpPw = ""
            smtpProtocol = TransportStrategy.SMTP_TLS
            systemDefaultUserName = "Genesis System"
            systemDefaultEmail = "system@genesis.global"
			
		    // Optional static distribution to merge with data configured on email distribution routes	
			staticDistribution { 
                to = listOf("address1@genesis.global")
                cc = listOf("address2@genesis.global")
                bcc = listOf("address3@genesis.global")
            }
		}
		
		// optionally include additional connections, including additional Symphony, Email
    }
}
```

### Using system definition in the notify.kts script

Include the following in your aplication's **genesis-system-definition.kts** file:

```kotlin
systemDefinition {
    global {
    
            //Email Notify Details
            item(name = "EMAIL_SYSTEM_DEFAULT_USER_NAME", value = "System Genesis" )
            item(name = "EMAIL_SYSTEM_DEFAULT", value = "system@genesis.com" )
            item(name = "EMAIL_SMTP_HOST", value = "localhost" )
            item(name = "EMAIL_SMTP_PORT", value = "587" )
            item(name = "EMAIL_SMTP_USER", value = "access@genesis.com" )
            item(name = "EMAIL_SMTP_PW", "")
        }
}
```

In the application's **notify.kts** file, you can refer to the item name directly, without import or qualifier:


```Kotlin
email(id = "email1") {
	smtpHost = EMAIL_SMTP_HOST
	smtpPort = EMAIL_SMTP_PORT
	smtpUser = MAIL_SMTP_USER
	smtpPw = EMAIL_SMTP_PW
	smtpProtocol = TransportStrategy.SMTP_TLS
	systemDefaultUserName = EMAIL_SYSTEM_DEFAULT_USER_NAME
	systemDefaultEmail = EMAIL_SYSTEM_DEFAULT
}
```

## Database configuration

### NOTIFY_ROUTE

| Field Name | Usage |
| --- | --- |
| GATEWAY_ID | This should reference the gateway `id` specified in the **notify.kts** file.   |
| NOTIFY_ROUTE_ID | A Unique ID for this route. |
| TOPIC_MATCH | String value to match against the topic on inbound notifications.  |


### EMAIL_DIST_NOTIFY_ROUTE_EXT

| Field Name | Usage |
| --- | --- |
| EMAIL_TO | List of addresses to send the email notification to.
| EMAIL_CC | List of addresses to send the email notification to, in Carbon-Copy (CC). | 
| EMAIL_BCC | List of addresses to send the email in Blind Carbon-Copy (BCC). | 
| NOTIFY_ROUTE_ID | Reference to a primary KEY in the NOTIFY_ROUTE table. |


### EMAIL_USER_NOTIFY_ROUTE_EXT
| Field Name | Usage |
| --- | --- |
| ENTITY_ID | String identifying the entity to send to. |
| ENTITY_ID_TYPE | One of USER_NAME, PROFILE_NAME, ALL, SELF. An additional value will be available that matches the ENTITY_ADMIN_PERMISSION_FIELD, if it is defined in Sysdef. | 
| NOTIFY_ROUTE_ID | Reference to a primary KEY in the NOTIFY_ROUTE table. |
