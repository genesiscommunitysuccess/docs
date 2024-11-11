import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import { RuleEffect } from "@jsonforms/core";
import useIsBrowser from "@docusaurus/useIsBrowser";

const jsonSchema = {
  type: "object",
  properties: {
    withLimit: {
      type: "boolean",
      description: "kotlin.Boolean",
    },
    limitPrice: {
      type: "number",
      description: "kotlin.Double",
    },
  },
};

const uiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/withLimit",
      label: "Add limit price?",
    },
    {
      type: "Control",
      scope: "#/properties/limitPrice",
      rule: {
        effect: RuleEffect.ENABLE,
        condition: {
          scope: "#/properties/withLimit",
          schema: { const: true },
        },
      },
    },
  ],
};

export default function BooleanRuleFormExample() {
  const isBrowser = useIsBrowser();
  const form = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    form.current.jsonSchema = jsonSchema;
    form.current.uischema = uiSchema;
  });

  return (
    <CodeSection>
      <foundation-form
        ref={form}
        design-system-prefix="rapid"
      ></foundation-form>
    </CodeSection>
  );
}
