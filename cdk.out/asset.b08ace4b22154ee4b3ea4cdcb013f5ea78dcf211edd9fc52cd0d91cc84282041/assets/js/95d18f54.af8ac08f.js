"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[56475],{9623:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return o},default:function(){return m},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return d}});var a=n(87462),s=n(63366),r=(n(67294),n(3905)),i=(n(61839),["components"]),l={title:"Prerequisites - Manual installation",sidebar_label:"Manual installation",id:"manual-installation",keywords:["getting started","quick start","prerequisites","manual installation"],tags:["getting started","quick start","prerequisites","manual installation"]},o=void 0,u={unversionedId:"getting-started/prerequisites/manual-installation",id:"getting-started/prerequisites/manual-installation",title:"Prerequisites - Manual installation",description:"To install the Genesis low-code platform on your server, go through the following steps.",source:"@site/docs/01_getting-started/04_prerequisites/05_manual-installation.md",sourceDirName:"01_getting-started/04_prerequisites",slug:"/getting-started/prerequisites/manual-installation",permalink:"/next/getting-started/prerequisites/manual-installation",draft:!1,tags:[{label:"getting started",permalink:"/next/tags/getting-started"},{label:"quick start",permalink:"/next/tags/quick-start"},{label:"prerequisites",permalink:"/next/tags/prerequisites"},{label:"manual installation",permalink:"/next/tags/manual-installation"}],version:"current",sidebarPosition:5,frontMatter:{title:"Prerequisites - Manual installation",sidebar_label:"Manual installation",id:"manual-installation",keywords:["getting started","quick start","prerequisites","manual installation"],tags:["getting started","quick start","prerequisites","manual installation"]},sidebar:"learningSidebar",previous:{title:"Genx",permalink:"/next/getting-started/prerequisites/genx"},next:{title:"Quick start with Docker",permalink:"/next/getting-started/use-cases/faster_quick-start/"}},p={},d=[{value:"Installing from an rpm",id:"installing-from-an-rpm",level:2},{value:"1. Give the user account a name",id:"1-give-the-user-account-a-name",level:3},{value:"2. Install the rpm",id:"2-install-the-rpm",level:3},{value:"3. Update system definition",id:"3-update-system-definition",level:3},{value:"4. Run genesisInstall",id:"4-run-genesisinstall",level:3}],c={toc:d};function m(e){var t=e.components,l=(0,s.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},c,l,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"To install the Genesis low-code platform on your server, go through the following steps."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Make sure you have the ",(0,r.kt)("a",{parentName:"li",href:"/getting-started/quick-start/hardware-and-software"},"correct infrastructure for installing the platform"),"."),(0,r.kt)("li",{parentName:"ol"},"Install the Genesis platform.")),(0,r.kt)("p",null,"That is it. Once you have an installed platform in the correct environment, you are ready to start developing. Let's look in more detail."),(0,r.kt)("h2",{id:"installing-from-an-rpm"},"Installing from an rpm"),(0,r.kt)("p",null,"You must start with a server with the operating system and relevant packages installed. Genesis supplies the rpm to simplify the installation. Everything you need is in the rpm, and nothing is downloaded when you install it.\nTo install the rpm, you need a privileged user account.\nIn our example, the rpm is called ",(0,r.kt)("strong",{parentName:"p"},"genesis-platform-6.0.1-1.x86_64.rpm"),"."),(0,r.kt)("h3",{id:"1-give-the-user-account-a-name"},"1. Give the user account a name"),(0,r.kt)("p",null,"By default, the installation creates an application user account called ",(0,r.kt)("strong",{parentName:"p"},"genesis"),". You can change this before you start by editing the file ",(0,r.kt)("strong",{parentName:"p"},"genesis_install.conf"),". For example, if you want to create a user account called ",(0,r.kt)("em",{parentName:"p"},"foxtrot"),", edit it as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'echo "genesis_user=foxtrot" >> /tmp/genesis_install.conf\n')),(0,r.kt)("p",null,"If you want to provide a group other than ",(0,r.kt)("strong",{parentName:"p"},"genesis"),", then you can pass this on to the installation by adding:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"echo \u201cgenesis_grp=charlie\u201d >> /tmp/genesis_install.conf\n")),(0,r.kt)("p",null,"The group (here, this is called ",(0,r.kt)("em",{parentName:"p"},"charlie"),") must already be in existence."),(0,r.kt)("p",null,"By default, genesis code is installed under ",(0,r.kt)("strong",{parentName:"p"},"/data"),". If you want to install to a different directory, run:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"echo \u201croot_dir=opt\u201d /tmp/genesis_install.conf\n")),(0,r.kt)("p",null,"The folder (here, this is called ",(0,r.kt)("em",{parentName:"p"},"opt"),") must already be in existence."),(0,r.kt)("h3",{id:"2-install-the-rpm"},"2. Install the rpm"),(0,r.kt)("p",null,"Now you can ",(0,r.kt)("inlineCode",{parentName:"p"},"sudo yum")," and install the rpm."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"sudo yum --nogpgcheck localinstall genesis-platform-6.0.1-1.x86.rpm\n")),(0,r.kt)("p",null,"This creates the user account and makes all the recommended security settings. Additionally, it creates the required directory structure and unpacks all the zipped files."),(0,r.kt)("p",null,"When the process has finished, you can go to the root directory and see the user that has been created (foxtrot, in our example)."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"Installed:\n   genesis-platform.x86_64 0:6.0.1-1\n\nComplete!\n[centos@genesisserv1 tmp]$ cd\n[centos@genesisserv1 ~]$ cd ..\n[centos@genesisserv1 home]$ ls\ncentos  foxtrot\n")),(0,r.kt)("p",null,"You can switch to that user and view the run directory for the newly installed platform, where you can find ",(0,r.kt)("strong",{parentName:"p"},"auth")," and ",(0,r.kt)("strong",{parentName:"p"},"genesis")," ready to be initialized."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"[centos@genesisserv1 home]$ sudo su - foxtrot\n[gnosis@genesisserv1 ~]$ ls\nrun\n[foxtrot@genesisserv1 ~]$ ls -ls\ntotal 12\ndrwx------.  2 foxtrot foxtrot  73  Aug21 13:54 .\ndrwxr-xr-x.  4 root    root     35  Aug21 13:54 ..\n-rw-r--r--.  1 foxtrot foxtrot  18  Apr  1 2020 .bash_logout\n-rw-r--r--.  1 foxtrot foxtrot 193  Apr  1 2020 .bash_profile\n-rw-r--r--.  1 foxtrot foxtrot 351  Aug 21 13:54 .bashrc\nlrwxrwxrwx.  1 root    root     34  Aug 21 13:54 run -> /data/foxtrot/server/20210821/run/\n[foxtrot@genesisserv1 ~]$ cd run/\n[foxtrot@genesisserv1 run]$ ls\nauth    genesis\n[foxtrot@genesisserv1 run]$\n")),(0,r.kt)("h3",{id:"3-update-system-definition"},"3. Update system definition"),(0,r.kt)("p",null,"We must make a small edit to the system configuration file found at the following URI: ",(0,r.kt)("strong",{parentName:"p"},"site-specific/cfg/genesis-system-definition.kts"),".\nRemove the current host configuration items and replace them with the name of your own host."),(0,r.kt)("h3",{id:"4-run-genesisinstall"},"4. Run genesisInstall"),(0,r.kt)("p",null,"The script does all the hard work for you. Just run ",(0,r.kt)("inlineCode",{parentName:"p"},"genesisInstall"),"."),(0,r.kt)("p",null,"The initialisation process creates new directories. In addition to ",(0,r.kt)("strong",{parentName:"p"},"auth")," and ",(0,r.kt)("strong",{parentName:"p"},"genesis"),", you will see:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"generated")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"runtime")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"site-specific"))),(0,r.kt)("p",null,"The process also creates some useful tools. Most immediately, try ",(0,r.kt)("inlineCode",{parentName:"p"},"mon")," to see the processes that need to be run."),(0,r.kt)("p",null,(0,r.kt)("img",{src:n(74880).Z,width:"901",height:"380"})),(0,r.kt)("p",null,"At this point, no processes are running. So, run the command ",(0,r.kt)("inlineCode",{parentName:"p"},"startServer"),". When it is complete, run ",(0,r.kt)("inlineCode",{parentName:"p"},"mon")," again. This time, you can see all the processes running."),(0,r.kt)("p",null,(0,r.kt)("img",{src:n(52144).Z,width:"900",height:"380"})),(0,r.kt)("p",null,"That\u2019s it. You are now ready to start developing. Congratulations."))}m.isMDXComponent=!0},74880:function(e,t,n){t.Z=n.p+"assets/images/joseph5-mon-b5f74ca3de39d22f0cdf182fa34abf34.png"},52144:function(e,t,n){t.Z=n.p+"assets/images/mon-processes-running-4a9f6d651a4a80f2aef18c84d42e6884.png"}}]);