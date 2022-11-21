"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[76084],{33788:function(e,t,a){a.r(t),a.d(t,{assets:function(){return d},contentTitle:function(){return o},default:function(){return N},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return u}});var n=a(87462),r=a(63366),i=(a(67294),a(3905)),l=(a(61839),["components"]),s={title:"Evaluator - Basics",sidebar_label:"Basics",id:"basics",keywords:["server","evaluator","basics"],tags:["server","evaluator","basics"]},o=void 0,p={unversionedId:"server/evaluator/basics",id:"version-2022.3/server/evaluator/basics",title:"Evaluator - Basics",description:"Introduction | Basics | Examples | Configuring runtime | Testing",source:"@site/versioned_docs/version-2022.3/03_server/08_evaluator/02_basics.md",sourceDirName:"03_server/08_evaluator",slug:"/server/evaluator/basics",permalink:"/server/evaluator/basics",draft:!1,tags:[{label:"server",permalink:"/tags/server"},{label:"evaluator",permalink:"/tags/evaluator"},{label:"basics",permalink:"/tags/basics"}],version:"2022.3",sidebarPosition:2,frontMatter:{title:"Evaluator - Basics",sidebar_label:"Basics",id:"basics",keywords:["server","evaluator","basics"],tags:["server","evaluator","basics"]},sidebar:"serverModulesSidebar",previous:{title:"Introduction",permalink:"/server/evaluator/introduction"},next:{title:"Examples",permalink:"/server/evaluator/examples"}},d={},u=[{value:"Dynamic rules",id:"dynamic-rules",level:2},{value:"Defining a dynamic rule",id:"defining-a-dynamic-rule",level:2},{value:"Static rules",id:"static-rules",level:2},{value:"Defining a static rule",id:"defining-a-static-rule",level:2},{value:"Load the static (Cron) rule",id:"load-the-static-cron-rule",level:3}],m={toc:u};function N(e){var t=e.components,a=(0,r.Z)(e,l);return(0,i.kt)("wrapper",(0,n.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/server/evaluator/introduction"},"Introduction")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/evaluator/basics"},"Basics")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/evaluator/examples"},"Examples")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/evaluator/configuring-runtime"},"Configuring runtime")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/evaluator/testing"},"Testing")),(0,i.kt)("h2",{id:"dynamic-rules"},"Dynamic rules"),(0,i.kt)("p",null,"This feature enables you to raise alarms on certain conditions or to react on specific states. Dynamic rules respond to changes in database tables. For instance, if a figure goes above a certain threshold, the rule could trigger a warning email to be sent out."),(0,i.kt)("h2",{id:"defining-a-dynamic-rule"},"Defining a dynamic rule"),(0,i.kt)("p",null,"To define a rule, you need to insert a row into the DYNAMIC_RULE table. This table is defined as follows:"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Field Name"),(0,i.kt)("th",{parentName:"tr",align:null},"Usage"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"NAME"),(0,i.kt)("td",{parentName:"tr",align:null},"Name of the Rule")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"DESCRIPTION"),(0,i.kt)("td",{parentName:"tr",align:null},"Simple description of the function of the rule")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"USER_NAME"),(0,i.kt)("td",{parentName:"tr",align:null},"The User Name that will be used to perform the operation / null implies system")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"RULE_TABLE"),(0,i.kt)("td",{parentName:"tr",align:null},"The table to listen to for changes, e.g.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"RULE_STATUS"),(0,i.kt)("td",{parentName:"tr",align:null},'This is either "ENABLED" or "DISABLED" and respectively enables or disables the rule')),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"RULE_EXPRESSION"),(0,i.kt)("td",{parentName:"tr",align:null},"This is a ",(0,i.kt)("a",{parentName:"td",href:"https://groovy-lang.org/syntax.html"},"groovy expression"),", which is evaluated when there is a table change on RULE_TABLE, if this evaluates to true, then the RESULT_EXPRESSION logic is activated e.g. ",(0,i.kt)("inlineCode",{parentName:"td"},"(QUANTITY > 500)"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"PROCESS_NAME"),(0,i.kt)("td",{parentName:"tr",align:null},"Process Name to send the event  e.g. POSITION_APP_EVENT_HANDLER")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"MESSAGE_TYPE"),(0,i.kt)("td",{parentName:"tr",align:null},"The Message Type that will be defined")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"RESULT_EXPRESSION"),(0,i.kt)("td",{parentName:"tr",align:null},"This is a ",(0,i.kt)("a",{parentName:"td",href:"https://groovy-lang.org/syntax.html"},"groovy expression"),", which should set on the MESSAGE Object that is defined in MESSAGE_TYPE e.g. ",(0,i.kt)("inlineCode",{parentName:"td"},"(POSITION_ID = POSITION_ID)"))))),(0,i.kt)("admonition",{type:"note"},(0,i.kt)("p",{parentName:"admonition"},"Groovy expressions need to be surrounded by brackets.")),(0,i.kt)("p",null,"MESSAGE_TYPE fields define the Java/Kotlin class that is instantiated and set by the RESULT_EXPRESSION. The MESSAGE_TYPE is defined as SNAKE_CASE, but the class is defined as regular Camel case (for example, POSITION_CANCEL maps to PositionCancel)."),(0,i.kt)("p",null,"Fields that are set in the expression but which are not on the class are ignored. The instantiated class is sent to the Event Handler implementation defined in the process identified by PROCESS_NAME."),(0,i.kt)("p",null,"To set up a MESSAGE_TYPE for the Event Handlers, simply create an appropriate data class: for example, ",(0,i.kt)("inlineCode",{parentName:"p"},"position_app-server\\position_app-messages\\src\\main\\java\\global\\genesis\\position_app\\message\\event\\PositionCancel.kt"),"."),(0,i.kt)("p",null,"Rules can be loaded into the database by creating a csv file containing the rules in the above format.\nThe following is an example of a csv file, which can be loaded into the database by saving as ",(0,i.kt)("strong",{parentName:"p"},"DYNAMIC_RULE.csv")," and running ",(0,i.kt)("inlineCode",{parentName:"p"},"sendIt"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-csv"},"NAME,DESCRIPTION,RULE_TABLE,RULE_STATUS,RULE_EXPRESSION,USER_NAME,PROCESS_NAME,MESSAGE_TYPE,RESULT_EXPRESSION\nMY_RULE,It\u2019s a rule,POSITION,ENABLED,(QUANTITY > 500),JaneDee,ALPHA_EVENT_HANDLER,EVENT_POSITION_CANCEL,((QUANTITY = 0) && (POSITION_ID = POSITION_ID))\n")),(0,i.kt)("p",null,"To set up a ",(0,i.kt)("inlineCode",{parentName:"p"},"MESSAGE_TYPE")," for the Event Handlers, simply create an appropriate data class: for example, ",(0,i.kt)("em",{parentName:"p"},"application-name"),(0,i.kt)("strong",{parentName:"p"},"-server","\\"),(0,i.kt)("em",{parentName:"p"},"application-name"),(0,i.kt)("strong",{parentName:"p"},"-messages\\src\\main\\java\\global\\genesis","\\"),(0,i.kt)("em",{parentName:"p"},"application-name"),(0,i.kt)("strong",{parentName:"p"},"\\message\\event\\PositionCancel.kt"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},"package global.genesis.position_app.message.event\n\ndata class PositionCancel(\n    val positionId: String,\n)\n")),(0,i.kt)("p",null,"So if the ",(0,i.kt)("inlineCode",{parentName:"p"},"RULE_TABLE")," is set to ",(0,i.kt)("inlineCode",{parentName:"p"},"POSITION"),", and the ",(0,i.kt)("inlineCode",{parentName:"p"},"RULE_EXPRESSION")," is set to ",(0,i.kt)("inlineCode",{parentName:"p"},"(POSITION_ID = POSITION_ID)"),", then this will take the ",(0,i.kt)("inlineCode",{parentName:"p"},"POSITION_ID")," from the ",(0,i.kt)("inlineCode",{parentName:"p"},"POSITION")," table and set it on the ",(0,i.kt)("inlineCode",{parentName:"p"},"PositionClass")," object that gets instantiated and ultimately sent to the Event Handler."),(0,i.kt)("p",null,"For example, if you have an Event Handler that inserts a ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/notify/configuring/"},"Notify")," email message, you could set up the Event Handler in this way in the ",(0,i.kt)("em",{parentName:"p"},"application"),(0,i.kt)("strong",{parentName:"p"},"-script-config\\src\\main\\resources\\scripts\\application-eventhandler.kts")," file:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'{\neventHandler<PositionCancel> {\n        onCommit { event ->\n            val positionId = event.details.positionId\n\n            entityDb.insert(\n                Notify {\n                    topic = "PositionAlert"\n                    header = "Position Alert for $positionId"\n                    body = mapOf<String, Any?>(\n                        "emailDistribution" to mapOf(\n                            "to" to listOf("peter.kievits@genesis.global"),\n                            "cc" to emptyList(),\n                            "bcc" to emptyList(),\n                        ),\n                        "content" to "Position $positionId breached the limit"\n                    ).toJsonString(true)\n                }\n            )\n            ack()\n        }\n    }\n}\n\n')),(0,i.kt)("p",null,"For the example above to work, you need to set up a ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/notify/configuring/"},"Notify")," process together with inserting a GATEWAY and a NOTIFY_ROUTE in the database and add the details of the connection for the SMTP server to the ",(0,i.kt)("strong",{parentName:"p"},"genesis-system-definition.kts")," file.\nYou can see an example of a dynamic rule using ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/notify/configuring/"},"Notify")," email messages being configured in our ",(0,i.kt)("a",{parentName:"p",href:"/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#dynamic-rules-conditional-rules"},"tutorial"),"."),(0,i.kt)("h2",{id:"static-rules"},"Static rules"),(0,i.kt)("p",null,"Static rules are used to create scheduled activities. For instance to schedule the production of EOD reports, or to run a batch report on the hour."),(0,i.kt)("h2",{id:"defining-a-static-rule"},"Defining a static rule"),(0,i.kt)("p",null,"To define a scheduled event, you need to insert a row into the ",(0,i.kt)("inlineCode",{parentName:"p"},"CRON_RULE")," table. This row must specify the CRON schedule that triggers the event. The table is defined as follows:"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Field Name"),(0,i.kt)("th",{parentName:"tr",align:null},"Usage"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"NAME"),(0,i.kt)("td",{parentName:"tr",align:null},"Name of the rule")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"CRON_EXPRESSION"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"https://en.wikipedia.org/wiki/Cron#CRON_expression"},"Standard Cron Expression"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"DESCRIPTION"),(0,i.kt)("td",{parentName:"tr",align:null},"Simple description of the function of the rule")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"TIME_ZONE"),(0,i.kt)("td",{parentName:"tr",align:null},"eg Europe/London")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"RULE_STATUS"),(0,i.kt)("td",{parentName:"tr",align:null},'This is either "ENABLED" or "DISABLED", respectively enables or disables the rule')),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"USER_NAME"),(0,i.kt)("td",{parentName:"tr",align:null},"The User Name that will be used to perform the operation / null implies system")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"PROCESS_NAME"),(0,i.kt)("td",{parentName:"tr",align:null},"Process Name to send the Event  e.g. POSITION_APP_EVENT_HANDLER")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"MESSAGE_TYPE"),(0,i.kt)("td",{parentName:"tr",align:null},"The message type that will be defined")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"RESULT_EXPRESSION"),(0,i.kt)("td",{parentName:"tr",align:null},"This is a ",(0,i.kt)("a",{parentName:"td",href:"https://groovy-lang.org/syntax.html"},"groovy expression")," which should set on the MESSAGE Object that is defined in MESSAGE_TYPE")))),(0,i.kt)("p",null,"MESSAGE_TYPE fields define the Java/Kotlin class that is instantiated and set by the RESULT_EXPRESSION. The MESSAGE_TYPE is defined as SNAKE_CASE, but the class is defined as regular Camel case (for example, POSITION_CANCEL maps to PositionCancel)."),(0,i.kt)("h3",{id:"load-the-static-cron-rule"},"Load the static (Cron) rule"),(0,i.kt)("p",null,"To load a static (Cron) rule into the database, create a csv file with the rule in the above format. Call the file ",(0,i.kt)("strong",{parentName:"p"},"CRON_RULE.csv"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-csv"},'CRON_EXPRESSION,DESCRIPTION,TIME_ZONE,RULE_STATUS,NAME,USER_NAME,PROCESS_NAME,MESSAGE_TYPE\n"0 * * * * *","It\u2019s a rule","Europe/London","ENABLED","A rule","JaneDee","ALPHA_EVENT_HANDLER","EVENT_POSITION_REPORT"\n')),(0,i.kt)("p",null,"Load the cron rule ",(0,i.kt)("strong",{parentName:"p"},"CRON_RULE.csv")," file into the ",(0,i.kt)("inlineCode",{parentName:"p"},"CRON_RULE"),"  ",(0,i.kt)("a",{parentName:"p",href:"/server/evaluator/configuring-runtime/#cron_rule-table"},"table"),"."),(0,i.kt)("p",null,"Run ",(0,i.kt)("inlineCode",{parentName:"p"},"SendIt")),(0,i.kt)("p",null,"You can see an example of a static rule being configured in our ",(0,i.kt)("a",{parentName:"p",href:"/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#static-rules-cron-rules"},"tutorial"),"."))}N.isMDXComponent=!0}}]);