---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-utils](./foundation-utils.md) &gt; [mapGenesisJsonSchema](./foundation-utils.mapgenesisjsonschema.md)

## mapGenesisJsonSchema() function

Takes in a valid response from `connect.getJsonSchema(resourceName)` and maps it to a JsonSchema extended with the genesisType metadata for a field

**Signature:**

```typescript
export declare function mapGenesisJsonSchema(jsonSchemResponse: {
    OUTBOUND: JSONSchema7;
}): Genesis.JSONSchema7;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  jsonSchemResponse | { OUTBOUND: JSONSchema7; } |  |

**Returns:**

[Genesis.JSONSchema7](./foundation-utils.genesis.jsonschema7.md)

