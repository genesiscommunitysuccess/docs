"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[34535],{54667:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return u},frontMatter:function(){return o},metadata:function(){return d},toc:function(){return h}});var a=n(87462),i=n(63366),s=(n(67294),n(3905)),r=(n(61839),["components"]),o={title:"State Machine - Basics",sidebar_label:"Basics",id:"basics",keywords:["server","state machine","basics"],tags:["server","state machine","basics"]},l=void 0,d={unversionedId:"server/state-machine/basics",id:"version-2022.3/server/state-machine/basics",title:"State Machine - Basics",description:"You define your state machine as a specific type of Event Handler.",source:"@site/versioned_docs/version-2022.3/03_server/06_state-machine/02_basics.md",sourceDirName:"03_server/06_state-machine",slug:"/server/state-machine/basics",permalink:"/server/state-machine/basics",draft:!1,tags:[{label:"server",permalink:"/tags/server"},{label:"state machine",permalink:"/tags/state-machine"},{label:"basics",permalink:"/tags/basics"}],version:"2022.3",sidebarPosition:2,frontMatter:{title:"State Machine - Basics",sidebar_label:"Basics",id:"basics",keywords:["server","state machine","basics"],tags:["server","state machine","basics"]},sidebar:"serverModulesSidebar",previous:{title:"Introduction",permalink:"/server/state-machine/introduction"},next:{title:"Advanced",permalink:"/server/state-machine/advanced"}},c={},h=[{value:"insertEvent",id:"insertevent",level:2},{value:"modifyEvent",id:"modifyevent",level:2},{value:"transitionEvent",id:"transitionevent",level:2}],m={toc:h};function u(e){var t=e.components,n=(0,i.Z)(e,r);return(0,s.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"You define your state machine as a specific type of Event Handler. "),(0,s.kt)("p",null,"Within your application's ",(0,s.kt)("strong",{parentName:"p"},"eventhandler.kts"),", you must define the conditions for each possible change of state. Remember, if you don't the conditions for changing from state to another, then it will not be possible for the application to make that transition."),(0,s.kt)("p",null,"You can initialize the state machine in two ways as shown below:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("p",{parentName:"li"},"Firstly you need an ENUM field that holds the state")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("p",{parentName:"li"},"One way of initialising is to provide the field of the table that holds the state, and it will always be transaction if the database layer supports it."))),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-kotlin"},"// tableField: the field of table which holds the state and will always be transaction if the database layer supports it.\neventHandler {\n    stateMachine(tableField = TRADE.TRADE_STATUS) {\n        \n    }\n}\n")),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"Another way to initialise is to provide the field of table which holds the state and choose whether you want to make the event Transactional or not by providing boolean value.")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-kotlin"},"eventHandler {\n    stateMachine(tableField = TRADE.TRADE_STATUS, transactional = true) {\n        \n    }\n}\n")),(0,s.kt)("p",null,"State Machine enables you to add constraints to insert trade, modify trade and transition trade from one state to another"),(0,s.kt)("p",null,"With state machine you can perform all operations you do with Event Handlers along with adding some constraints on workflows as shown below with examples:"),(0,s.kt)("h2",{id:"insertevent"},"insertEvent"),(0,s.kt)("p",null,"With this event you can insert trade using this method. The name of the event would be EVENT_{entity_name}_INSERT so in this example it EVENT_TRADE_INSERT"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-kotlin"},"eventHandler {\n    stateMachine(TRADE.TRADE_STATUS) {\n        insertEvent {\n            initialStates(TradeStatus.DRAFT)\n\n            excludedFields {\n                ENTERED_BY\n                ENTERED_TIME\n                MODIFIED_BY\n                MODIFIED_TIME\n            }\n\n            onEvent { event ->\n                event.withDetails {\n                    enteredBy = event.userName\n                    enteredTime = now()\n                }\n            }\n\n            onValidate { trade ->\n                verifyOnly { trade hasField TRADE.PRICE }\n                verifyOnly { trade hasField TRADE.QUANTITY greaterThan 0 }\n            }\n        }\n    }\n}\n")),(0,s.kt)("p",null,(0,s.kt)("strong",{parentName:"p"},"initialStates")," : This covers the insertion of a new trade, when the status is set to DRAFT.\n",(0,s.kt)("strong",{parentName:"p"},"excludedFields")," : It deliberately ignores the fields ENTERED_BY, ENTERED_TIME, MODIFIED_BY and MODIFIED_TIME.\n",(0,s.kt)("strong",{parentName:"p"},"onEvent")," : It provides event information, which can be used to get information like event user, event time, etc."),(0,s.kt)("h2",{id:"modifyevent"},"modifyEvent"),(0,s.kt)("p",null,"Using the modifyEvent method you can modify trade. The name of the event is written EVENT_{entity_name}_MODIFY so in this example it would be EVENT_TRADE_MODIFY"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-kotlin"},"eventHandler {\n    stateMachine(tableField = TRADE.TRADE_STATUS) {\n        modifyEvent {\n            mutableStates(TradeStatus.DRAFT, TradeStatus.OPEN)\n\n            excludedFields {\n                ENTERED_BY\n                ENTERED_TIME\n                MODIFIED_BY\n                MODIFIED_TIME\n            }\n\n            onEvent { event, trade ->\n                trade.modifiedBy = event.userName\n                trade.modifiedTime = now()\n            }\n\n            onValidate { trade ->\n                verifyOnly { trade hasField TRADE.PRICE }\n                verifyOnly { trade hasField TRADE.QUANTITY greaterThanOrEqual 0 }\n            }\n        }\n    }\n}\n")),(0,s.kt)("p",null,(0,s.kt)("strong",{parentName:"p"},"mutableStates")," : Which specifies the trade can be modified when TRADE_STATUS is DRAFT or OPEN\n",(0,s.kt)("strong",{parentName:"p"},"excludedFields")," : Use it to ignore some fields\n",(0,s.kt)("strong",{parentName:"p"},"onEvent")," : It provides event information which can be used to get information like event user, event time etc."),(0,s.kt)("h2",{id:"transitionevent"},"transitionEvent"),(0,s.kt)("p",null,"With this you can specify possible transitions of TRADE_STATUS field. Events are created based on transitionEvent. In above example the following events are created EVENT_TRADE_OPEN, EVENT_TRADE_CLOSED, EVENT_TRADE_CANCELLED"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-kotlin"},"eventHandler {\n    stateMachine(tableField = TRADE.TRADE_STATUS) {\n        transitionEvent(TradeStatus.OPEN) {\n            fromStates(TradeStatus.DRAFT)\n\n            onEvent { event, trade ->\n                trade.modifiedBy = event.userName\n                trade.modifiedTime = now()\n            }\n        }\n\n        transitionEvent(TradeStatus.CLOSED) {\n            fromStates(TradeStatus.DRAFT)\n\n            onEvent { event, trade ->\n                trade.modifiedBy = event.userName\n                trade.modifiedTime = now()\n            }\n        }\n\n        transitionEvent(TradeStatus.CANCELLED) {\n            fromStates(TradeStatus.DRAFT)\n\n            onEvent { event, trade ->\n                trade.modifiedBy = event.userName\n                trade.modifiedTime = now()\n            }\n        }\n    }\n}\n")),(0,s.kt)("p",null,(0,s.kt)("strong",{parentName:"p"},"fromStates")," : With this method you can specify what is the possible transition of Trade status. In above example possible transitions are: DRAFT to OPEN, DRAFT to CLOSED, DRAFT to CANCELLED\n",(0,s.kt)("strong",{parentName:"p"},"onEvent")," : It provides event information, which can be used to get information like event user, event time, etc."),(0,s.kt)("p",null,"You can click to view the ",(0,s.kt)("a",{parentName:"p",href:"/server/state-machine/examples/"},"whole file for this example state machine")," and see how each of the events is handled."))}u.isMDXComponent=!0}}]);