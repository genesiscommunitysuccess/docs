---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-utils](./foundation-utils.md) &gt; [InMemoryDatabase](./foundation-utils.inmemorydatabase.md)

## InMemoryDatabase class

An in memory database of specific DatabaseRecord types.

**Signature:**

```typescript
export declare class InMemoryDatabase<T extends DatabaseRecord> implements Database<T> 
```
**Implements:** [Database](./foundation-utils.database.md)&lt;T&gt;

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(uuid)](./foundation-utils.inmemorydatabase._constructor_.md) |  | Constructs a new instance of the <code>InMemoryDatabase</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [isWorking](./foundation-utils.inmemorydatabase.isworking.md) |  | boolean |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [create(newValue)](./foundation-utils.inmemorydatabase.create.md) |  |  |
|  [delete(id)](./foundation-utils.inmemorydatabase.delete.md) |  |  |
|  [onAfterUpdate(listener)](./foundation-utils.inmemorydatabase.onafterupdate.md) |  |  |
|  [onBeforeUpdate(listener)](./foundation-utils.inmemorydatabase.onbeforeupdate.md) |  |  |
|  [read(id)](./foundation-utils.inmemorydatabase.read.md) |  |  |
|  [update(id, newValue)](./foundation-utils.inmemorydatabase.update.md) |  |  |
|  [visit(visitor)](./foundation-utils.inmemorydatabase.visit.md) |  |  |

