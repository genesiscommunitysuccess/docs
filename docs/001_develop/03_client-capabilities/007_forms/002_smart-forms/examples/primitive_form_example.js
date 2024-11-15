import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

const primitiveJSONSchema = {
  type: "object",
  properties: {
    USER_NAME: {
      type: "string",
      description: "kotlin.String",
    },
    EMAIL: {
      type: "string",
      minLength: 3,
      description: "kotlin.String",
    },
    PASSWORD: {
      type: "string",
      description: "kotlin.String",
    },
    PASSWORD_CONFIRMATION: {
      type: "string",
      description: "kotlin.String",
    },
  },
  additionalProperties: false,
  required: ["USER_NAME", "PASSWORD", "PASSWORD_CONFIRMATION"],
};

export default function PrimitiveFormExample() {
  const isBrowser = useIsBrowser();
  const form = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    form.current.jsonSchema = primitiveJSONSchema;
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
