---
id: mappers
title: Declare Source and Mappers
sidebar_label: Declare Source and Mappers
sidebar_position: 4

---

In this part of the tutorial we will declare the PostgreSQL server as a data source and map the incoming rows to a Genesis [Table](https://docs.genesis.global/secure/creating-applications/defining-your-application/data-model/tables/tables/) object.

## Declare Data Source

To define the data pipeline, start by defining the data source. Create new kotlin script `trades-data-pipeline.kts` under `datapipeline-sandbox/server/jvm/datapipeline-trades-script-config/src/main/resources/cfg` (if you chose another project name don't forget to replace `datapipeline-trades` with it) and fill in the following.

In this example the `hostname` needs to be set to the address of the PostgreSQL server.

```kotlin
sources {

    postgres("trade-pipeline") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = "CantTell11*"
        databaseName = "postgres"

    }
}
```

the next step is to declare the mapper for each table. In our case we are only interested in one table - `trades`.

## Declare the Mapper

Enter the code from the next section. Don't worry if it looks confusing now. We'll go through it in a bit.

```kotlin
sources {

    postgres("trade-pipeline") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = "CantTell11*"
        databaseName = "postgres"

        table {
            "public.trades" to mapper("e2e-test", TRADE) {

                TRADE {
                    TRADE_ID {
                        //lookup from ALT_TRADE_ID based on trd_id column
                        transform {
                            val tradeCode: String = input.get(tradeId)
                            entityDb.get(AltTradeId.byCode(tradeCode, "TradeStore"))?.tradeId
                        }
                    }

                    INSTRUMENT_ID {
                        //lookup from ALT_INSTRUMENT_ID based on INSTRUMENT_CODE
                        transform {
                            val code: String = input.get(instrument)
                            val instrumentType = "RIC"
                            val altInstrumentId: AltInstrumentId? =
                                entityDb.get(AltInstrumentId.byCode(code, instrumentType))
                            if (altInstrumentId != null) {
                                altInstrumentId.instrumentId
                            } else {
                                val newInstrumentId = entityDb.insert(Instrument {
                                    //We don't have a name supplied by postgres, so use the code as the name
                                    instrumentName = code
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
                        sourceProperty = "price"
                    }

                    QUANTITY {
                        sourceProperty = "quantity"
                    }

                    SIDE {
                        transform {
                            Side.valueOf(input.get(side).toUpperCase())
                        }
                    }

                    TRADE_DATETIME {
                        transform {
                            val tradedAtLong = input.get(tradedAt) / 1000L
                            DateTime(tradedAtLong)
                        }
                    }

                    TRADE_DATE {
                        transform {
                            val tradedAtLong = input.get(tradedAt) / 1000L
                            DateTime(tradedAtLong).withTimeAtStartOfDay()
                        }
                    }

                    ENTERED_BY {
                        sourceProperty = "trader"
                    }

                    TRADE_STATUS {
                        transform {
                            val readState = input.get(tradeState)
                            when(readState) {
                                "new" -> TradeStatus.NEW
                                "mod" ->  TradeStatus.MODIFIED
                                "canc" -> TradeStatus.CANCELLED
                                else -> throw IllegalStateException("Unknown trade state: $readState")
                            }
                        }
                    }

                    UNSOLICITED {
                        sourceProperty = "unsolicited"
                    }

                    PREV_TRADE_ID {
                        sourceProperty = "orig_trd_id"
                    }
                }
            }
        }
    }
}
```

When declaring a mapper the first thing is to give it a name. This is just to identify it and doesn't have any functionality associated with it. The second argument is the [Table](https://docs.genesis.global/secure/creating-applications/defining-your-application/data-model/tables/tables/) to be mapped to. In our case this is the `TRADE` table. Following are mappings for each [Field](/creating-applications/defining-your-application/data-model/fields/fields) of the [Table](https://docs.genesis.global/secure/creating-applications/defining-your-application/data-model/tables/tables/). There are three ways to define a [Field](/creating-applications/defining-your-application/data-model/fields/fields) mapping:
- when the source property name is the same as the [Field](/creating-applications/defining-your-application/data-model/fields/fields) name then there is no need to specify anything
- when the source property name is different from the [Field](/creating-applications/defining-your-application/data-model/fields/fields) name, however, the type is the same as the [Field](/creating-applications/defining-your-application/data-model/fields/fields) type or is one that can be converted out of the box. In this case only the name has to be mapped and this is done by specifying the `sourceProperty` field
- when the source property name and type are different from the [Field](/creating-applications/defining-your-application/data-model/fields/fields) name and type - in this case a `transform` function can be used to calculate the mapped value

Looking at the code above you can notice that `TRADE_ID`, `INSTRUMENT_ID`, `SIDE`, `TRADE_DATETIME`, `TRADE_DATE` and `TRADE_STATUS` are calculated [Fields](/creating-applications/defining-your-application/data-model/fields/fields) and all the rest are mapped by name.

The `transform` function for `INSTRUMENT_ID` is the most complex one as it actually performs additional operations based on the current state of the Genesis database. On the first three lines in the function we try to map the incoming instrument code to a instrument that's already in the Genesis database. If such instrument exist then its id is returned, however, if it's not there a new instrument is created.

Follow the links for more information on [mapping](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-basics/#mapper-for-the-incoming-data) and the [`transform`](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/#interacting-with-the-database) function