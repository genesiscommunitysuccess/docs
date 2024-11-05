import { useEffect, useRef, useState } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import {
  CodeSection,
  CodeLabel,
} from "../../../../../../examples/ui/documentationBase";

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

export default function TradeFiltersExample() {
  registerComponents();

  const filter = useRef(null);
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
          style={{ width: "50%" }}
          ref={filter}
          design-system-prefix="rapid"
          onHandleChange={(e) => console.log(e)}
        ></foundation-filters>
        <rapid-divider
          orientation="vertical"
          style={{ height: "370px" }}
        ></rapid-divider>
        <div style={{ width: "50%", paddingLeft: "10px" }}>
          <h4 style={{ color: "white" }}>Generated Criteria:</h4>
          <p style={{ color: "white", fontSize: "14px" }}>{filterValue}</p>
        </div>
      </div>
    </CodeSection>
  );
}
