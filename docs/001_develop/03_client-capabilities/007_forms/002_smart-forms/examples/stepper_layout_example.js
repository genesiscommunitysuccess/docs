import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

const uiSchema = {
  type: "Stepper",
  elements: [
    {
      type: "Control",
      scope: "#",
      label: "Personal information",
      options: {
        childElements: [
          {
            type: "HorizontalLayout",
            elements: [
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
        ],
      },
    },
    {
      type: "Control",
      label: "Address",
      scope: "#",
      options: {
        childElements: [
          {
            type: "VerticalLayout",
            elements: [
              {
                type: "Control",
                label: "Street",
                scope: "#/properties/STREET",
              },
              {
                type: "Control",
                label: "Street Number",
                scope: "#/properties/STREET_NUMBER",
              },
            ],
          },
        ],
      },
    },
    {
      type: "Control",
      label: "Account details",
      scope: "#",
      options: {
        childElements: [
          {
            type: "VerticalLayout",
            elements: [
              {
                type: "Control",
                label: "Account",
                scope: "#/properties/ACCOUNT",
              },
              {
                type: "Control",
                label: "Amount",
                scope: "#/properties/AMOUNT",
              },
            ],
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
    ACCOUNT: {
      type: "string",
      description: "kotlin.String",
    },
    AMOUNT: {
      type: "string",
      description: "kotlin.String",
    },
  },
  additionalProperties: false,
  required: ["FIRST_NAME", "STREET", "ACCOUNT"],
};

export default function StepperFormUISchemaExample() {
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
        hide-submit-button
        design-system-prefix="rapid"
      ></foundation-form>
    </CodeSection>
  );
}
