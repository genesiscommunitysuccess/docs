---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-state-machine](./foundation-state-machine.md) &gt; [createResponseDataExtractorWithDeserializer](./foundation-state-machine.createresponsedataextractorwithdeserializer.md)

## createResponseDataExtractorWithDeserializer variable

Creates an extractor that applies a deserializer to the extracted response data.

**Signature:**

```typescript
createResponseDataExtractorWithDeserializer: <TInput = any, TOutput = any>(deserializer: (data: TInput) => Promise<TOutput>, extractor?: ResponseDataExtractor) => ResponseDataExtractor
```