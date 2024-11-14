---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-forms](./foundation-forms.md) &gt; [Filters](./foundation-forms.filters.md)

## Filters class

Foundation filters component for automatically generated filters based on json schema obtained from the api, supplied initial data or supplied JSON schema. Allowing customisable filters elements using UI schema and set of custom renderers

**Signature:**

```typescript
export declare class Filters extends FoundationElement 
```
**Extends:** FoundationElement

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [data](./foundation-forms.filters.data.md) |  | any | Initial data for the filters. |
|  [jsonSchema](./foundation-forms.filters.jsonschema.md) |  | JSONSchema7 | Alternatively to providing [Form.resourceName](./foundation-forms.form.resourcename.md) you can hardcode the JSON schema on the client. |
|  [prefix](./foundation-forms.filters.prefix.md) |  | string | Name of the design system prefix that will be used in renderers. |
|  [renderers](./foundation-forms.filters.renderers.md) |  | [RendererEntry](./foundation-forms.rendererentry.md)\[\] | Allows to provide the main set of renderers used by the form. If not provided, the built-in renderers will be used by default. |
|  [resourceName](./foundation-forms.filters.resourcename.md) |  | string | Name of the backend resource which will provide metadata used to generate filters. |
|  [uischema](./foundation-forms.filters.uischema.md) |  | [UiSchema](./foundation-forms.uischema.md) | UI schema used to define configuration of the layout and elements in the filters Check [UiSchema](./foundation-forms.uischema.md) for possible options. |
|  [value](./foundation-forms.filters.value.md) |  | string | Created criteria based on the given data that can be used to filter the data. |
