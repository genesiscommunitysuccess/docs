import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

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
  registerComponents();

  const form = useRef(null);

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
