---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/grid-pro](./grid-pro.md) &gt; [ActionRendererParams](./grid-pro.actionrendererparams.md)

## ActionRendererParams type

Parameters for the [GridPro](./grid-pro.gridpro.md) action renderer.

**Signature:**

```typescript
export type ActionRendererParams = {
    actionClick?: (rowData: any) => void;
    actionName?: string;
    appearance?: string;
    actionButtonStyle?: string;
    dataTestId?: string;
    isDisabled?: (rowData: any) => boolean;
    uniqueFieldName?: string;
    contentTemplate?: string;
};
```

## Remarks

For single action button scenarios.

