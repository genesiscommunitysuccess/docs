import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

const uiSchema = {
  type: "Stepper",
  options: {
    allowForwardJumps: false, // Controls whether users can jump to future steps
    allowBackwardJumps: false // Controls whether users can jump to previous steps
  },
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

// Example with forward jumping enabled
const uiSchemaWithForwardJumps = {
  type: "Stepper",
  options: {
    allowForwardJumps: true, // Enables jumping to future steps if validation passes
    allowBackwardJumps: false // Optional: can also allow backward navigation
  },
  elements: [
    // ... same elements as above ...
  ]
};

/**
 * Navigation Behavior:
 * - By default, stepper only allows sequential navigation (next/previous)
 * - With allowForwardJumps: true, users can click directly on future steps
 * - Forward jumping validates all intermediate steps before allowing the jump
 * - If validation fails on an intermediate step, the jump is prevented
 * - Forward jumping emits 'validation-failure' event if validation fails
 * - Forward jumping emits 'step-click' event on successful navigation
 */

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
  const isBrowser = useIsBrowser();
  const form = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

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