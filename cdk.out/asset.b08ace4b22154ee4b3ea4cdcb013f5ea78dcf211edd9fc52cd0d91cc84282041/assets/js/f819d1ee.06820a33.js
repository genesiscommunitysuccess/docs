"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[69913],{11953:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return s},default:function(){return g},frontMatter:function(){return o},metadata:function(){return l},toc:function(){return p}});var a=n(87462),i=n(63366),r=(n(67294),n(3905)),d=(n(61839),["components"]),o={title:"Go to the next level - Track the data changes using Auditable Tables",sidebar_label:"Using Auditable Tables",id:"audit",keywords:["getting started","quick start","next level","audit"],tags:["getting started","quick start","next level","audit"]},s=void 0,l={unversionedId:"getting-started/go-to-the-next-level/audit",id:"version-2022.3/getting-started/go-to-the-next-level/audit",title:"Go to the next level - Track the data changes using Auditable Tables",description:"We want to be able to track the changes made to the various trades on the TRADE table, such that we are able to see the times and modifications made during the history of the trade. So, we are going to add basic auditing to the TRADE table to keep a record of the changing states of the trades.",source:"@site/versioned_docs/version-2022.3/01_getting-started/03_go-to-the-next-level/10_audit.md",sourceDirName:"01_getting-started/03_go-to-the-next-level",slug:"/getting-started/go-to-the-next-level/audit",permalink:"/getting-started/go-to-the-next-level/audit",draft:!1,tags:[{label:"getting started",permalink:"/tags/getting-started"},{label:"quick start",permalink:"/tags/quick-start"},{label:"next level",permalink:"/tags/next-level"},{label:"audit",permalink:"/tags/audit"}],version:"2022.3",sidebarPosition:10,frontMatter:{title:"Go to the next level - Track the data changes using Auditable Tables",sidebar_label:"Using Auditable Tables",id:"audit",keywords:["getting started","quick start","next level","audit"],tags:["getting started","quick start","next level","audit"]},sidebar:"learningSidebar",previous:{title:"State Management",permalink:"/getting-started/go-to-the-next-level/state-management"},next:{title:"Setting Genesis Evaluator rules",permalink:"/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules"}},u={},p=[{value:"Section objectives",id:"section-objectives",level:2},{value:"Adding audit to table dictionary",id:"adding-audit-to-table-dictionary",level:3},{value:"Updating the state machine to use auditing",id:"updating-the-state-machine-to-use-auditing",level:3},{value:"Update the Event Handlers to use auditing",id:"update-the-event-handlers-to-use-auditing",level:3},{value:"Conclusion",id:"conclusion",level:3}],c={toc:p};function g(e){var t=e.components,n=(0,i.Z)(e,d);return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"We want to be able to track the changes made to the various trades on the ",(0,r.kt)("inlineCode",{parentName:"p"},"TRADE")," table, such that we are able to see the times and modifications made during the history of the trade. So, we are going to add basic auditing to the ",(0,r.kt)("inlineCode",{parentName:"p"},"TRADE")," table to keep a record of the changing states of the trades."),(0,r.kt)("p",null,"This is useful, if at a later date, you need to be able to produce an accurate course of events."),(0,r.kt)("h2",{id:"section-objectives"},"Section objectives"),(0,r.kt)("p",null,"The goal of this section is:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"update our tables to be auditable"),(0,r.kt)("li",{parentName:"ul"},"update our state machine to use auditing"),(0,r.kt)("li",{parentName:"ul"},"update our Event Handlers to pass transactions to our state machine of type ",(0,r.kt)("inlineCode",{parentName:"li"},"AsyncMultiEntityReadWriteGenericSupport"),".")),(0,r.kt)("h3",{id:"adding-audit-to-table-dictionary"},"Adding audit to table dictionary"),(0,r.kt)("p",null,"The first step to add basic auditing is to change the relevant table dictionary. In this instance, we will be making changes to the ",(0,r.kt)("strong",{parentName:"p"},"positions-app-tutorial-tables-dictionary.kts"),", by adding the ",(0,r.kt)("inlineCode",{parentName:"p"},"audit")," parameter. It should resemble the following:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-kotlin",metastring:"{1}","{1}":!0},'table (name = "TRADE", id = 11000, audit = details(id = 11002, sequence = "TR")) {\n    sequence(TRADE_ID, "TR")\n    INSTRUMENT_ID not null\n    COUNTERPARTY_ID not null\n    QUANTITY not null\n    SIDE not null\n    PRICE not null\n    TRADE_DATETIME\n    ENTERED_BY\n    TRADE_STATUS\n\n    primaryKey {\n        TRADE_ID\n    }\n}\n')),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"id")," parameter inside the details function indicates the ",(0,r.kt)("inlineCode",{parentName:"p"},"id")," of the newly created audit table, and will need to be different from any other table id."),(0,r.kt)("p",null,"As we are using the GPAL Event Handlers, this is sufficient to enable auditing on this table. A new table is created with the name of the original table, plus the ",(0,r.kt)("strong",{parentName:"p"},"_AUDIT")," suffix. In this instance, that would be the ",(0,r.kt)("strong",{parentName:"p"},"TRADE_AUDIT")," table."),(0,r.kt)("h3",{id:"updating-the-state-machine-to-use-auditing"},"Updating the state machine to use auditing"),(0,r.kt)("p",null,"Next we need to extend the insert and modify methods in the ",(0,r.kt)("strong",{parentName:"p"},"TradeStateMachine.kt")," file. Specifically, we need to add a transaction parameter of type ",(0,r.kt)("inlineCode",{parentName:"p"},"AsyncMultiEntityReadWriteGenericSupport")," and use ",(0,r.kt)("inlineCode",{parentName:"p"},"internalState.withTransaction(transaction)"),". For example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-kotlin",metastring:"{2,5,10,12,20,23}","{2,5,10,12,20,23}":!0},"    suspend fun insert(\n        transaction: AsyncMultiEntityReadWriteGenericSupport,\n        trade: Trade\n    ): Transition<Trade, TradeStatus, TradeEffect> =\n        internalState.withTransaction(transaction) {\n            create(trade)\n        }\n\n    suspend fun modify(\n        transaction: AsyncMultiEntityReadWriteGenericSupport,\n        tradeId: String, modify: suspend (Trade) -> Unit\n    ): Transition<Trade, TradeStatus, TradeEffect>? =\n        internalState.withTransaction(transaction) {\n            update(Trade.ById(tradeId)) {\n                    trade, _ -> modify(trade)\n            }\n        }\n\n    suspend fun modify(\n        transaction: AsyncMultiEntityReadWriteGenericSupport,\n        trade: Trade\n    ): Transition<Trade, TradeStatus, TradeEffect>? =\n        internalState.withTransaction(transaction) {\n            update(trade)\n        }\n")),(0,r.kt)("h3",{id:"update-the-event-handlers-to-use-auditing"},"Update the Event Handlers to use auditing"),(0,r.kt)("p",null,"Now we must update our ",(0,r.kt)("inlineCode",{parentName:"p"},"Trade")," Event Handlers inside the ",(0,r.kt)("strong",{parentName:"p"},"positions-app-tutorial-eventhandler.kts")," file and pass in our ",(0,r.kt)("inlineCode",{parentName:"p"},"transaction")," object as a parameter, in this case it's our ",(0,r.kt)("inlineCode",{parentName:"p"},"entityDb")," object. It should resemble the example below:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-kotlin",metastring:"{4,11,18,27}","{4,11,18,27}":!0},'    eventHandler<Trade>(name = "TRADE_INSERT") {\n        onCommit { event ->\n            val trade = event.details\n            stateMachine.insert(entityDb, trade)\n            ack()\n        }\n    }\n    eventHandler<Trade>(name = "TRADE_MODIFY") {\n        onCommit { event ->\n            val trade = event.details\n            stateMachine.modify(entityDb, trade)\n            ack()\n        }\n    }\n    eventHandler<TradeCancelled>(name = "TRADE_CANCELLED") {\n        onCommit { event ->\n            val message = event.details\n            stateMachine.modify(entityDb, message.tradeId) { trade ->\n                trade.tradeStatus = TradeStatus.CANCELLED\n            }\n            ack()\n        }\n    }\n    eventHandler<TradeAllocated>(name = "TRADE_ALLOCATED") {\n        onCommit { event ->\n            val message = event.details\n            stateMachine.modify(entityDb, message.tradeId) { trade ->\n                trade.tradeStatus = TradeStatus.ALLOCATED\n            }\n            ack()\n        }\n    }\n')),(0,r.kt)("p",null,"Finally we can run ",(0,r.kt)("inlineCode",{parentName:"p"},"generateDao"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"assemble")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"deploy-genesisproduct-positions-app-tutorial"),"."),(0,r.kt)("h3",{id:"conclusion"},"Conclusion"),(0,r.kt)("p",null,"With this, any changes made to ",(0,r.kt)("inlineCode",{parentName:"p"},"TRADE")," are tracked to ",(0,r.kt)("inlineCode",{parentName:"p"},"TRADE_AUDIT"),". To try it out, insert a new ",(0,r.kt)("inlineCode",{parentName:"p"},"TRADE")," and see what's stored in the ",(0,r.kt)("inlineCode",{parentName:"p"},"TRADE_AUDIT")," table via ",(0,r.kt)("inlineCode",{parentName:"p"},"DbMon"),". Go to your terminal and run ",(0,r.kt)("inlineCode",{parentName:"p"},"DbMon"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"table TRADE_AUDIT")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"search 1"),". For more information on testing, go to ",(0,r.kt)("a",{parentName:"p",href:"/server/integration/rest-endpoints/introduction/"},"Endpoints"),"."))}g.isMDXComponent=!0}}]);