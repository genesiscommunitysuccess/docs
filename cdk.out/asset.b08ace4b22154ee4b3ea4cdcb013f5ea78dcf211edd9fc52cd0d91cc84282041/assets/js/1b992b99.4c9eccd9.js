"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[76229],{66307:function(t,e,a){a.r(e),a.d(e,{assets:function(){return p},contentTitle:function(){return l},default:function(){return y},frontMatter:function(){return d},metadata:function(){return o},toc:function(){return b}});var n=a(87462),i=a(63366),r=(a(67294),a(3905)),s=(a(61839),["components"]),d={title:"Data types - DbEntity",sidebar_label:"DbEntity",id:"dbentity",keywords:["database","data types","dbentity"],tags:["database","data types","dbentity"]},l=void 0,o={unversionedId:"database/data-types/dbentity",id:"database/data-types/dbentity",title:"Data types - DbEntity",description:"DbEntity is the common interface implemented by table entities and view entities.",source:"@site/docs/02_database/04_data-types/05_dbentity.md",sourceDirName:"02_database/04_data-types",slug:"/database/data-types/dbentity",permalink:"/next/database/data-types/dbentity",draft:!1,tags:[{label:"database",permalink:"/next/tags/database"},{label:"data types",permalink:"/next/tags/data-types"},{label:"dbentity",permalink:"/next/tags/dbentity"}],version:"current",sidebarPosition:5,frontMatter:{title:"Data types - DbEntity",sidebar_label:"DbEntity",id:"dbentity",keywords:["database","data types","dbentity"],tags:["database","data types","dbentity"]},sidebar:"databaseSidebar",previous:{title:"DbRecord",permalink:"/next/database/data-types/dbrecord"},next:{title:"Database interface",permalink:"/next/database/database-interface/database-interface"}},p={},b=[],m={toc:b};function y(t){var e=t.components,a=(0,i.Z)(t,s);return(0,r.kt)("wrapper",(0,n.Z)({},m,a,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"DbEntity")," is the common interface implemented by table entities and view entities."),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"DbEntity")," methods are described below:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Signature"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"toDbRecord"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"fun toDbRecord(entity: E): DbRecord")),(0,r.kt)("td",{parentName:"tr",align:null},"Converts entity to ",(0,r.kt)("a",{parentName:"td",href:"/database/data-types/dbrecord/"},"DbRecord"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"toGenesisSetFormatted"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"fun toGenesisSetFormatted(entity: E, configs: Collection<ColumnConfig>? = null): GenesisSet")),(0,r.kt)("td",{parentName:"tr",align:null},"converts a view to ",(0,r.kt)("a",{parentName:"td",href:"/server/inter-process-messages/genesisSet/"},"GenesisSet")," and applies any formatter/aliases assigned to the fields")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"toGenesisSet"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"fun toGenesisSet(entity: E, columns: Collection<String>): GenesisSet")),(0,r.kt)("td",{parentName:"tr",align:null},"converts view to ",(0,r.kt)("a",{parentName:"td",href:"/server/inter-process-messages/genesisSet/"},"GenesisSet"),". This is the plain representation of view fields")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"get"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"operator fun get(field: String): Any?")),(0,r.kt)("td",{parentName:"tr",align:null},"gets the provided field value")))))}y.isMDXComponent=!0}}]);