"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[41865],{47476:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return r},metadata:function(){return p},toc:function(){return u}});var a=n(87462),i=n(63366),o=(n(67294),n(3905)),l=(n(61839),["components"]),r={title:"Go to the next level - Camel integrations",sidebar_label:"Camel integrations",id:"camel",keywords:["getting started","quick start","next level","apache camel","integration"],tags:["getting started","quick start","next level","apache camel","integration"]},s=void 0,p={unversionedId:"getting-started/go-to-the-next-level/camel",id:"version-2022.3/getting-started/go-to-the-next-level/camel",title:"Go to the next level - Camel integrations",description:"The Genesis low-code platform supports the use of Apache Camel in order to integrate with external systems, using its plethora of components.",source:"@site/versioned_docs/version-2022.3/01_getting-started/03_go-to-the-next-level/16_camel-integrations.md",sourceDirName:"01_getting-started/03_go-to-the-next-level",slug:"/getting-started/go-to-the-next-level/camel",permalink:"/getting-started/go-to-the-next-level/camel",draft:!1,tags:[{label:"getting started",permalink:"/tags/getting-started"},{label:"quick start",permalink:"/tags/quick-start"},{label:"next level",permalink:"/tags/next-level"},{label:"apache camel",permalink:"/tags/apache-camel"},{label:"integration",permalink:"/tags/integration"}],version:"2022.3",sidebarPosition:16,frontMatter:{title:"Go to the next level - Camel integrations",sidebar_label:"Camel integrations",id:"camel",keywords:["getting started","quick start","next level","apache camel","integration"],tags:["getting started","quick start","next level","apache camel","integration"]},sidebar:"learningSidebar",previous:{title:"Micro-frontends",permalink:"/getting-started/go-to-the-next-level/micro-frontends"},next:{title:"Run the application (WSL/CentOS)",permalink:"/getting-started/go-to-the-next-level/run-the-application-wsl"}},c={},u=[{value:"Section objectives",id:"section-objectives",level:2},{value:"Configure Netty API in Camel",id:"configure-netty-api-in-camel",level:2},{value:"Configure the runtime dependencies",id:"configure-the-runtime-dependencies",level:2},{value:"Configure the runtime",id:"configure-the-runtime",level:2}],g={toc:u};function m(e){var t=e.components,n=(0,i.Z)(e,l);return(0,o.kt)("wrapper",(0,a.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The Genesis low-code platform supports the use of ",(0,o.kt)("a",{parentName:"p",href:"https://camel.apache.org/"},"Apache Camel")," in order to integrate with external systems, using its plethora of ",(0,o.kt)("a",{parentName:"p",href:"https://camel.apache.org/components/3.16.x/index.html"},"components"),"."),(0,o.kt)("p",null,"Genesis makes this easy to configure and set up, allowing new processors to be defined and used within GPAL."),(0,o.kt)("p",null,"Should you wish to ingest data from a file or database, it is worth first checking out ",(0,o.kt)("a",{parentName:"p",href:"/server/integration/data-pipeline/introduction/"},"Genesis Data Pipelines"),", which offers a higher-level ingestion workflow than the Apache Camel DSL."),(0,o.kt)("h2",{id:"section-objectives"},"Section objectives"),(0,o.kt)("p",null,"The goal of this section is to:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"define and configure a Netty REST API via Camel"),(0,o.kt)("li",{parentName:"ul"},"package dependencies into our application distribution")),(0,o.kt)("h2",{id:"configure-netty-api-in-camel"},"Configure Netty API in Camel"),(0,o.kt)("p",null,"To work with the Camel GPAL, we must first add the dependency ",(0,o.kt)("inlineCode",{parentName:"p"},"genesis-pal-camel")," to your ",(0,o.kt)("strong",{parentName:"p"},"position-app-tutorial-script-config")," module. This ensures that you are able to use the camel functionality within your scripts. Ensure that Gradle imports the new dependency."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'api("global.genesis:genesis-pal-camel")\n')),(0,o.kt)("p",null,"Now we can create a new file ",(0,o.kt)("strong",{parentName:"p"},"positions-app-tutorial-camel.kts")," with the following:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'camel {\n    routeHandler {\n        from("netty-http:http://0.0.0.0:8080/foo")\n            .transform()\n            .constant("Hello World")\n    }\n}\n')),(0,o.kt)("p",null,'In the above script, we define an Apache Camel route using the netty-http component. This opens a resource on localhost:8080/foo. Finally, we return the "Hello World" string to the caller.'),(0,o.kt)("h2",{id:"configure-the-runtime-dependencies"},"Configure the runtime dependencies"),(0,o.kt)("p",null,"For this to work, we must ensure that we have ",(0,o.kt)("inlineCode",{parentName:"p"},"camel-netty-http")," on the classpath at runtime. To do this, we create a new module in the project called ",(0,o.kt)("strong",{parentName:"p"},"positions-app-tutorial-camel-libs")," and configure the ",(0,o.kt)("strong",{parentName:"p"},"build.gradle.kts")," within this new module to include the Camel dependency:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'dependencies {\n    api("org.apache.camel:camel-netty-http")\n}\n\ndescription = "positions-app-tutorial-camel-libs"\n')),(0,o.kt)("p",null,"We then need to bring this new module into the project's ",(0,o.kt)("strong",{parentName:"p"},"settings.gradle.kts")," by appending the following:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'include("positions-app-tutorial-camel-libs")\n')),(0,o.kt)("p",null,"And finally include the new module as a dependency on the ",(0,o.kt)("strong",{parentName:"p"},"positions-app-tutorial-distributions")," module by adding it to the ",(0,o.kt)("strong",{parentName:"p"},"build.gradle.kts")," within this module."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'implementation(project(":positions-app-tutorial-camel-libs"))\n')),(0,o.kt)("p",null,"We should now have the Camel dependencies on the classpath at runtime. Next, we need to configure the runtime itself."),(0,o.kt)("h2",{id:"configure-the-runtime"},"Configure the runtime"),(0,o.kt)("p",null,"Ensure that you add the following config to your ",(0,o.kt)("strong",{parentName:"p"},"-processes.xml")," and ",(0,o.kt)("strong",{parentName:"p"},"-service-definitions.xml")," files:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-xml"},'<process name="POSITIONS_APP_TUTORIAL_CAMEL">\n    <groupId>POSITIONS_APP_TUTORIAL</groupId>\n    <start>true</start>\n    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>\n    <module>genesis-pal-camel</module>\n    <package>global.genesis.camel.pal</package>\n    <script>positions-app-tutorial-camel.kts<\/script>\n    <description>Camel integrations</description>\n    <classpath>positions-app-tutorial-camel-libs*.jar</classpath>\n    <language>pal</language>\n    <loggingLevel>TRACE,DATADUMP_ON</loggingLevel>\n</process>\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-xml"},'<service host="localhost" name="POSITIONS_APP_TUTORIAL_CAMEL" port="11006"/>\n')),(0,o.kt)("p",null,"We are now ready to deploy the changes. Run ",(0,o.kt)("inlineCode",{parentName:"p"},"assemble")," and then ",(0,o.kt)("inlineCode",{parentName:"p"},"deploy-genesisproduct-positions-app-tutorial"),"."),(0,o.kt)("p",null,"To test that our Camel route is correctly running, try running a CURL on the API we have started"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"curl http://localhost:8080/foo\n")),(0,o.kt)("p",null,'You should now see "Hello World" returned.'),(0,o.kt)("p",null,"There are a countless number of choices when it comes to ",(0,o.kt)("a",{parentName:"p",href:"https://camel.apache.org/components/3.16.x/index.html"},"Camel components"),". Take a look at the list to see if there is something that works with your own use cases."))}m.isMDXComponent=!0}}]);