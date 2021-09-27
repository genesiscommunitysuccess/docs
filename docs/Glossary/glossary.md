---
sidebar_position: 1
title: Glossary
sidebar_label: Glossary
id: glossary

---
There is a lot of technology embedded in the Genesis LCNC Platform. So, inevitably, we have to refer to it in this documentation.

Here, we list many of the technical terms that appear in these pages. For each one, we give you a thumbnail description. We hope that helps you to put the information in context and gives you a useful start if you want to explore further.

## ACID

A design principle for database transactions. The ACID properties were created to ensure that transaction-oriented databases can recover in the event of a failure in a transaction.

* Atomicity (All the transaction or none)
* Consitency (all data abides by the rules)
* Isolation (Every transaction is a separate entity)
* Durability (Once completed, the data is changed and stored)

A transaction is a single logical operation that may consist of one or many steps. For example, transferring money between bank accounts (i.e. debiting one account and crediting the other) is a transaction.

If a transaction like this fails halfway through, it could have major consequences. Money could be debited from the first account but not credited to the other account.

This is where the ACID principles should apply.

According to the ACID definition, a database is consistent if, and only if ,it contains the results of successful transactions. Any database that is ACID-compliant will ensure that only successful transactions are processed. If a failure occurs before a transaction has been completed, no data will be changed.

## Aeron

Aeron is an open-source, low-latency messaging system, initially developed for a large US exchange. 

It enables processes running on different hosts (or the same host) to communicate with minimal and consistent latency. 

It is used in real-time systems that have high throughput, or which require minimal response time. 

Aeron operates in a peer-to-peer model. It is brokerless, in contrast to other middleware, such as RabbitMQ, Kafka, and TIBCO EMS.

