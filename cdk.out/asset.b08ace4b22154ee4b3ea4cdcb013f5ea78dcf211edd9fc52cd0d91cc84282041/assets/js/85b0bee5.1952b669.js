"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[31425],{44460:function(e,r,n){n.r(r),n.d(r,{assets:function(){return c},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return g}});var i=n(87462),t=n(63366),a=(n(67294),n(3905)),s=(n(61839),["components"]),o={title:"Data Server - configuring runtime",sidebar_label:"Configuring runtime",id:"configuring-runtime",keywords:["server","data server","dataserver","introduction","configuring runtime"],tags:["server","data server","dataserver","introduction","configuring runtime"]},l=void 0,u={unversionedId:"server/data-server/configuring-runtime",id:"server/data-server/configuring-runtime",title:"Data Server - configuring runtime",description:"There are two important files in your application that contain configuration information:",source:"@site/docs/03_server/02_data-server/05_configuring-runtime.md",sourceDirName:"03_server/02_data-server",slug:"/server/data-server/configuring-runtime",permalink:"/next/server/data-server/configuring-runtime",draft:!1,tags:[{label:"server",permalink:"/next/tags/server"},{label:"data server",permalink:"/next/tags/data-server"},{label:"dataserver",permalink:"/next/tags/dataserver"},{label:"introduction",permalink:"/next/tags/introduction"},{label:"configuring runtime",permalink:"/next/tags/configuring-runtime"}],version:"current",sidebarPosition:5,frontMatter:{title:"Data Server - configuring runtime",sidebar_label:"Configuring runtime",id:"configuring-runtime",keywords:["server","data server","dataserver","introduction","configuring runtime"],tags:["server","data server","dataserver","introduction","configuring runtime"]},sidebar:"serverModulesSidebar",previous:{title:"Examples",permalink:"/next/server/data-server/examples"},next:{title:"Testing",permalink:"/next/server/data-server/testing"}},c={},g=[{value:"Configuring in processes.xml",id:"configuring-in-processesxml",level:3},{value:"Configuring in service-definitions.xml",id:"configuring-in-service-definitionsxml",level:3}],p={toc:g};function m(e){var r=e.components,n=(0,t.Z)(e,s);return(0,a.kt)("wrapper",(0,i.Z)({},p,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"There are two important files in your application that contain configuration information: "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("em",{parentName:"li"},"application-name"),(0,a.kt)("strong",{parentName:"li"},"-processes.xml")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("em",{parentName:"li"},"application-name"),"**-service-definitions.xml")),(0,a.kt)("h3",{id:"configuring-in-processesxml"},"Configuring in processes.xml"),(0,a.kt)("p",null,"Here is an example configuration for a Data Server in an application's ",(0,a.kt)("strong",{parentName:"p"},"processes.xml")," file."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-xml"},'  <process name="POSITION_DATASERVER">\n    <groupId>POSITION</groupId>\n    <start>true</start>\n    <options>-Xmx1024m -DXSD_VALIDATE=false</options>\n    <module>genesis-pal-dataserver</module>\n    <package>global.genesis.dataserver.pal</package>\n    <script>position-dataserver.kts<\/script>\n    <description>Displays real-time details</description>\n    <language>pal</language>\n  </process>\n')),(0,a.kt)("p",null,"For more information about the tags that can be used to set the process configuration, follow this ",(0,a.kt)("a",{parentName:"p",href:"/server/configuring-runtime/processes"},"link"),"."),(0,a.kt)("h3",{id:"configuring-in-service-definitionsxml"},"Configuring in service-definitions.xml"),(0,a.kt)("p",null,"Here is a simple example of a service configuration for a Data Server in an application's ",(0,a.kt)("strong",{parentName:"p"},"service-definitions.xml"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-xml"},'  <service host="localhost" name="POSITION_DATASERVER" port="11000"/>\n')),(0,a.kt)("p",null,"For more information about the attributes that can be used to set the service definition configuration, follow this ",(0,a.kt)("a",{parentName:"p",href:"/server/configuring-runtime/service-definitions"},"link"),"."),(0,a.kt)("p",null,"Note - The name for both the service and process must be the same."))}m.isMDXComponent=!0}}]);