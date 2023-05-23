/**
 * Importing stuff we need for iife generation.
 * Based on packages/showcase/documentation-components/src/index.ts
 */
import { baseComponents, provideDesignSystem } from '@genesislcap/alpha-design-system';
import { foundationGridComponents } from '@genesislcap/grid-pro';
import { Form as FoundationForms } from '@genesislcap/foundation-forms';

provideDesignSystem().register(baseComponents, foundationGridComponents);

import {
  ColorPalette,
  ColorToken,
  ColorTokens,
  DesignSystemEditor,
  DesignSystemExport,
  DesignSystemPreview,
  PreviewComponents,
  TypographyTokens,
  PreviewForm
} from '@genesislcap/documentation-components';

DesignSystemEditor;
PreviewComponents;
DesignSystemExport;
ColorPalette;
ColorToken;
ColorTokens;
PreviewForm;
TypographyTokens;
DesignSystemPreview;
FoundationForms;


import { provideDesignSystem as provideZero, baseComponents as zeroComponents } from '@genesislcap/foundation-zero';
provideZero().register(zeroComponents);