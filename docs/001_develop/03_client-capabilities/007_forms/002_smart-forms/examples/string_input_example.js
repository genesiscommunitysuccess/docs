import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

const textInputJsonSchema = {
  type: "object",
  properties: {
    textInput: {
      type: "string",
      description: "kotlin.String",
    },
  },
};

const textInputUiSchema = {
  type: "VerticalLayout",
  elements: [{ type: "Control", scope: "#/properties/textInput" }],
};

export default function StringFormExample() {
  const isBrowser = useIsBrowser();
  const form = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    form.current.jsonSchema = textInputJsonSchema;
    form.current.uischema = textInputUiSchema;
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
