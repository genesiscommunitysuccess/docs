import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

export const formsWithArraysJsonSchema = {
    properties: {
      swapDates: {
        type: 'array',
        title: 'Swap Schedule',
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'number',
              description: 'org.joda.time.DateTime',
            },
            amount: {
              type: 'number'
            },
            notes: {
              type: 'string'
            }
          },
          required: [ 'date', 'number' ]
        }
      }
    }
  }
  
  export const formsWithArraysUiSchema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/swapDates',
        options: {
          childUiSchema: {
            type: "HorizontalLayout",
            elements: [
              {
                type: "Control",
                scope: "#/properties/date",
                label: "Date",
              },
              {
                type: "Control",
                scope: "#/properties/amount",
                label: "Amount",
              },
              {
                type: "Control",
                scope: "#/properties/notes",
                label: "Notes",
                options: {
                  textarea: true,
                }
              },
            ],
          },
        }
      }
    ]
  }

  export default function ArrayFormUISchemaExample() {
    const isBrowser = useIsBrowser();
    const form = useRef(null);
  
    if (isBrowser) {
      const RapidImports = require("../../../../../../examples/ui/rapidImports");
      RapidImports.registerComponents();
    }
  
    useEffect(() => {
      form.current.jsonSchema = formsWithArraysJsonSchema;
      form.current.uischema = formsWithArraysUiSchema;
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