<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-comms](./foundation-comms.md) &gt; [Auth](./foundation-comms.auth.md) &gt; [reAuthFromSession](./foundation-comms.auth.reauthfromsession.md)

## Auth.reAuthFromSession() method

Attempts to re-authenticate the user using the existing session data.

**Signature:**

```typescript
reAuthFromSession(): Promise<boolean>;
```
**Returns:**

Promise&lt;boolean&gt;

A Promise that resolves to `true` if the user was successfully re-authenticated, or `false` if re-authentication failed.
