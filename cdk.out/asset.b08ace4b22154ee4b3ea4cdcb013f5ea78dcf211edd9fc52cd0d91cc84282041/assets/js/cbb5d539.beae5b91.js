"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[2125],{65408:function(e,t,n){n.r(t),n.d(t,{assets:function(){return l},contentTitle:function(){return p},default:function(){return c},frontMatter:function(){return o},metadata:function(){return d},toc:function(){return m}});var a=n(87462),r=n(63366),s=(n(67294),n(3905)),i=(n(61839),["components"]),o={title:"Postgres data pipeline - Declare Source and Mappers",sidebar_label:"Declare Source and Mappers",sidebar_position:4,id:"mappers",keywords:["getting started","quick start","postgres data pipeline","mappers"],tags:["getting started","quick start","postgres data pipeline","mappers"]},p=void 0,d={unversionedId:"getting-started/use-cases/postgres-data-pipeline/mappers",id:"version-2022.3/getting-started/use-cases/postgres-data-pipeline/mappers",title:"Postgres data pipeline - Declare Source and Mappers",description:"In this part of the tutorial we will declare the PostgreSQL server as a data source and map the incoming rows to a Genesis Table object.",source:"@site/versioned_docs/version-2022.3/01_getting-started/05_use-cases/postgres-data-pipeline/03_declare-source.md",sourceDirName:"01_getting-started/05_use-cases/postgres-data-pipeline",slug:"/getting-started/use-cases/postgres-data-pipeline/mappers",permalink:"/getting-started/use-cases/postgres-data-pipeline/mappers",draft:!1,tags:[{label:"getting started",permalink:"/tags/getting-started"},{label:"quick start",permalink:"/tags/quick-start"},{label:"postgres data pipeline",permalink:"/tags/postgres-data-pipeline"},{label:"mappers",permalink:"/tags/mappers"}],version:"2022.3",sidebarPosition:4,frontMatter:{title:"Postgres data pipeline - Declare Source and Mappers",sidebar_label:"Declare Source and Mappers",sidebar_position:4,id:"mappers",keywords:["getting started","quick start","postgres data pipeline","mappers"],tags:["getting started","quick start","postgres data pipeline","mappers"]},sidebar:"learningSidebar",previous:{title:"Prepare the Source Data",permalink:"/getting-started/use-cases/postgres-data-pipeline/source-data"},next:{title:"Deploy the Application",permalink:"/getting-started/use-cases/postgres-data-pipeline/deploy"}},l={},m=[{value:"Declare Data Source",id:"declare-data-source",level:2},{value:"Declare the Mapper",id:"declare-the-mapper",level:2}],u={toc:m};function c(e){var t=e.components,n=(0,r.Z)(e,i);return(0,s.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"In this part of the tutorial we will declare the PostgreSQL server as a data source and map the incoming rows to a Genesis ",(0,s.kt)("a",{parentName:"p",href:"/database/fields-tables-views/tables/"},"Table")," object."),(0,s.kt)("h2",{id:"declare-data-source"},"Declare Data Source"),(0,s.kt)("p",null,"To define the data pipeline, start by defining the data source. Create a new Kotlin script ",(0,s.kt)("inlineCode",{parentName:"p"},"trades-data-pipeline.kts")," under ",(0,s.kt)("inlineCode",{parentName:"p"},"datapipeline-sandbox/server/jvm/datapipeline-trades-script-config/src/main/resources/cfg")," (if you chose another project name don't forget to replace ",(0,s.kt)("inlineCode",{parentName:"p"},"datapipeline-trades")," with it) and fill in the following."),(0,s.kt)("p",null,"In this example the ",(0,s.kt)("inlineCode",{parentName:"p"},"hostname")," needs to be set to the address of the PostgreSQL server."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-kotlin"},'sources {\n\n    postgres("trade-pipeline") {\n        hostname = "alpha.west.master"\n        port = 5432\n        username = "postgres"\n        password = systemDefinition.getItem("CdcPostgresPassword").toString()\n        databaseName = "postgres"\n\n    }\n}\n')),(0,s.kt)("admonition",{type:"tip"},(0,s.kt)("p",{parentName:"admonition"},"If you don't have intelisense when editing the data pipeline file check the contents of ",(0,s.kt)("strong",{parentName:"p"},"datapipeline-trades-script-config/build.gradle.kts"),". Under ",(0,s.kt)("strong",{parentName:"p"},"dependencies")," it should contain ",(0,s.kt)("inlineCode",{parentName:"p"},'api("global.genesis:genesis-pal-datapipeline")'),". If that entry is not present add it to the list of dependencies. Once done the file should look like:"),(0,s.kt)("pre",{parentName:"admonition"},(0,s.kt)("code",{parentName:"pre",className:"language-kotlin"},'dependencies {\n    ...\n    api("global.genesis:genesis-pal-datapipeline")\n    ..\n}\n'))),(0,s.kt)("p",null,"The next step is to declare the mapper for each table. In our case we are only interested in one table - ",(0,s.kt)("inlineCode",{parentName:"p"},"trades"),"."),(0,s.kt)("h2",{id:"declare-the-mapper"},"Declare the Mapper"),(0,s.kt)("p",null,"Enter the code from the next section. Don't worry if it looks confusing now. We'll go through it in a bit."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-kotlin"},'sources {\n\n    postgres("trade-pipeline") {\n        hostname = "alpha.west.master"\n        port = 5432\n        username = "postgres"\n        password = systemDefinition.getItem("CdcPostgresPassword").toString()\n        databaseName = "postgres"\n\n        table {\n            "public.trades" to mapper("e2e-test", TRADE) {\n\n                val tradeId = stringValue("trd_id")\n                val instrument = stringValue("inst")\n                val tradedAt = longValue("traded_at")\n                val side = stringValue("side")\n                val tradeState = stringValue("trade_state")\n\n                TRADE {\n                    TRADE_ID {\n                        //lookup from ALT_TRADE_ID based on trd_id column\n                        transform {\n                            val tradeCode: String = input.get(tradeId)\n                            entityDb.get(AltTradeId.byCode(tradeCode, "TradeStore"))?.tradeId\n                        }\n                    }\n\n                    INSTRUMENT_ID {\n                        //lookup from ALT_INSTRUMENT_ID based on INSTRUMENT_CODE\n                        transform {\n                            val code: String = input.get(instrument)\n                            val instrumentType = "RIC"\n                            val altInstrumentId: AltInstrumentId? =\n                                entityDb.get(AltInstrumentId.byCode(code, instrumentType))\n                            if (altInstrumentId != null) {\n                                altInstrumentId.instrumentId\n                            } else {\n                                val newInstrumentId = entityDb.insert(Instrument {\n                                    //We don\'t have a name supplied by postgres, so use the code as the name\n                                    instrumentName = code\n                                }).record.instrumentId\n\n                                entityDb.insert(AltInstrumentId {\n                                    alternateType = instrumentType\n                                    instrumentCode = code\n                                    instrumentId = newInstrumentId\n                                })\n\n                                newInstrumentId\n                            }\n                        }\n                    }\n\n                    PRICE {\n                        sourceProperty = "price"\n                    }\n\n                    QUANTITY {\n                        sourceProperty = "quantity"\n                    }\n\n                    SIDE {\n                        transform {\n                            Side.valueOf(input.get(side).toUpperCase())\n                        }\n                    }\n\n                    TRADE_DATETIME {\n                        transform {\n                            val tradedAtLong = input.get(tradedAt) / 1000L\n                            DateTime(tradedAtLong)\n                        }\n                    }\n\n                    TRADE_DATE {\n                        transform {\n                            val tradedAtLong = input.get(tradedAt) / 1000L\n                            DateTime(tradedAtLong).withTimeAtStartOfDay()\n                        }\n                    }\n\n                    ENTERED_BY {\n                        sourceProperty = "trader"\n                    }\n\n                    TRADE_STATUS {\n                        transform {\n                            val readState = input.get(tradeState)\n                            when(readState) {\n                                "new" -> TradeStatus.NEW\n                                "mod" ->  TradeStatus.MODIFIED\n                                "canc" -> TradeStatus.CANCELLED\n                                else -> throw IllegalStateException("Unknown trade state: $readState")\n                            }\n                        }\n                    }\n\n                    UNSOLICITED {\n                        sourceProperty = "unsolicited"\n                    }\n\n                    PREV_TRADE_ID {\n                        sourceProperty = "orig_trd_id"\n                    }\n                }\n            }\n        }\n    }\n}\n')),(0,s.kt)("p",null,"When declaring a mapper the first thing is to give it a name. This is just to identify it and doesn't have any functionality associated with it. The second argument is the ",(0,s.kt)("a",{parentName:"p",href:"/database/fields-tables-views/tables/"},"Table")," to be mapped to. In our case this is the ",(0,s.kt)("inlineCode",{parentName:"p"},"TRADE")," table. Following are mappings for each ",(0,s.kt)("a",{parentName:"p",href:"/database/fields-tables-views/fields/"},"Field")," of the ",(0,s.kt)("a",{parentName:"p",href:"/database/fields-tables-views/tables/"},"Table"),". There are three ways to define a ",(0,s.kt)("a",{parentName:"p",href:"/database/fields-tables-views/fields/"},"Field")," mapping:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"when the source property name is the same as the ",(0,s.kt)("a",{parentName:"li",href:"/database/fields-tables-views/fields/"},"Field")," name then there is no need to specify anything"),(0,s.kt)("li",{parentName:"ul"},"when the source property name is different from the ",(0,s.kt)("a",{parentName:"li",href:"/database/fields-tables-views/fields/"},"Field")," name, however, the type is the same as the ",(0,s.kt)("a",{parentName:"li",href:"/database/fields-tables-views/fields/"},"Field")," type or is one that can be converted out of the box. In this case only the name has to be mapped and this is done by specifying the ",(0,s.kt)("inlineCode",{parentName:"li"},"sourceProperty")," field"),(0,s.kt)("li",{parentName:"ul"},"when the source property name and type are different from the ",(0,s.kt)("a",{parentName:"li",href:"/database/fields-tables-views/fields/"},"Field")," name and type - in this case a ",(0,s.kt)("inlineCode",{parentName:"li"},"transform")," function can be used to calculate the mapped value")),(0,s.kt)("p",null,"Looking at the code above you can notice that ",(0,s.kt)("inlineCode",{parentName:"p"},"TRADE_ID"),", ",(0,s.kt)("inlineCode",{parentName:"p"},"INSTRUMENT_ID"),", ",(0,s.kt)("inlineCode",{parentName:"p"},"SIDE"),", ",(0,s.kt)("inlineCode",{parentName:"p"},"TRADE_DATETIME"),", ",(0,s.kt)("inlineCode",{parentName:"p"},"TRADE_DATE")," and ",(0,s.kt)("inlineCode",{parentName:"p"},"TRADE_STATUS")," are calculated ",(0,s.kt)("a",{parentName:"p",href:"/database/fields-tables-views/fields/"},"Fields")," and all the rest are mapped by name."),(0,s.kt)("p",null,"The ",(0,s.kt)("inlineCode",{parentName:"p"},"transform")," function for ",(0,s.kt)("inlineCode",{parentName:"p"},"INSTRUMENT_ID")," is the most complex one as it actually performs additional operations based on the current state of the Genesis database. On the first three lines in the function we try to map the incoming instrument code to a instrument that's already in the Genesis database. If such an instrument exists then its ID is returned, however, if it's not there a new instrument is created."),(0,s.kt)("p",null,"Follow the links for more information on ",(0,s.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/basics/#mapper-for-the-incoming-data"},"mapping")," and the ",(0,s.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/advanced/#interacting-with-the-database"},(0,s.kt)("inlineCode",{parentName:"a"},"transform"))," function."),(0,s.kt)("p",null,"Finally, to ensure your Genesis application picks up your new script, we must declare the runtime as defined ",(0,s.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/configuring-runtime/#configure-processesxml-file"},"here"),"."))}c.isMDXComponent=!0}}]);