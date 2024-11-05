import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

export const validationPatternJsonSchema = {
  type: "object",
  properties: {
    phoneNumber: {
      type: "string",
      pattern: "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$",
      description: "kotlin.String",
    },
    email: {
      type: "string",
      pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$",
      description: "kotlin.String",
    },
  },
  required: ["phoneNumber"],
};

export const validationPatternUiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/phoneNumber",
    },
    {
      type: "Control",
      scope: "#/properties/email",
    },
  ],
};

export default function PatternFormExample() {
  registerComponents();

  const form = useRef(null);

  useEffect(() => {
    form.current.jsonSchema = validationPatternJsonSchema;
    form.current.uischema = validationPatternUiSchema;
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
