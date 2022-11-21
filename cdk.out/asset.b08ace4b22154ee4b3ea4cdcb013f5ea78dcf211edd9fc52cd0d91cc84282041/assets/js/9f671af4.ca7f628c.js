"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[51520],{45325:function(e,t,n){n.r(t),n.d(t,{assets:function(){return h},contentTitle:function(){return c},default:function(){return u},frontMatter:function(){return s},metadata:function(){return l},toc:function(){return p}});var a=n(87462),i=n(63366),o=(n(67294),n(3905)),r=(n(61839),["components"]),s={title:"Genesis Containerisation - health checks",sidebar_label:"Health checks",id:"healthchecks",keywords:["operations","containerisation","container","docker","configuration","healthchecks"],tags:["operations","containerisation","container","docker","healthchecks"]},c=void 0,l={unversionedId:"operations/containerisation/healthchecks",id:"version-2022.3/operations/containerisation/healthchecks",title:"Genesis Containerisation - health checks",description:"The Genesis low-code platform Docker image provides a health check endpoint, which reports the status of the container.",source:"@site/versioned_docs/version-2022.3/05_operations/04_containerisation/06_healthchecks.md",sourceDirName:"05_operations/04_containerisation",slug:"/operations/containerisation/healthchecks",permalink:"/operations/containerisation/healthchecks",draft:!1,tags:[{label:"operations",permalink:"/tags/operations"},{label:"containerisation",permalink:"/tags/containerisation"},{label:"container",permalink:"/tags/container"},{label:"docker",permalink:"/tags/docker"},{label:"healthchecks",permalink:"/tags/healthchecks"}],version:"2022.3",sidebarPosition:6,frontMatter:{title:"Genesis Containerisation - health checks",sidebar_label:"Health checks",id:"healthchecks",keywords:["operations","containerisation","container","docker","configuration","healthchecks"],tags:["operations","containerisation","container","docker","healthchecks"]},sidebar:"operationsSidebar",previous:{title:"Pushing your image",permalink:"/operations/containerisation/pushing"},next:{title:"Configuration options",permalink:"/operations/containerisation/configuration"}},h={},p=[],k={toc:p};function u(e){var t=e.components,n=(0,i.Z)(e,r);return(0,o.kt)("wrapper",(0,a.Z)({},k,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The Genesis low-code platform Docker image provides a health check endpoint, which reports the status of the container."),(0,o.kt)("p",null,"This endpoint can be used for your liveliness/readiness checks if you are using container orchestration, or you can use it in your own checks if you are managing your containers yourself."),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Path"),(0,o.kt)("th",{parentName:"tr",align:null},"Port"),(0,o.kt)("th",{parentName:"tr",align:null},"Response"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"/health/status"),(0,o.kt)("td",{parentName:"tr",align:null},"This is set in the ",(0,o.kt)("a",{parentName:"td",href:"/server/integration/data-pipeline/advanced/#system-definition-properties"},"System Definition")," with the item ",(0,o.kt)("inlineCode",{parentName:"td"},"DaemonHealthPort")),(0,o.kt)("td",{parentName:"tr",align:null},"Either ",(0,o.kt)("inlineCode",{parentName:"td"},"200")," for HEALTHY or ",(0,o.kt)("inlineCode",{parentName:"td"},"503")," for UNHEALTHY",(0,o.kt)("br",null),(0,o.kt)("br",null),"(Note: the endpoint doesn't return a response body)")))),(0,o.kt)("p",null,"Note: You will need to ensure the port is accessible with either the Docker ",(0,o.kt)("inlineCode",{parentName:"p"},"--port")," option, or check the documentation for whichever container orchestration system you use."))}u.isMDXComponent=!0}}]);