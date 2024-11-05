import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import { RuleEffect } from "@jsonforms/core";

const selectData = ["United States", "Canada", "United Kingdom"];

const jsonSchema = {
  type: "object",
  properties: {
    country: {
      type: "string",
      description: "kotlin.String",
    },
    zipCode: {
      type: "string",
      description: "kotlin.String",
    },
    postalCode: {
      type: "string",
      description: "kotlin.String",
    },
  },
};

export const formsWithRulesUiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/country",
      label: "Country",
      options: {
        data: selectData.map((value) => ({ value })),
        labelField: "value",
        valueField: "value",
      },
    },
    {
      type: "Control",
      scope: "#/properties/zipCode",
      rule: {
        effect: RuleEffect.HIDE,
        condition: {
          scope: "#/properties/country",
          schema: { enum: ["United Kingdom", "Canada"] },
        },
      },
    },
    {
      type: "Control",
      scope: "#/properties/postalCode",
      rule: {
        effect: RuleEffect.SHOW,
        condition: {
          scope: "#/properties/country",
          schema: { enum: ["United Kingdom", "Canada"] },
        },
      },
    },
  ],
};

export default function EnumRuleFormExample() {
  registerComponents();

  const form = useRef(null);

  useEffect(() => {
    form.current.jsonSchema = jsonSchema;
    form.current.uischema = formsWithRulesUiSchema;
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
