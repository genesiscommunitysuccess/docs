import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

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
  registerComponents();

  const form = useRef(null);

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
