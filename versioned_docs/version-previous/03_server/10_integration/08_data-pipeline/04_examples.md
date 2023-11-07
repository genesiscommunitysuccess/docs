---
title: 'Data Pipeline - examples'
sidebar_label: 'Examples'
id: examples
keywords: [server, integration, data pipeline, examples]
tags:
  - server
  - integration
  - data pipeline
  - examples
---



Here is a full example of ingesting trades:

```kotlin
pipelines {

    postgres("cdc-test") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = "docker"
        databaseName = "postgres"

        table {
            "public.trades" to map("e2e-test", TRADE) {

                val tradeId = stringValue("trd_id")
                val instrument = stringValue("inst")
                val tradedAt = dateValue(name = "traded_at", format = "yyyy-MM-dd H-m-s")

                TRADE {
                    TRADE_ID {
                        //lookup from ALT_TRADE_ID based on trd_id column
                        //What to do in case of missing mapping in the ALT_TRADE_ID?
                        transform {
                            val tradeCode: String = input.get(tradeId)
                            entityDb.get(AltTradeId.byCode(tradeCode, "TradeStore"))?.tradeId
                        }
                    }

                    INSTRUMENT_ID {
                        //lookup from ALT_INSTRUMENT_ID based on INSTRUMENT_CODE
                        //There is no name of the instrument, so any instruments which need to be created will have the name missing, we should log a warning in this case
                        transform {
                            val code: String = input.get(instrument)
                            val instrumentType = "RIC"
                            val altInstrumentId: AltInstrumentId? =
                                entityDb.get(AltInstrumentId.byCode(code, instrumentType))
                            if (altInstrumentId != null) {
                                altInstrumentId.instrumentCode
                            } else {
                                val newInstrumentId = entityDb.insert(Instrument {
                                    instrumentName = ""
                                }).record.instrumentId

                                entityDb.insert(AltInstrumentId {
                                    alternateType = instrumentType
                                    instrumentCode = code
                                    instrumentId = newInstrumentId
                                })

                                newInstrumentId
                            }
                        }
                    }

                    PRICE {
                        property = "price"
                    }

                    QUANTITY {
                        property = "quantity"
                    }

                    SIDE {
                        property = "side"
                    }

                    TRADE_DATETIME {
                        transform {
                            input.get(tradedAt)
                        }
                    }

                    TRADE_DATE {
                        transform {
                            input.get(tradedAt)
                        }
                    }

                    ENTERED_BY {
                        property = "trader"
                    }

                    TRADE_STATUS {
                        property = "trade_state"
                    }

                    UNSOLICITED {
                        property = "unsolicited"
                    }

                    PREV_TRADE_ID {
                        property = "orig_trd_id"
                    }
                }
            }
        }
    }
}
```

A source definition for a CSV file with the same data would look like this:

```kotlin
pipelines {
    csvSource("cdc-test") {
        map("e2e-test", TRADE) {
            val tradeId = stringValue("trd_id")
            val instrument = stringValue("inst")
            val tradedAt = dateValue(name = "traded_at", format = "yyyy-MM-dd H-m-s")

            TRADE {
                TRADE_ID {
                    //lookup from ALT_TRADE_ID based on trd_id column
                    //What to do in case of missing mapping in the ALT_TRADE_ID?
                    transform {
                        val tradeCode: String = input.get(tradeId)
                        entityDb.get(AltTradeId.byCode(tradeCode, "TradeStore"))?.tradeId
                    }
                }

                INSTRUMENT_ID {
                    //lookup from ALT_INSTRUMENT_ID based on INSTRUMENT_CODE
                    //There is no name of the instrument, so any instruments which need to be created will have the name missing, we should log a warning in this case
                    transform {
                        val code: String = input.get(instrument)
                        val instrumentType = "RIC"
                        val altInstrumentId: AltInstrumentId? =
                            entityDb.get(AltInstrumentId.byCode(code, instrumentType))
                        if (altInstrumentId != null) {
                            altInstrumentId.instrumentCode
                        } else {
                            //Is this valid operation? Will the instrumentId be autogenerated?
                            val newInstrumentId = entityDb.insert(Instrument {
                                instrumentName = ""
                            }).record.instrumentId

                            entityDb.insert(AltInstrumentId {
                                alternateType = instrumentType
                                instrumentCode = code
                                instrumentId = newInstrumentId
                            })

                            newInstrumentId
                        }
                    }
                }

                PRICE {
                    property = "price"
                }

                QUANTITY {
                    property = "quantity"
                }

                SIDE {
                    property = "side"
                }

                TRADE_DATETIME {
                    transform {
                        input.get(tradedAt)
                    }
                }

                TRADE_DATE {
                    transform {
                        input.get(tradedAt)
                    }
                }

                ENTERED_BY {
                    property = "trader"
                }

                TRADE_STATUS {
                    property = "trade_state"
                }

                UNSOLICITED {
                    property = "unsolicited"
                }

                PREV_TRADE_ID {
                    property = "orig_trd_id"
                }
            }
        }
    }
}
```