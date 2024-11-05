import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

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
  registerComponents();

  const form = useRef(null);

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
