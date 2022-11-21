"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[1917],{24160:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return s},default:function(){return k},frontMatter:function(){return r},metadata:function(){return p},toc:function(){return u}});var a=n(87462),o=n(63366),i=(n(67294),n(3905)),l=(n(61839),["components"]),r={title:"Create application",id:"create-application"},s="Create application",p={unversionedId:"fuse/quick-start/create-application",id:"version-2022.3/fuse/quick-start/create-application",title:"Create application",description:"To simplify getting started, GenX CLI tool can create  projects from a number of available seeds (application templates). We will use a seed tailored for Fuse in this guide.",source:"@site/versioned_docs/version-2022.3/00_fuse/02_quick-start/02_create_application.md",sourceDirName:"00_fuse/02_quick-start",slug:"/fuse/quick-start/create-application",permalink:"/fuse/quick-start/create-application",draft:!1,tags:[],version:"2022.3",sidebarPosition:2,frontMatter:{title:"Create application",id:"create-application"},sidebar:"fuseSidebar",previous:{title:"Introduction",permalink:"/fuse/quick-start/introduction"},next:{title:"Start application",permalink:"/fuse/quick-start/start-application"}},c={},u=[{value:"Expected Result",id:"expected-result",level:2},{value:"Using GenX CLI",id:"using-genx-cli",level:2},{value:"Choosing Project Type",id:"choosing-project-type",level:3},{value:"Configuration",id:"configuration",level:3},{value:"Package and environment settings",id:"package-and-environment-settings",level:3},{value:"Recap",id:"recap",level:2}],d={toc:u};function k(e){var t=e.components,n=(0,o.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"create-application"},"Create application"),(0,i.kt)("p",null,"To simplify getting started, ",(0,i.kt)("a",{parentName:"p",href:"/fuse/introduction/prerequisites/#genx-cli"},"GenX CLI")," tool can create  projects from a number of available seeds (application templates). We will use a seed tailored for Fuse in this guide."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"A project seed takes care of the initial file structure and dependencies, allowing you to focus on the task at hand.")),(0,i.kt)("h2",{id:"expected-result"},"Expected Result"),(0,i.kt)("p",null,"By the end of this step, we should have:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"created and configured a new project")),(0,i.kt)("p",null,"This will allow us to start building application functionality."),(0,i.kt)("h2",{id:"using-genx-cli"},"Using GenX CLI"),(0,i.kt)("admonition",{type:"important"},(0,i.kt)("blockquote",{parentName:"admonition"},(0,i.kt)("p",{parentName:"blockquote"},"Install the ",(0,i.kt)("a",{parentName:"p",href:"/fuse/introduction/prerequisites/#genx-cli"},"GenX CLI")," before proceeding with the following steps."))),(0,i.kt)("p",null,"You are now ready to generate a new project."),(0,i.kt)("h3",{id:"choosing-project-type"},"Choosing Project Type"),(0,i.kt)("p",null,"From the terminal, run:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"foundation-cli\n")),(0,i.kt)("p",null,"If this is the first time running the CLI tool, you'll need to provide Artifactory credentials. "),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"No credentials? See our ",(0,i.kt)("a",{parentName:"p",href:"/fuse/introduction/prerequisites/"},"Pre-requisites"))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"? Genesis Username example.username\n? Genesis Password **************\n\u221a Logged into Genesis\n")),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"We persist details to help speed things up, so this won't happen every time.")),(0,i.kt)("p",null,"Select ",(0,i.kt)("inlineCode",{parentName:"p"},"create fuse application"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"? Please select an option: (Use arrow keys)\n> create fuse application - Creates a unified low-code DSL application.\n  create workspace - Generates a local workspace to use for your Genesis based apps.\n  configure workspace - Configure a local workspace.\n  create application - Generates a local application.\n  configure application - Configure a local app.\n")),(0,i.kt)("h3",{id:"configuration"},"Configuration"),(0,i.kt)("p",null,"We now want to configure our project. There are a number of fields to fill in to help us get the best possible start."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"When possible answers are presented in grey text, the capitalised option is the default. You can just hit ",(0,i.kt)("strong",{parentName:"p"},"Enter")," to select it.\nFor example ",(0,i.kt)("inlineCode",{parentName:"p"},"y/N"),": default here is 'N' (No).")),(0,i.kt)("admonition",{type:"info"},(0,i.kt)("p",{parentName:"admonition"},"We will use ",(0,i.kt)("inlineCode",{parentName:"p"},"alpha")," in our examples from now on, but you are free to choose any name. ")),(0,i.kt)("p",null,"Let's choose the target directory and name for our project:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"? Create an app in current directory Yes\n? App name alpha\n")),(0,i.kt)("p",null,"Select the seed from which you'd like to create an application (select ",(0,i.kt)("inlineCode",{parentName:"p"},"Pre-release")," option if working with Docker):"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"? App seed (Use arrow keys)\n  Low-code Application\n// highlight-next-line\n> Low-code Application (Pre-release)\n")),(0,i.kt)("admonition",{type:"caution"},(0,i.kt)("p",{parentName:"admonition"},"If you have previously created an application with this name, you will be asked whether you want to overwrite it. Overwriting is not recommended - it's preferable to exit the wizard (",(0,i.kt)("inlineCode",{parentName:"p"},"Ctrl + C"),") and rename or remove the old application."),(0,i.kt)("pre",{parentName:"admonition"},(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"? Overwrite existing files (y/N)\n"))),(0,i.kt)("p",null,"Application is now created and dependencies are installed. Our expected output should be:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"\u2714 Create path alpha\n\u2714 Create directory alpha\n\u2714 Creating from seed 'Low-code Application'\n\u2139 Installing dependencies.\n\u2714 Install success.\n")),(0,i.kt)("h3",{id:"package-and-environment-settings"},"Package and environment settings"),(0,i.kt)("p",null,"We can now configure the NPM package scope (typically name of your organisation) and name (defaults to your chosen application name):"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"? NPM package scope (genesislcap)\n? NPM package name (alpha)\n")),(0,i.kt)("p",null,"You will then be able to choose whether to use Docker (highly recommended) or WSL/CentOS environment."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"Use Docker (Y/n)\n")),(0,i.kt)("p",null,"Next, you will be asked whether we want to configure a custom API host. Hit Enter unless you need to override the default."),(0,i.kt)("admonition",{type:"info"},(0,i.kt)("p",{parentName:"admonition"},"Web front end will attempt to connect to your local Genesis server by default. If you want to connect to a remote server instead, choose ",(0,i.kt)("inlineCode",{parentName:"p"},"Yes")," and specify a WebSocket URL.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"? (Optional) Override the default API Host URL (N/y)\n")),(0,i.kt)("p",null,"Continue with the remaining prompts:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"? Genesis Server version\n? Auth Server version\n? GPL version\n? Kotlin version\n? Group Id global.genesis\n? Application Version 1.0.0-SNAPSHOT\n")),(0,i.kt)("p",null,"Next, you will be able to set the login details:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"? User Name\n? Password\n")),(0,i.kt)("p",null,"At this point, project will be updated based on your answers. You should see the following shortly:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"\u2714 Configuring Seed\n\u2714 Writing environment variables\n\u2139 Application created successfully! \ud83c\udf89 Please open the application and follow the README to complete setup.\n")),(0,i.kt)("p",null,"Now open your chosen IDE (e.g. IntelliJ) and locate the newly created project."),(0,i.kt)("h2",{id:"recap"},"Recap"),(0,i.kt)("p",null,"Congratulations, the local project is now ready. You have:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"created a new Fuse project"),(0,i.kt)("li",{parentName:"ul"},"configured package, dependency and development environment settings")))}k.isMDXComponent=!0}}]);