/**
 * Importing stuff we need for iife generation.
 * Based on packages/showcase/documentation-components/src/index.ts
 */
import { provideDesignSystem, baseComponents } from '@genesislcap/alpha-design-system';
import { foundationGridComponents } from '@genesislcap/grid-pro';

provideDesignSystem().register(baseComponents, foundationGridComponents);

import {
  DesignSystemEditor,
  ColorPalette,
  DesignSystemPreview,
  ColorToken,
  TypographyTokens,
} from '@genesislcap/documentation-components';

DesignSystemEditor;
DesignSystemPreview;
ColorPalette;
DesignSystemPreview;
ColorToken;
TypographyTokens;


import { baseComponents as zeroComponents, provideDesignSystem as provideZero } from '@genesislcap/foundation-zero';
provideZero().register(zeroComponents);
