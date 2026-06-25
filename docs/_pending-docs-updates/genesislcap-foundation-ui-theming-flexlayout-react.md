# Docs update needed: Theming `flexlayout-react`
Requested ACTION: ADD

**Could not auto-detect the doc target — please move this snippet to the right page.**

## Theming `flexlayout-react`

The `flexlayout-react` package is a third-party docking layout that you install separately in your application. The Rapid Design System provides a single source of truth for its theme, combining the base styles and Rapid token overrides into a single stylesheet. This ensures your layout theme stays in sync with your application's design tokens.

Because colors resolve from Rapid design tokens, you must render `flexlayout-react` under a `<rapid-design-system-provider>` so that CSS custom properties inherit correctly across shadow boundaries.

###### Usage

To install the styles globally in the Light DOM (typically once at application bootstrap), use `installRapidFlexLayoutReactStyles`:

```typescript
import { installRapidFlexLayoutReactStyles } from '@genesislcap/rapid-design-system';

installRapidFlexLayoutReactStyles();
```

To adopt the shared, cached stylesheet into a Shadow DOM root that hosts your layout, use `getRapidFlexLayoutReactStyleSheet`:

```typescript
import { getRapidFlexLayoutReactStyleSheet } from '@genesislcap/rapid-design-system';

shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, getRapidFlexLayoutReactStyleSheet()];
```

The package also exports the following helpers:

- `rapidFlexLayoutReactStyleText`: The raw CSS string.
- `rapidFlexLayoutReactStyles`: The FAST `ElementStyles` object.
- `RAPID_FLEXLAYOUT_REACT_VERSION`: The version of `flexlayout-react` targeted by the theme.
