"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[93643],{55484:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return r},default:function(){return y},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return o}});var n=a(87462),i=a(63366),d=(a(67294),a(3905)),s=(a(61839),["components"]),l={title:"Data types - Index entities",sidebar_label:"Index entities",id:"index-entities",keywords:["database","data types","index entities"],tags:["database","data types","index entities"]},r=void 0,u={unversionedId:"database/data-types/index-entities",id:"database/data-types/index-entities",title:"Data types - Index entities",description:"Index entities are nested in\xa0table\xa0and\xa0view entities. The name will be based on the index name. The entity can be constructed by passing in the field values in order. The first field of the index must always be provided, and the others are optional.",source:"@site/docs/02_database/04_data-types/02_index-entities.md",sourceDirName:"02_database/04_data-types",slug:"/database/data-types/index-entities",permalink:"/next/database/data-types/index-entities",draft:!1,tags:[{label:"database",permalink:"/next/tags/database"},{label:"data types",permalink:"/next/tags/data-types"},{label:"index entities",permalink:"/next/tags/index-entities"}],version:"current",sidebarPosition:2,frontMatter:{title:"Data types - Index entities",sidebar_label:"Index entities",id:"index-entities",keywords:["database","data types","index entities"],tags:["database","data types","index entities"]},sidebar:"databaseSidebar",previous:{title:"Table entities",permalink:"/next/database/data-types/table-entities"},next:{title:"Views entities",permalink:"/next/database/data-types/views-entities"}},p={},o=[{value:"Types",id:"types",level:2},{value:"Usage",id:"usage",level:2}],b={toc:o};function y(e){var t=e.components,a=(0,i.Z)(e,s);return(0,d.kt)("wrapper",(0,n.Z)({},b,a,{components:t,mdxType:"MDXLayout"}),(0,d.kt)("p",null,"Index entities are nested in\xa0",(0,d.kt)("a",{parentName:"p",href:"/database/data-types/table-entities/"},"table"),"\xa0and\xa0",(0,d.kt)("a",{parentName:"p",href:"/database/data-types/views-entities/"},"view entities"),". The name will be based on the index name. The entity can be constructed by passing in the field values in order. The first field of the index must always be provided, and the others are optional."),(0,d.kt)("p",null,"A unique index entity will only be created when all fields of a unique index are supplied. In all other cases, a non-unique index entity will be created."),(0,d.kt)("h2",{id:"types"},"Types"),(0,d.kt)("p",null,"There are two types of index entity:"),(0,d.kt)("ul",null,(0,d.kt)("li",{parentName:"ul"},"unique index entity"),(0,d.kt)("li",{parentName:"ul"},"non-unique index entity")),(0,d.kt)("table",null,(0,d.kt)("thead",{parentName:"table"},(0,d.kt)("tr",{parentName:"thead"},(0,d.kt)("th",{parentName:"tr",align:null}),(0,d.kt)("th",{parentName:"tr",align:null},"Unique"),(0,d.kt)("th",{parentName:"tr",align:null},"Non-unique"))),(0,d.kt)("tbody",{parentName:"table"},(0,d.kt)("tr",{parentName:"tbody"},(0,d.kt)("td",{parentName:"tr",align:null},"Can be used in a\xa0",(0,d.kt)("inlineCode",{parentName:"td"},"get")),(0,d.kt)("td",{parentName:"tr",align:null},"\u2714\ufe0f"),(0,d.kt)("td",{parentName:"tr",align:null},"\u274c")),(0,d.kt)("tr",{parentName:"tbody"},(0,d.kt)("td",{parentName:"tr",align:null},"Can be used in a\xa0",(0,d.kt)("inlineCode",{parentName:"td"},"getBulk")),(0,d.kt)("td",{parentName:"tr",align:null},"\u2714\ufe0f"),(0,d.kt)("td",{parentName:"tr",align:null},"\u2714\ufe0f")),(0,d.kt)("tr",{parentName:"tbody"},(0,d.kt)("td",{parentName:"tr",align:null},"Can be used in a\xa0",(0,d.kt)("inlineCode",{parentName:"td"},"getRange(index)")),(0,d.kt)("td",{parentName:"tr",align:null},"\u274c"),(0,d.kt)("td",{parentName:"tr",align:null},"\u2714\ufe0f")),(0,d.kt)("tr",{parentName:"tbody"},(0,d.kt)("td",{parentName:"tr",align:null},"Can be used in a\xa0",(0,d.kt)("inlineCode",{parentName:"td"},"getRange(from, to)")),(0,d.kt)("td",{parentName:"tr",align:null},"\u2714\ufe0f"),(0,d.kt)("td",{parentName:"tr",align:null},"\u2714\ufe0f")))),(0,d.kt)("h2",{id:"usage"},"Usage"),(0,d.kt)("pre",null,(0,d.kt)("code",{parentName:"pre",className:"language-kotlin"},'// TRADE_BY_ID is a unique index; a unique index entity is created\nval byId = Trade.byId("TR_123")\n// TRADE_BY_DATE is a non-unique index; a non-unique index entity is created\nval byDate = Trade.byDate(now())\n// TRADE_BY_TYPE_ID is a unique index; a unique index entity is created\nval byTypeId = Trade.byTypeId("SWAP", "TR_123")\n// TRADE_BY_TYPE_ID is a unique index, not all fields are provided;\n// a non-unique index entity is created\nval byType = Trade.byTypeId("SWAP")\n')),(0,d.kt)("p",null,"Index entities can also be created directly from a table or view entity:"),(0,d.kt)("pre",null,(0,d.kt)("code",{parentName:"pre",className:"language-kotlin"},"// TRADE_BY_ID is a unique index; a unique index entity is created\nval byId = trade.byId()\n// TRADE_BY_DATE is a non-unique index; a non-unique index entity is created\nval byDate = trade.byDate()\n// TRADE_BY_TYPE_ID is a unique index; a unique index entity is created\nval byTypeId = trade.byTypeId()\n")))}y.isMDXComponent=!0}}]);