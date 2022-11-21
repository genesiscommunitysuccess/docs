"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[96157],{74067:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return o},default:function(){return h},frontMatter:function(){return l},metadata:function(){return d},toc:function(){return p}});var a=n(87462),r=n(63366),i=(n(67294),n(3905)),s=(n(61839),["components"]),l={title:"Data Server - Advanced",sidebar_label:"Advanced",id:"advanced",keywords:["server","data server","dataserver","advanced"],tags:["server","data server","dataserver","advanced"]},o=void 0,d={unversionedId:"server/data-server/advanced",id:"version-2022.3/server/data-server/advanced",title:"Data Server - Advanced",description:"Client-enriched data",source:"@site/versioned_docs/version-2022.3/03_server/02_data-server/03_advanced.md",sourceDirName:"03_server/02_data-server",slug:"/server/data-server/advanced",permalink:"/server/data-server/advanced",draft:!1,tags:[{label:"server",permalink:"/tags/server"},{label:"data server",permalink:"/tags/data-server"},{label:"dataserver",permalink:"/tags/dataserver"},{label:"advanced",permalink:"/tags/advanced"}],version:"2022.3",sidebarPosition:3,frontMatter:{title:"Data Server - Advanced",sidebar_label:"Advanced",id:"advanced",keywords:["server","data server","dataserver","advanced"],tags:["server","data server","dataserver","advanced"]},sidebar:"serverModulesSidebar",previous:{title:"Basics",permalink:"/server/data-server/basics"},next:{title:"Examples",permalink:"/server/data-server/examples"}},u={},p=[{value:"Client-enriched data",id:"client-enriched-data",level:3},{value:"Ranged Data Server queries",id:"ranged-data-server-queries",level:3},{value:"Client-side (runtime) options",id:"client-side-runtime-options",level:2},{value:"Criteria matching",id:"criteria-matching",level:2},{value:"Common expressions",id:"common-expressions",level:3},{value:"String operations",id:"string-operations",level:4},{value:"containsIgnoreCase(String, String)",id:"containsignorecasestring-string",level:5},{value:"containsWordsStartingWithIgnoreCase(String, String)",id:"containswordsstartingwithignorecasestring-string",level:5},{value:"Date operations",id:"date-operations",level:4},{value:"dateIsBefore(date as DateTime|String|Long, String)",id:"dateisbeforedate-as-datetimestringlong-string",level:5},{value:"dateIsAfter(date as DateTime|String|Long, String)",id:"dateisafterdate-as-datetimestringlong-string",level:5},{value:"dateIsGreaterEqual(date as DateTime|String|Long, String)",id:"dateisgreaterequaldate-as-datetimestringlong-string",level:5},{value:"dateIsLessEqual(date as DateTime|String|Long, String)",id:"dateislessequaldate-as-datetimestringlong-string",level:5},{value:"dateIsEqual(date as DateTime|String|Long, String)",id:"dateisequaldate-as-datetimestringlong-string",level:5},{value:"dateIsToday(date as DateTime|String|Long)",id:"dateistodaydate-as-datetimestringlong",level:5},{value:"DateTime operations",id:"datetime-operations",level:4},{value:"dateTimeIsBefore(datetime as DateTime|String|Long, String)",id:"datetimeisbeforedatetime-as-datetimestringlong-string",level:5},{value:"dateTimeIsAfter(datetime as DateTime|String|Long, String)",id:"datetimeisafterdatetime-as-datetimestringlong-string",level:5},{value:"dateTimeIsGreaterEqual(datetime as DateTime|String|Long, String)",id:"datetimeisgreaterequaldatetime-as-datetimestringlong-string",level:5},{value:"dateTimeIsLessEqual(datetime as DateTime|String|Long, String)",id:"datetimeislessequaldatetime-as-datetimestringlong-string",level:5},{value:"Groovy expression",id:"groovy-expression",level:3}],m={toc:p};function h(e){var t=e.components,n=(0,r.Z)(e,s);return(0,i.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h3",{id:"client-enriched-data"},"Client-enriched data"),(0,i.kt)("p",null,"In some scenarios, you might want to associate the results of Data Server queries with the user who initiated the queries. You can achieve this using the ",(0,i.kt)("inlineCode",{parentName:"p"},"enrich")," feature, which enables an additional table or view join (including backwards joins). With this feature, you can provide user-specific values for each row, or even perform cell-level permissioning (for example, to hide cell values), depending on entitlements."),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"join")," operation receives two parameters: "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"userName")," is the current user name subscribed to the query"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"row")," is the pre-built query row")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"hideFields")," enables you to define a list of fields that will be hidden if certain conditions apply. Three parameters are provided: "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"userName")," the current user name subscribed to the query"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"row")," the pre-built query ",(0,i.kt)("inlineCode",{parentName:"li"},"row")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"userData")," the table or view lookup result; this will be null if the lookup fails to find a record")),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"fields")," section defines what fields should be visible as part of the query. Use this if you want to use a subset of fields from the enriched table or view, or if you want to declare your own derived fields."),(0,i.kt)("p",null,"The example below should help you to understand the functionality. Comments are included in the code to ease understanding."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'// Example using "hideFields" and creating derived fields based on user counterparty association\nquery("ALL_BUYER_SELLER_TRADES", BUYER_SELLER_TRADE_VIEW){\n    permissioning {\n        permissionCodes = listOf("ViewTrades")\n        auth("ENTITY_VISIBILITY"){\n            BUYER_SELLER_TRADE_VIEW.BUYER_COUNTERPARTY_ID\n        } or\n        auth("ENTITY_VISIBILITY"){\n            BUYER_SELLER_TRADE_VIEW.SELLER_COUNTERPARTY_ID\n        }\n    }\n    enrich(USER_COUNTERPARTY_MAP) {\n        join { userName, row ->\n            UserCounterpartyMap.ByUserName(userName)\n        }\n        // Hide buyer counterparty id to users associated to counterparty seller if "isHiddenToSeller" is true.\n        hideFields { userName, row, userData ->\n            if(userData?.counterpartyId == queryRow.sellerConterPartyId && queryRow.isHiddenToSeller == true){\n                listOf(BUYER_SELLER_TRADE_VIEW.BUYER_COUNTERPARTY_ID)\n            } else{\n                emptyList()\n            }\n        }\n        fields {\n            // If a user belows to the buyer counterparty, "COUNTERPARTY" value will be the seller name\n            // in the reverse scenario it will be the buyer name\n            derivedField("COUNTERPARTY", STRING) { row, userData ->\n                when {\n                    userData?.counterpartyId == row.buyerId -> row.sellerName\n                    userData?.counterpartyId == row.sellerId -> row.buyerName\n                    else -> ""\n                }\n            }\n            // If a user belows to the buyer counterparty, "DIRECTION" will be "BUY"\n            // in the reverse scenario it will be "SELL"\n            derivedField("DIRECTION", STRING) { row, userData ->\n                when {\n                    userData?.counterpartyId == row.buyerId -> "BUY"\n                    userData?.counterpartyId == row.sellerId -> "SELL"\n                    else -> ""\n                }\n            }\n        }\n    }\n}\n\n// Example: selecting fields from enriched view\nquery("ALL_COUNTERPARTIES" , COUNTERPARTY_VIEW) {\n    // Lookup user counterparty favourite view and provide user enrich field to display if a counterparty has been marked as favourite by the user.\n    enrich(USER_COUNTERPARTY_FAVOURITE) {\n        join { userName, row ->\n            UserCounterpartyFavourite.ByUserNameCounterparty(username, row.counterpartyId)\n        }\n        // We only care about selecting the IS_FAVOURITE field from the USER_COUNTERPARTY_FAVOURITE view\n        fields {\n            USER_COUNTERPARTY_FAVOURITE.IS_FAVOURITE\n        }\n    }\n}\n\n// Example: using "enrichedAuth" to combine fields from enrichment with authorisation mechanism\nquery("ALL_FAVOURITE_COUNTERPARTIES", COUNTERPARTY_VIEW) {\n    permissioning {\n        enrichedAuth("COUNTERPARTY_FAVOURITE_VISIBILITY", USER_COUNTERPARTY_FAVOURITE) {\n            COUNTERPARTY_VIEW.COUNTERPARTY_ID\n            USER_COUNTERPARTY_FAVOURITE.IS_FAVOURITE\n        }\n    }\n    enrich(USER_COUNTERPARTY_FAVOURITE) {\n        join { userName, row ->\n            UserCounterpartyFavourite.ByUserNameCounterparty(username, row.counterpartyId)\n        }\n    }\n}\n\n')),(0,i.kt)("h3",{id:"ranged-data-server-queries"},"Ranged Data Server queries"),(0,i.kt)("p",null,"Ranged Data Servers only cache a defined range within a table or view. This makes the Data Server more responsive and reduces resource requirements."),(0,i.kt)("p",null,"The example below includes comments to ease understanding:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'query("TRADE_RANGED_LAST_2_HOURS", TRADE) {\n    // the ranged key word makes this a ranged query\n    //    the index and the number of key fields needs to be specified\n    ranged(index = Trade.ByTradeDateTimeAndType, numKeyFields = 1) {\n        // optionally refresh keys periodically, for example when we are doing a\n        // range on dates\n        refresh {\n            // either every\n            every(2.hours)\n            // or at specific time\n            at(8.pm)\n        }\n        // required, starting key\n        from {\n            Trade.ByTradeDateTime(now().minusHours(2), "")\n        }\n        // optionally end key\n        to {\n            Trade.ByTradeDateTime(now().plusHours(1), "")\n        }\n    }\n}\n')),(0,i.kt)("p",null,"Examples:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'// all dollar trades:\nquery("TRADE_RANGED_TRADE_RANGE_USD", TRADE) {\n    ranged(Trade.ByCurrencyId, 1) {\n        from {\n            Trade.ByCurrencyId("USD")\n        }\n    }\n}\n\n// all trades with quantity between 100 and 1,000\nquery("TRADE_RANGED_TRADE_RANGE_QTY", TRADE) {\n    ranged(Trade.ByQuantity, 1) {\n        from {\n            Trade.ByQuantity(100)\n        }\n        to {\n            Trade.ByQuantity(1000)\n        }\n    }\n}\n\nquery("TRADE_RANGED_LAST_2_HOURS", TRADE) {\n    ranged(index = Trade.ByTradeDateTimeAndType, numKeyFields = 1) {\n        refresh {\n            every(15.minutes)\n        }\n        from {\n            Trade.ByTradeDateTime(now().minusHours(2), "")\n        }\n        to {\n            Trade.ByTradeDateTime(now().plusHours(1), "")\n        }\n    }\n}\n')),(0,i.kt)("p",null,"With refresh queries, rows that move out of the filter range will be removed from the cache, while rows that move into the filter will be added."),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"numKeyFields")," property specifies the number of fields to use from an index. The fields\nare always selected in the order they are specified in the index."),(0,i.kt)("h2",{id:"client-side-runtime-options"},"Client-side (runtime) options"),(0,i.kt)("p",null,"When a client initiates a subscription to a Data Server by sending a ",(0,i.kt)("strong",{parentName:"p"},"DATA_LOGON")," message, there are several options that can be specified. None of these options is mandatory; you don't have to specify any to initiate a subscription.\nThe features of the options are explained below."),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Option"),(0,i.kt)("th",{parentName:"tr",align:null},"Default"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"MAX_ROWS"),(0,i.kt)("td",{parentName:"tr",align:null},"250"),(0,i.kt)("td",{parentName:"tr",align:null},"Maximum number of rows to be returned as part of the initial message, and as part of any additional ",(0,i.kt)("strong",{parentName:"td"},"MORE_ROWS")," messages")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"MAX_VIEW"),(0,i.kt)("td",{parentName:"tr",align:null},"1000"),(0,i.kt)("td",{parentName:"tr",align:null},'Maximum number of rows to track as part of a client "view')),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"MOVING_VIEW"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"td"},"true")),(0,i.kt)("td",{parentName:"tr",align:null},"Defines the behaviour of the client view when new rows are received in real time. If ",(0,i.kt)("inlineCode",{parentName:"td"},"MOVING_VIEW")," is set to ",(0,i.kt)("inlineCode",{parentName:"td"},"true"),", and ",(0,i.kt)("inlineCode",{parentName:"td"},"MAX_VIEW")," is reached, any new rows arriving to the query will start replacing the oldest rows in the view. This guarantees that only the most recent rows are shown by default")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"CRITERIA_MATCH"),(0,i.kt)("td",{parentName:"tr",align:null}),(0,i.kt)("td",{parentName:"tr",align:null},"Clients can send a Groovy expression to perform filters on the query server; these remain active for the life of the subscription. For example: ",(0,i.kt)("inlineCode",{parentName:"td"},"Expr.dateIsBefore(TRADE_DATE,'20150518')")," or ",(0,i.kt)("inlineCode",{parentName:"td"},"QUANTITY > 10000"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"FIELDS"),(0,i.kt)("td",{parentName:"tr",align:null}),(0,i.kt)("td",{parentName:"tr",align:null},"This optional parameter enables you to select a subset of fields from the query if the client is not interested in receiving all of them. Example: ",(0,i.kt)("inlineCode",{parentName:"td"},"TRADE_ID QUANTITY PRICE INSTRUMENT_ID"),". By default, all fields are returned if this option is not specified")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"ORDER_BY"),(0,i.kt)("td",{parentName:"tr",align:null}),(0,i.kt)("td",{parentName:"tr",align:null},"This option can be used to select a Data Server index (defined in xml), which is especially useful if you want the data to be sorted in a specific way. By default, Data Server rows will be returned in order of creation (from oldest database record to newest)")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"REVERSE"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"td"},"false")),(0,i.kt)("td",{parentName:"tr",align:null},"This option changes the Data Server index iteration. For example, if you are using the default index, the query will return rows from newest database records to oldest")))),(0,i.kt)("h2",{id:"criteria-matching"},"Criteria matching"),(0,i.kt)("p",null,"Used to perform filters on the server, you can send a Groovy expression as part of your Data Server request for client-side filtering. Criteria matching supports Groovy expressions and some common expressions. All expressions must return a boolean value (",(0,i.kt)("inlineCode",{parentName:"p"},"true")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"false"),").\nYou can mix and match both common expressions and custom groovy expressions using the && (logical AND) and || (logical OR) boolean operators. These are explained in more detail below."),(0,i.kt)("h3",{id:"common-expressions"},"Common expressions"),(0,i.kt)("p",null,"The platform provides common expressions that are especially helpful for ",(0,i.kt)("inlineCode",{parentName:"p"},"Date")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"DateTime")," client-side filtering. Common expressions are called using the ",(0,i.kt)("inlineCode",{parentName:"p"},"Expr")," binding and take one or two parameters:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"The first parameter is always a query field. In the case of date/datetime, this can either represent the epoch time in milliseconds or a ",(0,i.kt)("inlineCode",{parentName:"li"},"String")," value representing the actual ",(0,i.kt)("inlineCode",{parentName:"li"},"Date")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"DateTime")," in the supported formats."),(0,i.kt)("li",{parentName:"ul"},"The second parameter (if applicable) is a predefined ",(0,i.kt)("inlineCode",{parentName:"li"},"String")," value")),(0,i.kt)("h4",{id:"string-operations"},"String operations"),(0,i.kt)("h5",{id:"containsignorecasestring-string"},"containsIgnoreCase(String, String)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when our field contains the string. Casing is ignored."),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.containsIgnoreCase(EXCHANGE_NAME, 'oves')")),(0,i.kt)("h5",{id:"containswordsstartingwithignorecasestring-string"},"containsWordsStartingWithIgnoreCase(String, String)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when our field starts with the string. Casing is ignored."),(0,i.kt)("h4",{id:"date-operations"},"Date operations"),(0,i.kt)("p",null,"The allowed String formats are:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"DateTime with milliseconds precision: ",(0,i.kt)("em",{parentName:"li"},"yyyyMMdd-HH:mm:ss.SSS")),(0,i.kt)("li",{parentName:"ul"},"DateTime with seconds precision: ",(0,i.kt)("em",{parentName:"li"},"yyyyMMdd-HH:mm:ss")),(0,i.kt)("li",{parentName:"ul"},"DateTime with minutes precision: ",(0,i.kt)("em",{parentName:"li"},"yyyyMMdd-HH:mm")),(0,i.kt)("li",{parentName:"ul"},"DateTime as Date: ",(0,i.kt)("em",{parentName:"li"},"yyyyMMdd"))),(0,i.kt)("h5",{id:"dateisbeforedate-as-datetimestringlong-string"},"dateIsBefore(date as DateTime|String|Long, String)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when the date in the given field is before the date specified."),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.dateIsBefore(TRADE_DATE,'20150518')")),(0,i.kt)("h5",{id:"dateisafterdate-as-datetimestringlong-string"},"dateIsAfter(date as DateTime|String|Long, String)"),(0,i.kt)("p",null,"This returns true when the date in the given field is after the date specified."),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.dateIsAfter(TRADE_DATE,'20150518')")),(0,i.kt)("h5",{id:"dateisgreaterequaldate-as-datetimestringlong-string"},"dateIsGreaterEqual(date as DateTime|String|Long, String)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when the date in the given field is greater or equal to the date specified."),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.dateIsGreaterEqual(TRADE_DATE,'20150518')")),(0,i.kt)("h5",{id:"dateislessequaldate-as-datetimestringlong-string"},"dateIsLessEqual(date as DateTime|String|Long, String)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when the date in the given field is less or equal to the date specified."),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.dateIsLessEqual(TRADE_DATE,'20150518')")),(0,i.kt)("h5",{id:"dateisequaldate-as-datetimestringlong-string"},"dateIsEqual(date as DateTime|String|Long, String)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when the date in the given field is equal to the date specified"),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.dateIsEqual(TRADE_DATE,'20150518')")),(0,i.kt)("h5",{id:"dateistodaydate-as-datetimestringlong"},"dateIsToday(date as DateTime|String|Long)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when the data in the given field is equal to today's date (using system local time)."),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.dateIsToday(TRADE_DATE)")),(0,i.kt)("h4",{id:"datetime-operations"},"DateTime operations"),(0,i.kt)("h5",{id:"datetimeisbeforedatetime-as-datetimestringlong-string"},"dateTimeIsBefore(datetime as DateTime|String|Long, String)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when the datetime in the given field is before the datetime specified."),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.dateTimeIsBefore(TRADE_DATETIME,'20150518-10:50:24')")),(0,i.kt)("h5",{id:"datetimeisafterdatetime-as-datetimestringlong-string"},"dateTimeIsAfter(datetime as DateTime|String|Long, String)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when the datetime in the given field is after the datetime specified."),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.dateTimeIsAfter(TRADE_DATETIME,'20150518-10:50:24')")),(0,i.kt)("h5",{id:"datetimeisgreaterequaldatetime-as-datetimestringlong-string"},"dateTimeIsGreaterEqual(datetime as DateTime|String|Long, String)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when the datetime in the given field is greater or equal to the datetime specified."),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.dateTimeIsGreaterEqual(TRADE_DATETIME,'20150518-10:50:24')")),(0,i.kt)("h5",{id:"datetimeislessequaldatetime-as-datetimestringlong-string"},"dateTimeIsLessEqual(datetime as DateTime|String|Long, String)"),(0,i.kt)("p",null,"This returns ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," when the datetime in the given field is less or equal to the datetime specified."),(0,i.kt)("p",null,"For example:\n",(0,i.kt)("inlineCode",{parentName:"p"},"Expr.dateTimeIsLessEqual(TRADE_DATETIME,'20150518-10:50:24')")),(0,i.kt)("h3",{id:"groovy-expression"},"Groovy expression"),(0,i.kt)("p",null,"Groovy expressions provide the most flexibility for client-side filtering. This approach allows you to use complex boolean logic to filter over your fields using Java syntax."),(0,i.kt)("p",null,"Note - You can not filter over derived fields."),(0,i.kt)("p",null,"Below are a few examples of valid Groovy expressions."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"// Quantity is more than 10000\nQUANTITY > 10000\n\n// Quantity is more than or equal to 10000\nQUANTITY >= 10000\n\n// Quantity is less than 10000\nQUANTITY < 10000\n\n// Quantity is less than or equal to 10000\nQUANTITY <= 10000\n\n// Quantity is equal to 10000\nQUANTITY == 10000\n\n// Quantity is not equal 10000\nQUANTITY != 10000\n")),(0,i.kt)("p",null,"You can also join multiple expressions together. These expressions can even be the common expressions mentioned above."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"// Quantity is more than 100 AND less than 500\nQUANTITY > 100 && QUANTITY < 500\n\n// Quantity is less than 100 OR more than or equal to 500\nQUANTITY < 100 || QUANTITY >= 500\n\n// Date is today AND QUANTITY is more than 100\nExpr.dateIsToday(TRADE_DATE) && QUANTITY > 100\n")),(0,i.kt)("p",null,"Note - When using logical OR in your filter, you will lose the ability to use indexing for searches."),(0,i.kt)("p",null,"Should you wish to use more advanced boolean logic, you can pass brackets to ensure each part of your filter is checked in line with your business needs."),(0,i.kt)("p",null,"The following complex example defines:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"If the date is today, the QUANTITY must be over 100"),(0,i.kt)("li",{parentName:"ul"},"If the date is 1st of April 2022, the QUANTITY must be between 250 and 350")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'(Expr.dateIsToday(TRADE_DATE) && QUANTITY > 100) || (Expr.dateIsEqual(TRADE_DATE, "20220401") && (QUANTITY > 250 || QUANTITY < 350))\n')),(0,i.kt)("p",null,"In Java's operator precedence, logical AND is evaluated before logical OR. For this reason, we must add ",(0,i.kt)("inlineCode",{parentName:"p"},"QUANTITY > 250 || QUANTITY < 350")," within brackets."))}h.isMDXComponent=!0}}]);