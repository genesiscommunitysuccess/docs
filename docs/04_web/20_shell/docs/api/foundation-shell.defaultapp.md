---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-shell](./foundation-shell.md) &gt; [DefaultApp](./foundation-shell.defaultapp.md)

## DefaultApp class

Default App implementation.

**Signature:**

```typescript
export declare class DefaultApp implements App 
```
**Implements:** [App](./foundation-shell.app.md)

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [elements](./foundation-shell.defaultapp.elements.md) |  | [AppElement](./foundation-shell.appelement.md)\[\] | All [AppElement](./foundation-shell.appelement.md) tokens. |
|  [metadata](./foundation-shell.defaultapp.metadata.md) |  | [AppMetadata](./foundation-shell.appmetadata.md)\[\] | All [AppMetadata](./foundation-shell.appmetadata.md) tokens. |
|  [registrations](./foundation-shell.defaultapp.registrations.md) |  | [AppRegistration](./foundation-shell.appregistration.md)\[\] | All [AppRegistration](./foundation-shell.appregistration.md) tokens. |
|  [routes](./foundation-shell.defaultapp.routes.md) |  | [AppRoute](./foundation-shell.approute.md)\[\] | All [AppRoute](./foundation-shell.approute.md) tokens. |
|  [stores](./foundation-shell.defaultapp.stores.md) |  | [AppStore](./foundation-shell.appstore.md)\[\] | All [AppStore](./foundation-shell.appstore.md) tokens. |
|  [styles](./foundation-shell.defaultapp.styles.md) |  | [AppStyle](./foundation-shell.appstyle.md)\[\] | All [AppStyle](./foundation-shell.appstyle.md) tokens. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [deregisterAssets()](./foundation-shell.defaultapp.deregisterassets.md) |  | Deregister assets. |
|  [deregisterElement(element)](./foundation-shell.defaultapp.deregisterelement.md) |  | API for developers to deregister [AppElements](./foundation-shell.appelement.md). |
|  [deregisterRoute(route)](./foundation-shell.defaultapp.deregisterroute.md) |  | API for developers to deregister [AppRoutes](./foundation-shell.approute.md). |
|  [deregisterStore(store)](./foundation-shell.defaultapp.deregisterstore.md) |  | API for developers to deregister [AppStores](./foundation-shell.appstore.md). |
|  [deregisterStyle(style)](./foundation-shell.defaultapp.deregisterstyle.md) |  | API for developers to deregister [AppStyles](./foundation-shell.appstyle.md). |
|  [hasAssets()](./foundation-shell.defaultapp.hasassets.md) |  | Check if the App has registered assets. |
|  [isValid(context)](./foundation-shell.defaultapp.isvalid.md) |  | Monitors metadata and other data points as assets are registered and deregistered for app validity. |
|  [registerAssets(assets)](./foundation-shell.defaultapp.registerassets.md) |  | Register assets from either a globed dynamic import or some predefined AppAssets instance. This is a one time operation. Assets had be subsequently registered and deregistered using their individual APIs. |
|  [registerComponents(context)](./foundation-shell.defaultapp.registercomponents.md) |  | API for Application and Seed authors to register dynamic components. |
|  [registerElement(element)](./foundation-shell.defaultapp.registerelement.md) |  | API for developers to register [AppElements](./foundation-shell.appelement.md) lazily. |
|  [registerElementsTarget(targetId, predicate, repeatOptions)](./foundation-shell.defaultapp.registerelementstarget.md) |  | API for Application and Seed authors to define dynamic [AppElement](./foundation-shell.appelement.md) integration points. |
|  [registerRoute(route)](./foundation-shell.defaultapp.registerroute.md) |  | API for developers to register [AppRoutes](./foundation-shell.approute.md) lazily. |
|  [registerRouteCollection(routeCollection, predicate)](./foundation-shell.defaultapp.registerroutecollection.md) |  | API for Application and Seed authors to register the main . |
|  [registerStore(store)](./foundation-shell.defaultapp.registerstore.md) |  | API for developers to register [AppStores](./foundation-shell.appstore.md) lazily. |
|  [registerStoreRoot(storeRoot, predicate)](./foundation-shell.defaultapp.registerstoreroot.md) |  | API for Application and Seed authors to register the . |
|  [registerStyle(style)](./foundation-shell.defaultapp.registerstyle.md) |  | API for developers to register [AppStyles](./foundation-shell.appstyle.md) lazily. |
|  [registerStylesTarget(targetId, predicate)](./foundation-shell.defaultapp.registerstylestarget.md) |  | API for Application and Seed authors to define dynamic [AppStyle](./foundation-shell.appstyle.md) integration points. |
