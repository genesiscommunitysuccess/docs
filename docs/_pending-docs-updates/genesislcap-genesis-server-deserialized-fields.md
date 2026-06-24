# Proposed docs change: Deserialized fields

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (590 non-space chars) is much smaller than the existing one (2124) and would delete content. Review and apply this to `docs/001_develop/02_server-capabilities/015_communications/index.mdx` manually.**

### Deserialized fields

When you work with type-safe messages, incoming fields are deserialized into instances of `DeserializedField`.

The `DeserializedField` sealed class has the following subtypes:

- `DeserializedField.Array(val elements: List<DeserializedField>)`
- `DeserializedField.Object(val fields: Map<String, DeserializedField>)`
- `DeserializedField.String(val value: String)`
- `DeserializedField.Number(val value: BigDecimal)`
- `DeserializedField.Boolean(val value: Boolean)`
- `DeserializedField.Null`

Note that the `Array` subtype uses the `elements` property to hold its list of fields, whereas the `Object` subtype uses the `fields` property.
