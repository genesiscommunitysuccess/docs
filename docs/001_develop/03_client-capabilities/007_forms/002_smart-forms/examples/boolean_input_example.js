import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

const booleanInputJsonSchema = {
  type: "object",
  properties: {
    booleanInput: {
      type: "boolean",
      description: "kotlin.Boolean",
    },
  },
};

const booleanInputUiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/booleanInput",
    },
  ],
};

export default function BooleanFormExample() {
  registerComponents();

  const form = useRef(null);

  useEffect(() => {
    form.current.jsonSchema = booleanInputJsonSchema;
    form.current.uischema = booleanInputUiSchema;
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
