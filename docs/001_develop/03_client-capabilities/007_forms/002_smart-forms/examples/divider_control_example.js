import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

const dividerUISchema = {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/input1",
        label: "Input 1",
      },
      {
        type: "Control",
        options: {
          divider: true,
        },
      },
      {
        type: "Control",
        scope: "#/properties/input2",
        label: "Input 2",
      },
    ],
  };

const dividerJSONSchema = {
  type: "object",
  properties: {
    input1: {
      type: "string",
      description: "kotlin.String",
    },
    input2: {
      type: "string",
      description: "kotlin.String",
    }
  },

};

export default function DividerControlExample() {
  const isBrowser = useIsBrowser();
  const form = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    form.current.jsonSchema = dividerJSONSchema;
    form.current.uischema = dividerUISchema;
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
