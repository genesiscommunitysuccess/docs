import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

const passwordInputJsonSchema = {
  type: "object",
  properties: {
    textInput: {
      type: "string",
      description: "kotlin.String",
    },
  },
};

const passwordInputUiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/password",
      options: {
        isPassword: true,
      },
    },
  ],
};

export default function PasswordFormExample() {
  registerComponents();

  const form = useRef(null);

  useEffect(() => {
    form.current.jsonSchema = passwordInputJsonSchema;
    form.current.uischema = passwordInputUiSchema;
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
