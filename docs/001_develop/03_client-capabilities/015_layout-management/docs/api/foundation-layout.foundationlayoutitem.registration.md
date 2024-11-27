---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-layout](./foundation-layout.md) &gt; [FoundationLayoutItem](./foundation-layout.foundationlayoutitem.md) &gt; [registration](./foundation-layout.foundationlayoutitem.registration.md)

## FoundationLayoutItem.registration property

Sets the registration name for the item, which can be used later to add the item via the JavaScript API using [FoundationLayout.addItem()](./foundation-layout.foundationlayout.additem.md).

**Signature:**

```typescript
registration: string;
```

## Remarks

Items added via the JavaScript API and HTML API share the same pool of registration names. Using a duplicate registration name is a runtime error. This registration name defaults to the number of the window it is. It is highly recommended if you are using the JavaScript API that you set a registration name here manually.
