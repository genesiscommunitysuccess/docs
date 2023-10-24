---
title: 'Custom endpoints - examples'
sidebar_label: 'Examples'
id: examples
keywords: [server, integration, custom endpoints, examples]
tags:
  - server
  - integration
  - custom endpoints
  - examples
---

The example below is a collection of custom endpoints supporting SAML authentication. The `LoginPostEndPoint`, `LoginUrlRequestEndPoint`, `LogoutEndPoint`, and `MetadataEndPoint` all extend this `AbstractSamlEndPoint`.

##
```kotlin
webHandlers("trade") {
    config {
        logLevel = INFO
    }

    grouping("insert-trade") {
        endpoint<Trade, Trade>(POST, "trader") {
            accepts(ContentType.APPLICATION_JSON)
            produces(ContentType.APPLICATION_JSON)

            permissioning {
                permissionCodes("TRADER")
            }

            suspend fun WebContext.doStuff() : Long {
                return db.count(TRADE)
            }

            handleRequest {
                LOG.info("Count: ${doStuff()}")
                db.insert(body).record
            }
        }

        endpoint<Trade, InsertResult<Trade>>(POST, "auth") {
            accepts(ContentType.APPLICATION_JSON)
            produces(ContentType.APPLICATION_JSON)

            permissioning {
                requestAuth("CCY") {
                    field { currencyId }
                }
            }

            handleRequest {
                db.insert(body)
            }
        }

        endpoint<Trade, InsertResult<Trade>>(POST, "custom") {
            accepts(ContentType.APPLICATION_JSON)
            produces(ContentType.APPLICATION_JSON)

            val secret by optionalHeader("secret")

            permissioning {
                customPermissions {
                    secret == "123"
                }
            }

            handleRequest {
                db.insert(body)
            }
        }
    }

    endpoint(GET, "all-trades") {
        produces(ContentType.APPLICATION_JSON, ContentType.TEXT_CSV)

        permissioning {
            responseAuth("CCY", flow<Trade>()) {
                field { currencyId }
            }
        }

        handleRequest {
            db.getBulk(TRADE)
        }
    }
}
```
