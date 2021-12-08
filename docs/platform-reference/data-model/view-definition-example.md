---
title: 'View definition example'
sidebar_label: 'View definition example'
sidebar_position: 50
id: view-example
---

### View definitions that use different joins
This example shows a range of different joins. Comments have been added to explani each one.


```kotlin
views {
    // Simple view
    view("CALENDAR_SIDES", TRADE_CALENDAR) {
        joins {
            joining(TRADE_SIDE) {
                on(TRADE_CALENDAR.CALENDAR_ID to TRADE_SIDE.CALENDAR_ID)
            }
        }

        fields {
            TRADE_CALENDAR.CALENDAR_NAME
            TRADE_SIDE.INDEX
            TRADE_SIDE.RATE
            derivedField("FLOAT_CALENDAR", STRING) {
                withInput(TRADE_SIDE.INDEX) { it }
            }
        }
    }

    // Inner join
    view(name = "SWAP", rootTable = TRADE) {
        val fix = TRADE_SIDE withAlias "fix"
        val float = TRADE_SIDE withAlias "float"

        val fixCal = TRADE_CALENDAR withAlias "fix_cal"
        val floatCal = TRADE_CALENDAR withAlias "float_cal"

        joins {
            joining(TRADE_TO_SIDE, JoinType.INNER, backwardsJoin = true) {
                on(TRADE { TRADE_ID } to TRADE_TO_SIDE { TRADE_ID })
                    .joining(fix, backwardsJoin = true) {
                        on(TRADE_TO_SIDE { FIX_ID } to fix { SIDE_ID })
                            .and(fix { SIDE_TYPE } to SideType.FIX)
                            .joining(fixCal, JoinType.INNER, backwardsJoin = true) {
                                on(fix { CALENDAR_ID } to fixCal { CALENDAR_ID })
                            }
                    }
                    .joining(float, JoinType.INNER, backwardsJoin = true) {
                        on(TRADE_TO_SIDE { FLOAT_ID } to float { SIDE_ID })
                            .and(float { SIDE_TYPE } to SideType.FLOAT)
                            .joining(floatCal, JoinType.INNER, backwardsJoin = true) {
                                on(float { CALENDAR_ID } to floatCal { CALENDAR_ID })
                            }
                    }
            }
        }

        fields {
            TRADE.allFields()

            float {
                INDEX
                TENOR
                RATE withAlias "SPREAD"
            }

            floatCal {
                // CALENDAR_NAME withAlias "FLOAT_CALENDAR"
            }

            derivedField("FLOAT_CALENDAR", STRING) {
                withInput(floatCal { CALENDAR_NAME }) { it }
            }

            fix {
                RATE withPrefix "FIXED"
            }

            fixCal {
                CALENDAR_NAME withAlias "FIX_CALENDAR"
            }
        }
    }

    view("INSTRUMENT_DETAILS_PARTIAL_JOIN_KEY", ALT_INSTRUMENT_ID) {
        joins {
            joining(INSTRUMENT) {
                on(ALT_INSTRUMENT_ID.INSTRUMENT_ID to INSTRUMENT.ID)
                    .joining(MARKET_INSTRUMENT) {
                        on(INSTRUMENT.ID to MARKET_INSTRUMENT.INSTRUMENT_ID)
//                        .and(MARKET_INSTRUMENT.MARKET_ID to "BRZ-MAIN") // partial join
                            .joining(MARKET) {
                                on(MARKET_INSTRUMENT.MARKET_ID to MARKET.ID)
                                    .joining(EXCHANGE) {
                                        on(MARKET.EXCHANGE_ID to EXCHANGE.ID)
                                    }
                            }
                    }
                    .joining(INSTRUMENT_PRICE) {
                        on(INSTRUMENT.ID to INSTRUMENT_PRICE.INSTRUMENT_ID)
                    }
            }
        }
        fields {
            ALT_INSTRUMENT_ID.ALTERNATE_CODE withAlias "INSTRUMENT_CODE"
            ALT_INSTRUMENT_ID.INSTRUMENT_ID
            INSTRUMENT.NAME withAlias "INSTRUMENT_NAME"
            INSTRUMENT_PRICE.LAST_TRADED_PRICE
            INSTRUMENT_PRICE.VWAP withFormat "#,##0.00"
            derivedField("SPREAD", DOUBLE) {
                withInput(INSTRUMENT_PRICE.BID_PRICE, INSTRUMENT_PRICE.ASK_PRICE) { bid, ask ->
                    if (ask == null || bid == null) null
                    else ask - bid
                }
            }
            derivedField("FLOAT_CALENDAR", STRING) {
                withInput(EXCHANGE.ID) { it }
            }
            MARKET_INSTRUMENT.CURRENCY_ID withAlias "TRADED_CURRENCY"
            EXCHANGE.ID withAlias "EXCHANGE_ID"
        }
    }

    view("INSTRUMENT_DETAILS", ALT_INSTRUMENT_ID) {
        joins {
            joining(INSTRUMENT) {
                on(ALT_INSTRUMENT_ID.INSTRUMENT_ID to INSTRUMENT.ID)
                    .joining(MARKET_INSTRUMENT) {
                        on(INSTRUMENT.ID to MARKET_INSTRUMENT.INSTRUMENT_ID)
                            .and(MARKET_INSTRUMENT.MARKET_ID to "BRZ-MAIN")
                            .joining(MARKET) {
                                on(MARKET_INSTRUMENT.MARKET_ID to MARKET.ID)
                                    .joining(EXCHANGE) {
                                        on(MARKET.EXCHANGE_ID to EXCHANGE.ID)
                                    }
                            }
                    }
                    .joining(INSTRUMENT_PRICE) {
                        on(INSTRUMENT.ID to INSTRUMENT_PRICE.INSTRUMENT_ID)
                    }
            }
        }
        fields {
            ALT_INSTRUMENT_ID.ALTERNATE_CODE withAlias "INSTRUMENT_CODE"
            ALT_INSTRUMENT_ID.INSTRUMENT_ID
            INSTRUMENT.NAME withAlias "INSTRUMENT_NAME"

            INSTRUMENT_PRICE.LAST_TRADED_PRICE
            INSTRUMENT_PRICE.VWAP

            derivedField("SPREAD", DOUBLE) {
                withInput(INSTRUMENT_PRICE.BID_PRICE, INSTRUMENT_PRICE.ASK_PRICE) { bid, ask ->
                    if (ask == null || bid == null) null
                    else ask - bid
                }
            }

            MARKET_INSTRUMENT.CURRENCY_ID withAlias "TRADED_CURRENCY"
            EXCHANGE.ID withAlias "EXCHANGE_ID"

        }
    }

    view("MOVIE_BY_ACTOR", MOVIES) {
        joins {
            joining(ACTORS, backwardsJoin = true, joinType = JoinType.INNER) {
                on(MOVIES.ID to ACTORS.SOURCE_ID)
                    .and(ACTORS.NAME asParameter "ACTOR_NAME")
            }
        }
        fields {
            MOVIES.NAME withPrefix "MOVIE"
            ACTORS.ASK_PRICE withAlias "ACTOR_PRICE"
        }
    }

    view("USER_MEMBER_RIGHTS", USER_MEMBER) {
        joins {
            joining(RIGHT_SUMMARY) {
                on(USER_MEMBER.USER_NAME to RIGHT_SUMMARY.USER_NAME)
            }
        }
        fields {
            USER_MEMBER.ACCOUNT_TYPE
            USER_MEMBER.USER_NAME
        }
    }

    view("USER_SESSION_DETAILS", USER_DETAILS) {
        joins {
            joining(USER_SESSION) {
                on(USER_DETAILS.USER_NAME to USER_SESSION.USER_NAME)
            }
        }
        fields {
            USER_DETAILS.allFields()
            USER_SESSION.LAST_ACCESS_TIME
        }
    }
}

```