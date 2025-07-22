import { useEffect, useRef, useState } from "react";
import {
  CodeSection,
} from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

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
    TRADE_DATETIME: {
      type: "string",
      description: "org.joda.time.DateTime",
    },
  },
  additionalProperties: false,
};

export default function TradeFiltersSaveExample() {
  const isBrowser = useIsBrowser();
  const filter = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    filter.current.jsonSchema = simpleTradeJsonSchema;
    filter.current.addEventListener("change", () => {
      setFilterValue(filter.current.value);
    });
  });

  return (
    <CodeSection>
      <div style={{ display: "flex", width: "100%" }}>
        <foundation-filters
          ref={filter}
          design-system-prefix="rapid"
          show-filter-persistence-controls
        ></foundation-filters>
      </div>
    </CodeSection>
  );
}
