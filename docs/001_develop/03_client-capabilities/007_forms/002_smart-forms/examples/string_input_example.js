import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

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
  registerComponents();

  const form = useRef(null);

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
