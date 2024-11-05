import { useEffect, useRef } from "react";
import { registerComponents } from "../../../../../../examples/ui/rapidImports";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";

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
        scope: '#/properties/swapDates'
      }
    ]
  }

  export default function ArrayFormUISchemaExample() {
    registerComponents();
  
    const form = useRef(null);
  
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