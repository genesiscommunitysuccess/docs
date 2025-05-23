---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/expression-builder](./expression-builder.md) &gt; [Types](./expression-builder.types.md) &gt; [Styles](./expression-builder.types.styles.md)

## Types.Styles type

> This API is provided as a beta preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

Configuration items for the expression builder styles.

`customElements`: optional `Types.CustomElements` block for overriding the html tags used in the expression builder

`customStyles`: optional `Types.CustomStyles` block to configure custom css for components.

**Signature:**

```typescript
export type Styles = {
    customElements?: CustomElements;
    customStyles?: CustomStyles;
};
```
**References:** [CustomElements](./expression-builder.types.customelements.md), [CustomStyles](./expression-builder.types.customstyles.md)

