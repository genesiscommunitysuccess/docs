"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[7396],{50393:function(e,t,s){s.r(t),s.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return i},metadata:function(){return u},toc:function(){return c}});var n=s(87462),r=s(63366),a=(s(67294),s(3905)),o=(s(61839),["components"]),i={title:"Request Server - Testing",sidebar_label:"Testing",id:"testing",keywords:["server","request server","testing"],tags:["server","request server","testing"]},l=void 0,u={unversionedId:"server/request-server/testing",id:"server/request-server/testing",title:"Request Server - Testing",description:"Integration testing",source:"@site/docs/03_server/03_request-server/06_testing.md",sourceDirName:"03_server/03_request-server",slug:"/server/request-server/testing",permalink:"/next/server/request-server/testing",draft:!1,tags:[{label:"server",permalink:"/next/tags/server"},{label:"request server",permalink:"/next/tags/request-server"},{label:"testing",permalink:"/next/tags/testing"}],version:"current",sidebarPosition:6,frontMatter:{title:"Request Server - Testing",sidebar_label:"Testing",id:"testing",keywords:["server","request server","testing"],tags:["server","request server","testing"]},sidebar:"serverModulesSidebar",previous:{title:"Configuring runtime",permalink:"/next/server/request-server/configuring-runtime"},next:{title:"Introduction",permalink:"/next/server/event-handler/introduction"}},p={},c=[{value:"Integration testing",id:"integration-testing",level:2},{value:"Standard Request Servers",id:"standard-request-servers",level:3},{value:"Custom Request Servers",id:"custom-request-servers",level:3},{value:"Manual testing",id:"manual-testing",level:2},{value:"Testing with Console",id:"testing-with-console",level:3},{value:"Testing with an API client",id:"testing-with-an-api-client",level:3}],h={toc:c};function d(e){var t=e.components,i=(0,r.Z)(e,o);return(0,a.kt)("wrapper",(0,n.Z)({},h,i,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"integration-testing"},"Integration testing"),(0,a.kt)("p",null,"It is good practice to test your Request Servers. This is the best way to prevent any unexpected side effects of changes to your application over time."),(0,a.kt)("p",null,"The Genesis platform provides the ",(0,a.kt)("inlineCode",{parentName:"p"},"AbstractGenesisTestSupport")," abstract class that enables end-to-end testing of specific areas of your application. In this case, we want to ensure that we have a database, seeded with information, and that our Request Server configuration is used to create our Request Server. We also need to add the required packages and genesis home. "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'class ReqRepTests : AbstractGenesisTestSupport<Reply<*>>(\n    GenesisTestConfig {\n        addPackageName("global.genesis.requestreply.pal")\n        genesisHome = "/GenesisHome/"\n        scriptFileName = "your-application-reqrep.kts"\n        initialDataFile = "seed-data.csv"\n    }\n) {\n    ...\n}\n')),(0,a.kt)("p",null,"For more information about ",(0,a.kt)("inlineCode",{parentName:"p"},"AbstractGenesisTestSupport"),", see the ",(0,a.kt)("a",{parentName:"p",href:"/operations/testing/integration-testing"},"testing documentation"),"."),(0,a.kt)("p",null,"Once you have set up your configuration, we can start writing tests against our Request Server. Your tests will look a little different, depending on if you are using the standard approach to Request Servers or using ",(0,a.kt)("a",{parentName:"p",href:"/server/request-server/advanced/#custom-request-servers"},"custom Request Servers"),"."),(0,a.kt)("h3",{id:"standard-request-servers"},"Standard Request Servers"),(0,a.kt)("p",null,"Let's run a very simple example.\nCopy the following into a csv file and save as ",(0,a.kt)("inlineCode",{parentName:"p"},"seed-data.csv")," in the test Resources folder."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-text"},"#COUNTERPARTY\nCOUNTERPARTY_ID,COUNTERPARTY_NAME\ntestID 1,TestName 1\ntestID 2,TestName 2\n")),(0,a.kt)("p",null,"We shall send a message to our Genesis application, pointing at the correct Request Server (making sure to add the ",(0,a.kt)("em",{parentName:"p"},"REQ_")," prefix) and wait for the response.\nThe Genesis platform uses Kotlin coroutines which gives us a degree of non-blocking asynchronous computation. For this reason, we must wrap our tests in a ",(0,a.kt)("inlineCode",{parentName:"p"},"runBlocking")," coroutine scope as seen below."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'class ReqrepTest : AbstractGenesisTestSupport<GenesisSet>(\n    GenesisTestConfig {\n        addPackageName("global.genesis.requestreply.pal")\n        genesisHome = "/GenesisHome/"\n        scriptFileName = "positions-app-tutorial-reqrep.kts"\n        initialDataFile = "seed-data.csv"\n        parser = { it }\n    }\n) {\n\n    @Test\n    fun `can get all counterparty`() = runBlocking {\n        val request = GenesisSet.genesisSet {\n            MessageType.MESSAGE_TYPE with "REQ_COUNTERPARTY"\n        }\n        val counterparties = sendMessageAsync(request).getArray<GenesisSet>("REPLY")\n        assertNotNull(counterparties)\n        assertEquals(2, counterparties.size)\n    }\n}\n\n')),(0,a.kt)("p",null,"In the above example, we are asserting that there are five rows within the response from our Request Server. This is based on the two rows of data that we have in ",(0,a.kt)("inlineCode",{parentName:"p"},"seed-data.csv")," declared earlier."),(0,a.kt)("h3",{id:"custom-request-servers"},"Custom Request Servers"),(0,a.kt)("p",null,"For custom Request Servers, we must declare a workflow object that matches the custom Request Server that we have declared. This should match the same input and output types for the custom Request Server."),(0,a.kt)("p",null,"Given a custom Request Server that takes an input of type ",(0,a.kt)("inlineCode",{parentName:"p"},"Hello")," and returns type ",(0,a.kt)("inlineCode",{parentName:"p"},"World"),", we pass the same types into the requestReplyWorkflow. We can optionally pass the name of the Request Server to the builder."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'object HelloWorldFlow : RequestReplyWorkflow<Hello, World> by requestReplyWorkflowBuilder("HELLO_WORLD")\n\n@Test\nfun `can get hello world`() = runBlocking {\n    val reply = sendRequest(HelloWorldFlow, Hello("Peter")).first()\n\n    assert(reply.message == "Hello Peter")\n}\n')),(0,a.kt)("p",null,"If you want to reuse a workflow with the same input and output types, you can use the unary plus overload to change the name of the Request Server being pointed to. In the  example below, we reuse ",(0,a.kt)("inlineCode",{parentName:"p"},"HelloWorldFlow"),' and change the Request Server to "HELLO_WORLD_CAPS", a variant of the same Request Server which returns a string in all caps.'),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'@Test\nfun `can get hello world`() = runBlocking {\n    val reply = sendRequest(HelloWorldFlow + "HELLO_WORLD_CAPS", Hello("Peter")).first()\n\n    assert(reply.message == "HELLO PETER")\n}\n')),(0,a.kt)("h2",{id:"manual-testing"},"Manual testing"),(0,a.kt)("h3",{id:"testing-with-console"},"Testing with Console"),(0,a.kt)("p",null,"If you use Genesis Console, this gives you a simple way of testing components."),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"In your browser, go to ",(0,a.kt)("a",{parentName:"li",href:"http://genesislcap.com/console/console-next2/"},"http://genesislcap.com/console/console-next2/"),"."),(0,a.kt)("li",{parentName:"ol"},"Enter the IP address of your server. If you get a blank page without any response, then this is probably because you don't have ",(0,a.kt)("a",{parentName:"li",href:"/operations/server-setup/config-management/#nginx-configuration"},"NGINX configured"),"."),(0,a.kt)("li",{parentName:"ol"},"Log in with your user name and password. This starts Genesis Console, and you will see a list of tabs along the top of the screen."),(0,a.kt)("li",{parentName:"ol"},"Click on the ",(0,a.kt)("strong",{parentName:"li"},"RESOURCES")," tab."),(0,a.kt)("li",{parentName:"ol"},"Filter the ",(0,a.kt)("strong",{parentName:"li"},"Resource type")," to show only Request Servers. Once you click into your Request Server, you will see the current response from the Request Server and any input fields that you have defined. You can change the inputs and verify that the correct behaviour is being seen. Make sure that your database has some data for you to search through.")),(0,a.kt)("p",null,(0,a.kt)("img",{src:s(74075).Z,width:"1458",height:"686"})),(0,a.kt)("p",null,"For more detailed information about using Genesis Console for manual testing, head over to the ",(0,a.kt)("a",{parentName:"p",href:"/server/request-server/testing"},"testing documetation"),"."),(0,a.kt)("h3",{id:"testing-with-an-api-client"},"Testing with an API client"),(0,a.kt)("p",null,"An API client is useful way of testing components. As a client, it is effectively a front end seeking information from the server."),(0,a.kt)("p",null,"The API client enables you to create calls to the resources in your server - Data Servers, Request Servers and Event Handlers. Then you can just click to run a call and see what response you get."),(0,a.kt)("p",null,"Before you can make any calls on these resources, you will have to permission yourself by obtaining a SESSION_AUTH_TOKEN. The details of how to do this are on our separate ",(0,a.kt)("a",{parentName:"p",href:"/operations/testing/component-testing/#using-an-api-client"},"Testing")," page."),(0,a.kt)("p",null,"Once you have the SESSION_AUTH_TOKEN, keep a copy that you can paste into each request as you make your test call."),(0,a.kt)("p",null,"In the example below, we are using Insomnia as the client API."),(0,a.kt)("p",null,(0,a.kt)("img",{src:s(77011).Z,width:"1312",height:"611"})),(0,a.kt)("p",null,"There is no need for any information in the body, as this is a ",(0,a.kt)("strong",{parentName:"p"},"GET")," request."),(0,a.kt)("p",null,"In the header, you need to supply:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"a SOURCE_REF (always), which identifies you; you can use any string value that suits you"),(0,a.kt)("li",{parentName:"ul"},"the SESSION_AUTH_TOKEN that permissions you to access the server")),(0,a.kt)("p",null,"In front of the url, this has been set to a ",(0,a.kt)("strong",{parentName:"p"},"GET")," call."),(0,a.kt)("p",null,"The url consists of:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"the address or hostname of the server"),(0,a.kt)("li",{parentName:"ul"},"if necessary, some extra routing; in this case ",(0,a.kt)("strong",{parentName:"li"},"sm")," uses a proxy to access the server"),(0,a.kt)("li",{parentName:"ul"},"the name of the request server, preceded by ",(0,a.kt)("strong",{parentName:"li"},"REQ_"))),(0,a.kt)("p",null,"When you have this in place, click on ",(0,a.kt)("strong",{parentName:"p"},"Send")," to make the call. You can see that the fields for the instruments have been returned on the right of the screen."))}d.isMDXComponent=!0},74075:function(e,t,s){t.Z=s.p+"assets/images/test-console-rs-success-64fb0012ebde12b3b15b3a37b5b32a81.png"},77011:function(e,t,s){t.Z=s.p+"assets/images/test-rs-instrument-success-a2421a0c8a30638ad30e558bcfd72ee4.png"}}]);