"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[10513],{72948:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return c},frontMatter:function(){return d},metadata:function(){return o},toc:function(){return u}});var n=a(87462),i=a(63366),l=(a(67294),a(3905)),r=(a(61839),["components"]),d={title:"Add features",id:"add-features"},s="Add features",o={unversionedId:"fuse/quick-start/add-features",id:"version-2022.3/fuse/quick-start/add-features",title:"Add features",description:"We've now got our project created and configured. We've started our servers, now we're ready to add features to our application.",source:"@site/versioned_docs/version-2022.3/00_fuse/02_quick-start/04_add-features.md",sourceDirName:"00_fuse/02_quick-start",slug:"/fuse/quick-start/add-features",permalink:"/fuse/quick-start/add-features",draft:!1,tags:[],version:"2022.3",sidebarPosition:4,frontMatter:{title:"Add features",id:"add-features"},sidebar:"fuseSidebar",previous:{title:"Start application",permalink:"/fuse/quick-start/start-application"},next:{title:"Summary",permalink:"/fuse/quick-start/summary"}},p={},u=[{value:"Expected result",id:"expected-result",level:3},{value:"Simple UI changes",id:"simple-ui-changes",level:3},{value:"Model",id:"model",level:2},{value:"Grid and form",id:"grid-and-form",level:2},{value:"Deploy",id:"deploy",level:2},{value:"Recap",id:"recap",level:2}],m={toc:u};function c(e){var t=e.components,d=(0,i.Z)(e,r);return(0,l.kt)("wrapper",(0,n.Z)({},m,d,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"add-features"},"Add features"),(0,l.kt)("p",null,"We've now got our project created and configured. We've started our servers, now we're ready to add features to our application."),(0,l.kt)("h3",{id:"expected-result"},"Expected result"),(0,l.kt)("p",null,"For this part of the guide, we've picked out a few core features we can demonstrate while building a sample application. By the end of this step we will have:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"the ability to make changes to the user interface and reflect those changes in the browser"),(0,l.kt)("li",{parentName:"ul"},"added a data ",(0,l.kt)("strong",{parentName:"li"},"model")," to describe the structure we'd like"),(0,l.kt)("li",{parentName:"ul"},"configured a ",(0,l.kt)("strong",{parentName:"li"},"grid")," to display the application data"),(0,l.kt)("li",{parentName:"ul"},"added a ",(0,l.kt)("strong",{parentName:"li"},"form")," to insert new records into our database")),(0,l.kt)("h3",{id:"simple-ui-changes"},"Simple UI changes"),(0,l.kt)("p",null,"Our page title has been auto-generated based on our application name. Let's modify it and add simple text heading to our page. We'll start by opening ",(0,l.kt)("inlineCode",{parentName:"p"},"app-ui.kts"),":"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"In IntelliJ press the ",(0,l.kt)("inlineCode",{parentName:"li"},"Shift")," key twice and start typing the filename"),(0,l.kt)("li",{parentName:"ul"},"In VS Code press ",(0,l.kt)("inlineCode",{parentName:"li"},"Ctrl + P")," (",(0,l.kt)("inlineCode",{parentName:"li"},"Cmd + P")," on a Mac) and start typing the filename")),(0,l.kt)("admonition",{type:"info"},(0,l.kt)("p",{parentName:"admonition"},"If you are seeing multiple matches, make sure you open the file in ",(0,l.kt)("inlineCode",{parentName:"p"},"src/main/resources")," folder")),(0,l.kt)("p",null,"Let's amend its contents as follows:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'// highlight-next-line\nui("Alpha Trading Dashboard") {\n    service(Login)\n\n    page("Home") {\n        // highlight-next-line\n        heading("Hello World")\n    }\n}\n')),(0,l.kt)("p",null,"We should now see the updated page title and heading text:"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(79946).Z,width:"413",height:"314"})),(0,l.kt)("h2",{id:"model"},"Model"),(0,l.kt)("p",null,"Now we're ready to define the fields and tables that make up the ",(0,l.kt)("a",{parentName:"p",href:"/getting-started/quick-start/define-the-data-model/"},"data model"),"."),(0,l.kt)("p",null,"Right-click on ",(0,l.kt)("inlineCode",{parentName:"p"},"src/main/kotlin/global/genesis/alpha/model")," folder in your IDE and add a new file called ",(0,l.kt)("inlineCode",{parentName:"p"},"Trade.kt"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"package global.genesis.alpha.model\n\nimport global.genesis.gpl.api.schema.Persist\nimport global.genesis.gpl.api.schema.Table\n\n@Persist\nobject TRADE : Table(11_000) {\n    val tradeId by varchar().nonNullable().generated()\n    val instrumentId by varchar().nonNullable()\n    val side by enum(Side.BUY)\n    val price by double().nonNullable()\n    val quantity by integer().nonNullable()\n    val tradeDateTime by now().immutable()\n    val enteredBy by username().immutable()\n    val modifyTime by now()\n    val tradeStatus by enum(TradeStatus.NEW)\n\n    override val primaryKey by primaryKey(tradeId)\n}\n\nenum class Side { BUY, SELL }\nenum class TradeStatus { NEW, ALLOCATED, CANCELLED }\n")),(0,l.kt)("h2",{id:"grid-and-form"},"Grid and form"),(0,l.kt)("p",null,"Grids are our primary way of displaying information. Let's add a grid to display our new ",(0,l.kt)("inlineCode",{parentName:"p"},"TRADE")," model and a form to allow users to submit new trades. We can achieve this by adding an ",(0,l.kt)("inlineCode",{parentName:"p"},"entityManager")," component as shown below. Specifying the ",(0,l.kt)("inlineCode",{parentName:"p"},"ADD")," operation will allow us to add new trade records."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},' ui("Alpha Trading Dashboard") {\n    service(Login)\n\n    page("Home") {\n        // highlight-start\n        entityManager(\n            entity = TRADE, \n            title = "Trades", \n            operations = listOf(ADD),\n        )\n        // highlight-end\n    }\n}\n')),(0,l.kt)("h2",{id:"deploy"},"Deploy"),(0,l.kt)("p",null,"Adding an entity manager component will require new server resources to be generated. We can generate and deploy them with the following command:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"genx app deploy\n")),(0,l.kt)("p",null,"Deployment involves restarting a server, which typically takes several minutes. You can check progress with ",(0,l.kt)("inlineCode",{parentName:"p"},"genx app status"),". You can ignore any ",(0,l.kt)("inlineCode",{parentName:"p"},"Unsupported key type (ssh-ed25519)")," warnings if present."),(0,l.kt)("p",null,"Once deployment has been completed, we will see a grid. Yours will be empty at this stage - to populate it with trades, click the ",(0,l.kt)("strong",{parentName:"p"},"Add")," button."),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(94089).Z,width:"1080",height:"928"})),(0,l.kt)("p",null,"This should open the add new trade form in a modal:"),(0,l.kt)("p",null,(0,l.kt)("img",{src:a(1251).Z,width:"1079",height:"929"})),(0,l.kt)("h2",{id:"recap"},"Recap"),(0,l.kt)("p",null,"Congratulations, with just a few lines of code and some commands, you now have:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"a new data model for trades"),(0,l.kt)("li",{parentName:"ul"},"a grid display of all trades"),(0,l.kt)("li",{parentName:"ul"},"the ability to add new trades via a form")))}c.isMDXComponent=!0},1251:function(e,t,a){t.Z=a.p+"assets/images/gpl-seed-form-51c8d9fd0e08be7aba769db519270dfe.png"},94089:function(e,t,a){t.Z=a.p+"assets/images/gpl-seed-grid-1f76f09a1cd4c851c0aca1e3108deea2.png"},79946:function(e,t,a){t.Z=a.p+"assets/images/gpl-seed-start-first-changes-fb915d2ad8d55bd98d5e87d7d9e5d763.png"}}]);