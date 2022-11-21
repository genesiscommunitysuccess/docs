"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[53783],{85162:function(e,A,t){t.d(A,{Z:function(){return r}});var a=t(67294),n=t(86010),i="tabItem_Ymn6";function r(e){var A=e.children,t=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",className:(0,n.Z)(i,r),hidden:t},A)}},65488:function(e,A,t){t.d(A,{Z:function(){return c}});var a=t(87462),n=t(67294),i=t(86010),r=t(72389),l=t(67392),o=t(7094),s=t(12466),p="tabList__CuJ",u="tabItem_LNqP";function d(e){var A,t,r=e.lazy,d=e.block,c=e.defaultValue,I=e.values,g=e.groupId,k=e.className,m=n.Children.map(e.children,(function(e){if((0,n.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=I?I:m.map((function(e){var A=e.props;return{value:A.value,label:A.label,attributes:A.attributes}})),Q=(0,l.l)(h,(function(e,A){return e.value===A.value}));if(Q.length>0)throw new Error('Docusaurus error: Duplicate values "'+Q.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var E=null===c?c:null!=(A=null!=c?c:null==(t=m.find((function(e){return e.props.default})))?void 0:t.props.value)?A:m[0].props.value;if(null!==E&&!h.some((function(e){return e.value===E})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+E+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var C=(0,o.U)(),v=C.tabGroupChoices,N=C.setTabGroupChoices,f=(0,n.useState)(E),B=f[0],b=f[1],U=[],R=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=g){var S=v[g];null!=S&&S!==B&&h.some((function(e){return e.value===S}))&&b(S)}var H=function(e){var A=e.currentTarget,t=U.indexOf(A),a=h[t].value;a!==B&&(R(A),b(a),null!=g&&N(g,String(a)))},q=function(e){var A,t=null;switch(e.key){case"ArrowRight":var a,n=U.indexOf(e.currentTarget)+1;t=null!=(a=U[n])?a:U[0];break;case"ArrowLeft":var i,r=U.indexOf(e.currentTarget)-1;t=null!=(i=U[r])?i:U[U.length-1]}null==(A=t)||A.focus()};return n.createElement("div",{className:(0,i.Z)("tabs-container",p)},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":d},k)},h.map((function(e){var A=e.value,t=e.label,r=e.attributes;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:B===A?0:-1,"aria-selected":B===A,key:A,ref:function(e){return U.push(e)},onKeyDown:q,onFocus:H,onClick:H},r,{className:(0,i.Z)("tabs__item",u,null==r?void 0:r.className,{"tabs__item--active":B===A})}),null!=t?t:A)}))),r?(0,n.cloneElement)(m.filter((function(e){return e.props.value===B}))[0],{className:"margin-top--md"}):n.createElement("div",{className:"margin-top--md"},m.map((function(e,A){return(0,n.cloneElement)(e,{key:A,hidden:e.props.value!==B})}))))}function c(e){var A=(0,r.Z)();return n.createElement(d,(0,a.Z)({key:String(A)},e))}},96156:function(e,A,t){t.r(A),t.d(A,{assets:function(){return d},contentTitle:function(){return p},default:function(){return g},frontMatter:function(){return s},metadata:function(){return u},toc:function(){return c}});var a=t(87462),n=t(63366),i=(t(67294),t(3905)),r=(t(61839),t(65488)),l=t(85162),o=["components"],s={title:"Start application",id:"start-application"},p="Start application",u={unversionedId:"fuse/quick-start/start-application",id:"version-2022.3/fuse/quick-start/start-application",title:"Start application",description:"By the end of this section we should have all parts of our application running. We shall:",source:"@site/versioned_docs/version-2022.3/00_fuse/02_quick-start/03_start_application.md",sourceDirName:"00_fuse/02_quick-start",slug:"/fuse/quick-start/start-application",permalink:"/fuse/quick-start/start-application",draft:!1,tags:[],version:"2022.3",sidebarPosition:3,frontMatter:{title:"Start application",id:"start-application"},sidebar:"fuseSidebar",previous:{title:"Create application",permalink:"/fuse/quick-start/create-application"},next:{title:"Add features",permalink:"/fuse/quick-start/add-features"}},d={},c=[{value:"Server set-up",id:"server-set-up",level:2},{value:"Preparing the server",id:"preparing-the-server",level:3},{value:"Validating user import",id:"validating-user-import",level:3},{value:"Build and deploy",id:"build-and-deploy",level:3},{value:"Making the UI available in our web browser",id:"making-the-ui-available-in-our-web-browser",level:3},{value:"Accessing user interface",id:"accessing-user-interface",level:3},{value:"Testing end-to-end connectivity",id:"testing-end-to-end-connectivity",level:3},{value:"Recap",id:"recap",level:2}],I={toc:c};function g(e){var A=e.components,s=(0,n.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},I,s,{components:A,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"start-application"},"Start application"),(0,i.kt)("p",null,"By the end of this section we should have all parts of our application running. We shall:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"have our API, Web and database servers running"),(0,i.kt)("li",{parentName:"ul"},"load user interface in the browser"),(0,i.kt)("li",{parentName:"ul"},"confirm that everything is connected as expected by logging in")),(0,i.kt)("h2",{id:"server-set-up"},"Server set-up"),(0,i.kt)(r.Z,{mdxType:"Tabs"},(0,i.kt)(l.Z,{value:"docker",label:"Docker",default:!0,mdxType:"TabItem"},(0,i.kt)("p",null,"We can now start the servers:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"genx app run\n")),(0,i.kt)("admonition",{type:"info"},(0,i.kt)("p",{parentName:"admonition"},"You can ocassionally run into intermittent network issues such as ",(0,i.kt)("inlineCode",{parentName:"p"},"npm ERR! Invalid response body")," or database connectivity issues such as ",(0,i.kt)("inlineCode",{parentName:"p"},"Failure initialising SQL client... Database is unavailable"),". If you are experiencing any of the above, simply re-run ",(0,i.kt)("inlineCode",{parentName:"p"},"genx app run"),"."),(0,i.kt)("p",{parentName:"admonition"},"If they persist, you can run ",(0,i.kt)("inlineCode",{parentName:"p"},"genx app restart"),". This will rebuild Docker images."),(0,i.kt)("p",{parentName:"admonition"},"Finally, if none of the above steps have helped, you can run ",(0,i.kt)("inlineCode",{parentName:"p"},"genx app run clear-docker-cache")," to clear your cache and try running ",(0,i.kt)("inlineCode",{parentName:"p"},"genx app run")," again.")),(0,i.kt)("p",null,"It will take a few minutes to get everything ready. Eventually, you should see the following message:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"Waiting for changes to input files of tasks... (ctrl-d to exit)\n")),(0,i.kt)("p",null,"You can confirm that Docker containers have been started:"),(0,i.kt)("p",null,(0,i.kt)("img",{src:t(11933).Z,width:"845",height:"480"})),(0,i.kt)("admonition",{type:"danger"},(0,i.kt)("p",{parentName:"admonition"},"Application data used during local development is ",(0,i.kt)("strong",{parentName:"p"},"not persisted")," - if you restart your application, it will be lost. You can use ",(0,i.kt)("a",{parentName:"p",href:"https://docs.genesis.global/secure/operations/commands/server-commands/#dumpit-script"},(0,i.kt)("inlineCode",{parentName:"a"},"DumpIt"))," command to back up your database if needed."),(0,i.kt)("p",{parentName:"admonition"},"You can stop your application by running:"),(0,i.kt)("pre",{parentName:"admonition"},(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"genx app stop\n")))),(0,i.kt)(l.Z,{value:"wsl",label:"WSL",mdxType:"TabItem"},(0,i.kt)("p",null,"Before starting with the server set-up, make sure that:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"We have set up a user with name of the application (",(0,i.kt)("inlineCode",{parentName:"li"},"alpha")," in our case)"),(0,i.kt)("li",{parentName:"ul"},"FoundationDB is running (if it is not, run ",(0,i.kt)("inlineCode",{parentName:"li"},"systemctl start foundationdb")," from WSL terminal)")),(0,i.kt)("p",null,"If unsure about the above, refer to ",(0,i.kt)("a",{parentName:"p",href:"/getting-started/prerequisites/installing-wsl/"},"WSL installation instructions"),"."),(0,i.kt)("h3",{id:"preparing-the-server"},"Preparing the server"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"genx app setup\n")),(0,i.kt)("p",null,"This will:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"generate all the server and UI configuration"),(0,i.kt)("li",{parentName:"ul"},"extract and configure the Genesis distribution specified as a dependency"),(0,i.kt)("li",{parentName:"ul"},"import user login credentials")),(0,i.kt)("h3",{id:"validating-user-import"},"Validating user import"),(0,i.kt)("p",null,"We want to validate that user was set up successfully. We can do that using the ",(0,i.kt)("inlineCode",{parentName:"p"},"DbMon")," console. Once inside the console, type ",(0,i.kt)("inlineCode",{parentName:"p"},"table USER")," and then ",(0,i.kt)("inlineCode",{parentName:"p"},"search 1"),". If imported correctly, the user should be listed."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"genx app dbmon\n")),(0,i.kt)("h3",{id:"build-and-deploy"},"Build and deploy"),(0,i.kt)("p",null,"Next, let's build and deploy our application:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"genx app deploy\n")),(0,i.kt)("p",null,"After this command is completed, we will have a basic Genesis server running."),(0,i.kt)("h3",{id:"making-the-ui-available-in-our-web-browser"},"Making the UI available in our web browser"),(0,i.kt)("p",null,"Next, let's start automatic UI configuration regeneration:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"genx app watch\n")),(0,i.kt)("p",null,"Finally, in another terminal window let's start a local Web server:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"genx app web\n")),(0,i.kt)("p",null,"Once ",(0,i.kt)("inlineCode",{parentName:"p"},"INFO: Accepting connections")," message is shown, we are ready to load our UI in the browser."))),(0,i.kt)("h3",{id:"accessing-user-interface"},"Accessing user interface"),(0,i.kt)("p",null,"We can now open ",(0,i.kt)("a",{href:"http://localhost:9000/",target:"_blank"},"http://localhost:9000/"),"."),(0,i.kt)("p",null,(0,i.kt)("img",{src:t(45938).Z,width:"845",height:"698"})),(0,i.kt)("p",null,"Our server is running, however the individual services it provides are still starting up. The login button will stay disabled until they are fully up and running, which can take a few minutes. To check progress, you can open another terminal window and run:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"genx app status\n")),(0,i.kt)("p",null,"Your output should be similar. PID, CPU and memory values may differ - we are interested in the status column:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"PID     Process Name                  Port        Status         CPU       Memory    Message\n===============================================================================================\n426     GENESIS_AUTH_CONSOLIDATOR     8005        STANDBY        26.30     1.30\n350     GENESIS_AUTH_DATASERVER       8002        RUNNING        46.70     1.70\n334     GENESIS_AUTH_MANAGER          8001        RUNNING        51.50     1.70\n368     GENESIS_AUTH_PERMS            8003        RUNNING        55.70     1.90\n403     GENESIS_AUTH_REQUEST_SERVER   8004        RUNNING        46.80     1.60\n490     GENESIS_CLUSTER               9000        RUNNING        54.30     2.50\n570     GENESIS_ROUTER                9017        RUNNING        44.70     2.00\n534     GENESIS_WEBMON                9011        RUNNING        41.30     2.50\n===============================================================================================\n664     ALPHA_DATASERVER              11000       RUNNING        58.10     1.50\n703     ALPHA_EVENT_HANDLER           11001       RUNNING        71.30     2.20\n")),(0,i.kt)("h3",{id:"testing-end-to-end-connectivity"},"Testing end-to-end connectivity"),(0,i.kt)("p",null,"Once all the services are running, we can login with credentials configured in the previous step (defaults are ",(0,i.kt)("inlineCode",{parentName:"p"},"JaneDee"),"/",(0,i.kt)("inlineCode",{parentName:"p"},"beONneON*74"),"). You should see the following after a succesful login:"),(0,i.kt)("p",null,(0,i.kt)("img",{src:t(89765).Z,width:"681",height:"544"})),(0,i.kt)("p",null,"At the moment our home page is virtually empty - we will fix that in the next step."),(0,i.kt)("h2",{id:"recap"},"Recap"),(0,i.kt)("p",null,"Congratulations, you now have:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"API, Web and database servers running"),(0,i.kt)("li",{parentName:"ul"},"auth component loaded and configured "),(0,i.kt)("li",{parentName:"ul"},"user interface available in the browser"),(0,i.kt)("li",{parentName:"ul"},"a working connection between the server and user interface")))}g.isMDXComponent=!0},11933:function(e,A,t){A.Z=t.p+"assets/images/gpl-docker-b294daefd92cd751cb15de054926d7d6.png"},45938:function(e,A,t){A.Z=t.p+"assets/images/gpl-seed-login-39fa362137675602a6c8f22c0ead5fe1.png"},89765:function(e,A){A.Z="data:image/png;base64,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IB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACAdkQoAQDoiFQCAdEQqAADpiFQAANIRqQAApCNSAQBIR6QCAJCOSAUAIB2RCgBAOiIVAIB0RCoAAOmIVAAA0hGpAACkI1IBAEhHpAIAkI5IBQAgHZEKAEA6IhUAgHREKgAA6YhUAADSEakAAKQjUgEASEekAgCQjkgFACCZiP8HiFKDNwO0aZkAAAAASUVORK5CYII="}}]);