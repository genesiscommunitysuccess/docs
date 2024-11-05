import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

const uiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Group",
      scope: "#/properties/basic",
      label: "Personal information",
      options: {
        childElements: [
          {
            type: "Control",
            label: "First Name",
            scope: "#/properties/FIRST_NAME",
          },
          {
            type: "Control",
            label: "Second Name",
            scope: "#/properties/SECOND_NAME",
          },
        ],
      },
    },
    {
      type: "Group",
      label: "Address",
      scope: "#/properties/address",
      options: {
        childElements: [
          {
            type: "Control",
            label: "Street",
            scope: "#/properties/STREET",
            options: {
              isPassword: true,
            },
          },
          {
            type: "Control",
            label: "Street Number",
            scope: "#/properties/STREET_NUMBER",
            options: {
              isPassword: true,
            },
          },
        ],
      },
    },
  ],
};

const primitiveJSONSchema = {
  type: "object",
  properties: {
    FIRST_NAME: {
      type: "string",
      description: "kotlin.String",
    },
    SECOND_NAME: {
      type: "string",
      minLength: 3,
      description: "kotlin.String",
    },
    STREET: {
      type: "string",
      description: "kotlin.String",
    },
    STREET_NUMBER: {
      type: "string",
      description: "kotlin.String",
    },
  },
  additionalProperties: false,
  required: ["USER_NAME", "PASSWORD", "PASSWORD_CONFIRMATION"],
};

export default function GroupFormUISchemaExample() {
  registerComponents();

  const form = useRef(null);

  useEffect(() => {
    form.current.jsonSchema = primitiveJSONSchema;
    form.current.uischema = uiSchema;
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
