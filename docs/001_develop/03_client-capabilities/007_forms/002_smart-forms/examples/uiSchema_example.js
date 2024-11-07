import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

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
  const isBrowser = useIsBrowser();
  const form = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

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
