import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

const selectData = [
  "Miami",
  "New York",
  "London",
  "Dublin",
  "São Paulo",
  "Bengaluru",
];

const selectInputJsonSchema = {
  type: "object",
  properties: {
    selectInput: {
      type: "string",
      description: "kotlin.String",
      enum: selectData,
    },
  },
};

const selectInputUiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/selectInput",
      options: {
        data: selectData.map((value) => ({ value })),
        labelField: "value",
        valueField: "value",
      },
    },
  ],
};

export default function SelectFormExample() {
  const isBrowser = useIsBrowser();
  const form = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    form.current.jsonSchema = selectInputJsonSchema;
    form.current.uischema = selectInputUiSchema;
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
