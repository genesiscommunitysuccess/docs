---
title: 'FAQs'
sidebar_label: 'FAQs'
id: faqs
---

Frequently Asked Questions
==========================

My write operations are not hitting the database[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/faq/#my-write-operations-are-not-hitting-the-database "Direct link to heading")
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

When using the [RxJava](https://docs.genesis.global/secure/reference/developer/api/database/reference/apis/rxjava/) api, it is paramount that you end the call chain with a `subscribe...` call. The underlying database operation will not commence until it is subscribed to.