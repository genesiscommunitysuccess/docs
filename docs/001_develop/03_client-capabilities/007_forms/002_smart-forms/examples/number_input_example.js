import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

const numberJsonSchema = {
  type: "object",
  properties: {
    numberInput: {
      type: "number",
      description: "kotlin.Double",
    },
  },
};

const numberInputUiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/numberInput",
    },
  ],
};

export default function NumberFormExample() {
  registerComponents();

  const form = useRef(null);

  useEffect(() => {
    form.current.jsonSchema = numberJsonSchema;
    form.current.uischema = numberInputUiSchema;
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
