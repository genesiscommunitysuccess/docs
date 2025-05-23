---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-comms](./foundation-comms.md) &gt; [DefaultAuth](./foundation-comms.defaultauth.md)

## DefaultAuth class

The default implementation for the Auth interface.

**Signature:**

```typescript
export declare class DefaultAuth implements Auth 
```
**Implements:** [Auth](./foundation-comms.auth.md)

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(session, connect, messageBuilder, credentialManager, currentUser)](./foundation-comms.defaultauth._constructor_.md) |  | Constructs a new instance of the <code>DefaultAuth</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [currentUser](./foundation-comms.defaultauth.currentuser.md) |  | User |  |
|  [isLoggedIn](./foundation-comms.defaultauth.isloggedin.md) | <code>readonly</code> | boolean |  |
|  [isLoggedIn$](./foundation-comms.defaultauth.isloggedin_.md) | <code>readonly</code> | Observable&lt;boolean&gt; |  |
|  [isWorking](./foundation-comms.defaultauth.isworking.md) |  | boolean |  |
|  [loggedUserResult](./foundation-comms.defaultauth.loggeduserresult.md) |  | [LoginResult](./foundation-comms.loginresult.md) |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [login(credentials)](./foundation-comms.defaultauth.login.md) |  |  |
|  [logout()](./foundation-comms.defaultauth.logout.md) |  |  |
|  [reAuthFromSession()](./foundation-comms.defaultauth.reauthfromsession.md) |  |  |

