"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[12065],{2727:function(e,t,a){a.r(t),a.d(t,{assets:function(){return d},contentTitle:function(){return l},default:function(){return h},frontMatter:function(){return r},metadata:function(){return p},toc:function(){return u}});var i=a(87462),n=a(63366),s=(a(67294),a(3905)),o=(a(61839),["components"]),r={title:"Server Setup - Host Preparation",sidebar_label:"Host Preparation",sidebar_position:1,id:"host-preparation",keywords:["operations","server","setup","preparation"],tags:["database","server","setup","preparation"]},l=void 0,p={unversionedId:"operations/server-setup/host-preparation",id:"version-2022.3/operations/server-setup/host-preparation",title:"Server Setup - Host Preparation",description:"This document describes preparing a host to run applications built with Genesis frameworks.  It is written for a",source:"@site/versioned_docs/version-2022.3/05_operations/01_server-setup/01_host-prepration.md",sourceDirName:"05_operations/01_server-setup",slug:"/operations/server-setup/host-preparation",permalink:"/operations/server-setup/host-preparation",draft:!1,tags:[{label:"database",permalink:"/tags/database"},{label:"server",permalink:"/tags/server"},{label:"setup",permalink:"/tags/setup"},{label:"preparation",permalink:"/tags/preparation"}],version:"2022.3",sidebarPosition:1,frontMatter:{title:"Server Setup - Host Preparation",sidebar_label:"Host Preparation",sidebar_position:1,id:"host-preparation",keywords:["operations","server","setup","preparation"],tags:["database","server","setup","preparation"]},sidebar:"operationsSidebar",previous:{title:"Overview",permalink:"/operations/"},next:{title:"Initial Application Install",permalink:"/operations/server-setup/initial-application-install"}},d={},u=[{value:"OS Choice",id:"os-choice",level:2},{value:"Processes and dependencies",id:"processes-and-dependencies",level:2},{value:"Java / Kotlin",id:"java--kotlin",level:3},{value:"Third-party software",id:"third-party-software",level:3},{value:"Databases",id:"databases",level:3},{value:"Installing FoundationDB",id:"installing-foundationdb",level:4},{value:"Specific preparations",id:"specific-preparations",level:2},{value:"How many hosts, how big?",id:"how-many-hosts-how-big",level:2}],c={toc:u};function h(e){var t=e.components,a=(0,n.Z)(e,o);return(0,s.kt)("wrapper",(0,i.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"This document describes preparing a host to run applications built with Genesis frameworks.  It is written for a\nreader with some Linux system administration experience."),(0,s.kt)("h2",{id:"os-choice"},"OS Choice"),(0,s.kt)("p",null,"Genesis runs a set of JVM processes and a few external pieces of software, notably ",(0,s.kt)("a",{parentName:"p",href:"https://nginx.org/en/"},"nginx"),".  It\nrequires (in all likelihood) one of a set of supported databases and Genesis Global can provide RPM packages for them\nif required.  Our existing build pipeline favours producing either ZIP files or RPM packages.  As such, Genesis Global\nrecommends an OS from the RedHat family, either CentOS 7 or RHEL 7.  We have seen good results with AmazonLinux 2."),(0,s.kt)("p",null,"Choosing a different Linux variant will require the operator to locate suitable packages to install database and other\nsoftware packages."),(0,s.kt)("h2",{id:"processes-and-dependencies"},"Processes and dependencies"),(0,s.kt)("p",null,"For applications built with Genesis frameworks, there are some dependencies that any running host must meed."),(0,s.kt)("p",null,"Genesis applications include both server-side and web code.  The server-side processes are Java and Kotlin.  The web\nframework is built as NPMs and web application code is served to the client by the server."),(0,s.kt)("h3",{id:"java--kotlin"},"Java / Kotlin"),(0,s.kt)("p",null,"Genesis recommends ",(0,s.kt)("a",{parentName:"p",href:"https://openjdk.org/projects/jdk/11/"},"openjdk-11")," as the runtime.  ",(0,s.kt)("em",{parentName:"p"},"Note")," the JRE is not\nsufficient, as installation of Genesis applications includes steps to configure the applications."),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"java-openjdk-11")),(0,s.kt)("h3",{id:"third-party-software"},"Third-party software"),(0,s.kt)("p",null,"Other packages needed to manage and run Genesis applications are:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"nginx"),(0,s.kt)("li",{parentName:"ul"},"unzip"),(0,s.kt)("li",{parentName:"ul"},"lmdb")),(0,s.kt)("h3",{id:"databases"},"Databases"),(0,s.kt)("p",null,"Genesis supports several types of database; application developers are free to choose with the constraint of which\nchoices make sense in your environment.  The currently supported list is:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://www.foundationdb.org/"},"FoundationDB")," (default)"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://aerospike.com/"},"Aerospike")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://www.postgresql.org/"},"PostgreSQL")," (local or RDS within AWS)"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://www.microsoft.com/en-gb/sql-server/sql-server-2016"},"MSSQL")," (Windows environments)"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://www.oracle.com/uk/database/"},"Oracle")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://aws.amazon.com/rds/aurora/"},"Aurora")," (AWS environments)")),(0,s.kt)("h4",{id:"installing-foundationdb"},"Installing FoundationDB"),(0,s.kt)("p",null,"FoundationDB compatible versions are available from Genesis' Artifactory at\n",(0,s.kt)("a",{parentName:"p",href:"https://genesisglobal.jfrog.io/artifactory/genesis-rpm/$releasever/$basearch/"},"a suitable path"),"."),(0,s.kt)("p",null,"If resilient FoundationDB is required, it can be clustered across multiple hosts (an odd number of instances are\nneeded for safety).   Details of setup can be found in FoundationDB's\n",(0,s.kt)("a",{parentName:"p",href:"https://apple.github.io/foundationdb/administration.html"},"documentation"),"."),(0,s.kt)("h2",{id:"specific-preparations"},"Specific preparations"),(0,s.kt)("p",null,"The default installation location for Genesis applications is inside /data, which may or may not be created by your OS\ninstall.  If it is not, it should be created mode 0644 as non-root users' data will be written inside and thus it will\nneed to be readable."),(0,s.kt)("p",null,"Genesis applications typically run as a non-root user (for a spectrum of reasons, largely security-related).  The\nexact choice of user is in the control of the operator of the host.  Genesis currently recommends a separate user per\napplication on a host - ",(0,s.kt)("em",{parentName:"p"},"multiple applications sharing running as one user creates some difficulties in development\nand operation"),"."),(0,s.kt)("p",null,"During installation the username for the application is used to set the file ownership and startup scripts' behaviour\nand a symlink will be created in the user's home directory.  Creation of user home directories should therefore not be\ndisabled."),(0,s.kt)("h2",{id:"how-many-hosts-how-big"},"How many hosts, how big?"),(0,s.kt)("p",null,"Genesis applications will run quite happily within one host, provided enough CPU and memory are present (we recommend\na minimum of 16GB and 32GB is better; CPU demands vary greatly by application, and idle applicaitons consume very\nlittle CPU)."),(0,s.kt)("p",null,"Resilience options involve some customization of setup and our framework will integrate with\n",(0,s.kt)("a",{parentName:"p",href:"https://www.consul.io/"},"Consul")," to handle multi-host setups.  Some larger Genesis-built projects have spread out\nacross more than a dozen hosts to accomplish scaling and resilience.  Consul at a known-good version can also be\ndownloaded from our Artifactory at the link above."),(0,s.kt)("p",null,"Clustering is native to Genesis applications and the details of configuring it are covered\n",(0,s.kt)("a",{parentName:"p",href:"/operations/clustering/clusters"},"later"),"."),(0,s.kt)("p",null,"Disk space required is very application dependent.  Genesis applications will by default log locally; log volumes are\ndetermined by application activity levels.  Genesis applications also use local disk to create local LMDB files to help\ncoordinate data.  These are mmap()'d by the processes and writes are coalesced by the Linux kernel, so iops are kept\nlow, but it is still affected by application activity."),(0,s.kt)("p",null,"If the chosen database is help locally, this also affects disk requirements.  Data volumes also depend greatly on the\napplication; Genesis framework requires very little for itself.  Consult with your application developers on the\nanticipated data volumes."))}h.isMDXComponent=!0}}]);