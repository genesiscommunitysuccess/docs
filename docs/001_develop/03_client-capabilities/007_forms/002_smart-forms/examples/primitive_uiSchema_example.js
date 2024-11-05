import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

const primitiveUISchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      label: "Username",
      scope: "#/properties/USER_NAME",
    },
    {
      type: "Control",
      label: "Email",
      scope: "#/properties/EMAIL",
    },
    {
      type: "Control",
      label: "Password",
      scope: "#/properties/PASSWORD",
      options: {
        isPassword: true,
      },
    },
    {
      type: "Control",
      label: "Password confirmation",
      scope: "#/properties/PASSWORD_CONFIRMATION",
      options: {
        isPassword: true,
      },
    },
  ],
};

const primitiveJSONSchema = {
  type: "object",
  properties: {
    USER_NAME: {
      type: "string",
      description: "kotlin.String",
    },
    EMAIL: {
      type: "string",
      minLength: 3,
      description: "kotlin.String",
    },
    PASSWORD: {
      type: "string",
      description: "kotlin.String",
    },
    PASSWORD_CONFIRMATION: {
      type: "string",
      description: "kotlin.String",
    },
  },
  additionalProperties: false,
  required: ["USER_NAME", "PASSWORD", "PASSWORD_CONFIRMATION"],
};

export default function PrimitiveFormUISchemaExample() {
  registerComponents();

  const form = useRef(null);

  useEffect(() => {
    form.current.jsonSchema = primitiveJSONSchema;
    form.current.uischema = primitiveUISchema;
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
