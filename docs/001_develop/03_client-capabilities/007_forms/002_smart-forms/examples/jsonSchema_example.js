import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

const sampleJsonSchema = {
  type: "object",
  properties: {
    QUANTITY: {
      type: "number",
      description: "kotlin.Double",
    },
    SIDE: {
      type: "number",
      description: "kotlin.String",
    },
  },
};

export default function JsonSchemaFormExample() {
  registerComponents();
  const form = useRef(null);

  useEffect(() => {
    form.current.jsonSchema = sampleJsonSchema;
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
