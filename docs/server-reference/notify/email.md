---
title: 'Email'
sidebar_label: 'Email'
sidebar_position: 2
id: email
---
###  Email

#### System Definition Configuration

The following configuration items are defined to detail SMTP server connection details as well as configuring email service related features.

        //Generated emails sent as this email address by default
        item(name = "SYSTEM_DEFAULT_EMAIL", value = "notifications@genesis.global" )
        //Display name of default email address
        item(name = "SYSTEM_DEFAULT_USER_NAME", value = "GenesisGlobal" )
        
        //SMTP server connection details
        
        item(name = "EMAIL_SMTP_HOST", value = "smtp.office365.com" )
        item(name = "EMAIL_SMTP_PORT", value = "587" )
        //Credentials for SMTP server, note that the user will need to be permitted to send as the SYSTEM_DEFAULT_EMAIL on the SMTP server where values are different
        item(name = "EMAIL_SMTP_USER", value = "myuser@genesis.global" )
        item(name = "EMAIL_SMTP_PW", value = "NOTAPASSWORD" )
        item(name = "EMAIL_SMTP_PROTOCOL", value = "SMTP_TLS" )

        //Set to false if the NOTIFY record severity should be added into the email subject/body
        item(name = "EMAIL_SUPPRESS_SEVERITY_TEXT", value = "true" )

#### Database configuration

##### GATEWAY

| Field Name | Usage |
| --- | --- |
| GATEWAY_ID | A Unique name for the gateway which can be referenced in the NOTIFY_ROUTE   |
| GATEWAY_TYPE | Set to "EmailDistribution" |
| GATEWAY_VALUE | Static email distribution list specified for this gatway as a [JSON Structure](#GATEWAY_VALUE-JSON-Structure)  |
| INCOMING_TOPIC | Currently not used for Email |

#### GATEWAY_VALUE JSON Structure
```json
{
  "emailDistribution": {
    "to": ["jason <jason@email.com>", "carol@email.com>"],
    "cc": ["susan@email.com", "Tom <tom@email.com>"],
    "bcc": []
} 
```

note, when using Genesis command line tool `SendIt` to import field values that contain quotes, such as JSON values, into the database, 
you need to escape the quotes. eg `SendIt -t GATEWAY.CSV` where we are setting up an empty distribution list.

```text
GATEWAY_ID,GATEWAY_TYPE,GATEWAY_VALUE,INCOMING_TOPIC
"EMAIL1","EmailDistribution","{ \"emailDistribution\" : { \"to\" : [ ], \"cc\" : [ ], \"bcc\" : [ ] } }",
```

##### NOTIFY_ROUTE

| Field Name | Usage |
| --- | --- |
| SENDER | Usage |
| TOPIC | Usage |
| EXPIRY | Usage |
| HEADER | Usage |
| BODY | Usage |
| NOTIFY_COMPRESSION_TYPE | Usage |
| APPLICATION_REF | Usage |
| NOTIFY_SEVERITY | Usage |
| DOCUMENT_ID | Usage |


##### NOTIFY
As above
Talk about the json approach for on the fly including more email addresses etc..
