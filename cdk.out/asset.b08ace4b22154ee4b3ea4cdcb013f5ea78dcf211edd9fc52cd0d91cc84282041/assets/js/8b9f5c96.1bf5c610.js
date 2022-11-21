"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[82884],{16787:function(n,e,t){t.r(e),t.d(e,{assets:function(){return p},contentTitle:function(){return d},default:function(){return c},frontMatter:function(){return o},metadata:function(){return l},toc:function(){return u}});var r=t(87462),a=t(63366),i=(t(67294),t(3905)),s=(t(61839),["components"]),o={title:"Data Pipeline - Examples",sidebar_label:"Examples",id:"examples",keywords:["server","integration","data pipeline","examples"],tags:["server","integration","data pipeline","examples"]},d=void 0,l={unversionedId:"server/integration/data-pipeline/examples",id:"server/integration/data-pipeline/examples",title:"Data Pipeline - Examples",description:"Introduction  | Basics | Advanced | Examples | Configuring runtime | Testing",source:"@site/docs/03_server/10_integration/08_data-pipeline/04_examples.md",sourceDirName:"03_server/10_integration/08_data-pipeline",slug:"/server/integration/data-pipeline/examples",permalink:"/next/server/integration/data-pipeline/examples",draft:!1,tags:[{label:"server",permalink:"/next/tags/server"},{label:"integration",permalink:"/next/tags/integration"},{label:"data pipeline",permalink:"/next/tags/data-pipeline"},{label:"examples",permalink:"/next/tags/examples"}],version:"current",sidebarPosition:4,frontMatter:{title:"Data Pipeline - Examples",sidebar_label:"Examples",id:"examples",keywords:["server","integration","data pipeline","examples"],tags:["server","integration","data pipeline","examples"]},sidebar:"serverModulesSidebar",previous:{title:"Advanced",permalink:"/next/server/integration/data-pipeline/advanced"},next:{title:"Configuring Runtime",permalink:"/next/server/integration/data-pipeline/configuring-runtime"}},p={},u=[],m={toc:u};function c(n){var e=n.components,t=(0,a.Z)(n,s);return(0,i.kt)("wrapper",(0,r.Z)({},m,t,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/introduction/"},"Introduction"),"  | ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/basics"},"Basics")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/advanced"},"Advanced")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/examples"},"Examples")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/configuring-runtime"},"Configuring runtime")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/testing"},"Testing")),(0,i.kt)("p",null,"Here is a full example of ingesting trades:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'sources {\n\n    postgres("cdc-test") {\n        hostname = "localhost"\n        port = 5432\n        username = "postgres"\n        password = "docker"\n        databaseName = "postgres"\n\n        table {\n            "public.trades" to mapper("e2e-test", TRADE) {\n\n                val tradeId = stringValue("trd_id")\n                val instrument = stringValue("inst")\n                val tradedAt = dateValue(name = "traded_at", format = "yyyy-MM-dd H-m-s")\n\n                TRADE {\n                    TRADE_ID {\n                        //lookup from ALT_TRADE_ID based on trd_id column\n                        //What to do in case of missing mapping in the ALT_TRADE_ID?\n                        transform {\n                            val tradeCode: String = input.get(tradeId)\n                            entityDb.get(AltTradeId.byCode(tradeCode, "TradeStore"))?.tradeId\n                        }\n                    }\n\n                    INSTRUMENT_ID {\n                        //lookup from ALT_INSTRUMENT_ID based on INSTRUMENT_CODE\n                        //There is no name of the instrument, so any instruments which need to be created will have the name missing, we should log a warning in this case\n                        transform {\n                            val code: String = input.get(instrument)\n                            val instrumentType = "RIC"\n                            val altInstrumentId: AltInstrumentId? =\n                                entityDb.get(AltInstrumentId.byCode(code, instrumentType))\n                            if (altInstrumentId != null) {\n                                altInstrumentId.instrumentCode\n                            } else {\n                                //Is this valid operation? Will the instrumentId be autogenerated?\n                                val newInstrumentId = entityDb.insert(Instrument {\n                                    instrumentName = ""\n                                }).record.instrumentId\n\n                                entityDb.insert(AltInstrumentId {\n                                    alternateType = instrumentType\n                                    instrumentCode = code\n                                    instrumentId = newInstrumentId\n                                })\n\n                                newInstrumentId\n                            }\n                        }\n                    }\n\n                    PRICE {\n                        sourceProperty = "price"\n                    }\n\n                    QUANTITY {\n                        sourceProperty = "quantity"\n                    }\n\n                    SIDE {\n                        sourceProperty = "side"\n                    }\n\n                    TRADE_DATETIME {\n                        transform {\n                            input.get(tradedAt)\n                        }\n                    }\n\n                    TRADE_DATE {\n                        transform {\n                            input.get(tradedAt)\n                        }\n                    }\n\n                    ENTERED_BY {\n                        sourceProperty = "trader"\n                    }\n\n                    TRADE_STATUS {\n                        sourceProperty = "trade_state"\n                    }\n\n                    UNSOLICITED {\n                        sourceProperty = "unsolicited"\n                    }\n\n                    PREV_TRADE_ID {\n                        sourceProperty = "orig_trd_id"\n                    }\n                }\n            }\n        }\n    }\n}\n')),(0,i.kt)("p",null,"A source definition for a CSV file with the same data would look like the following:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'sources {\n    csv("cdc-test") {\n        mapper("e2e-test", TRADE) {\n            val tradeId = stringValue("trd_id")\n            val instrument = stringValue("inst")\n            val tradedAt = dateValue(name = "traded_at", format = "yyyy-MM-dd H-m-s")\n\n            TRADE {\n                TRADE_ID {\n                    //lookup from ALT_TRADE_ID based on trd_id column\n                    //What to do in case of missing mapping in the ALT_TRADE_ID?\n                    transform {\n                        val tradeCode: String = input.get(tradeId)\n                        entityDb.get(AltTradeId.byCode(tradeCode, "TradeStore"))?.tradeId\n                    }\n                }\n\n                INSTRUMENT_ID {\n                    //lookup from ALT_INSTRUMENT_ID based on INSTRUMENT_CODE\n                    //There is no name of the instrument, so any instruments which need to be created will have the name missing, we should log a warning in this case\n                    transform {\n                        val code: String = input.get(instrument)\n                        val instrumentType = "RIC"\n                        val altInstrumentId: AltInstrumentId? =\n                            entityDb.get(AltInstrumentId.byCode(code, instrumentType))\n                        if (altInstrumentId != null) {\n                            altInstrumentId.instrumentCode\n                        } else {\n                            //Is this valid operation? Will the instrumentId be autogenerated?\n                            val newInstrumentId = entityDb.insert(Instrument {\n                                instrumentName = ""\n                            }).record.instrumentId\n\n                            entityDb.insert(AltInstrumentId {\n                                alternateType = instrumentType\n                                instrumentCode = code\n                                instrumentId = newInstrumentId\n                            })\n\n                            newInstrumentId\n                        }\n                    }\n                }\n\n                PRICE {\n                    sourceProperty = "price"\n                }\n\n                QUANTITY {\n                    sourceProperty = "quantity"\n                }\n\n                SIDE {\n                    sourceProperty = "side"\n                }\n\n                TRADE_DATETIME {\n                    transform {\n                        input.get(tradedAt)\n                    }\n                }\n\n                TRADE_DATE {\n                    transform {\n                        input.get(tradedAt)\n                    }\n                }\n\n                ENTERED_BY {\n                    sourceProperty = "trader"\n                }\n\n                TRADE_STATUS {\n                    sourceProperty = "trade_state"\n                }\n\n                UNSOLICITED {\n                    sourceProperty = "unsolicited"\n                }\n\n                PREV_TRADE_ID {\n                    sourceProperty = "orig_trd_id"\n                }\n            }\n        }\n    }\n}\n')))}c.isMDXComponent=!0}}]);