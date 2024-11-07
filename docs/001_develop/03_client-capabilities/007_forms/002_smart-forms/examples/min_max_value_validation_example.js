import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

export const validationMinMaxValueJsonSchema = {
  properties: {
    minValueInput: {
      type: "number",
      description: "kotlin.Double",
      minimum: 18,
    },
    maxValueInput: {
      type: "number",
      description: "kotlin.Double",
      maximum: 65,
    },
  },
  required: ["minValueInput", "maxValueInput"],
};

export default function MinMaxValueFormExample() {
  const isBrowser = useIsBrowser();
  const form = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    form.current.jsonSchema = validationMinMaxValueJsonSchema;
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
