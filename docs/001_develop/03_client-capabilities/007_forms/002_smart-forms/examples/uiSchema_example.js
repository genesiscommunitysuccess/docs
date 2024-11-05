import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

export const simpleTradeUiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/SIMPLE_TRADE_ID",
      options: {
        hidden: true,
      },
    },
    {
      type: "Control",
      scope: "#/properties/QUANTITY",
      label: "Enter Quantity:",
    },
    {
      type: "Control",
      scope: "#/properties/SIDE",
      options: {
        data: [
          { label: "Buy", value: "BUY" },
          { label: "Sell", value: "SELL" },
        ],
        valueField: "value",
        labelField: "label",
      },
    },
  ],
};

const simpleTradeJsonSchema = {
  type: "object",
  properties: {
    SIMPLE_TRADE_ID: {
      type: "string",
      description: "kotlin.String",
    },
    QUANTITY: {
      type: "number",
      description: "kotlin.Double",
    },
    SIDE: {
      type: "string",
      description: "kotlin.String",
    },
  },
  additionalProperties: false,
};

export default function TradeFormExample() {
  registerComponents();

  const form = useRef(null);

  useEffect(() => {
    form.current.jsonSchema = simpleTradeJsonSchema;
    form.current.uischema = simpleTradeUiSchema;
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
