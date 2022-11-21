"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[47898],{10318:function(e,t,a){a.r(t),a.d(t,{assets:function(){return d},contentTitle:function(){return l},default:function(){return u},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return m}});var i=a(87462),n=a(63366),r=(a(67294),a(3905)),o=(a(61839),["components"]),s={title:"Market data adaptors - Configuration",sidebar_label:"Configuring Adaptors",id:"configuring-adaptors",keywords:["server","integration","market data adaptors","configuration"],tags:["server","integration","market data adaptors","configuration"]},l=void 0,p={unversionedId:"server/integration/market-data-adaptors/configuring-adaptors",id:"server/integration/market-data-adaptors/configuring-adaptors",title:"Market data adaptors - Configuration",description:"This page gives details of the configuration requirements common to adaptors for all vendors.",source:"@site/docs/03_server/10_integration/05_market-data-adaptors/01_configuring-adaptors.md",sourceDirName:"03_server/10_integration/05_market-data-adaptors",slug:"/server/integration/market-data-adaptors/configuring-adaptors",permalink:"/next/server/integration/market-data-adaptors/configuring-adaptors",draft:!1,tags:[{label:"server",permalink:"/next/tags/server"},{label:"integration",permalink:"/next/tags/integration"},{label:"market data adaptors",permalink:"/next/tags/market-data-adaptors"},{label:"configuration",permalink:"/next/tags/configuration"}],version:"current",sidebarPosition:1,frontMatter:{title:"Market data adaptors - Configuration",sidebar_label:"Configuring Adaptors",id:"configuring-adaptors",keywords:["server","integration","market data adaptors","configuration"],tags:["server","integration","market data adaptors","configuration"]},sidebar:"serverModulesSidebar",previous:{title:"Examples",permalink:"/next/server/integration/gateways-and-streamers/examples"},next:{title:"Refinitiv",permalink:"/next/server/integration/market-data-adaptors/refinitiv"}},d={},m=[{value:"Adding the process to processes.xml\u200b",id:"adding-the-process-to-processesxmldirect-link-to-heading",level:2},{value:"The config file\u200b",id:"the-config-filedirect-link-to-heading",level:2},{value:"Pre-expression\u200b",id:"pre-expressiondirect-link-to-heading",level:2},{value:"Subscriptions\u200b",id:"subscriptionsdirect-link-to-heading",level:2}],c={toc:m};function u(e){var t=e.components,a=(0,n.Z)(e,o);return(0,r.kt)("wrapper",(0,i.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"This page gives details of the configuration requirements common to adaptors for all vendors."),(0,r.kt)("h2",{id:"adding-the-process-to-processesxmldirect-link-to-heading"},"Adding the process to processes.xml",(0,r.kt)("a",{parentName:"h2",href:"https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/common-config/#adding-the-process-to-processesxml",title:"Direct link to heading"},"\u200b")),(0,r.kt)("p",null,"You configure the details of an adaptor in your ",(0,r.kt)("em",{parentName:"p"},"applicationName"),(0,r.kt)("strong",{parentName:"p"},"-processes.xml")," file. Before we go into detail, go to your ",(0,r.kt)("em",{parentName:"p"},"applicationName"),(0,r.kt)("strong",{parentName:"p"},"-processes.xml"),"\xa0file and specify the file name in your config element process definition. Here is an example of such a definition for an Elektron adaptor. We have called the process file for this process\xa0elektron-adaptor.xml:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-xml"},'<process name="ELEKTRON_ADAPTOR">    \n    <start>true</start>    \n    <options>-Xmx2048m -DXSD_VALIDATE=false</options>    \n    <module>elektron-adaptor</module>    \n    <package>global.genesis.elektron.adapter,global.genesis.marketdata.core</package>    \n    <config>elektron-adaptor.xml</config>    \n    <joinPub>market-data-joiner.xml</joinPub>    \n    <groupId>ELEKTRON</groupId>    \n    <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>\n</process>\n')),(0,r.kt)("p",null,"When specifying the process definition for a market data adaptor, you must include the\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"global.genesis.marketdata.core package"),"\xa0in the package element tag, alongside the adaptor-specific package."),(0,r.kt)("p",null,"This is because the bulk of the functionality is provided by the market data engine. When the service is initialised by dependency injection, the core of the service is initialised from the engine, and the adaptor provides vendor-specific components that enable the adaptor to function."),(0,r.kt)("h2",{id:"the-config-filedirect-link-to-heading"},"The config file",(0,r.kt)("a",{parentName:"h2",href:"https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/common-config/#the-config-file",title:"Direct link to heading"},"\u200b")),(0,r.kt)("p",null,"The market data adaptors themselves are configured with an xml file. There are common elements to all the adaptor configurations."),(0,r.kt)("p",null,"The majority of customisable logic is specified within the xml file as groovy code snippets elements prefixed with a CDATA block, similar to the configuration for consolidators."),(0,r.kt)("h2",{id:"pre-expressiondirect-link-to-heading"},"Pre-expression",(0,r.kt)("a",{parentName:"h2",href:"https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/common-config/#pre-expression",title:"Direct link to heading"},"\u200b")),(0,r.kt)("p",null,"The pre-expression is a groovy code block executed before any other code block specified in the file. You can use this expression to define any utility functions you wish to use within your other code."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},'<preExpression>\n<![CDATA[        \n    import org.joda.time.format.DateTimeFormat        \n    import org.joda.time.format.DateTimeFormatter        \n    import org.joda.time.DateTime        \n    import org.joda.time.LocalTime        \n    import org.apache.commons.lang3.time.DateUtils        \n    class DateTimeHelper {           \n        private final static DateTimeFormatter fullDateFormatter = DateTimeFormat.forPattern("dd MMM yyyy HH:mm:ss")           \n        private final static DateTimeFormatter timeFormatter = DateTimeFormat.forPattern("HH:mm:ss")           \n        private final static DateTimeFormatter fullDateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd\'T\'HH:mm:ss.SSSZ")           \n        public static DateTime fullDateTimeConverter(String date, String time){           \n             return DateTime.parse("${date} ${time}", DateTimeHelper.fullDateFormatter)           \n        }           \n        public static DateTime timeToDateTimeConverter(String time){            \n            return LocalTime.parse(time, DateTimeHelper.timeFormatter).toDateTimeToday()           \n        }           \n        public static DateTime dateTimeToDateTimeConverter(String time){            \n            return DateTime.parse(time, DateTimeHelper.fullDateTimeFormatter)           \n        }        \n    } \n]]>\n</preExpression>\n')),(0,r.kt)("h2",{id:"subscriptionsdirect-link-to-heading"},"Subscriptions",(0,r.kt)("a",{parentName:"h2",href:"https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/common-config/#subscriptions",title:"Direct link to heading"},"\u200b")),(0,r.kt)("p",null,"After the pre-expression, an adaptor has a\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"subscriptions"),"\xa0element. This contains a number of\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"subscription"),"\xa0elements. This is where you specify the details of the adaptor."),(0,r.kt)("p",null,"Within a subscription element, you can specify:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"one or more\xa0",(0,r.kt)("inlineCode",{parentName:"li"},"table"),"\xa0objects within a\xa0",(0,r.kt)("inlineCode",{parentName:"li"},"tables"),"\xa0element"),(0,r.kt)("li",{parentName:"ul"},"a\xa0",(0,r.kt)("inlineCode",{parentName:"li"},"where"),"\xa0element, where you can define a code block for custom logic"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"record"),"\xa0elements defined within a\xa0",(0,r.kt)("inlineCode",{parentName:"li"},"records"),"\xa0element")),(0,r.kt)("p",null,"Each subscription has a number of\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"table"),"\xa0objects within a\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"tables"),"\xa0element. Each table is given an alias so it can be referred to in code, using the\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"alias"),"\xa0attribute. It also has a\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"seedKey"),"\xa0attribute, that defines the index used for lookups."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-xml"},'<tables>    \n    <table name="INSTRUMENT_PRICE_SUBSCRIPTION" alias="ips" seedKey="INSTRUMENT_PRICE_SUBSCRIPTION_BY_INSTRUMENT_CODE">\n</tables>\n')),(0,r.kt)("p",null,"Each subscription has a\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"where"),"\xa0element, where you can define a code block for custom logic dictating whether or not a record should be subscribed for. It should return a boolean value."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-xml"},"<where><![CDATA[recordExists(ips)]]></where>\n")),(0,r.kt)("p",null,"Each subscription has a number of\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"record"),"\xa0elements defined within a\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"records"),"\xa0element. These elements define the destination that market data will be published to (i.e. which tables)."),(0,r.kt)("p",null,"A\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"record"),"\xa0has the following attributes."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"targetTable"),"\xa0refers to the name of the table where market data will be published. It must be defined in the tables dictionary for the projects."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"alias"),"\xa0is a variable name given to the record to be populated so it can be referred to in code."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"type"),"\xa0is an enumerated value which must be one of\xa0",(0,r.kt)("inlineCode",{parentName:"li"},"INSERT_ONLY"),"\xa0or\xa0",(0,r.kt)("inlineCode",{parentName:"li"},"MODIFY"),". ",(0,r.kt)("inlineCode",{parentName:"li"},"INSERT_ONLY")," records do not overwrite existing records for the same lookup key. This is useful for time-series data like time and sales. Modify indicates records should be overwritten for the same lookup key. This is useful for real-time prices."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"isHFT"),"\xa0refers to whether the target table is configured as a database table or a Genesis HFT memory-mapped table."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"lookupKey"),"\xa0is explained in detail below.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-xml"},'<record targetTable="INSTRUMENT_L1_PRICE" alias="ip" type="MODIFY" isHFT="true" lookupKey="someKey">\n')),(0,r.kt)("p",null,"The\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"lookupKey"),"\xa0element defines a function in groovy. Its goal is to populate a database record with the information required to locate the exisiting record in the database (if one exists). As such, it is not applicable to records specified with a type of\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"INSERT_ONLY"),". The inputs to this function are:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"a variable called data, which is a ",(0,r.kt)("inlineCode",{parentName:"li"},"Map<String, Object>"),". The map contains the field names and values received from the adaptor."),(0,r.kt)("li",{parentName:"ul"},"a variable with the same name as the alias defined for the target table specified in the record. This variable should be populated with the data required to perform the lookup."),(0,r.kt)("li",{parentName:"ul"},"variables for all the tables defined in the subscription, with names corresponding to their configured aliases.")),(0,r.kt)("p",null,"Below is an example of a simple lookup key function. The\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"INSTRUMENT_L1_PRICE"),"\xa0table has an index on\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"INSTRUMENT_CODE"),", so this is the only data point we need to locate the existing record. We obtain the code from the subscription table defined with alias 'ips'."),(0,r.kt)("p",null,"If your price tables are more complex than the stock tables provided by the market data system, then you will need to make sure that the record in this function is populated with sufficient information in order to locate the existing record by an index."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-xml"},'<record targetTable="INSTRUMENT_L1_PRICE" alias="ip" type="MODIFY" isHFT="true">    \n    <lookupKey><![CDATA[ip.setString(ips.getString(\'INSTRUMENT_CODE\'))]]></lookupKey>\n</record>\n')),(0,r.kt)("p",null,"The record has two more elements:"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Fields"),"\xa0enables you to specify a transformation function that maps your data map to a record in the target table."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-xml"},"<fields>\n<![CDATA[ip.setDouble('EMS_BID_PRICE', (Double)((Double) data['BID'])/100) ip.setDouble('EMS_ASK_PRICE', (Double)((Double) data['ASK'])/100)]]>\n</fields>\n")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"hftFields"),"\xa0enables you to do the same if the target table is specified as an HFT memory-mapped table. Null checks must be performed before entering values."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-xml"},'<hftFields>\nDouble emsBidPrice = data["BID"]  \nif (emsBidPrice != null) {       \n    hft_ip.setEmsBidPrice(emsBidPrice)    \n}    \nDouble emsAskPrice = data["ASK"]    \nif (emsAskPrice != null) {\n    hft_ip.setEmsAskPrice(emsAskPrice)    \n}\n</hftFields>\n')),(0,r.kt)("p",null,"Here is a full example configuration for an adaptor. This has two subscriptions. The first is called\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"LEVEL_ONE"),"\xa0and the second is called\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"FX_SUBSCRIPTION"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-xml"},'<elektronAdaptor>    \n    <connection>        \n        <connectionType>RSSL</connectionType>        \n        <port>14002</port>        \n        <host>localhost</host>        \n        <userName>genesis</userName>        \n        <service>ELEKTRON_DD</service>        \n        <logEnabled>0</logEnabled>    \n    </connection>    \n    <preExpression>      \n        <![CDATA[            \n            import org.joda.time.format.DateTimeFormat            \n            import org.joda.time.format.DateTimeFormatter            \n            import org.joda.time.DateTime            \n            import org.joda.time.LocalTime            \n            import org.apache.commons.lang3.time.DateUtils            \n            class DateTimeHelper {               \n                private final static DateTimeFormatter fullDateFormatter = DateTimeFormat.forPattern("dd MMM yyyy HH:mm:ss")               \n                private final static DateTimeFormatter timeFormatter = DateTimeFormat.forPattern("HH:mm:ss")               private final static DateTimeFormatter fullDateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd\'T\'HH:mm:ss.SSSZ")               \n                public static DateTime fullDateTimeConverter(String date, String time){                \n                    return DateTime.parse("${date} ${time}", DateTimeHelper.fullDateFormatter)               \n                }               \n                public static DateTime timeToDateTimeConverter(String time){                \n                    return LocalTime.parse(time, DateTimeHelper.timeFormatter).toDateTimeToday()               \n                }               \n                public static DateTime dateTimeToDateTimeConverter(String time){                \n                    return DateTime.parse(time, DateTimeHelper.fullDateTimeFormatter)               \n                }            \n            }        \n        ]]>    \n    </preExpression>    \n    <subscriptions>        \n        <subscription name="LEVEL_ONE">            \n            <tables>                \n                <table name="INSTRUMENT_PRICE_SUBSCRIPTION" alias="ips" seedKey="INSTRUMENT_PRICE_SUBSCRIPTION_BY_INSTRUMENT_CODE" />            \n            </tables>            \n            <ricFormat>                \n                <![CDATA[ "/" + ips.getString(\'INSTRUMENT_CODE\') + ".L" ]]>            \n            </ricFormat>            \n            <where>                \n                <![CDATA[recordExists(ips)]]>            \n            </where>            \n            <records>                \n                <record targetTable="INSTRUMENT_L1_PRICE" alias="ip" type="MODIFY" isHFT="true">                    <lookupKey>                        \n                    <![CDATA[ips.getString(\'INSTRUMENT_CODE\')]]>                    \n                </lookupKey>                    \n                <fields>                        \n                    <![CDATA[\n                        ip.setDouble(\'LOW_PRICE\', \n                        (Double)((Double)data[\'LOW_1\'])/100) ip.setDouble(\'HIGH_PRICE\', \n                        (Double)((Double) data[\'HIGH_1\'])/100) ip.setDouble(\'EMS_BID_PRICE\', \n                        (Double)((Double) data[\'BID\'])/100) ip.setDouble(\'EMS_ASK_PRICE\', (Double)((Double) data[\'ASK\'])/100) ip.setDouble(\'BID_SIZE\', \n                        (Double) data[\'BIDSIZE\']) ip.setDouble(\'ASK_SIZE\', (Double) data[\'ASKSIZE\']) ip.setDouble(\'PCT_CHANGE\', (Double) data[\'PCTCHNG\']) ip.setDouble(\'NET_CHANGE\', (Double) data[\'NETCHNG_1\']) ip.setDouble(\'VWAP\', (Double)((Double) data[\'VWAP\'])/100) ip.setDouble(\'OPEN_PRICE\', \n                        (Double)((Double) data[\'OPEN_PRC\'])/100) ip.setDouble(\'LAST_TRADE\', (Double)((Double) data[\'TRDPRC_1\'])/100) ip.setString(\'DSPLY_NAME\', (String) data[\'DSPLY_NAME\'])]]>\n                </fields>                    \n                <hftFields>                        \n                    <![CDATA[\n                        Double lowPrice = data["LOW_1"]                        \n                        if (lowPrice != null) {                            \n                            hft_ip.setLowPrice(lowPrice)                        \n                        }                        \n                        Double highPrice = data["HIGH_1"]                        \n                        if (highPrice != null) {                            \n                            hft_ip.setHighPrice(highPrice)                        \n                        }                        \n                        Double emsBidPrice = data["BID"]                        \n                        if (emsBidPrice != null) {                            \n                            hft_ip.setEmsBidPrice(emsBidPrice)                        \n                        }                        \n                        Double emsAskPrice = data["ASK"]                        \n                        if (emsAskPrice != null) {                            \n                            hft_ip.setEmsAskPrice(emsAskPrice)                        \n                        }                        \n                        Double bidSize = data["BIDSIZE"]                        \n                        if (bidSize != null) {                            \n                            hft_ip.setBidSize(bidSize)                        \n                        }                       \n                        Double askSize = data["ASKSIZE"]                        \n                        if (askSize != null) {                            \n                            hft_ip.setAskSize(askSize)                        \n                        }                        \n                        Double pctChange = data["PCTCHNG"]                        \n                        if (pctChange != null) {                            \n                            hft_ip.setPctChange(pctChange)                        \n                        }                        \n                        Double netChange = data["NETCHNG_1"]                        \n                        if (netChange != null) {                            \n                            hft_ip.setNetChange(netChange)                        \n                        }                        \n                        Double vwap = data["VWAP"]                        \n                        if (vwap != null) {                            \n                            hft_ip.setVwap(vwap)                        \n                        }                        \n                        Double openPrice = data["OPEN_PRC"]                       \n                        if (openPrice != null) {                           \n                            hft_ip.setOpenPrice(openPrice)                        \n                        }                        \n                        Double lastTrade = data["TRDPRC_1"]                        \n                        if (lastTrade != null) {                            \n                            hft_ip.setLastTrade(lastTrade)                        \n                        }                        \n                        String dsplyName = data["DSPLY_NAME"]                        \n                        if (dsplyName != null) {                            \n                            hft_ip.setDsplyName(dsplyName)                        \n                        }                        \n                    ]]>                    \n                </hftFields>                \n            </record>            \n        </records>        \n        </subscription>        \n        <subscription name="FX_SUBSCRIPTION">            \n            <tables>                \n                <table name="FX_SUBSCRIPTION" alias="fs" seedKey="FX_SUBSCRIPTION_BY_INSTRUMENT_CODE" />            \n            </tables>            \n            <ricFormat>                \n                <![CDATA[fs.getString(\'INSTRUMENT_CODE\')]]>            \n            </ricFormat>            \n            <where>                \n                <![CDATA[recordExists(fs)]]>            \n            </where>            \n            <records>                \n                <record targetTable="FX_RATE" alias="fr" type="MODIFY" isHFT="true">                    \n                    <lookupKey> \n                        <![CDATA[fs.getString(\'INSTRUMENT_CODE\') ]]>\n                    </lookupKey>                    \n                    <fields>                        \n                        <![CDATA[fr.setDouble(\'BID_RATE\', (Double) data[\'BID\']) fr.setDouble(\'ASK_RATE\', (Double) data[\'ASK\'])fr.setString(\'DESCRIPTION\', (String) data[\'GEN_TEXT16\']) fr.setDouble(\'PCT_CHANGE\', (Double) data[\'PCTCHNG\'])]]>                    \n                    </fields>                    \n                    <hftFields>                        \n                        <![CDATA[Double bidRate = data["BID"]                        \n                            if (bidRate != null) {                            \n                                hft_fr.setBidRate(bidRate)                        \n                            }                        \n                            Double askRate = data["ASK"]                        \n                            if (askRate != null) {                            \n                                hft_fr.setAskRate(askRate)                        \n                            }                        \n                            String description = data["GEN_TEXT16"]                        \n                            if (description != null) {                            \n                                hft_fr.setDescription(description)                        \n                            }                        \n                            Double pctChange = data["PCTCHNG"]                        \n                            if (pctChange != null) {                            \n                                hft_fr.setPctChange(pctChange)                        \n                            }\n                        ]]>                    \n                    </hftFields>                \n                </record>            \n            </records>        \n        </subscription>    \n    </subscriptions>\n</elektronAdaptor>\n')))}u.isMDXComponent=!0}}]);