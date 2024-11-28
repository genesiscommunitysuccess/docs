import useIsBrowser from '@docusaurus/useIsBrowser';
import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../examples/ui/documentationBase";

const rowData = [
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxster', price: 72000 },
];

const columnDefs = [
  { headerName: 'Make', field: 'make', sortable: true, filter: true },
  { headerName: 'Model', field: 'model', sortable: true, filter: true },
  { headerName: 'Price', field: 'price', sortable: true, filter: true },
];

export default function GridProExample() {
	const isBrowser = useIsBrowser();
  const grid = useRef(null);

	if (isBrowser) {
		const RapidImports = require('../../../../../examples/ui/rapidImports');
		RapidImports.registerComponents();
	}

  useEffect(() => {
    grid.current.gridOptions = {
      defaultColDef: {
        resizable: true,
        filter: true,
      },
      columnDefs: columnDefs,
      rowData: rowData,
    };
  });

  return (
    <CodeSection>
      <rapid-grid-pro ref={grid}></rapid-grid-pro>
    </CodeSection>
  );
}
