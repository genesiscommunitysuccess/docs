"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[13549],{82350:function(e,t,a){a.r(t),a.d(t,{assets:function(){return u},contentTitle:function(){return d},default:function(){return g},frontMatter:function(){return l},metadata:function(){return o},toc:function(){return p}});var n=a(87462),s=a(63366),i=(a(67294),a(3905)),r=(a(61839),["components"]),l={title:"Faster quick start - Define the data model",sidebar_label:"Define the data model",id:"define-the-data-model",keywords:["getting started","quick start","faster quick start","data model"],tags:["getting started","quick start","faster quick start","data model"]},d=void 0,o={unversionedId:"getting-started/use-cases/faster_quick-start/define-the-data-model",id:"getting-started/use-cases/faster_quick-start/define-the-data-model",title:"Faster quick start - Define the data model",description:"Now you are ready to define the fields and tables that make up your data model. This structures information in a simple way that can be viewed by users and processed by the application.",source:"@site/docs/01_getting-started/05_use-cases/09_faster_quick-start/03_define-the-data-model.md",sourceDirName:"01_getting-started/05_use-cases/09_faster_quick-start",slug:"/getting-started/use-cases/faster_quick-start/define-the-data-model",permalink:"/next/getting-started/use-cases/faster_quick-start/define-the-data-model",draft:!1,tags:[{label:"getting started",permalink:"/next/tags/getting-started"},{label:"quick start",permalink:"/next/tags/quick-start"},{label:"faster quick start",permalink:"/next/tags/faster-quick-start"},{label:"data model",permalink:"/next/tags/data-model"}],version:"current",sidebarPosition:3,frontMatter:{title:"Faster quick start - Define the data model",sidebar_label:"Define the data model",id:"define-the-data-model",keywords:["getting started","quick start","faster quick start","data model"],tags:["getting started","quick start","faster quick start","data model"]},sidebar:"learningSidebar",previous:{title:"Create a new project",permalink:"/next/getting-started/use-cases/faster_quick-start/create-a-new-project"},next:{title:"Add business logic",permalink:"/next/getting-started/use-cases/faster_quick-start/add-business-logic"}},u={},p=[{value:"Add fields",id:"add-fields",level:3},{value:"Add a table",id:"add-a-table",level:3}],c={toc:p};function g(e){var t=e.components,l=(0,s.Z)(e,r);return(0,i.kt)("wrapper",(0,n.Z)({},c,l,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Now you are ready to define the fields and tables that make up your data model. This structures information in a simple way that can be viewed by users and processed by the application."),(0,i.kt)("p",null,"Open Intellij (or your chosen IDE). In the alpha project, you will see the ",(0,i.kt)("strong",{parentName:"p"},"readme")," file for the project. After importing and indexing, your gradle tab (normally on the right of your window) should contain 3 folders (alpha, client, genesisproduct-alpha)."),(0,i.kt)("h3",{id:"add-fields"},"Add fields"),(0,i.kt)("p",null,"You define your fields in the file ",(0,i.kt)("strong",{parentName:"p"},"alpha-fields-dictionary.kts"),"."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"Once the project is open, there are two easy ways to find this file quickly in Intellij:"),(0,i.kt)("ul",{parentName:"admonition"},(0,i.kt)("li",{parentName:"ul"},"Press the ",(0,i.kt)("strong",{parentName:"li"},"Shift")," key twice, then type the name of the file you are looking for."),(0,i.kt)("li",{parentName:"ul"},"Press ",(0,i.kt)("strong",{parentName:"li"},"Shift")," + ",(0,i.kt)("strong",{parentName:"li"},"Ctrl")," + ",(0,i.kt)("strong",{parentName:"li"},"N"),", then type the name of the file you are looking for."))),(0,i.kt)("p",null,"For our simple example, we shall add five fields:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'fields {\n\n    field("TRADE_ID", type = STRING)\n    field("QUANTITY", type = INT)\n    field("PRICE", type = DOUBLE)\n    field("SYMBOL", type = STRING)\n    field("DIRECTION", type = ENUM("BUY", "SELL", default = "BUY"))\n\n}\n')),(0,i.kt)("p",null,"After you have saved this file, run genesis-generated-fields."),(0,i.kt)("p",null,"From the Gradle menu on the right of Intellij, this is:"),(0,i.kt)("p",null," ",(0,i.kt)("strong",{parentName:"p"},"genesisproduct-alpha"),"/",(0,i.kt)("strong",{parentName:"p"},"alpha-dictionary-cache"),"/",(0,i.kt)("strong",{parentName:"p"},"genesis-generated-fields"),"/",(0,i.kt)("strong",{parentName:"p"},"Tasks"),"/",(0,i.kt)("strong",{parentName:"p"},"genesis"),"/",(0,i.kt)("strong",{parentName:"p"},"generateFields")),(0,i.kt)("p",null,(0,i.kt)("img",{src:a(88185).Z,width:"421",height:"474"})),(0,i.kt)("h3",{id:"add-a-table"},"Add a table"),(0,i.kt)("p",null,"Now we have our fields, let's define a table in the file ",(0,i.kt)("strong",{parentName:"p"},"alpha-tables-dictionary.kts"),"."),(0,i.kt)("p",null,"We are defining one single table, containing all our fields."),(0,i.kt)("p",null,"TRADE_ID is the primaryKey, which will be auto-generated."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'tables {\n\n    table (name = "TRADE", id = 2000) {\n        sequence(TRADE_ID, "TR")\n        QUANTITY\n        PRICE\n        SYMBOL\n        DIRECTION\n\n        primaryKey {\n            TRADE_ID\n        }\n    }\n    \n}\n')),(0,i.kt)("p",null,"After you have saved this file, run genesis-generated-dao."),(0,i.kt)("p",null,"From the Gradle menu, this is:"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"genesisproduct-alpha"),"/",(0,i.kt)("strong",{parentName:"p"},"alpha-dictionary-cache"),"/",(0,i.kt)("strong",{parentName:"p"},"genesis-generated-dao"),"/",(0,i.kt)("strong",{parentName:"p"},"Tasks"),"/",(0,i.kt)("strong",{parentName:"p"},"genesis"),"/",(0,i.kt)("strong",{parentName:"p"},"generateDAO")),(0,i.kt)("p",null,(0,i.kt)("img",{src:a(94767).Z,width:"421",height:"474"})),(0,i.kt)("p",null,"OK. You have now created your data model. You can now create the key modules that surround the database."))}g.isMDXComponent=!0},88185:function(e,t,a){t.Z=a.p+"assets/images/build-gradle-kts-fields-dda7d15a1fce367439da670978602f23.png"},94767:function(e,t,a){t.Z=a.p+"assets/images/build-gradle-kts-generated-dao-c3e584280d2b372eaefe2256ae3a3236.png"}}]);