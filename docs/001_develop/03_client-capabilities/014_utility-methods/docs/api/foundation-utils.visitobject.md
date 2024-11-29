---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-utils](./foundation-utils.md) &gt; [visitObject](./foundation-utils.visitobject.md)

## visitObject() function

> This API is provided as a beta preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

Visit object utility.

**Signature:**

```typescript
export declare function visitObject<TVisitorData>(object: any, deep: boolean, visitor: ObjectVisitor<TVisitorData>, data: TVisitorData, traversed: WeakSet<any> | Set<any>): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  object | any | The object. |
|  deep | boolean | A flag to indicate if a recursive visit of sub objects should occur. |
|  visitor | [ObjectVisitor](./foundation-utils.objectvisitor.md)&lt;TVisitorData&gt; | The defined [ObjectVisitor](./foundation-utils.objectvisitor.md) logic. |
|  data | TVisitorData | Visitor data. |
|  traversed | WeakSet&lt;any&gt; \| Set&lt;any&gt; | The traversed object set. |

**Returns:**

void

## Example

Reactive example.

```ts
export function reactive<T>(object: T, deep = false): T {
  visitObject(object, deep, makeObserverVisitor, void 0, observed);
  return object;
}
```
