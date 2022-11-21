"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[16722],{53431:function(e,a,n){n.r(a),n.d(a,{assets:function(){return p},contentTitle:function(){return s},default:function(){return c},frontMatter:function(){return o},metadata:function(){return d},toc:function(){return m}});var t=n(87462),i=n(63366),l=(n(67294),n(3905)),r=(n(61839),["components"]),o={title:"Event Handler - Basics",sidebar_label:"Basics",id:"basics",keywords:["server","event handler","basics"],tags:["server","event handler","basics"]},s=void 0,d={unversionedId:"server/event-handler/basics",id:"server/event-handler/basics",title:"Event Handler - Basics",description:"Let's make things really simple.",source:"@site/docs/03_server/04_event-handler/02_basics.md",sourceDirName:"03_server/04_event-handler",slug:"/server/event-handler/basics",permalink:"/next/server/event-handler/basics",draft:!1,tags:[{label:"server",permalink:"/next/tags/server"},{label:"event handler",permalink:"/next/tags/event-handler"},{label:"basics",permalink:"/next/tags/basics"}],version:"current",sidebarPosition:2,frontMatter:{title:"Event Handler - Basics",sidebar_label:"Basics",id:"basics",keywords:["server","event handler","basics"],tags:["server","event handler","basics"]},sidebar:"serverModulesSidebar",previous:{title:"Introduction",permalink:"/next/server/event-handler/introduction"},next:{title:"Advanced",permalink:"/next/server/event-handler/advanced"}},p={},m=[{value:"A simple example of an Event Handler",id:"a-simple-example-of-an-event-handler",level:2},{value:"Adding a name",id:"adding-a-name",level:2},{value:"Adding validation",id:"adding-validation",level:2},{value:"Returning a value",id:"returning-a-value",level:2},{value:"Default reply types",id:"default-reply-types",level:3},{value:"Transactional Event Handlers (ACID)",id:"transactional-event-handlers-acid",level:2},{value:"Processing onValidate and onCommit",id:"processing-onvalidate-and-oncommit",level:2},{value:"validate = true",id:"validate--true",level:3},{value:"validate = false",id:"validate--false",level:3},{value:"More information about onValidate",id:"more-information-about-onvalidate",level:2},{value:"Context Event Handlers",id:"context-event-handlers",level:3}],u={toc:m};function c(e){var a=e.components,o=(0,i.Z)(e,r);return(0,l.kt)("wrapper",(0,t.Z)({},u,o,{components:a,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Let's make things really simple."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"The Event Handler is the component that enables the application to write to the database."),(0,l.kt)("li",{parentName:"ul"},"You define your application's Event Handler in a Kotlin script file (",(0,l.kt)("strong",{parentName:"li"},".kts"),")."),(0,l.kt)("li",{parentName:"ul"},"In this file, you define specific ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," codeblocks, each of which has full access to the database."),(0,l.kt)("li",{parentName:"ul"},"Each ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," can be invoked from the front end, from other ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," codeblocks, or from custom components in the application."),(0,l.kt)("li",{parentName:"ul"},"If you use AppGen to build from your dictionary, then a basic ",(0,l.kt)("strong",{parentName:"li"},".kts")," file will be built automatically for you, creating basic insert, modify and delete ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," code blocks for all the tables and views in your data model. You can edit this file to customise the component."),(0,l.kt)("li",{parentName:"ul"},"Otherwise, you can build your ",(0,l.kt)("strong",{parentName:"li"},".kts")," by defining each ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," codeblock from scratch."),(0,l.kt)("li",{parentName:"ul"},"For complex Event Handlers, you might prefer to use the ",(0,l.kt)("a",{parentName:"li",href:"/database/api-reference/event-handler-api/"},"Event Handler API")," to implement a set of classes.")),(0,l.kt)("p",null,"On this page, we'll take you through the basics of creating an Event Handler in simple stages:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#a-simple-example-of-an-event-handler"},"a very simple example file")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#adding-a-name"},"giving each ",(0,l.kt)("inlineCode",{parentName:"a"},"eventHandler")," codeblock a name")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#adding-validation"},"adding validation")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#returning-a-value"},"returning a value")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#transactional-event-handlers-acid"},"transactional ",(0,l.kt)("inlineCode",{parentName:"a"},"eventHandler")," codeblocks")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#processing-onvalidate-and-oncommit"},"the process flow for ",(0,l.kt)("inlineCode",{parentName:"a"},"eventHandler")," codeblocks")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#more-information-about-onvalidate"},"more information on validation")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#context-event-handlers"},"context Event Handlers"))),(0,l.kt)("p",null,"By the end of that, you'll have some very useful knowledge, and you'll be ready to move on to the ",(0,l.kt)("a",{parentName:"p",href:"/server/event-handler/advanced/"},"advanced")," page."),(0,l.kt)("p",null,"It is possible to define an Event Handler in Java, and we have included Java ",(0,l.kt)("a",{parentName:"p",href:"/server/event-handler/java-event-handlers/"},"examples"),". However, we strongly advise you to create your Event Handler using Kotlin; it is a considerably more efficient method."),(0,l.kt)("h2",{id:"a-simple-example-of-an-event-handler"},"A simple example of an Event Handler"),(0,l.kt)("p",null,"Here is a simple example of an Event Handler file. It defines a single ",(0,l.kt)("inlineCode",{parentName:"p"},"eventHandler"),", which inserts a counterparty into the database, using the ",(0,l.kt)("a",{parentName:"p",href:"/database/database-interface/entity-db/"},"entityDb"),"."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"First, note that there is an ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," statement for containing all your ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler"),"codeblocks. This is necessary whether the file contains one ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler"),", or hundreds."),(0,l.kt)("li",{parentName:"ul"},"The single ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," is of type ",(0,l.kt)("inlineCode",{parentName:"li"},"<Counterparty>"),", which has been created in advance for the COUNTERPARTY table. It defines a single ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," of type ",(0,l.kt)("inlineCode",{parentName:"li"},"<Counterparty>"),"."),(0,l.kt)("li",{parentName:"ul"},"The ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," inserts a counterparty into the database, using the ",(0,l.kt)("a",{parentName:"li",href:"/database/database-interface/entity-db/"},"entityDb"),".")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"    eventHandler {\n        eventHandler<Counterparty> {\n            onCommit { event ->\n                val counterparty = event.details\n                entityDb.insert(counterparty)\n                ack()\n            }\n        }\n    }\n")),(0,l.kt)("h2",{id:"adding-a-name"},"Adding a name"),(0,l.kt)("p",null,"Every ",(0,l.kt)("inlineCode",{parentName:"p"},"eventHandler")," in your ",(0,l.kt)("strong",{parentName:"p"},".kts")," must have a unique name. If you do not provide one, it will be allocated automatically. In the previous example, the ",(0,l.kt)("inlineCode",{parentName:"p"},"eventHandler")," will automatically be named EVENT_COUNTERPARTY."),(0,l.kt)("p",null,"It is good practice to provide your own name for each ",(0,l.kt)("inlineCode",{parentName:"p"},"eventHandler"),". For example, if you have insert and modify codeblocks for the same table and you don't name them, then the platform will probably generate identical names for both - which will give you a problem.\nNote that the prefix ",(0,l.kt)("inlineCode",{parentName:"p"},"EVENT_")," is automatically added to the name that you specify."),(0,l.kt)("p",null,"If you do not define a name, a default name will be allocated automatically. The default name will be ",(0,l.kt)("inlineCode",{parentName:"p"},"EVENT_<message type name>"),". So, for a message type declared as ",(0,l.kt)("inlineCode",{parentName:"p"},"OrderInsert"),", declaring an Event Handler block as ",(0,l.kt)("inlineCode",{parentName:"p"},"eventHandler<OrderInsert>{}")," automatically registers the event with the name ",(0,l.kt)("inlineCode",{parentName:"p"},"EVENT_ORDER_INSERT"),"."),(0,l.kt)("p",null,"So, below, we modify our previous example by defining the name of the ",(0,l.kt)("inlineCode",{parentName:"p"},"eventHandler"),": COUNTERPARTY_INSERT. This will automatically become EVENT_COUNTERPARTY_INSERT."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'eventHandler<Counterparty>(name = "COUNTERPARTY_INSERT") {\n    onCommit { event ->\n        val counterparty = event.details\n        entityDb.insert(counterparty)\n        ack()\n    }\n}\n')),(0,l.kt)("h2",{id:"adding-validation"},"Adding validation"),(0,l.kt)("p",null,"So far, we have provided an ",(0,l.kt)("inlineCode",{parentName:"p"},"onCommit"),"block in our ",(0,l.kt)("inlineCode",{parentName:"p"},"eventHandler"),". This is where the active instructions are; these are usually database changes."),(0,l.kt)("p",null,"If you want to provide some validation before the action, you need to have an ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," block before the ",(0,l.kt)("inlineCode",{parentName:"p"},"onCommit"),". The last value of the code block must always be the return message type."),(0,l.kt)("p",null,"In this case, we have used the kotlin ",(0,l.kt)("a",{parentName:"p",href:"https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html"},"require")," function to check that the ",(0,l.kt)("inlineCode",{parentName:"p"},"counterparty")," field is not empty."),(0,l.kt)("p",null,"The ",(0,l.kt)("inlineCode",{parentName:"p"},"onCommit")," block will only be executed if the ",(0,l.kt)("inlineCode",{parentName:"p"},"counterparty")," field is not null."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'    eventHandler<Counterparty>(name = "COUNTERPARTY_INSERT") {\n        onValidate { event ->\n            val counterparty = event.details\n            require(counterparty.name != null) { "Counterparty should have a name" }\n            ack()\n        }\n        onCommit { event ->\n            val counterparty = event.details\n            entityDb.insert(counterparty)\n            ack()\n        }\n    }\n')),(0,l.kt)("h2",{id:"returning-a-value"},"Returning a value"),(0,l.kt)("p",null,"The ",(0,l.kt)("inlineCode",{parentName:"p"},"onCommit")," block must always return either an ",(0,l.kt)("inlineCode",{parentName:"p"},"ack()")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"nack(...)"),". In the previous examples, it has always been an ",(0,l.kt)("inlineCode",{parentName:"p"},"ack()"),"."),(0,l.kt)("p",null,"Now consider a scenario where you might want to return a ",(0,l.kt)("inlineCode",{parentName:"p"},"nack(...)"),". In this case, there is no ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," block."),(0,l.kt)("p",null,"In the ",(0,l.kt)("inlineCode",{parentName:"p"},"onCommit")," block:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"if the counterparty field is empty, the ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," returns a ",(0,l.kt)("inlineCode",{parentName:"li"},"nack"),", along with a suitable message."),(0,l.kt)("li",{parentName:"ul"},"if the counterparty field has content, then the ",(0,l.kt)("inlineCode",{parentName:"li"},"eventHandler")," returns an ",(0,l.kt)("inlineCode",{parentName:"li"},"ack"))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'eventHandler<Counterparty>(name = "COUNTERPARTY_INSERT") {\n    onCommit { event ->\n        val counterparty = event.details\n        if (counterparty.name == null) {\n            nack("Counterparty should have a name")\n        } else {\n            entityDb.insert(counterparty)\n            ack()\n        }\n    }\n}\n')),(0,l.kt)("h3",{id:"default-reply-types"},"Default reply types"),(0,l.kt)("p",null,"So far, we have seen ",(0,l.kt)("inlineCode",{parentName:"p"},"ack")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"nack"),". There is a third type: ",(0,l.kt)("inlineCode",{parentName:"p"},"warningNack"),". Let's stop and look at the specifications for all three default reply types:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"ack"),": used to signify a successful result. ",(0,l.kt)("inlineCode",{parentName:"li"},"ack")," takes an optional parameter of ",(0,l.kt)("inlineCode",{parentName:"li"},"List<Map<String, Any>>"),". For example, ",(0,l.kt)("inlineCode",{parentName:"li"},'ack(listOf(mapOf("TRADE_ID", "1")))'),"."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"nack"),": used to signify an unsuccessful result. ",(0,l.kt)("inlineCode",{parentName:"li"},"nack")," accepts either a ",(0,l.kt)("inlineCode",{parentName:"li"},"String")," parameter or a ",(0,l.kt)("inlineCode",{parentName:"li"},"Throwable"),". For example, ",(0,l.kt)("inlineCode",{parentName:"li"},'nack("Error!")')," or ",(0,l.kt)("inlineCode",{parentName:"li"},"nack(myThrowable)"),"."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"warningNack"),": used to warn the client. ",(0,l.kt)("inlineCode",{parentName:"li"},"warningNack"),", like ",(0,l.kt)("inlineCode",{parentName:"li"},"nack"),", accepts either a ",(0,l.kt)("inlineCode",{parentName:"li"},"String")," parameter or a ",(0,l.kt)("inlineCode",{parentName:"li"},"Throwable"),". For example, ",(0,l.kt)("inlineCode",{parentName:"li"},'warningNack("Provided User alias $userAlias will override Username $username.")')," or ",(0,l.kt)("inlineCode",{parentName:"li"},"warningNack(myThrowable)"),".")),(0,l.kt)("h2",{id:"transactional-event-handlers-acid"},"Transactional Event Handlers (ACID)"),(0,l.kt)("p",null,"If you want your  ",(0,l.kt)("inlineCode",{parentName:"p"},"eventHandler")," to comply with ",(0,l.kt)("a",{parentName:"p",href:"/getting-started/glossary/glossary/#acid"},"ACID"),", you can declare it to be  ",(0,l.kt)("inlineCode",{parentName:"p"},"transactional = true"),". Any exception returned will result in a complete rollback of all parts of the ",(0,l.kt)("inlineCode",{parentName:"p"},"onCommit")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," (the transaction also covers read commands) blocks. While an exception will trigger a rollback, the transaction will commit if a ",(0,l.kt)("inlineCode",{parentName:"p"},"nack")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"ack")," is returned."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},"    eventHandler<Counterparty>(transactional = true) {\n        onCommit { event ->\n            val counterparty = event.details\n            entityDb.insert(counterparty)\n            ack()\n        }\n    }\n")),(0,l.kt)("p",null," Whether it is a database update or uploading a report to a third party. It will be called when an event message is received with ",(0,l.kt)("inlineCode",{parentName:"p"},"validate = false")," and has successfully passed the ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," block. The last value of the code block must always be the return message type."),(0,l.kt)("h2",{id:"processing-onvalidate-and-oncommit"},"Processing onValidate and onCommit"),(0,l.kt)("p",null,"The incoming message that triggers an Event Handler can have ",(0,l.kt)("inlineCode",{parentName:"p"},"validate")," set to ",(0,l.kt)("inlineCode",{parentName:"p"},"true")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"false"),". This controls whether the Event Handler simply performs some validation or it executes its complete set of processing. "),(0,l.kt)("h3",{id:"validate--true"},"validate = true"),(0,l.kt)("p",null,"The key thing about this setting is that it means that only the ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," block is executed, not the ",(0,l.kt)("inlineCode",{parentName:"p"},"onCommit")," block. Here is the precise process flow:"),(0,l.kt)("p",null,(0,l.kt)("img",{src:n(88915).Z,width:"235",height:"312"})),(0,l.kt)("h3",{id:"validate--false"},"validate = false"),(0,l.kt)("p",null,"With this setting, both the ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," codeblock and the ",(0,l.kt)("inlineCode",{parentName:"p"},"onCommit")," codeblock will be executed. Here is the precise process flow:"),(0,l.kt)("p",null,(0,l.kt)("img",{src:n(64625).Z,width:"281",height:"362"})),(0,l.kt)("h2",{id:"more-information-about-onvalidate"},"More information about onValidate"),(0,l.kt)("p",null,"As you will have seen above, an ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," codeblock will be executed whether the incoming message has ",(0,l.kt)("inlineCode",{parentName:"p"},"validate=true")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"validate=false"),".The ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," block is optional if you are using the default reply message type (",(0,l.kt)("inlineCode",{parentName:"p"},"EventReply"),") and will automatically be successful if not defined."),(0,l.kt)("p",null,"However, note that an ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," codeblock is mandatory when using custom reply message types; the script will not compile if there is no ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," codeblock. See the simple example below:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'    eventHandler<Company>(name = "COMPANY_INSERT") {\n        onValidate { event ->\n            val company = event.details\n            require(company.companyName != "MY_COMPANY") {\n            "We don\'t accept your company"\n            }\n        ack()\n        }\n        onCommit { event ->\n            val company = event.details\n            val result = entityDb.insert(company)\n            ack(listOf(mapOf("COMPANY_ID" to result.record.companyId)))\n        }\n    }\n')),(0,l.kt)("p",null,"Kotlin\u2019s ",(0,l.kt)("inlineCode",{parentName:"p"},"require")," method throws an exception with a message if the boolean expression is not what is expected, and the Event Handler automatically converts that exception into a corresponding ",(0,l.kt)("inlineCode",{parentName:"p"},"EventNack"),"."),(0,l.kt)("h3",{id:"context-event-handlers"},"Context Event Handlers"),(0,l.kt)("p",null,"In order to optimise database look-up operations, you might want to use data obtained by the ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," block inside your ",(0,l.kt)("inlineCode",{parentName:"p"},"onCommit")," block. To do this,\nuse context Event Handlers, as shown below:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-kotlin"},'    contextEventHandler<Company, String>(name = "CONTEXT_COMPANY_INSERT") {\n        onValidate {\n            val company = it.details\n            if(company.companyName == "MY_COMPANY") {\n                validationAck(validationContext = "Best company in the world")\n            } else {\n                validationAck()\n            }\n        }\n        onCommit { event, context ->\n            val parsedContext = context ?: "Missing context"\n            val company = event.details\n            val result = entityDb.insert(company)\n            ack(listOf(mapOf("VALUE" to parsedContext)))\n        }\n    }\n')),(0,l.kt)("p",null,"As the  example shows, there is an additional type defined for the context Event Handler. This is a ",(0,l.kt)("inlineCode",{parentName:"p"},"String"),". It gives you the option of returning a ",(0,l.kt)("inlineCode",{parentName:"p"},"String")," value from the ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," block (see ",(0,l.kt)("em",{parentName:"p"},"validationAck")," logic), which can then be captured it in the ",(0,l.kt)("inlineCode",{parentName:"p"},"onCommit")," block (see ",(0,l.kt)("em",{parentName:"p"},"context")," lambda parameter)."),(0,l.kt)("p",null,"Because the example creates a validation context, the function ",(0,l.kt)("inlineCode",{parentName:"p"},"validationAck()")," is used at the end of the ",(0,l.kt)("inlineCode",{parentName:"p"},"onValidate")," block, and not just ",(0,l.kt)("inlineCode",{parentName:"p"},"ack()"),"."))}c.isMDXComponent=!0},64625:function(e,a,n){a.Z=n.p+"assets/images/eh-validate-false-c4d70289bdfae8232f15994a33ccce3c.png"},88915:function(e,a){a.Z="data:image/png;base64,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"}}]);