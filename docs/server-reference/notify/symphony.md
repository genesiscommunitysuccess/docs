---
title: 'Symphony'
sidebar_label: 'Symphony'
sidebar_position: 3
id: symphony
---
###  Symphony

#### System Definiotion Configuration

The following configuration items are defined to detail SMTP server connection details as well as configuring email service related features.

        // Symphony Config
        item(name = "SYMPHONY_SESSION_AUTH_HOST", value = "76680.p.symphony.com")
        item(name = "SYMPHONY_SESSION_AUTH_PORT", value = 443)
        item(name = "SYMPHONY_KEY_AUTH_HOST", value = "76680.p.symphony.com")
        item(name = "SYMPHONY_KEY_AUTH_PORT", value = 443)
        item(name = "SYMPHONY_POD_HOST", value = "76680.p.symphony.com")
        item(name = "SYMPHONY_POD_PORT", value = 443)
        item(name = "SYMPHONY_AGENT_HOST", value = "76680.p.symphony.com")
        item(name = "SYMPHONY_AGENT_PORT", value = 443)
        item(name = "SYMPHONY_TRUSTSTORE_PATH", value = "")
        item(name = "SYMPHONY_TRUSTSTORE_PASSWORD", value = "")
        item(name = "SYMPHONY_BOT_USERNAME", value = "botusergenesis@genesis.global")
        item(name = "SYMPHONY_BOT_EMAIL_ADDRESS", value = "botusergenesis@genesis.global")
        item(name = "SYMPHONY_BOT_PRIVATE_KEY_PATH", value = "/home/priss/run/site-specific/cfg/symphony/rsa/")
        item(name = "SYMPHONY_BOT_PRIVATE_KEY_NAME", value = "76680.p.symphonybotkey.pem")
        item(name = "SYMPHONY_BOT_CERT_PATH", value = "")
        item(name = "SYMPHONY_BOT_CERT_NAME", value = "")
        item(name = "SYMPHONY_BOT_CERT_PASSWORD", value = "")
        item(name = "SYMPHONY_PROXY_URL", value = "")
        item(name = "SYMPHONY_PROXY_USERNAME", value = "")
        item(name = "SYMPHONY_PROXY_PASSWORD", value = "")
        item(name = "SYMPHONY_KEY_MANAGER_PROXY_URL", value = "")
        item(name = "SYMPHONY_KEY_MANAGER_PROXY_USERNAME", value = "")
        item(name = "SYMPHONY_KEY_MANAGER_PROXY_PASSWORD", value = "")

#### Database configuration

##### GATEWAY
Explain what each field does (including NA – e.g. INCOMING_TOPIC)
##### NOTIFY_ROUTE
As above
##### NOTIFY
As above
Talk about the json approach for on the fly including more email addresses etc..