There is an [aeron wiki](https://github.com/real-logic/aeron/wiki) on github.


## Akka
Akka is a set of open-source libraries for designing scalable, resilient systems that span processor cores and networks. 
Akka provides low-level code to deliver reliable behaviour, fault tolerance, and high performance.

Aeron addresses important challenges inherent in designing distributed systems. To be successful, they must cope in an environment where components crash without responding, messages get lost without a trace on the wire, and network latency fluctuates. 
These are regular problems in carefully managed intra-datacenter environments - even more so in virtualized architectures.

## Amazon Elastic Compute Cloud 
Known as EC2.
This is Amazon's [Amazon Web Services cloud-computing platform](https://aws.amazon.com/ec2/?ec2-whats-new.sort-by=item.additionalFields.postDateTime&ec2-whats-new.sort-order=desc), where the Genesis servers are located.
In effect, these are virtual computers that we use to run our services.
It enables us to boot an Amazon Machine Image (AMI) to configure a virtual machine - an instance - where we can install any software we like.
We also use the AWS Free Tier (known as S3).

## Ansible
A development tool.

An engine that automates cloud provisioning, configuration management, application deployment, intra-service orchestration, and many other IT needs.

A basic Ansible command or playbook:

* selects machines to execute against from inventory
* connects to those machines (or network devices, or other managed nodes), usually over SSH
* copies one or more modules to the remote machines and starts execution there

If you are excited, stimulated or inspired, you can start [here](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html#intro-getting-started). 

## Atomic broadcast
In fault-tolerant distributed computing, an atomic broadcast or total order broadcast is a broadcast where all correct processes in a system of multiple processes receive the same set of messages in the same order; that is, the same sequence of messages.

The broadcast is termed "atomic" because it either eventually completes correctly at all participants, or all participants abort without side effects. 

The following properties are usually required from an atomic broadcast protocol:

* Validity. If a correct participant broadcasts a message, then all correct participants will eventually receive it.
* Uniform Agreement. If one correct participant receives a message, then all correct participants will eventually receive that message.
* Uniform Integrity. A message is received by each participant once only, and only if it was previously broadcast.
* Uniform Total Order. The messages are totally ordered in the mathematical sense; if any correct participant receives message 1 first and message 2 second, then every other correct participant must receive message 1 before message 2.

## Camel (Apache Camel)
An Open Source integration framework that enables you to integrate different systems that consume or produce data.

You can define routing and mediation rules in a variety of domain-specific languages, including a Java-based Fluent API, Spring or Blueprint XML Configuration files. This gives you smart completion of routing rules in your IDE, whether in a Java or XML editor.

Apache Camel uses Uniform Resource Identifiers (URIs) to work directly with the Transport or messaging model. This can be HTTP, ActiveMQ, JMS, JBI, SCA, MINA or CXF, as well as pluggable Components and Data Format options. 

## DBeaver
[Dbeaver](dbeaver.com) is a desktop application written in Java and based on the Eclipse platform.

It is an  SQL client software application and database administration tool that enables you to view data and develop in SQL.

* For relational databases it uses the JDBC application programming interface (API) to interact with databases via a JDBC driver.

* For other databases (NoSQL) it uses proprietary database drivers. 

Dbeaver provides an editor for SQL that supports code completion and syntax highlighting. 

It provides a plug-in architecture (based on the Eclipse plugins architecture) that enables users to modify much of the application's behavior to provide database-specific functionality or features that are database-independent. 

There are also tools for drawing diagrams, import/export and data analysis.



## EC2
Amazon Elastic Compute Cloud
This is where our Dev, Test and Production Instances are housed in the cloud.

## FIX
Financial Information Exchange 
A protocol for sending and receiving financial information.

FIX has standard dictionaries of different messages. Typically, we use v4.4. note that some banks use earlier versions (usually 4.2) and some have already moved to 5.0). Also note that you can customise these dictionaries to create our own messages.

Genesis uses [QuickFIX](quickfixengine.org) (open source). 

There is a standard FIX module that you can include in applications. 

This inlcudes the standard FIX libraries.

It also gives you a standard FIX inbound streamer that listens to the FIX_In table in the datbase.

## GPAL
Genesis Platform Abstraction Language
This is our own scripting language, which plugs in to IntelliJ.
It means that you have access to autocompletion Help and error highlighting as you code. Once you define an object in GPAL (such as a View), you can use it in multiple components. 

## Java Binary Object
A binary object is a wrapper over the binary representation of an entry stored in a cache. Each binary object has the `field (name)` method, which returns the value of the given field, and the `type ()` method, which extracts the information about the type of the object. Binary objects are useful when you want to work only with some fields of the objects and do not need to deserialize the entire content set.

## MarkitWire
An electronic trade capture and confirmation platform.

## MQ (IBM MQ)
IBM protocol which has an API so it can interact with JMS.
Message queues provide an asynchronous communications protocol, meaning that the sender and receiver of the message do not need to interact with the message queue at the same time. Messages placed onto the queue are stored until the recipient retrieves them. Message queues have implicit or explicit limits on the size of data that may be transmitted in a single message and the number of messages that may remain outstanding on the queue. 

## LDAP
Lightweight Directory Access Protocol
Industry-standard application protocol for accessing and maintaining distributed directory information services over an Internet Protocol (IP) network.

A common use of LDAP is to provide a central store of usernames and passwords. This allows many different applications and services to connect to the LDAP server to validate users.

## Maven
A tool for building and managing Java-based projects. 
There is a very useful [Maven tutorial](https://www.tutorialspoint.com/maven/maven_overview.htm)

Maven provides  default behavior for projects. When a Maven project is created, Maven creates a default project structure. As a developer, all you have to do is put the files in the right places. There is no need to define any configuration in pom.xml.

Maven pPlugins are generally used to:
* create jar and war files
* compile code files
* unit-test your code
* create project documentation
* create project reports

## Maven repository
In Maven terminology, a repository is a directory where all the project jars, library jar, plugins or any other project-specific artifacts are stored for use by Maven.

Maven local repository is a folder location on your machine. It is created when you run any maven command for the first time. 

When you run a Maven build, Maven automatically downloads all the dependency jars into the local repository. It helps to avoid references to dependencies stored on remote machine every time a project is built.

By default, a local repository is created by Maven in the %USER_HOME% directory. To override the default location, specify a different path in the Maven settings.xml file available at %M2_HOME%\conf directory.


## Netty
Netty is a socket communication component in Camel. It is an NIO client server framework for developing networkServerInitializerFactory applications, such as protocol servers and clients.

The aim is to simplify and streamline network programming, such as TCP and UDP socket server.

Netty supports both producer and consumer endpoints.

It has several options and allows fine-grained control of a number of TCP/UDP communication parameters (buffer sizes, keepAlives, tcpNoDelay, etc) and facilitates both In-Only and In-Out communication on a Camel route.

Maven users need to add a dependency to their pom.xml to use Netty.

Find this and a lot more at the [Camel website](https://camel.apache.org/components/latest/netty-component.html).





## Node Package Manager
[NPM](https://medium.com/swlh/what-is-npm-a-simple-english-guide-to-truly-understanding-the-node-package-manager-41e82f6c5515#:~:text=The%20Basics%20of%20Using%20NPM%201%20npm%20init,package%20to%20your%20node_modules%20folder.%20More%20items...%20) automates the management of third-party packages (exact version number, etc).

As a general rule, any project that uses Node.js will need a package.json file. This is the control centre for NPM, where you tell NPM which libraries you want to import, provide information about source control, project metadata, and more.

Whenever you run npm install, NPM will look at your package.json file and importa the relevant libraries.


## POJO
Plain Old Java Object

## POM
Project Object Model
A key project file for Maven, provided as xml.

## R
A statistical programming language.

It is widely used by statisticians and data miners for developing statistical software and data analysis. 

Genesis enables you to use R functions in our Consolidators.



## SSH
Secure Shell Protocol
A protocol for operating secure network services over an unsecured network.
Typical applications include remote command-line, login, and remote command execution, but any network service can be secured with SSH.
SSH creates a secure channel on a network by using a client–server architecture. It connects an SSH client application with an SSH server. [2] There are two major versions: SSH-1 and SSH-2. The standard TCP port for SSH is 22. 
SSH is generally used to access Unix-like operating systems, but it can also be used on Microsoft Windows.

Terraform
A tool for building, changing, and versioning infrastructure safely and efficiently. 
Configuration files describe to Terraform the components needed to run a single application or a datacenter. Terraform generates an execution plan describing what it will do to reach the desired state, and then executes it to build the described infrastructure. As the configuration changes, Terraform is able to determine what changed and create incremental execution plans which can be applied.
The infrastructure Terraform can manage includes low-level components, such as compute instances, storage, and networking, as well as high-level components such as DNS entries, SaaS features, etc.
Infrastructure as Code
You describe your infrastructure using a high-level configuration syntax to create a blueprint of your datacenter. This can be versioned and treated as you would any other code. Additionally, infrastructure can be shared and re-used.
Execution Plans
Terraform has a planning step that generates an execution plan. This shows what Terraform will do when you call apply - so you can avoid any nasty surprises.
Resource Graph
Terraform builds a graph of all resources, and parallelizes the creation and modification of any non-dependent resources. Because of this, Terraform builds infrastructure as efficiently as possible, and operators get insight into dependencies in their infrastructure.
Change Automation
Complex changesets can be applied to infrastructure with minimal human interaction. With the previously mentioned execution plan and resource graph, you know exactly what Terraform will change and in what order, avoiding many possible human errors.

UDP
User Datagram Protocol. 
While TCP provides apps a way to deliver (and receive) an ordered and error-checked stream of information packets over the network, the User Datagram Protocol (UDP) is used by apps to deliver a faster stream of information by doing away with error-checking. 
A datagram and a packet are more or less the same thing. UDP, built on top of the IP protocol, works similarly to TCP, but is simpler and faster. 
The main difference is that UDP doesn’t require the recipient to acknowledge that each packet has been received. Any packets that get lost in transit are not resent.

## VLAN
A Virtual Local Area Network (VLAN) is a logical grouping of different hosts in a similar broadcast domain. 


Virtual LANs provide mechanisms for aking logical groups of end devices, even where  they are on different networks. They increase the number of broadcast domains possible in a LAN by grouping various hosts with similar functions. Being virtual, there no issues plugging or unplugging cables. 

Implementing VLANs reduces the security risks significantly, as the number of hosts connected on a broadcast domain decreases. This is done by configuring a separate VLAN for only the hosts with the relevant access permissions. So you control  which devices have local access to each other.

VLANs offer flexible networking models which groups different users based on their departments (jobs/function), rather than just physical locations of that network.

## Web components
[Web components](HTML.https://www.webcomponents.org/introduction) are web platform APIs that enable you to create new custom, reusable, encapsulated HTML tags for use in web pages and web apps. 
Custom components and widgets build on the Web Component standards. They are designed to work across all standard browsers, and can be used with any JavaScript library or framework that works with HTML.


## WSL
Windows Subsystem for Linux



