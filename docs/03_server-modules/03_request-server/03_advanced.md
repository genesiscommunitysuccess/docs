---
title: 'Advanced'
sidebar_label: 'Advanced'
id: advanced
---


##
Pre-processing a request
Request Server scripts can optionally transform a request parameter’s value using withTransformation. This takes two inputs:

- the request parameter’s value (which is nullable)
- the full request message

In the example below, withTransformation is used twice.

- If the ALTERNATE_TYPE parameter value is null, then the Request Server will use "UNKNOWN" by default.
- If the ALTERNATE_TYPE parameter has the value "RIC", then the transformation block will use the value of INSTRUMENT_CODE from the request. Otherwise, it will assign it the value "NOT_RIC" before making the database lookup.

GET MISSING INFORMATION !

## Custom Request Servers
By defining your own Request Servers, you have maximum flexibility. You can specify any class for the input and output, similar to Event Handlers. For the request, optional fields should have a default value in the primary constructor. You cannot use native Kotlin classes. You should wrap these in custom input and output classes.

We recommended that you locate your classes within the Messages module of your application. This is the platform's standard location for all the custom message types for an application. If you use this, you need to ensure that the script-config module has a dependency on the messages module.