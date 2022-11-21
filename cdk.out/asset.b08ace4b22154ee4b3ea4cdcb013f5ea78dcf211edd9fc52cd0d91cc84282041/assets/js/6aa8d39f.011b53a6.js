"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[32934],{56824:function(e,t,r){r.r(t),r.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return p},frontMatter:function(){return d},metadata:function(){return u},toc:function(){return v}});var a=r(87462),n=r(63366),i=(r(67294),r(3905)),s=r(61839),o=["components"],d={title:"Data Server - Introduction",sidebar_label:"Introduction",id:"introduction",keywords:["server","data server","dataserver","introduction"],tags:["server","data server","dataserver","introduction"]},l=void 0,u={unversionedId:"server/data-server/introduction",id:"server/data-server/introduction",title:"Data Server - Introduction",description:"Data Servers monitor specific tables or views in the database. When a change in data occurs, the Data Server sends the updates to all of its subscribers.",source:"@site/docs/03_server/02_data-server/01_introduction.md",sourceDirName:"03_server/02_data-server",slug:"/server/data-server/introduction",permalink:"/next/server/data-server/introduction",draft:!1,tags:[{label:"server",permalink:"/next/tags/server"},{label:"data server",permalink:"/next/tags/data-server"},{label:"dataserver",permalink:"/next/tags/dataserver"},{label:"introduction",permalink:"/next/tags/introduction"}],version:"current",sidebarPosition:1,frontMatter:{title:"Data Server - Introduction",sidebar_label:"Introduction",id:"introduction",keywords:["server","data server","dataserver","introduction"],tags:["server","data server","dataserver","introduction"]},sidebar:"serverModulesSidebar",previous:{title:"Setting the database technology",permalink:"/next/server/configuring-runtime/setting-the-database-technology"},next:{title:"Basics",permalink:"/next/server/data-server/basics"}},c={},v=[],h={toc:v};function p(e){var t=e.components,r=(0,n.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},h,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Data Servers monitor specific tables or views in the database. When a change in data occurs, the Data Server sends the updates to all of its subscribers."),(0,i.kt)(s.G,{chart:"graph TD\nA[UI] --\x3e |Connection| B(DATA_SERVER)\nB --\x3e|Initial data| A\nB --\x3e |Updates| A\nB --\x3e|Connection| C[Database]\nC --\x3e |Changes in table/view trigger a read|B",mdxType:"Mermaid"}),(0,i.kt)("p",null,"The Data Server configuration is refreshingly light, because all the hard work is done by the table or views."),(0,i.kt)("p",null,"A Data Server file consists of a number of queries that handle each event in the required way. You can define any number of queries. A query can be on an individual table or view. All the details of the table or view are inherited from the definition, so you don\u2019t need to supply any further details."),(0,i.kt)("p",null,"The initial run of the query serves all the data that is defined by the table or view. From then on, it automatically monitors the user who has requested the data. Whenever a value in the underlying table or view changes, that change is sent to the user. In this way, the user\u2019s data is maintained up to date in real time, without the unnecessary burden of sending the whole data set each time there is a change."),(0,i.kt)("p",null,"Data Servers are conventionally defined in the file ",(0,i.kt)("em",{parentName:"p"},"application-name"),(0,i.kt)("strong",{parentName:"p"},"-dataserver.kts"),"."),(0,i.kt)("p",null,"So, if your application is called ",(0,i.kt)("strong",{parentName:"p"},"positions"),", then the file would conventionally be named ",(0,i.kt)("strong",{parentName:"p"},"positions-dataserver.kts"),"."),(0,i.kt)("p",null,"Note, you will also need to declare your Data Server within the ",(0,i.kt)("a",{parentName:"p",href:"/server/data-server/configuring-runtime/"},"runtime configuration"),"."))}p.isMDXComponent=!0}}]);