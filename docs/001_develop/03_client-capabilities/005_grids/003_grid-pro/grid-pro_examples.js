import useIsBrowser from '@docusaurus/useIsBrowser';
import { useEffect, useRef, useState } from 'react';
import { CodeSection } from '../../../../../examples/ui/documentationBase';
import LoadingRing from '@site/src/components/Card/LoadingRing';

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

function GridProExampleBase({
  modifyGridOptions = (options) => options,
  gridHeight = '200px',
}) {
  const isBrowser = useIsBrowser();
  const grid = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isBrowser) {
      import('../../../../../examples/ui/rapidImports').then((RapidImports) => {
        RapidImports.registerComponents();
      });
    }
  }, [isBrowser]);

  const loadGridOptions = () => {
    if (grid.current) {
      let gridOptions = {
        defaultColDef: {
          resizable: true,
          filter: true,
        },
        columnDefs: columnDefs,
        rowData: rowData,
      };

      gridOptions = modifyGridOptions(gridOptions);

      grid.current.gridOptions = gridOptions;

      setIsLoaded(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { loadGridOptions(); }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CodeSection>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: gridHeight }}>
        <rapid-grid-pro ref={grid} ></rapid-grid-pro>
      </div>
    </CodeSection>
  );
}

export default function GridProExample() {
  return <GridProExampleBase />;
}

export function GridProExampleActionRenderer() {
  const modifyGridOptions = (gridOptions) => ({
    ...gridOptions,
    columnDefs: [
      ...gridOptions.columnDefs,
      {
        headerName: 'Action',
        cellRenderer: 'action',
        width: 200,
        pinned: 'right',
        cellRendererParams: {
          actionName: 'View',
          appearance: 'primary',
          actionClick: (rowData) => console.log('View Data', rowData),
        },
      },
    ],
  });

  return (
    <GridProExampleBase
      modifyGridOptions={modifyGridOptions}
      buttonText="Load Grid Pro with Action Renderer"
    />
  );
}

export function GridProExampleActionsMenuRenderer() {
  const modifyGridOptions = (gridOptions) => ({
    ...gridOptions,
    columnDefs: [
      ...gridOptions.columnDefs,
      {
        headerName: 'Actions',
        cellRenderer: 'actionsMenu',
        width: 300,
        pinned: 'right',
        cellRendererParams: {
          actions: [
            {
              name: 'View',
              callback: (rowData) => console.log('View Data', rowData),
            },
            {
              name: 'Delete',
              callback: (rowData) => console.log('Delete Data', rowData),
            },
            {
              name: 'Edit',
              callback: (rowData) => console.log('Edit Data', rowData),
            },
          ],
        },
      },
    ],
  });

  return (
    <GridProExampleBase
      modifyGridOptions={modifyGridOptions}
      buttonText="Load Grid Pro with Actions Menu Renderer"
    />
  );
}

export function GridProExampleBooleanRenderer() {
  const modifyGridOptions = (gridOptions) => {
    const modifiedRowData = gridOptions.rowData.map((row, index) => ({
      ...row,
      boolean: index % 2 === 0,
    }));

    return {
      ...gridOptions,
      columnDefs: [
        ...gridOptions.columnDefs,
        {
          headerName: 'Bought?',
          field: 'boolean',
          cellRenderer: 'boolean',
          width: 200,
          pinned: 'right',
        },
      ],
      rowData: modifiedRowData,
    };
  };

  return (
    <GridProExampleBase
      modifyGridOptions={modifyGridOptions}
      buttonText="Load Grid Pro with Boolean Renderer"
    />
  );
}

export function GridProExampleEditableRenderer() {
  const modifyGridOptions = (gridOptions) => ({
    ...gridOptions,
    columnDefs: gridOptions.columnDefs.map((colDef) => ({
      ...colDef,
      cellRenderer: 'editable',
    })),
  });

  return (
    <GridProExampleBase
      modifyGridOptions={modifyGridOptions}
      buttonText="Load Grid Pro with Editable Renderer"
    />
  );
}

