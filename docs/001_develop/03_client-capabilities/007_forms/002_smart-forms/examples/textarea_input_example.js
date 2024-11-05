import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

const textAreaInputJsonSchema = {
  type: "object",
  properties: {
    textarea: {
      type: "string",
      description: "kotlin.String",
    },
  },
};

const textAreaInputUiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/textarea",
      options: {
        textarea: true,
      },
    },
  ],
};

export default function TextAreaFormExample() {
  registerComponents();

  const form = useRef(null);

  useEffect(() => {
    form.current.jsonSchema = textAreaInputJsonSchema;
    form.current.uischema = textAreaInputUiSchema;
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
