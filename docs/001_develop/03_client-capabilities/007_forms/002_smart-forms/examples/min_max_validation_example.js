import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

export const validationMinMaxLengthJsonSchema = {
  properties: {
    minLengthInput: {
      type: "string",
      minLength: 3,
    },
    maxLengthInput: {
      type: "string",
      maxLength: 10,
    },
  },
  required: ["minLengthInput", "maxLengthInput"],
};

export default function MinMaxFormExample() {
  const isBrowser = useIsBrowser();
  const form = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    form.current.jsonSchema = validationMinMaxLengthJsonSchema;
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
