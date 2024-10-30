import { EntityManagement } from '@genesislcap/foundation-entity-management';
import { Form } from '@genesislcap/foundation-forms';
import { foundationLayoutComponents } from '@genesislcap/foundation-layout';
import { getApp } from '@genesislcap/foundation-shell/app';
import { FoundationRouter } from '@genesislcap/foundation-ui';
import * as zeroDesignSystem from '@genesislcap/foundation-zero';
// import { g2plotChartsComponents } from '@genesislcap/g2plot-chart';
import * as rapidDesignSystem from '@genesislcap/rapid-design-system';
import { rapidGridComponents } from '@genesislcap/rapid-grid-pro';

/**
 * Ensure tree shaking doesn't remove these.
 */
FoundationRouter;
EntityManagement;
Form;

/**
 * registerComponents.
 * @public
 */
export async function registerComponents() {
  const { configure: configureHeader } = await import('@genesislcap/foundation-header/config');
  /**
   * Register any PBC components with the design system
   */
  getApp().registerComponents({
    designSystem: rapidDesignSystem,
  });

  rapidDesignSystem
    .provideDesignSystem()
    .register(
      rapidDesignSystem.baseComponents,
      rapidGridComponents,
      // g2plotChartsComponents,
      foundationLayoutComponents,
    );

  configureHeader({
    templateOptions: {
      icon: 'rapid-icon',
      button: 'rapid-button',
      connectionIndicator: 'rapid-connection-indicator',
      select: 'rapid-select',
      option: 'rapid-option',
      flyout: 'rapid-flyout',
    },
  });
}
