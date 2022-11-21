"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[58246],{49483:function(e,n,a){a.r(n),a.d(n,{assets:function(){return o},contentTitle:function(){return I},default:function(){return d},frontMatter:function(){return T},metadata:function(){return N},toc:function(){return r}});var i=a(87462),s=a(63366),t=(a(67294),a(3905)),l=(a(61839),["components"]),T={title:"Views - examples",sidebar_label:"Views - examples",id:"views-examples",keywords:["database","views","examples"],tags:["database","views","examples"]},I=void 0,N={unversionedId:"database/fields-tables-views/views/views-examples",id:"version-2022.3/database/fields-tables-views/views/views-examples",title:"Views - examples",description:"Here is an example view-dictionary.kts from our tutorial.",source:"@site/versioned_docs/version-2022.3/02_database/01_fields-tables-views/03_views/03_views-examples.md",sourceDirName:"02_database/01_fields-tables-views/03_views",slug:"/database/fields-tables-views/views/views-examples",permalink:"/database/fields-tables-views/views/views-examples",draft:!1,tags:[{label:"database",permalink:"/tags/database"},{label:"views",permalink:"/tags/views"},{label:"examples",permalink:"/tags/examples"}],version:"2022.3",sidebarPosition:3,frontMatter:{title:"Views - examples",sidebar_label:"Views - examples",id:"views-examples",keywords:["database","views","examples"],tags:["database","views","examples"]},sidebar:"databaseSidebar",previous:{title:"Views - advanced",permalink:"/database/fields-tables-views/views/views-advanced"},next:{title:"Generating DAOs",permalink:"/database/fields-tables-views/genesisDao"}},o={},r=[],E={toc:r};function d(e){var n=e.components,a=(0,s.Z)(e,l);return(0,t.kt)("wrapper",(0,i.Z)({},E,a,{components:n,mdxType:"MDXLayout"}),(0,t.kt)("p",null,"Here is an example ",(0,t.kt)("strong",{parentName:"p"},"view-dictionary.kts")," from our tutorial."),(0,t.kt)("p",null,"The file has two views:"),(0,t.kt)("ul",null,(0,t.kt)("li",{parentName:"ul"},"The first view is called TRADE_VIEW. It joins the TRADE table to the COUNTERPARTY table and to the INSTRUMENT table."),(0,t.kt)("li",{parentName:"ul"},"The second view is called POSITION_VIEW. It joins the POSITION table to the ALT_INSTRUMENT_ID table (this is a backwards join, because it includes real-time price data) and the INSTRUMENT table.")),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre",className:"language-kotlin"},'views {\n\n  view("TRADE_VIEW", TRADE) {\n\n    joins {\n      joining(COUNTERPARTY) {\n        on(TRADE.COUNTERPARTY_ID to COUNTERPARTY { COUNTERPARTY_ID })\n      }\n      joining(INSTRUMENT) {\n        on(TRADE.INSTRUMENT_ID to INSTRUMENT { INSTRUMENT_ID })\n      }\n    }\n\n    fields {\n      TRADE.allFields()\n\n      COUNTERPARTY.NAME withPrefix COUNTERPARTY\n      INSTRUMENT.NAME withPrefix INSTRUMENT\n      INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"\n\n      derivedField("CONSIDERATION", DOUBLE) {\n        // I: F2*H2\n        withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->\n          QUANTITY * PRICE\n        }\n      }\n    }\n  }\n\n  view("POSITION_VIEW", POSITION) {\n\n    joins {\n      joining(ALT_INSTRUMENT_ID, backwardsJoin = true) {\n        on(POSITION.INSTRUMENT_ID to ALT_INSTRUMENT_ID { INSTRUMENT_ID })\n          .and(ALT_INSTRUMENT_ID { ALTERNATE_TYPE } to "REFINITIV")\n\n          .joining(INSTRUMENT_L1_PRICE, backwardsJoin = true) {\n            on(ALT_INSTRUMENT_ID.INSTRUMENT_CODE to INSTRUMENT_L1_PRICE { INSTRUMENT_CODE })\n          }\n      }\n\n      joining(INSTRUMENT) {\n        on(POSITION.INSTRUMENT_ID to INSTRUMENT { INSTRUMENT_ID })\n      }\n    }\n\n    fields {\n      POSITION.allFields()\n\n      INSTRUMENT.NAME withPrefix INSTRUMENT\n      INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"\n\n      derivedField("VALUE", DOUBLE) {\n        withInput(\n          POSITION.QUANTITY,\n          INSTRUMENT_L1_PRICE.EMS_BID_PRICE,\n          INSTRUMENT_L1_PRICE.EMS_ASK_PRICE\n        ) { quantity, bid, ask ->\n          val quant = quantity ?: 0\n          //Use BID if positive position, else ask if negative\n          val price = when {\n              quant > 0 -> bid ?: 0.0\n              quant < 0 -> ask ?: 0.0\n              else -> 0.0\n          }\n          price * 1000 * quant\n        }\n      }\n\n      derivedField("PNL", DOUBLE) {\n        withInput(\n          POSITION.QUANTITY,\n          POSITION.NOTIONAL,\n          INSTRUMENT_L1_PRICE.EMS_BID_PRICE,\n          INSTRUMENT_L1_PRICE.EMS_ASK_PRICE\n        ) { quantity, notional, bid, ask ->\n          val quant = quantity ?: 0\n          //Use BID if positive position, else ask if negative\n          val price = when {\n            quant > 0 -> bid ?: 0.0\n            quant < 0 -> ask ?: 0.0\n            else -> 0.0\n          }\n          val marketVal = price * 1000 * quant\n          marketVal - notional\n        }\n      }\n    }\n  }\n}\n\n')))}d.isMDXComponent=!0}}]);