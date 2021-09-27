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

Aeron operates in a peer-to-peer model, it is brokerless, in contrast to other middleware, such as RabbitMQ, Kafka, and TIBCO EMS.

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

## 


##


##


##