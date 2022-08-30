---
title: 'Component testing'
sidebar_label: 'Component testing'
id: component-testing
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Component testing

There are two easy ways of testing components in your application.

- using the Genesis Console
- using an API client

### Before you start
Before you start, make sure your server is running. Then run `mon` to check that your particular component’s process is running. For example, if you want to test your request server, check that the _application_**_REQUEST_SERVER** process is running.

For any testing, you need to know:
- the IP address of name of your server
- the user name and password that will enable you to login and authenticate yourself

### Testing with Genesis Console
For users who have Console, the easiest way to check a component is to log into the server and subscribe to the relevant Data Server via the Resources page. You need to know the server address and have a valid user name and password.

1. In your browser, go to http://genesislcap.com/console/console-next2/.
2. Enter the IP address of your server.
3. Log in with your user name and password.
4. Click on the **RESOURCES** tab.
5. Filter the type to show only the relevant component, for example Event Handlers.

In the example below, we are testing the ability of the Event Handler EVENT_COUNTERPARTY_INSERT to insert a row of data to the table ALL_COUNTERPARTYS. The four fields in the table are listed on the left. On the right, we have supplied values for the four fields. Then you can click on **COMMIT** to send the insert. A successful insert displays an **ACK** message.
![](/img/test-console-add-ctpty.png)

### Using an API client
This type of software offers an easy way of testing each of your resources.

Two clients that Genesis uses for component testing are:
- [Postman](https://www.postman.com/downloads/)
- [Insomnia](https://insomnia.rest/download)

Broadly speaking, Postman offers more features, but Insomnia is also good and is simpler to use.

#### Logging on 
Whichever client you are using, you need to log in before you can send test requests to the server. This involves two things:
- providing a SOURCE_REF - this can be any string that identifies all your activity while you are logged in
- retrieving a SESSION_AUTH_TOKEN, which you can copy and use to authorise all your test requests

For example, to login using Insomnia:
1. Create a new query in Insomnia.
2. In front of the url, set the call to **POST**.
3. For the url, you need to supply your server instance, then **:9064** (which sends you to the application's Router), and then **event-login-auth**. For example:
**https://test-mynewapp:9064/event-login-auth**
4. Set the Body to JSON and insert the message below (substituting your correct user name and password) in the main body. 

```
{
    "MESSAGE_TYPE": "TXN_LOGIN_AUTH",
    "SERVICE_NAME": "AUTH_MANAGER",
    "DETAILS": {
        "USER_NAME": "DonJuan",
        "PASSWORD": "2BisTODO"
    }
}
```
5. Click to view the header, then insert SOURCE_REF in the header. For this field, you can use any string that will identify you (in effect). In the example below, we have set SOURCE_REF to BAUDOIN1 (for no particular reason).
&nbsp
&nbsp
![](/img/test-login-result.png)

6. When you have done this, click on the **Send** button.

This returns a set of details in the right side of the Insomnia window, where you can copy the SESSION_AUTH_TOKEN, which you will need for your test requests.


