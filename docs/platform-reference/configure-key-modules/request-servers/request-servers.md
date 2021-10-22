---
title: 'Request servers'
sidebar_label: 'Request servers'
sidebar_position: 10
id: configure
---

Request servers, (otherwise known as request/replies or reqreps) retrieve snapshot data from a table or a view. They then make the data available to the UI.
By default, a request server file is generated automatically when you use AppGen. This uses the metadata of each index or table in the data model to create an individual `requestReply` code block for each one. The code block specifies which field or fields can be requested, and which field or fields are to be returned in the response. The request will be the primary key, and the response provides every field in the table or view.

However, you can choose to specify both the request fields and the response fields as part of the statement. Request fields can include wildcards, so you could request all RIC Codes for example, or all RIC Codes beginning with V.

You can define complex (or custom) requestReplies. This is useful, for example, if you want to request data from a number of different tables and views that are not related. By nesting and joining all the relevant data in your requestReply statement, you are creating your own metadata for the request server, so it can then be used anywhere in the module.