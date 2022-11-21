"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[44483],{72167:function(e,t,a){a.r(t),a.d(t,{assets:function(){return u},contentTitle:function(){return o},default:function(){return c},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return p}});var n=a(87462),l=a(63366),r=(a(67294),a(3905)),i=(a(61839),["components"]),s={title:"Database concepts - Subscribe",sidebar_label:"Subscribe",id:"subscribe",keywords:["database","concepts","subscribe"],tags:["database","concepts","subscribe"]},o=void 0,d={unversionedId:"database/database-concepts/subscribe",id:"version-2022.3/database/database-concepts/subscribe",title:"Database concepts - Subscribe",description:"Subscribe operations enable code to react to database changes, rather than polling for changes. Code can either listen to changes, or use a combined read/subscribe operation. These mixed read/subscribe operations are useful.",source:"@site/versioned_docs/version-2022.3/02_database/02_database-concepts/02_subscribe.md",sourceDirName:"02_database/02_database-concepts",slug:"/database/database-concepts/subscribe",permalink:"/database/database-concepts/subscribe",draft:!1,tags:[{label:"database",permalink:"/tags/database"},{label:"concepts",permalink:"/tags/concepts"},{label:"subscribe",permalink:"/tags/subscribe"}],version:"2022.3",sidebarPosition:2,frontMatter:{title:"Database concepts - Subscribe",sidebar_label:"Subscribe",id:"subscribe",keywords:["database","concepts","subscribe"],tags:["database","concepts","subscribe"]},sidebar:"databaseSidebar",previous:{title:"Read",permalink:"/database/database-concepts/read"},next:{title:"Write",permalink:"/database/database-concepts/write"}},u={},p=[{value:"Types of change",id:"types-of-change",level:2},{value:"Backwards joins",id:"backwards-joins",level:3},{value:"Subscribing to updates",id:"subscribing-to-updates",level:2},{value:"Mixed read/subscribe operations",id:"mixed-readsubscribe-operations",level:2},{value:"<code>bulkSubscribe</code>",id:"bulksubscribe",level:3},{value:"<code>rangeSubscribe</code>",id:"rangesubscribe",level:3}],b={toc:p};function c(e){var t=e.components,a=(0,l.Z)(e,i);return(0,r.kt)("wrapper",(0,n.Z)({},b,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Subscribe operations enable code to react to database changes, rather than ",(0,r.kt)("a",{parentName:"p",href:"/getting-started/glossary/glossary/#polling"},"polling")," for changes. Code can either listen to changes, or use a combined read/subscribe operation. These mixed read/subscribe operations are useful."),(0,r.kt)("p",null,"Subscriptions are limited to a single table or view."),(0,r.kt)("h2",{id:"types-of-change"},"Types of change"),(0,r.kt)("p",null,"A subscribe operation can make three different types of change:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Insert - a new row is inserted"),(0,r.kt)("li",{parentName:"ul"},"Delete - an existing row is deleted"),(0,r.kt)("li",{parentName:"ul"},"Modify - an existing row is changed")),(0,r.kt)("p",null,"When subscribing to a view and/or a range, the change will reflect the change to the subscription - rather than directly correlate to a database operation. A database insert or delete update will only be published to the subscriber if the insert appears in the range and/or view. "),(0,r.kt)("p",null,"Similarly, a database modify update might not show at all, or be transformed into an insert or delete update, if it moves into or out of the subscription."),(0,r.kt)("h3",{id:"backwards-joins"},"Backwards joins"),(0,r.kt)("p",null,"By default, subscriptions on views only publish updates on database changes to the root table. "),(0,r.kt)("p",null,"If you want to subscribe to changes to sub tables you need to enable ",(0,r.kt)("a",{parentName:"p",href:"/server/data-server/basics/#backwards-joins"},"backwards joins")," in your view definition:\xa0",(0,r.kt)("inlineCode",{parentName:"p"},"backwardsJoin = true"),". Once specified, the subscription will also publish changes to the sub tables as modify updates. Please click the link for a useful example of a backwards join in the ",(0,r.kt)("a",{parentName:"p",href:"/database/fields-tables-views/views/views-examples"},"views examples"),"."),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"Backwards join subscriptions are only supported for combined read/subscribe operations, as the subscription needs to cache the joins. This cache requires extra memory and CPU cycles to be maintained.")),(0,r.kt)("h2",{id:"subscribing-to-updates"},"Subscribing to updates"),(0,r.kt)("p",null,"When subscribing to updates, there are a number of different parameters:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Required"),(0,r.kt)("th",{parentName:"tr",align:null},"Meaning"),(0,r.kt)("th",{parentName:"tr",align:null},"Default Value"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Table name"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2714\ufe0f"),(0,r.kt)("td",{parentName:"tr",align:null},"The table to subscribe to"),(0,r.kt)("td",{parentName:"tr",align:null},"n/a")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"fields"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"Only listen to changes on selected fields"),(0,r.kt)("td",{parentName:"tr",align:null},"listen to all fields")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"delay"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"Group and publish updates every x ms"),(0,r.kt)("td",{parentName:"tr",align:null},"no grouping")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"subscribeLocally"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"When in a cluster, only listen to local updates"),(0,r.kt)("td",{parentName:"tr",align:null},"false")))),(0,r.kt)("h2",{id:"mixed-readsubscribe-operations"},"Mixed read/subscribe operations"),(0,r.kt)("p",null,"Mixed read and subscribe operations are useful in custom components when you need to read a whole or part of a table and need to keep in the loop of changes."),(0,r.kt)("p",null,"For this purpose, the database exposes two types of operation:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"bulkSubscribe"),"\xa0- combines\xa0",(0,r.kt)("inlineCode",{parentName:"li"},"subscribe"),"\xa0and\xa0",(0,r.kt)("inlineCode",{parentName:"li"},"getBulk")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"rangeSubscribe"),"\xa0- combines\xa0",(0,r.kt)("inlineCode",{parentName:"li"},"subscribe"),"\xa0and\xa0",(0,r.kt)("inlineCode",{parentName:"li"},"getRange"))),(0,r.kt)("h3",{id:"bulksubscribe"},(0,r.kt)("inlineCode",{parentName:"h3"},"bulkSubscribe")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"bulkSubscribe"),"\xa0has the following parameters:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Required"),(0,r.kt)("th",{parentName:"tr",align:null},"Meaning"),(0,r.kt)("th",{parentName:"tr",align:null},"Default Value"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Table name"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2714\ufe0f"),(0,r.kt)("td",{parentName:"tr",align:null},"The table to subscribe to"),(0,r.kt)("td",{parentName:"tr",align:null},"n/a")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Index name"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"The index to sort the read by"),(0,r.kt)("td",{parentName:"tr",align:null},"primary key")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"fields"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"Only listen to changes on selected fields"),(0,r.kt)("td",{parentName:"tr",align:null},"listen to all fields")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"delay"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"Group and publish updates every x ms"),(0,r.kt)("td",{parentName:"tr",align:null},"no grouping")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"subscribeLocally"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"When in a cluster, only listen to local updates"),(0,r.kt)("td",{parentName:"tr",align:null},"false")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"backwardsJoin"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"subscribe to changes on sub tables"),(0,r.kt)("td",{parentName:"tr",align:null},"false")))),(0,r.kt)("h3",{id:"rangesubscribe"},(0,r.kt)("inlineCode",{parentName:"h3"},"rangeSubscribe")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"rangeSubscribe"),"\xa0has the following parameters:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Required"),(0,r.kt)("th",{parentName:"tr",align:null},"Meaning"),(0,r.kt)("th",{parentName:"tr",align:null},"Default Value"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Table name"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2714\ufe0f"),(0,r.kt)("td",{parentName:"tr",align:null},"The table to subscribe to"),(0,r.kt)("td",{parentName:"tr",align:null},"n/a")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Start index"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2714\ufe0f"),(0,r.kt)("td",{parentName:"tr",align:null},"The index entry to read from"),(0,r.kt)("td",{parentName:"tr",align:null},"primary key")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"End index"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"The index entry to read to"),(0,r.kt)("td",{parentName:"tr",align:null},"primary key")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"fields"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"Only listen to changes on selected fields"),(0,r.kt)("td",{parentName:"tr",align:null},"listen to all fields")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"delay"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"Group and publish updates every x ms"),(0,r.kt)("td",{parentName:"tr",align:null},"no grouping")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"subscribeLocally"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"When in a cluster, only listen to local updates"),(0,r.kt)("td",{parentName:"tr",align:null},"false")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"backwardsJoin"),(0,r.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,r.kt)("td",{parentName:"tr",align:null},"subscribe to changes on sub tables"),(0,r.kt)("td",{parentName:"tr",align:null},"false")))))}c.isMDXComponent=!0}}]);