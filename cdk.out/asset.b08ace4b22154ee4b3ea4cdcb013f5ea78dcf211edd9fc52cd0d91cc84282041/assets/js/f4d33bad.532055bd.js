"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[2135],{5301:function(e,n,t){t.r(n),t.d(n,{assets:function(){return d},contentTitle:function(){return o},default:function(){return T},frontMatter:function(){return l},metadata:function(){return E},toc:function(){return u}});var a=t(87462),r=t(63366),i=(t(67294),t(3905)),s=(t(61839),["components"]),l={title:"REST endpoints - Advanced",sidebar_label:"Advanced",id:"advanced",keywords:["server","integration","REST endpoints","advanced"],tags:["server","integration","REST endpoints","advanced"]},o=void 0,E={unversionedId:"server/integration/rest-endpoints/advanced",id:"version-2022.3/server/integration/rest-endpoints/advanced",title:"REST endpoints - Advanced",description:"Introduction | Where to define | Basics | Advanced | Configuring runtime | Testing",source:"@site/versioned_docs/version-2022.3/03_server/10_integration/01_rest-endpoints/04_advanced.md",sourceDirName:"03_server/10_integration/01_rest-endpoints",slug:"/server/integration/rest-endpoints/advanced",permalink:"/server/integration/rest-endpoints/advanced",draft:!1,tags:[{label:"server",permalink:"/tags/server"},{label:"integration",permalink:"/tags/integration"},{label:"REST endpoints",permalink:"/tags/rest-endpoints"},{label:"advanced",permalink:"/tags/advanced"}],version:"2022.3",sidebarPosition:4,frontMatter:{title:"REST endpoints - Advanced",sidebar_label:"Advanced",id:"advanced",keywords:["server","integration","REST endpoints","advanced"],tags:["server","integration","REST endpoints","advanced"]},sidebar:"serverModulesSidebar",previous:{title:"Basics",permalink:"/server/integration/rest-endpoints/basics"},next:{title:"Configuring Runtime",permalink:"/server/integration/rest-endpoints/configuring-runtime"}},d={},u=[{value:"Authentication",id:"authentication",level:2},{value:"EVENT_LOGIN_REFRESH",id:"event_login_refresh",level:3},{value:"EVENT_LOGOUT",id:"event_logout",level:3},{value:"Metadata",id:"metadata",level:2},{value:"RESOURCES",id:"resources",level:3},{value:"METADATA",id:"metadata-1",level:3}],p={toc:u};function T(e){var n=e.components,t=(0,r.Z)(e,s);return(0,i.kt)("wrapper",(0,a.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/server/integration/rest-endpoints/introduction/"},"Introduction")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/rest-endpoints/where-to-define"},"Where to define")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/rest-endpoints/basics/"},"Basics")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/rest-endpoints/advanced/"},"Advanced")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/rest-endpoints/configuring-runtime/"},"Configuring runtime")," | ",(0,i.kt)("a",{parentName:"p",href:"/server/integration/rest-endpoints/testing/"},"Testing")),(0,i.kt)("h2",{id:"authentication"},"Authentication"),(0,i.kt)("h3",{id:"event_login_refresh"},"EVENT_LOGIN_REFRESH"),(0,i.kt)("p",null,"Log in refresh requests are submitted via POST requests to\n",(0,i.kt)("inlineCode",{parentName:"p"},"[host]:[genesis_router_port]/event-login-auth"),"."),(0,i.kt)("p",null,"Log in refresh requests require:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"SOURCE_REF")," header"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"USER_NAME")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"REFRESH_AUTH_TOKEN")," (supplied on the last login reply payload in the HTTP headers) parameters in the ",(0,i.kt)("inlineCode",{parentName:"li"},"DETAILS")," object.")),(0,i.kt)("p",null,"Sample request:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'POST /event-login-auth HTTP/1.1\nHost: localhost:9064\nContent-Type: application/json\nSOURCE_REF: 123456-789042\n\n{\n    "DETAILS": {\n        "USER_NAME": "JaneDee",\n        "REFRESH_AUTH_TOKEN": "FmqF9CGzo2MiujEZoiRUjGXh8ybDC62L"\n    }\n}\n')),(0,i.kt)("p",null,"Sample response:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "MESSAGE_TYPE": "EVENT_LOGIN_AUTH_ACK",\n    "SESSION_AUTH_TOKEN": "qeKC5dPAEH1qQgmwW0eFH6LPNWRzIkqi",\n    "REFRESH_AUTH_TOKEN": "FmqF9CGzo2MiujEZoiRUjGXh8ybDC62L",\n    "SESSION_ID": "7043f539-160a-418a-be92-d5813a13a5fd",\n    "USER_ID": "",\n    "DETAILS": {\n        "SYSTEM": {\n            "DATE": "Sun Jan 21 20:53:48 UTC 2018"\n        },\n        "HEARTBEAT_INTERVAL_SECS": 30,\n        "FAILED_LOGIN_ATTEMPTS": 0,\n        "REJECTED_LOGIN_ATTEMPTS": 0,\n        "LAST_LOGIN_DATETIME": 1516567765917,\n        "PRODUCT": [\n            {\n                "NAME": "genesis",\n                "VERSION": "2.2.2"\n            },\n            {\n                "NAME": "auth",\n                "VERSION": "1.1.1"\n            }\n        ]\n    },\n    "SOURCE_REF": "123456-789041"\n}\n')),(0,i.kt)("h3",{id:"event_logout"},"EVENT_LOGOUT"),(0,i.kt)("p",null,"To end the user's session, you need to send a log out request."),(0,i.kt)("p",null,"Log out requests are submitted via POST requests to\n",(0,i.kt)("inlineCode",{parentName:"p"},"[host]:[genesis_router_port]/event-logout"),"."),(0,i.kt)("p",null,"Log out requests require:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"SOURCE_REF")," header"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"USER_NAME")," header"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"SESSION_ID")," header (supplied on the last login reply payload in the HTTP headers)")),(0,i.kt)("p",null,"Sample request:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"POST /event-logout HTTP/1.1\nHost: localhost:9064\nContent-Type: application/json\nSOURCE_REF: 123456-789043\nSESSION_ID: 7043f539-160a-418a-be92-d5813a13a5fd\nUSER_NAME: JaneDee\n")),(0,i.kt)("p",null,"Sample response:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "MESSAGE_TYPE": "LOGOUT_ACK",\n    "SOURCE_REF": "123456-789043"\n}\n')),(0,i.kt)("h2",{id:"metadata"},"Metadata"),(0,i.kt)("p",null,"There are special requests which can be used to retrieve available system resources and their respective metadata (query fields available, request parameters, transaction fields, etc...)"),(0,i.kt)("h3",{id:"resources"},"RESOURCES"),(0,i.kt)("p",null,"This request will return all the resources available on the server, each resource has a name and a type (e.g. RequestServer, DataServer, EventHandler)."),(0,i.kt)("p",null,"Resource requests are accessed via GET requests to\n",(0,i.kt)("inlineCode",{parentName:"p"},"[host]:[genesis_router_port]/resources-request"),"."),(0,i.kt)("p",null,"Resource requests require:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"SOURCE_REF")," header"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"SESSION_AUTH_TOKEN")," header")),(0,i.kt)("p",null,"Sample request:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"GET /resources-request HTTP/1.1\nHost: localhost:9064\nContent-Type: application/json\nSOURCE_REF: 123456-789051\nSESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0\n")),(0,i.kt)("p",null,"Sample response:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "MESSAGE_TYPE": "RESOURCES_REQUEST_ACK",\n    "RESOURCES": [\n        {\n            "RESOURCE_NAME": "EVENT_ORDER_INSERT",\n            "RESOURCE_TYPE": "EVENT_HANDLER"\n        },\n        {\n            "RESOURCE_NAME": "EVENT_ORDER_AMEND",\n            "RESOURCE_TYPE": "EVENT_HANDLER"\n        },\n        {\n            "RESOURCE_NAME": "EVENT_ORDER_CANCEL",\n            "RESOURCE_TYPE": "EVENT_HANDLER"\n        },\n        {\n            "RESOURCE_NAME": "COUNTERPARTY_DETAILS",\n            "RESOURCE_TYPE": "REQUESTSERVER"\n        },\n        {\n            "RESOURCE_NAME": "MY_TRADES",\n            "RESOURCE_TYPE": "DATASERVER"\n        }\n    ],\n    "SOURCE_REF": "123456-789051"\n}\n')),(0,i.kt)("h3",{id:"metadata-1"},"METADATA"),(0,i.kt)("p",null,"This request will return all the metadata associated with a given resource."),(0,i.kt)("p",null,"Metadata requests are accessed via GET requests to\n",(0,i.kt)("inlineCode",{parentName:"p"},"[host]:[genesis_router_port]/meta-request?details[FEATURE]=[RESOURCE_NAME]"),"."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Request Server resources will return the request and reply fields available to the resource and their associated metadata.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Data Server resources will return the fields available to the resource and their associated metadata.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Event Handler resources will return the transaction fields available to the resource and their associated metadata."))),(0,i.kt)("p",null,"Metadata requests require:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"SOURCE_REF")," header"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"SESSION_AUTH_TOKEN")," header")),(0,i.kt)("p",null,"Sample request:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"GET /meta-request?details[FEATURE]=MY_TRADES HTTP/1.1\nHost: localhost:9064\nContent-Type: application/json\nSOURCE_REF: 123456-789052\nSESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0\n")),(0,i.kt)("p",null,"Sample response:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "MESSAGE_TYPE": "META_ACK",\n    "DETAILS": {\n        "TYPE": "DATASERVER",\n        "NAME": "MY_TRADES",\n        "FIELD": [\n            {\n                "NAME": "TRADE_ID",\n                "TYPE": "STRING"\n            },\n            {\n                "NAME": "INSTRUMENT_ID",\n                "TYPE": "STRING"\n            },\n            {\n                "NAME": "CURRENCY",\n                "TYPE": "STRING"\n            },\n            {\n                "NAME": "QUANTITY",\n                "TYPE": "INT"\n            },\n            {\n                "NAME": "BROKER_ID",\n                "TYPE": "STRING"\n            },\n            {\n                "NAME": "PRICE",\n                "TYPE": "DOUBLE"\n            },\n            {\n                "NAME": "FULLY_FILLED",\n                "TYPE": "BOOLEAN"\n            },\n            {\n                "NAME": "DIRECTION",\n                "TYPE": "ENUM"\n            },\n            {\n                "NAME": "CLIENT_ID",\n                "TYPE": "STRING"\n            }\n        ]\n    },\n    "SOURCE_REF": "123456-789052"\n}\n')))}T.isMDXComponent=!0}}]);