export function GridProExampleSelectEditorRenderer() {
  const modifyGridOptions = (gridOptions) => ({
    ...gridOptions,
    columnDefs: [
      ...gridOptions.columnDefs,
      {
        headerName: 'In Storage?',
        field: 'inStorage',
        cellRenderer: 'selectEditor',
        cellRendererParams: {
          values: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: 'Maybe', value: 'maybe' },
          ],
          valueField: 'value',
          labelField: 'label',
        },
        width: 200,
        pinned: 'right',
      },
    ],
  });

  return (
    <GridProExampleBase
      modifyGridOptions={modifyGridOptions}
      buttonText="Load Grid Pro with Select Editor Renderer"
    />
  );
}

export function GridProExampleNumberEditor() {
  const modifyGridOptions = (gridOptions) => ({
    ...gridOptions,
    columnDefs: gridOptions.columnDefs.map((colDef) =>
      colDef.field === 'price'
        ? {
            ...colDef,
            cellEditor: 'numberEditor',
            cellEditorParams: {
              withFormatting: true,
              formatOptions: { style: 'currency', currency: 'USD' },
              placeholder: 'Enter amount',
              disabled: false,
            },
            editable: true,
            pinned: 'right',
          }
        : colDef
    ),
  });

  return (
    <GridProExampleBase
      modifyGridOptions={modifyGridOptions}
      gridHeight="300px"
      buttonText="Load Grid Pro with Number Editor Renderer"
    />
  );
}

export function GridProExampleMultiselectEditor() {
  const options = [
    { id: 'red', name: 'Red' },
    { id: 'blue', name: 'Blue' },
    { id: 'green', name: 'Green' },
    { id: 'yellow', name: 'Yellow' },
    { id: 'black', name: 'Black' },
    { id: 'white', name: 'White' },
  ];

  const modifyGridOptions = (gridOptions) => {
    const modifiedRowData = gridOptions.rowData.map((row) => ({
      ...row,
      availableColors: [],
    }));

    return {
      ...gridOptions,
      columnDefs: [
        ...gridOptions.columnDefs,
        {
          headerName: 'Available Colors',
          field: 'availableColors',
          cellEditor: 'multiselectEditor',
          cellEditorParams: {
            values: options,
            valueField: 'id',
            labelField: 'name',
            async: false,
            selectedOptionsCallback: (data) => data.availableColors,
          },
          width: 250,
          pinned: 'right',
          editable: true,
        },
      ],
      rowData: modifiedRowData,
    };
  };

  return (
    <GridProExampleBase
      modifyGridOptions={modifyGridOptions}
      gridHeight="300px"
      buttonText="Load Grid Pro with Multiselect Editor Renderer"
    />
  );
}

export function GridProExampleDateEditor() {
  const modifyGridOptions = (gridOptions) => {
    const modifiedRowData = gridOptions.rowData.map((row) => ({
      ...row,
      releaseDate: '2022-01-01',
    }));

    return {
      ...gridOptions,
      columnDefs: [
        ...gridOptions.columnDefs,
        {
          headerName: 'Release Date',
          field: 'releaseDate',
          cellEditor: 'dateEditor',
          cellEditorParams: {
            withTime: false,
          },
          width: 200,
          pinned: 'right',
          editable: true,
        },
      ],
      rowData: modifiedRowData,
    };
  };

  return (
    <GridProExampleBase
      modifyGridOptions={modifyGridOptions}
      gridHeight="300px"
      buttonText="Load Grid Pro with Date Editor Renderer"
    />
  );
}

export function GridProExampleStringEditor() {
  const modifyGridOptions = (gridOptions) => {
    const modifiedRowData = gridOptions.rowData.map((row) => ({
      ...row,
      notes: '',
    }));

    return {
      ...gridOptions,
      columnDefs: [
        ...gridOptions.columnDefs,
        {
          headerName: 'Notes',
          field: 'notes',
          cellEditor: 'stringEditor',
          cellEditorParams: {
            placeholder: 'Enter notes here',
          },
          width: 300,
          pinned: 'right',
          editable: true,
        },
      ],
      rowData: modifiedRowData,
    };
  };

  return (
    <GridProExampleBase
      modifyGridOptions={modifyGridOptions}
      gridHeight="300px"
      buttonText="Load Grid Pro with String Editor Renderer"
    />
  );
}
