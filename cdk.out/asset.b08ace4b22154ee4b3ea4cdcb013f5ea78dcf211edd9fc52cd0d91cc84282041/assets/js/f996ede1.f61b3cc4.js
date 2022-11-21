"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[30107],{39801:function(a,e,t){t.r(e),t.d(e,{assets:function(){return u},contentTitle:function(){return p},default:function(){return m},frontMatter:function(){return l},metadata:function(){return o},toc:function(){return d}});var n=t(87462),r=t(63366),s=(t(67294),t(3905)),i=(t(61839),["components"]),l={title:"Types of API - RxJava API",sidebar_label:"RxJava",id:"rxjava",keywords:["database","types of api","api","types","rxjava"],tags:["database","types of api","api","types","rxjava"]},p=void 0,o={unversionedId:"database/types-of-api/rxjava",id:"version-2022.3/database/types-of-api/rxjava",title:"Types of API - RxJava API",description:"Async |",source:"@site/versioned_docs/version-2022.3/02_database/07_types-of-api/02_rxjava.md",sourceDirName:"02_database/07_types-of-api",slug:"/database/types-of-api/rxjava",permalink:"/database/types-of-api/rxjava",draft:!1,tags:[{label:"database",permalink:"/tags/database"},{label:"types of api",permalink:"/tags/types-of-api"},{label:"api",permalink:"/tags/api"},{label:"types",permalink:"/tags/types"},{label:"rxjava",permalink:"/tags/rxjava"}],version:"2022.3",sidebarPosition:2,frontMatter:{title:"Types of API - RxJava API",sidebar_label:"RxJava",id:"rxjava",keywords:["database","types of api","api","types","rxjava"],tags:["database","types of api","api","types","rxjava"]},sidebar:"databaseSidebar",previous:{title:"Async",permalink:"/database/types-of-api/async"},next:{title:"Overview",permalink:"/database/database-technology/overview"}},u={},d=[{value:"Subscription\u200b",id:"subscription",level:2},{value:"RxJava return types\u200b",id:"rxjava-return-types",level:2},{value:"Single\u200b",id:"single",level:3},{value:"Maybe\u200b",id:"maybe",level:3},{value:"Flowable\u200b",id:"flowable",level:3}],k={toc:d};function m(a){var e=a.components,t=(0,r.Z)(a,i);return(0,s.kt)("wrapper",(0,n.Z)({},k,t,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("p",null,(0,s.kt)("a",{parentName:"p",href:"/database/types-of-api/async/"},"Async")," |\n",(0,s.kt)("a",{parentName:"p",href:"/database/types-of-api/rxjava/"},"RxJava")," "),(0,s.kt)("p",null,(0,s.kt)("a",{parentName:"p",href:"https://www.rxjava.com/"},"RxJava"),"\xa0is a Java implementation of reactive extensions. The Genesis database uses this library to represent asynchronous database operations in java."),(0,s.kt)("p",null,"If you are using Java. RxJava API is the only way of accessing the database. For Kotlin, the\xa0",(0,s.kt)("a",{parentName:"p",href:"/database/types-of-api/async/"},"async"),"\xa0API is preferred (although the RxJava API is also supported)."),(0,s.kt)("h2",{id:"subscription"},"Subscription",(0,s.kt)("a",{parentName:"h2",href:"/database/types-of-api/rxjava/#subscriptiondirect-link-to-heading"},"\u200b")),(0,s.kt)("p",null,"It is important to note that any database operation with RxJava return type is cold until it is subscribed to. This means that the operation is not sent to the database until that time."),(0,s.kt)("h2",{id:"rxjava-return-types"},"RxJava return types",(0,s.kt)("a",{parentName:"h2",href:"/database/types-of-api/rxjava/#rxjava-return-typesdirect-link-to-heading"},"\u200b")),(0,s.kt)("p",null,"The Genesis database uses three RxJava return types:"),(0,s.kt)("table",null,(0,s.kt)("thead",{parentName:"table"},(0,s.kt)("tr",{parentName:"thead"},(0,s.kt)("th",{parentName:"tr",align:null},"Return type"),(0,s.kt)("th",{parentName:"tr",align:null},"minimum returns"),(0,s.kt)("th",{parentName:"tr",align:null},"maximum returns"))),(0,s.kt)("tbody",{parentName:"table"},(0,s.kt)("tr",{parentName:"tbody"},(0,s.kt)("td",{parentName:"tr",align:null},"Single"),(0,s.kt)("td",{parentName:"tr",align:null},"1"),(0,s.kt)("td",{parentName:"tr",align:null},"1")),(0,s.kt)("tr",{parentName:"tbody"},(0,s.kt)("td",{parentName:"tr",align:null},"Maybe"),(0,s.kt)("td",{parentName:"tr",align:null},"0"),(0,s.kt)("td",{parentName:"tr",align:null},"1")),(0,s.kt)("tr",{parentName:"tbody"},(0,s.kt)("td",{parentName:"tr",align:null},"Flowable"),(0,s.kt)("td",{parentName:"tr",align:null},"0"),(0,s.kt)("td",{parentName:"tr",align:null},"\u221e")))),(0,s.kt)("h3",{id:"single"},"Single",(0,s.kt)("a",{parentName:"h3",href:"/database/types-of-api/rxjava/#singledirect-link-to-heading"},"\u200b")),(0,s.kt)("p",null,"In the RxJava API, a\xa0",(0,s.kt)("inlineCode",{parentName:"p"},"Single"),"\xa0represents an asynchronous operation that has two possible outcomes:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"a success with result, or"),(0,s.kt)("li",{parentName:"ul"},"a failure")),(0,s.kt)("p",null,"For example, on the database,\xa0",(0,s.kt)("inlineCode",{parentName:"p"},"delete"),"\xa0returns a\xa0",(0,s.kt)("inlineCode",{parentName:"p"},"Single"),", with the following possible outcomes:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"the record was deleted; it provides a\xa0",(0,s.kt)("a",{parentName:"li",href:"/database/helper-classes/write-result/"},"write result")),(0,s.kt)("li",{parentName:"ul"},"the operation was not successful; for example, the record was not found")),(0,s.kt)("h3",{id:"maybe"},"Maybe",(0,s.kt)("a",{parentName:"h3",href:"/database/types-of-api/rxjava/#maybedirect-link-to-heading"},"\u200b")),(0,s.kt)("p",null,"In the RxJava API, a\xa0",(0,s.kt)("inlineCode",{parentName:"p"},"Maybe"),"\xa0represents an asynchronous operation that has three possible outcomes:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"a success with result"),(0,s.kt)("li",{parentName:"ul"},"a success with no result"),(0,s.kt)("li",{parentName:"ul"},"a failure")),(0,s.kt)("p",null,"For example, on the database,\xa0",(0,s.kt)("inlineCode",{parentName:"p"},"get"),"\xa0returns a\xa0",(0,s.kt)("inlineCode",{parentName:"p"},"Maybe"),", with the following possible outcomes:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"a record is found"),(0,s.kt)("li",{parentName:"ul"},"no record is found"),(0,s.kt)("li",{parentName:"ul"},"the operation was not successful, for example the index was incorrect")),(0,s.kt)("h3",{id:"flowable"},"Flowable",(0,s.kt)("a",{parentName:"h3",href:"/database/types-of-api/rxjava/#flowabledirect-link-to-heading"},"\u200b")),(0,s.kt)("p",null,"In the RxJava API, a\xa0",(0,s.kt)("inlineCode",{parentName:"p"},"Flowable"),"\xa0represents an asynchronous operation that has an undefined number of outputs."))}m.isMDXComponent=!0}}]);