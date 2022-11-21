"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[1381],{81939:function(t,e,a){a.r(e),a.d(e,{assets:function(){return p},contentTitle:function(){return s},default:function(){return g},frontMatter:function(){return r},metadata:function(){return d},toc:function(){return u}});var n=a(87462),i=a(63366),l=(a(67294),a(3905)),o=(a(61839),["components"]),r={title:"Go to the next level - Introduction",sidebar_label:"Introduction",id:"introduction",keywords:["getting started","quick start","next level","introduction"],tags:["getting started","quick start","next level","introduction"]},s=void 0,d={unversionedId:"getting-started/go-to-the-next-level/introduction",id:"getting-started/go-to-the-next-level/introduction",title:"Go to the next level - Introduction",description:"Now that you have completed the Quick Start and are comfortable with the basics, we'll build an advanced application that will demonstrate more of the Genesis platform features.",source:"@site/docs/01_getting-started/03_go-to-the-next-level/01_introduction.md",sourceDirName:"01_getting-started/03_go-to-the-next-level",slug:"/getting-started/go-to-the-next-level/introduction",permalink:"/next/getting-started/go-to-the-next-level/introduction",draft:!1,tags:[{label:"getting started",permalink:"/next/tags/getting-started"},{label:"quick start",permalink:"/next/tags/quick-start"},{label:"next level",permalink:"/next/tags/next-level"},{label:"introduction",permalink:"/next/tags/introduction"}],version:"current",sidebarPosition:1,frontMatter:{title:"Go to the next level - Introduction",sidebar_label:"Introduction",id:"introduction",keywords:["getting started","quick start","next level","introduction"],tags:["getting started","quick start","next level","introduction"]},sidebar:"learningSidebar",previous:{title:"Run the application (Docker)",permalink:"/next/getting-started/quick-start/run-the-application-docker"},next:{title:"Fields, tables and views",permalink:"/next/getting-started/go-to-the-next-level/data-model"}},p={},u=[{value:"What you will build",id:"what-you-will-build",level:2},{value:"Create a new project",id:"create-a-new-project",level:2}],c={toc:u};function g(t){var e=t.components,a=(0,i.Z)(t,o);return(0,l.kt)("wrapper",(0,n.Z)({},c,a,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Now that you have completed the ",(0,l.kt)("a",{parentName:"p",href:"/getting-started/quick-start/"},"Quick Start")," and are comfortable with the basics, we'll build an advanced application that will demonstrate more of the Genesis platform features."),(0,l.kt)("h2",{id:"what-you-will-build"},"What you will build"),(0,l.kt)("p",null,"We want to build a real-time ",(0,l.kt)("a",{parentName:"p",href:"https://www.investopedia.com/terms/p/position.asp"},"positions")," application, where trades can be entered, and will be aggregated to maintain positions."),(0,l.kt)("p",null,"In this tutorial we will build a positions trading application. This is a typical application for the capital markets and highlights some of the typical use cases and features of the Genesis low-code platform.\nIn the tutorial, you will create a more sophisticated form and grid for adding information than those given in the ",(0,l.kt)("a",{parentName:"p",href:"/getting-started/learn-the-basics/what-can-i-build/build-intro/"},"Learn the basics")," section."),(0,l.kt)("p",null,"The application will make use of the following platform features:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/data-model/"},"Data Model")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/events/#data-server"},"Data Server")," and ",(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/events/#event-handler"},"Event Handlers")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/data-grid/"},"Data Grid")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/calculated-data/"},"Computed values")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/consolidators/"},"Consolidators")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/audit/"},"Auditable tables")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/state-management/"},"State management")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/audit/"},"Auditable tables")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/"},"Genesis Evaluator rules")," "),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/getting-started/go-to-the-next-level/data-pipeline/"},"Data pipelines"))),(0,l.kt)("p",null,"We are going to call this example application ",(0,l.kt)("strong",{parentName:"p"},"positions-app-tutorial"),". You will see this reflected in the file names throughout."),(0,l.kt)("h2",{id:"create-a-new-project"},"Create a new project"),(0,l.kt)("p",null,"Using the GenX CLI tool, we want to generate a blank full-stack application project. Go to a folder where you want your project to reside, and run:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"npx genx\n")),(0,l.kt)("p",null,"Follow through the series of questions. For ",(0,l.kt)("inlineCode",{parentName:"p"},"App name")," enter ",(0,l.kt)("inlineCode",{parentName:"p"},"positions-app-tutorial")," and for ",(0,l.kt)("inlineCode",{parentName:"p"},"App seed")," enter ",(0,l.kt)("inlineCode",{parentName:"p"},"Quick Start Application"),"."),(0,l.kt)("p",null,"If this is the first time you are using the GenX CLI tool, check the ",(0,l.kt)("a",{parentName:"p",href:"/getting-started/quick-start/create-a-new-project/"},"Quick Start")," guide first."),(0,l.kt)("admonition",{type:"info"},(0,l.kt)("p",{parentName:"admonition"},"This project is not a direct copy of the positions app but will contain most of its functionality.")))}g.isMDXComponent=!0}}]);