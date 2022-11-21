"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[77043],{47249:function(e,r,t){t.r(r),t.d(r,{assets:function(){return p},contentTitle:function(){return o},default:function(){return c},frontMatter:function(){return i},metadata:function(){return u},toc:function(){return m}});var n=t(87462),s=t(63366),a=(t(67294),t(3905)),l=(t(61839),["components"]),i={title:"Request Server - Examples",sidebar_label:"Examples",id:"examples",keywords:["server","request server","examples"],tags:["server","request server","examples"]},o=void 0,u={unversionedId:"server/request-server/examples",id:"server/request-server/examples",title:"Request Server - Examples",description:"Below is a fairly simple requestReply codeblock with standard request and reply statements. The where block below filters out any data that does not meet the conditions. All data that is returned will have an instrumentCode equal to the request parameter INSTRUMENT_CODE.",source:"@site/docs/03_server/03_request-server/04_examples.md",sourceDirName:"03_server/03_request-server",slug:"/server/request-server/examples",permalink:"/next/server/request-server/examples",draft:!1,tags:[{label:"server",permalink:"/next/tags/server"},{label:"request server",permalink:"/next/tags/request-server"},{label:"examples",permalink:"/next/tags/examples"}],version:"current",sidebarPosition:4,frontMatter:{title:"Request Server - Examples",sidebar_label:"Examples",id:"examples",keywords:["server","request server","examples"],tags:["server","request server","examples"]},sidebar:"serverModulesSidebar",previous:{title:"Advanced",permalink:"/next/server/request-server/advanced"},next:{title:"Configuring runtime",permalink:"/next/server/request-server/configuring-runtime"}},p={},m=[],d={toc:m};function c(e){var r=e.components,t=(0,s.Z)(e,l);return(0,a.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Below is a fairly simple ",(0,a.kt)("inlineCode",{parentName:"p"},"requestReply")," codeblock with standard ",(0,a.kt)("inlineCode",{parentName:"p"},"request")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"reply")," statements. The ",(0,a.kt)("a",{parentName:"p",href:"/server/request-server/basics/#where-block"},(0,a.kt)("inlineCode",{parentName:"a"},"where")," block")," below filters out any data that does not meet the conditions. All data that is returned will have an instrumentCode equal to the request parameter INSTRUMENT_CODE. "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'requestReplies {\n    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {\n\n        request {\n            INSTRUMENT_CODE\n        }\n\n        reply {\n            INSTRUMENT_CODE\n            INSTRUMENT_ID\n            INSTRUMENT_NAME\n            LAST_TRADED_PRICE\n            VWAP\n            SPREAD\n            TRADED_CURRENCY\n            EXCHANGE_ID\n        }\n\n        where { row, parameters ->\n            row.instrumentCode.equals(parameters.getString("INSTRUMENT_CODE"))\n        }\n    }\n}\n')),(0,a.kt)("p",null,"In the example below, we have modified the example above to include two restrictions:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"The maximum number of rows to be returned is 5."),(0,a.kt)("li",{parentName:"ul"},"The process will time out if no response is received for 15 seconds.")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'requestReplies {\n    requestReply(INSTRUMENT_DETAILS) {\n\n        rowReturnLimit = 5\n        timeout = 15\n\n        request {\n            ALTERNATE_TYPE withAlias "ALTERNATE_TYPE"\n        }\n\n        reply {\n            INSTRUMENT_ID\n            INSTRUMENT_NAME\n            LAST_TRADED_PRICE\n            VWAP\n            SPREAD\n            TRADED_CURRENCY\n            EXCHANGE_ID\n        }\n    }\n}\n')),(0,a.kt)("p",null,"Below is an example of a file where the single ",(0,a.kt)("inlineCode",{parentName:"p"},"eventHandler")," code block includes a ",(0,a.kt)("inlineCode",{parentName:"p"},"where")," clause. You can find out more about this example on the ",(0,a.kt)("a",{parentName:"p",href:"/server/request-server/basics/#where-block"},"Basics")," page."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'requestReplies {\n    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {\n\n        request {\n            ALTERNATE_TYPE\n        }\n\n        where { row, parameters ->\n            "ALLL3" == row.instrumentCode &&                         \n             parameters.getString("ALTERNATE_TYPE") in listOf("RIC", "BLOOMBERG") \n        }\n    }\n}\n')))}c.isMDXComponent=!0}}]);