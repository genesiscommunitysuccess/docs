/**
 * Importing stuff we need for iife generation.
 * Based on packages/showcase/documentation-components/src/index.ts
 */
import { baseComponents, provideDesignSystem } from '@genesislcap/alpha-design-system';
import { foundationGridComponents } from '@genesislcap/grid-pro';

provideDesignSystem().register(baseComponents, foundationGridComponents);

import {
  ColorPalette,
  ColorToken,
  DesignSystemEditor,
  DesignSystemExport,
  DesignSystemPreview,
  PreviewComponents,
  TypographyTokens
} from '@genesislcap/documentation-components';

DesignSystemEditor;
PreviewComponents;
DesignSystemExport;
ColorPalette;
ColorToken;
TypographyTokens;
DesignSystemPreview;


import { provideDesignSystem as provideZero, baseComponents as zeroComponents } from '@genesislcap/foundation-zero';
provideZero().register(zeroComponents);