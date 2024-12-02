import useIsBrowser from '@docusaurus/useIsBrowser';
import { useRef } from 'react';
import { CodeSection } from '../../../../../examples/ui/documentationBase';

const rowData = [
  { make: 'Toyota', model: 'Celica', price: 35000, year: 2021, color: 'red' },
  { make: 'Ford', model: 'Mondeo', price: 32000, year: 2020, color: 'blue' },
  { make: 'Porsche', model: 'Boxster', price: 72000, year: 2022, color: 'green' },
  { make: 'Subaru', model: 'Impreza', price: 25000, year: 2019, color: 'yellow' },
  { make: 'Nissan', model: 'Sentra', price: 20000, year: 2018, color: 'black' },
  { make: 'Chevrolet', model: 'Camaro', price: 40000, year: 2020, color: 'white' },
  { make: 'BMW', model: 'M3', price: 60000, year: 2021, color: 'silver' },
  { make: 'Audi', model: 'A4', price: 45000, year: 2022, color: 'orange' },
  { make: 'Mercedes', model: 'C-Class', price: 50000, year: 2020, color: 'purple' },
  { make: 'Volkswagen', model: 'Golf', price: 30000, year: 2019, color: 'brown' },
];

const columnDefs = [
  { headerName: 'Make', field: 'make', sortable: true, filter: true },
  { headerName: 'Model', field: 'model', sortable: true, filter: true },
  { headerName: 'Price', field: 'price', sortable: true, filter: true },
  { headerName: 'Year', field: 'year', sortable: true, filter: true },
  { headerName: 'Color', field: 'color', sortable: true, filter: true },
];

export default function GridProExample() {
  const isBrowser = useIsBrowser();
  const grid = useRef(null);

  if (isBrowser) {
    const RapidImports = require('../../../../../examples/ui/rapidImports');
    RapidImports.registerComponents();
  }

  const loadGridOptions = () => {
    if (grid.current) {
      grid.current.gridOptions = {
        defaultColDef: {
          resizable: true,
          filter: true,
        },
        columnDefs: columnDefs,
        rowData: rowData,
      };
    }
  };

  return (
    <CodeSection>
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', height: '200px' }}>
        <rapid-button onClick={loadGridOptions}>Load Grid Pro</rapid-button>
        <rapid-grid-pro ref={grid}></rapid-grid-pro>
      </div>
    </CodeSection>
  );
}
