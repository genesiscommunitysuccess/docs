---
title: 'Email'
sidebar_label: 'Email'
sidebar_position: 2
id: email
---
###  Email

#### System Definiotion Configuration

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
Explain what each field does (including NA – e.g. INCOMING_TOPIC)
##### NOTIFY_ROUTE
As above
##### NOTIFY
As above
Talk about the json approach for on the fly including more email addresses etc..
