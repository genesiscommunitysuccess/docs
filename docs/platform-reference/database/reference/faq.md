---
sidebar_position: 100
title: Frequently Asked Questions
sidebar_label: Frequently Asked Questions
id: faq

---

## My write operations are not hitting the database

When using the [RxJava](../apis/rxjava/) api, it is paramount that you end the call chain with a `subscribe...`
call. The underlying database operation will not commence until it is subscribed to. 