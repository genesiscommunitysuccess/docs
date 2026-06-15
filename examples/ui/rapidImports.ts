import { EntityManagement } from "@genesislcap/foundation-entity-management";
import { Form, Filters } from "@genesislcap/foundation-forms";
import { foundationLayoutComponents } from "@genesislcap/foundation-layout";
import { getApp } from "@genesislcap/foundation-shell/app";
import { FoundationRouter } from "@genesislcap/foundation-ui";
import { CriteriaSegmentedControl } from "@genesislcap/foundation-criteria";
import { g2plotChartsComponents } from '@genesislcap/g2plot-chart';
import * as rapidDesignSystem from "@genesislcap/rapid-design-system";
import {
  RapidRuleExpressionBuilder,
  RapidValueExpressionBuilder,
} from "@genesislcap/rapid-design-system/react";
import { rapidGridComponents } from "@genesislcap/rapid-grid-pro";
import { FoundationHeader } from "@genesislcap/foundation-header";

/**
 * Ensure tree shaking doesn't remove these.
 */
FoundationRouter;
FoundationHeader;
// EntityManagement;
Form;
Filters;
CriteriaSegmentedControl;
rapidDesignSystem.RapidRuleExpressionBuilder;
rapidDesignSystem.RapidValueExpressionBuilder;
RapidRuleExpressionBuilder;
RapidValueExpressionBuilder;

export { RapidRuleExpressionBuilder, RapidValueExpressionBuilder };

/**
 * registerComponents.
 * @public
 */
export async function registerComponents() {
  /**
   * Register any PBC components with the design system
   */
  getApp().registerComponents({
    designSystem: rapidDesignSystem,
  });

  rapidDesignSystem.provideDesignSystem().register(
    rapidDesignSystem.baseComponents,
    rapidGridComponents,
    g2plotChartsComponents,
    foundationLayoutComponents
  );
}
