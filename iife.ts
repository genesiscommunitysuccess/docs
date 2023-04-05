/**
 * Importing stuff we need for iife generation.
 * Based on packages/showcase/documentation-components/src/index.ts
 */
import {
    provideDesignSystem as provideAlphaDesignSystem,
    baseComponents as alphaBaseComponents,
  } from '@genesislcap/alpha-design-system';
  import {
    provideDesignSystem as provideZeroDesignSystem,
    baseComponents as zeroBaseComponents,
  } from '@genesislcap/foundation-zero';
  import { zeroGridComponents } from '@genesislcap/foundation-zero-grid-pro';
  import { foundationGridComponents } from '@genesislcap/grid-pro';
  import {
    DesignSystemEditor,
    ColorPalette,
    DesignSystemPreview,
    ColorToken,
    TypographyTokens,
  } from '@genesislcap/documentation-components';
  
  export * from '@genesislcap/documentation-components';
  
  provideZeroDesignSystem().register(zeroBaseComponents, zeroGridComponents);
  
  provideAlphaDesignSystem().register(alphaBaseComponents, foundationGridComponents);
  
  DesignSystemEditor;
  DesignSystemPreview;
  ColorPalette;
  DesignSystemPreview;
  ColorToken;
  TypographyTokens;