---
title: 'Email'
sidebar_label: 'Email'
sidebar_position: 2
id: email
---


### Email Configuration

You can define the following configuration items in order to provide SMTP server connection details, and to configure email service-related features.

filename: ```notify.kts```

```kotlin
notify {

    // note: the connection 'id' will default to 'email1' if it's not specified, however if you have multiple connections
    //       of the same type (in this case email) then it will need to be specified.
    email(id = "email1") {
    
            // Default Linux Email SMTP Server
            smtpHost = "localhost"
            smtpPort = 25
            smtpUser = "notifications@genesis.global"
            smtpPw = ""
            smtpProtocol = "SMTP"
    }

    // optionally include additional connections, including additional Symphony, Email or Microsoft Teams connections
}
```

### Database configuration

### GATEWAY

| Field Name | Usage |
| --- | --- |
| GATEWAY_ID | A Unique name for the gateway which can be referenced in the NOTIFY_ROUTE   |
| GATEWAY_TYPE | Set to "EmailDistribution" |
| GATEWAY_VALUE | Static email distribution list specified for this gateway as a [JSON Structure](#GATEWAY_VALUE-JSON-Structure)  |
| INCOMING_TOPIC | Currently not used for Email |
| CONNECTION_ID | This should reference the connection `id` specified in the ```notify.kts``` file. Note if the id is specified in the connection, then you should use the default id of `Email`

### GATEWAY_VALUE JSON Structure
```json
{
  "emailDistribution": {
    "to": ["jason <jason@email.com>", "carol@email.com>"],
    "cc": ["susan@email.com", "Tom <tom@email.com>"],
    "bcc": []
} 
```
Any of the `to`, `cc`, or `bcc` fields in the structure above can be omitted if they are empty arrays. In this instance, all three are present to show you all the potential fields, `bcc` could be omitted to no functional difference.

When you use [SendIt] to send data to the database, keep two things in mind.

* [SendIt] uses quotes to delimit strings. So, if there quotes within any string in your data, you need to escape them.
* [SendIt] interprets a new line as a new row in the database. So, make sure all the relevant data is on one single line - remove any unwanted line breaks.

For example, here we are going to run [SendIt] to send an empty distribution list to the database.

The command is:  `SendIt -t GATEWAY.CSV`

And we have set up the data file GATEWAY.CSV in the following way.

```text
GATEWAY_ID,GATEWAY_TYPE,GATEWAY_VALUE,INCOMING_TOPIC
"EMAIL1","EmailDistribution","{ \"emailDistribution\" : { \"to\" : [ ], \"cc\" : [ ], \"bcc\" : [ ] } }",
```
The data is all on one single line. It has three strings, and the third string has four sets of quote marks, each of which we have escaped with a \ character.

#### NOTIFY_ROUTE
| Field Name | Usage |
| --- | --- |
| ENTITY_ID | Genesis User sending message, null implies System |
| ENTITY_ID_TYPE | Enum of "USER_NAME", "PROFILE_NAME", "GATEWAY" |
| TOPIC_MATCH | Topic that should match that will forward to the GATEWAY |
| GATEWAY_ID | The Gateway that matched topic messages will be sent to |


#### NOTIFY
| Field Name | Usage |
| --- | --- |
| SENDER | Genesis User sending message, null implies System |
| TOPIC | The Topic to broadcast this message |
| BODY | Contents of message, for Email it should follow the [JSON Structure](#NOTIFY.BODY-JSON-Structure) |
| NOTIFY_COMPRESSION_TYPE | Used internally by Genesis, indicates if the body of the message is compressed |
| APPLICATION_REF | Currently not used for Email |

#### NOTIFY.BODY JSON Structure
```json
{
  "emailDistribution": {
    "to": ["jason <jason@email.com>", "carol@email.com>"],
    "cc": ["susan@email.com", "Tom <tom@email.com>"],
    "bcc": [],
    "contents" : "Content of Message Here"
} 
```

When sending HTML within the contents of a JSON string you should escape any quotes, and remove or replace new lines.

Here is an example in Kotlin:
```kotlin
htmlMailMessage.replaceAll("\"", "&quot;").replaceAll("\\R", "\\\\n");
```

The final outgoing emailDistribution with be the merger of the distribution list specified on the Notify message and the statically defined distribution list specified for any Gateway which messages may be routed too.

