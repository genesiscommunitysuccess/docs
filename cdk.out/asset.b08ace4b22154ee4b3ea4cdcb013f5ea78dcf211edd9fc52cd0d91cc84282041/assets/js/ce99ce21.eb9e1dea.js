"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[4882],{40087:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return d},default:function(){return h},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return p}});var a=n(87462),r=n(63366),s=(n(67294),n(3905)),i=n(61839),o=["components"],l={title:"Event Handler - Introduction",sidebar_label:"Introduction",id:"introduction",keywords:["server","event handler","introduction"],tags:["server","event handler","introduction"]},d=void 0,u={unversionedId:"server/event-handler/introduction",id:"server/event-handler/introduction",title:"Event Handler - Introduction",description:"The Genesis low-code platform has a real-time event-driven architecture.",source:"@site/docs/03_server/04_event-handler/01_introduction.md",sourceDirName:"03_server/04_event-handler",slug:"/server/event-handler/introduction",permalink:"/next/server/event-handler/introduction",draft:!1,tags:[{label:"server",permalink:"/next/tags/server"},{label:"event handler",permalink:"/next/tags/event-handler"},{label:"introduction",permalink:"/next/tags/introduction"}],version:"current",sidebarPosition:1,frontMatter:{title:"Event Handler - Introduction",sidebar_label:"Introduction",id:"introduction",keywords:["server","event handler","introduction"],tags:["server","event handler","introduction"]},sidebar:"serverModulesSidebar",previous:{title:"Testing",permalink:"/next/server/request-server/testing"},next:{title:"Basics",permalink:"/next/server/event-handler/basics"}},c={},p=[],m={toc:p};function h(e){var t=e.components,n=(0,r.Z)(e,o);return(0,s.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"The Genesis low-code platform has a real-time event-driven architecture."),(0,s.kt)("p",null,"Applications built on the system must respond immediately to different types of input:\xa0inputs from users, messages from other systems, market-data updates and internally calculated analytic signals.\xa0 These inputs are events."),(0,s.kt)("p",null,"All the business logic for applications built on the platform is structured around these events. When an event occurs, the business logic immediately fires into action."),(0,s.kt)(i.G,{chart:"graph TD\nA[UI] --\x3e |Connection| B(EVENT_HANDLER)\nB --\x3e|Ack/Nack| A\nB --\x3e|INSERT/MODIFY/DELETE| C[Database]\nC --\x3e |Ack/Nack|B",mdxType:"Mermaid"}),(0,s.kt)("p",null,"As a rough guide, many of the tables you have created need ",(0,s.kt)("strong",{parentName:"p"},"Insert"),", ",(0,s.kt)("strong",{parentName:"p"},"Modify")," and ",(0,s.kt)("strong",{parentName:"p"},"Delete")," events, so that you can specify the processing that these events require. "),(0,s.kt)("p",null,"The vast majority of applications include business workflow."),(0,s.kt)("p",null,"That could be a simple linear workflow, such as a deal being enriched and approved, or a margin call payment \u2013 or it could be a more complex set of steps."),(0,s.kt)("p",null,"Most applications built on the platform include the typical financial product ",(0,s.kt)("strong",{parentName:"p"},"business entities"),", such as orders, trades, bids, allocations and positions. These business entities have a lifecycle where they go through various ",(0,s.kt)("strong",{parentName:"p"},"states"),". The transition from one state to another is an event that needs to be handled. The paths through those states are workflows, and to assist the workflows, we use state machines."),(0,s.kt)("p",null,"Event Handlers are conventionally defined in the file ",(0,s.kt)("strong",{parentName:"p"},"{app-name}-eventhandler.kts"),". "),(0,s.kt)("p",null,"So, if your application is called ",(0,s.kt)("strong",{parentName:"p"},"positions"),", then the file would conventionally be named ",(0,s.kt)("strong",{parentName:"p"},"positions-eventhandler.kts"),"."),(0,s.kt)("p",null,"You can write custom Event Handlers using our ",(0,s.kt)("a",{parentName:"p",href:"/database/api-reference/event-handler-api/"},"APIs"),". These can be implemented using Kotlin or Java."),(0,s.kt)("admonition",{type:"note"},(0,s.kt)("p",{parentName:"admonition"},"We recommend using ",(0,s.kt)("strong",{parentName:"p"},"Kotlin")," to implement Event Handlers."),(0,s.kt)("ul",{parentName:"admonition"},(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("strong",{parentName:"li"},"Java")," Event Handlers are implemented using ",(0,s.kt)("a",{parentName:"li",href:"#rx3"},(0,s.kt)("strong",{parentName:"a"},"RxJava3"))," ",(0,s.kt)("a",{parentName:"li",href:"#sync"},(0,s.kt)("strong",{parentName:"a"},"Sync"))," Event Handlers only. "),(0,s.kt)("li",{parentName:"ul"},"Async Event Handlers cannot be used, as there is no implementation for Kotlin coroutines in Java."))))}h.isMDXComponent=!0}}]);