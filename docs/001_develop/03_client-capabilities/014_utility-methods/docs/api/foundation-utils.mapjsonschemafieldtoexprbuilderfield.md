---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-utils](./foundation-utils.md) &gt; [mapJsonSchemaFieldToExprBuilderField](./foundation-utils.mapjsonschemafieldtoexprbuilderfield.md)

## mapJsonSchemaFieldToExprBuilderField() function

Maps fields contained in a JSON schema block enhanced with genesisType metadata to the field shape required by the expression builder component.

Only sets the properties that are \*required\*. Optional properties, such as `defaultValue`, must be explicitly set by the user separately.

**Signature:**

```typescript
export declare function mapJsonSchemaFieldToExprBuilderField([name, schema]: [
    string,
    Genesis.FieldJsonSchema
]): Types.Field | null;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  \[name, schema\] | \[ string, [Genesis.FieldJsonSchema](./foundation-utils.genesis.fieldjsonschema.md) \] |  |

**Returns:**

Types.Field \| null

## Example


```ts
import { mapGenesisJsonSchema, mapJsonSchemaFieldToExprBuilderField } from '@genesislcap/foundation-utils';

const response = await connect.getJsonSchema("RESOURCE_NAME");
// Assuming the response is valid, requires checking
const schema = mapGenesisJsonSchema(response);
const fields = Object.entries(schema.properties).map(mapJsonSchemaFieldToExprBuilderField);
```

