/**
 * Importing stuff we need for iife generation.
 * Based on packages/showcase/documentation-components/src/index.ts
 */
import {
  baseComponents as alphaBaseComponents,
  provideDesignSystem as provideAlphaDesignSystem,
} from '@genesislcap/alpha-design-system';
import {
  ColorPalette,
  ColorToken,
  DesignSystemEditor,
  DesignSystemExport,
  DesignSystemPreview,
  TypographyTokens
} from '@genesislcap/documentation-components';
import {
  provideDesignSystem as provideZeroDesignSystem,
  baseComponents as zeroBaseComponents,
} from '@genesislcap/foundation-zero';
import { zeroGridComponents } from '@genesislcap/foundation-zero-grid-pro';
import { foundationGridComponents } from '@genesislcap/grid-pro';

export * from '@genesislcap/documentation-components';
export * from '@genesislcap/foundation-zero';

provideZeroDesignSystem().register(zeroBaseComponents, zeroGridComponents);
provideAlphaDesignSystem().register(alphaBaseComponents, foundationGridComponents);

DesignSystemEditor;
DesignSystemPreview;
DesignSystemExport;
ColorPalette;
DesignSystemPreview;
ColorToken;
TypographyTokens;