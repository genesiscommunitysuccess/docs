import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

const dateInputJsonSchema = {
  type: "object",
  properties: {
    dateInput: {
      type: "number",
      description: "org.joda.time.DateTime",
    },
  },
};

const dateInputUiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/dateInput",
    },
  ],
};

export default function DateFormExample() {
  const isBrowser = useIsBrowser();
  const form = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }


  useEffect(() => {
    form.current.jsonSchema = dateInputJsonSchema;
    form.current.uischema = dateInputUiSchema;
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
