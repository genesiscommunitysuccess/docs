---
title: 'Create a user interface'
sidebar_label: 'Create a user interface'
id: create-a-user-interface
---

## Create a user interface

Now let's create a single page with a grid and a form for entering data.

For your user interface, the `genx` process has generated the following files:

- **home.template.ts**
- **home.ts**
- **home.styles.ts**

We are going to update the files **home.template.ts** and **home.ts**, so the application will be able to display a single page and enable you to insert a new trade.
As we are using *Micro Front-ends*, there is no need to change the file **home.styles.ts**; the styles will be inherited from the base components.


### EntityManagement

We want to be able to insert a Trade grid with data into our project. For this, we will use the *Micro Front-end* called **EntityManagement**.

First, open the file **home.ts** to import the Micro front-ends needed, as well as declaring EntityManagement after the imports.

```ts {2,4}
...
import {EntityManagement, Permissions} from '@genesislcap/foundation-entity-management';

EntityManagement; //imported from '@genesislcap/foundation-entity-management' to display Trade grid

const name = 'home-route';
...
```

Now, still in the **home.ts** file, let's add two constants to define:

- the columns config (*defaultColumnConfig*)
- the fields available (*COLUMNS*).

We need to declare the columns and permissions in the Home class as well.

```ts {5-10,13-39,47-48,52}
...
const name = 'home-route';

//describes the default config for the grid columns
const defaultColumnConfig = {
  enableCellChangeFlash: true,
  enableRowGroup: true,
  enablePivot: true,
  enableValue: true,
};

//grid columns that will be showed
const COLUMNS = [
  {
    ...defaultColumnConfig,
    field: 'TRADE_ID',
    headerName: 'Id',
  },
  {
    ...defaultColumnConfig,
    field: 'QUANTITY',
    headerName: 'Quantity',
  },
  {
    ...defaultColumnConfig,
    field: 'PRICE',
    headerName: 'Price',
  },
  {
    ...defaultColumnConfig,
    field: 'SYMBOL',
    headerName: 'Symbol',
  },
  {
    ...defaultColumnConfig,
    field: 'DIRECTION',
    headerName: 'Direction',
  },
];

@customElement({
  name,
  template,
  styles,
})
export class Home extends FASTElement {
  @observable columns: any = COLUMNS;
  @observable permissionsTrade: Permissions[] = []; 
  
  constructor() {
    super();
    this.permissionsTrade = [Permissions.add]; //permissions will show the Grid buttons
  }
}
```

We can now insert the grid into our page. Open the file **home.template.ts** and insert the *entity-management* tag using the class attributes we just created.

```ts {5-12}
import {html, } from '@microsoft/fast-element';
import type {Home} from './home';

export const HomeTemplate = html<Home>`
  <entity-management
      resourceName="ALL_TRADES"
      title = "Trades"
      entityLabel="Trades"
      createEvent = "EVENT_TRADE_INSERT"
      :columns=${x => x.columns}
      :permissions=${x => x.permissionsTrade}
  ></entity-management>
`;
```

At this point, the application is now able to display and insert data.