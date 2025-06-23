import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

// Sample data for countries and cities
const countries = [
  { COUNTRY_ID: 1, COUNTRY_NAME: "United States" },
  { COUNTRY_ID: 2, COUNTRY_NAME: "United Kingdom" },
  { COUNTRY_ID: 3, COUNTRY_NAME: "Canada" }
];

const cities = [
  { CITY_ID: 1, COUNTRY_ID: 1, CITY_NAME: "New York" },
  { CITY_ID: 2, COUNTRY_ID: 1, CITY_NAME: "Los Angeles" },
  { CITY_ID: 3, COUNTRY_ID: 1, CITY_NAME: "Chicago" },
  { CITY_ID: 4, COUNTRY_ID: 2, CITY_NAME: "London" },
  { CITY_ID: 5, COUNTRY_ID: 2, CITY_NAME: "Manchester" },
  { CITY_ID: 6, COUNTRY_ID: 2, CITY_NAME: "Birmingham" },
  { CITY_ID: 7, COUNTRY_ID: 3, CITY_NAME: "Toronto" },
  { CITY_ID: 8, COUNTRY_ID: 3, CITY_NAME: "Vancouver" },
  { CITY_ID: 9, COUNTRY_ID: 3, CITY_NAME: "Montreal" }
];

const jsonSchema = {
  type: "object",
  properties: {
    COUNTRY_ID: {
      type: "number",
      title: "Country"
    },
    CITY_ID: {
      type: "number",
      title: "City"
    }
  }
};

const getFilteredCities = (countryId) => {
  return countryId ? cities.filter(city => city.COUNTRY_ID === countryId) : [];
};

const locationUISchema = (countryId) => {
  const filteredCities = getFilteredCities(countryId);
  return {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        label: "Country",
        scope: "#/properties/COUNTRY_ID",
        options: {
          valueField: "COUNTRY_ID",
          labelField: "COUNTRY_NAME",
          data: countries
        }
      },
      {
        type: "Control",
        label: "City",
        scope: "#/properties/CITY_ID",
        options: {
          valueField: "CITY_ID",
          labelField: "CITY_NAME",
          data: filteredCities
        }
      }
    ]
  };
};

export default function ConditionalFilteringExample() {
  const isBrowser = useIsBrowser();
  const form = useRef(null);
  const previousCountry = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    if (form.current) {
      form.current.jsonSchema = jsonSchema;
      form.current.uischema = locationUISchema(undefined);
      form.current.data = { COUNTRY_ID: undefined, CITY_ID: undefined };

      const handleDataChange = (event) => {
        const { data } = event.detail;
        const currentCountry = data?.COUNTRY_ID;

        if (currentCountry !== previousCountry.current) {
          previousCountry.current = currentCountry;
          // Force reset of city when country changes
          form.current.data = { COUNTRY_ID: currentCountry, CITY_ID: undefined };
          form.current.uischema = locationUISchema(currentCountry);
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