---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-forms](./foundation-forms.md) &gt; [StandardRendererOptions](./foundation-forms.standardrendereroptions.md)

## StandardRendererOptions type

Standard configuration options available for all renderers.

**Signature:**

```typescript
export type StandardRendererOptions = {
    readonly?: boolean;
    hidden?: boolean;
    validateFn?: (data: any, path: string, label: string) => ErrorObject[];
    i18n?: {
        [key: string]: any;
    };
    tooltip?: string;
};
```
