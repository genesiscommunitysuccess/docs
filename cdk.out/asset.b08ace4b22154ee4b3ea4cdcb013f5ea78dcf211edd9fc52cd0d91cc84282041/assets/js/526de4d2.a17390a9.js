"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[37881],{24422:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return p},default:function(){return m},frontMatter:function(){return s},metadata:function(){return l},toc:function(){return u}});var a=n(87462),i=n(63366),r=(n(67294),n(3905)),o=(n(61839),["components"]),s={title:"Data Pipeline - Introduction",sidebar_label:"Introduction",id:"introduction",keywords:["server","integration","data pipeline","introduction"],tags:["server","integration","data pipeline","introduction"]},p=void 0,l={unversionedId:"server/integration/data-pipeline/introduction",id:"version-2022.3/server/integration/data-pipeline/introduction",title:"Data Pipeline - Introduction",description:"Introduction  | Basics | Advanced | Examples | Configuring runtime | Testing",source:"@site/versioned_docs/version-2022.3/03_server/10_integration/08_data-pipeline/01_introduction.md",sourceDirName:"03_server/10_integration/08_data-pipeline",slug:"/server/integration/data-pipeline/introduction",permalink:"/server/integration/data-pipeline/introduction",draft:!1,tags:[{label:"server",permalink:"/tags/server"},{label:"integration",permalink:"/tags/integration"},{label:"data pipeline",permalink:"/tags/data-pipeline"},{label:"introduction",permalink:"/tags/introduction"}],version:"2022.3",sidebarPosition:1,frontMatter:{title:"Data Pipeline - Introduction",sidebar_label:"Introduction",id:"introduction",keywords:["server","integration","data pipeline","introduction"],tags:["server","integration","data pipeline","introduction"]},sidebar:"serverModulesSidebar",previous:{title:"Testing",permalink:"/server/integration/custom-endpoints/testing"},next:{title:"Basics",permalink:"/server/integration/data-pipeline/basics"}},d={},u=[{value:"Supported sources",id:"supported-sources",level:2}],c={toc:u};function m(e){var t=e.components,n=(0,i.Z)(e,o);return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/introduction/"},"Introduction"),"  | ",(0,r.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/basics"},"Basics")," | ",(0,r.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/advanced"},"Advanced")," | ",(0,r.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/examples"},"Examples")," | ",(0,r.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/configuring-runtime"},"Configuring runtime")," | ",(0,r.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/testing"},"Testing")),(0,r.kt)("p",null,"You can define pipelines that map data from an external source (database, file) to ",(0,r.kt)("a",{parentName:"p",href:"/database/fields-tables-views/tables/"},"Tables")," in your application. By default, the resulting Table objects are stored in the database. However, you can define ",(0,r.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/advanced/#custom-handler-for-the-mapped-entity"},"custom operations")," as well."),(0,r.kt)("p",null,"Each data pipeline defines a source for the data and how that data is mapped to each ",(0,r.kt)("a",{parentName:"p",href:"/database/fields-tables-views/fields/"},"Field")," in the Table."),(0,r.kt)("p",null,"If a field mapping is not one-to-one - e.g. complex type conversions, data obfuscation, enriched values - you can define a ",(0,r.kt)("inlineCode",{parentName:"p"},"transform")," function that has a return value that is mapped to the required field."),(0,r.kt)("p",null,"Here is a sample configuration:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-kotlin"},'sources {\n\n    postgres("cdc-test") {\n        hostname = "localhost"\n        port = 5432\n        username = "postgres"\n        password = "docker"\n        databaseName = "postgres"\n\n        table {\n            "public.source_trades" to mapper("incoming_trades", TRADE) {\n                val tradeId = stringValue("trd_id")\n                val tradedAt = longValue("traded_at")\n\n                TRADE {\n\n                    TRADE_TYPE {\n                        sourceProperty = "side"\n                    }\n\n                    TRADE_DATE {\n                        transform {\n                            DateTime(input.get(tradedAt))\n                        }\n                    }\n\n                    RECORD_ID {\n                        transform {\n                            input.get(tradeId).removePrefix("ITS_").toLong()\n                        }\n                    }\n                }\n            }\n        }\n    }\n}\n\n')),(0,r.kt)("p",null,"Once your Genesis application is running, data ingestion will take place."),(0,r.kt)("h2",{id:"supported-sources"},"Supported sources"),(0,r.kt)("p",null,"Currently, the supported sources are:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"PostgreSQL"),(0,r.kt)("li",{parentName:"ul"},"MS SQL Server"),(0,r.kt)("li",{parentName:"ul"},"Oracle Enterprise"),(0,r.kt)("li",{parentName:"ul"},"Files that originate from the local filesystem or S3",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"CSV"),(0,r.kt)("li",{parentName:"ul"},"XML"),(0,r.kt)("li",{parentName:"ul"},"JSON")))))}m.isMDXComponent=!0}}]);