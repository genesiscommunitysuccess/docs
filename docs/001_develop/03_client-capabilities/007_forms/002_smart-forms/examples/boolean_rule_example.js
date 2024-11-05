import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import { RuleEffect } from "@jsonforms/core";

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
  registerComponents();

  const form = useRef(null);

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
