import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

const jsonSchema = {
  type: "object",
  properties: {
    NOTIONAL: {
      type: "number",
      title: "Notional"
    },
    PREMIUM_AMOUNT: {
      type: "number",
      title: "Premium Amount"
    },
    PREMIUM_BPS: {
      type: "number",
      title: "Premium (BPS)"
    }
  }
};

const uiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      label: "Notional",
      scope: "#/properties/NOTIONAL"
    },
    {
      type: "Control",
      label: "Premium Amount",
      scope: "#/properties/PREMIUM_AMOUNT"
    },
    {
      type: "Control",
      label: "Premium (BPS)",
      scope: "#/properties/PREMIUM_BPS"
    }
  ]
};

export default function CalculationExample() {
  const isBrowser = useIsBrowser();
  const form = useRef(null);
  const previousData = useRef({ NOTIONAL: undefined, PREMIUM_AMOUNT: undefined, PREMIUM_BPS: undefined });

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    if (form.current) {
      form.current.jsonSchema = jsonSchema;
      form.current.uischema = uiSchema;
      form.current.data = { NOTIONAL: undefined, PREMIUM_AMOUNT: undefined, PREMIUM_BPS: undefined };

      const handleDataChange = (event) => {
        const { data } = event.detail;
        const prev = previousData.current;

        const notionalChanged = prev.NOTIONAL !== data.NOTIONAL;
        const premiumBpsChanged = prev.PREMIUM_BPS !== data.PREMIUM_BPS;
        const premiumAmountChanged = prev.PREMIUM_AMOUNT !== data.PREMIUM_AMOUNT;

        if ((notionalChanged || premiumBpsChanged) && data.NOTIONAL != null && data.PREMIUM_BPS != null) {
          const newData = { ...data, PREMIUM_AMOUNT: (data.NOTIONAL * data.PREMIUM_BPS) / 10000 };
          previousData.current = newData;
          form.current.data = newData;
        } else if (premiumAmountChanged && data.NOTIONAL != null && data.PREMIUM_AMOUNT != null) {
          const newData = { ...data, PREMIUM_BPS: (data.PREMIUM_AMOUNT * 10000) / data.NOTIONAL };
          previousData.current = newData;
          form.current.data = newData;
        } else {
          previousData.current = data;
        }
      };

      form.current.addEventListener('data-change', handleDataChange);
      return () => form.current?.removeEventListener('data-change', handleDataChange);
    }
  }, []);

  return (
    <CodeSection>
      <foundation-form
        ref={form}
        design-system-prefix="rapid"
      ></foundation-form>
    </CodeSection>
  );
}
