---
title: 'Angular - Position app'
sidebar_label: 'Position app'
id: angular-position-app
keywords: [web, integrations, angular]
tags:
    - web
    - integrations
    - angular
---

# Angular Position app

## Introduction

This tutorial will guide you through creating a responsive Angular application with layout using the `grid-layout` component. Additionally, it will demonstrate the integration of an entity manager for handling trade and position data, as well as the incorporation of a donut chart to visualize the data. The tutorial assumes you have a basic understanding of Angular and have already set up your project.

## Step 1: Set Up the Grid Layout

### 1.1 Create a Grid Layout with Tiles

```html
<zero-grid-layout row-count="2" col-count="2" class="content-around spacing-4x">
  <!-- Tile 1: Positions -->
  <zero-grid-layout-item col-number="1" row-number="1" width="1" height="1">
    <!-- Content for Positions -->
  </zero-grid-layout-item>

  <!-- Tile 2: Entity Management - Trades -->
  <zero-grid-layout-item col-number="2" row-number="1" width="1" height="1">
    <!-- Entity Manager for ALL_TRADES -->
  </zero-grid-layout-item>

  <!-- Tile 3: Donut Chart -->
  <zero-grid-layout-item col-number="1" row-number="2" width="1" height="1">
    <!-- Donut Chart -->
  </zero-grid-layout-item>

  <!-- Tile 4: Line Chart -->
  <zero-grid-layout-item col-number="2" row-number="2" width="1" height="1">
    <!-- Line Chart -->
  </zero-grid-layout-item>
</zero-grid-layout>
```
## Step 2: Display data

### 2.1 Add Positions Grid with grid-pro

```html
<!-- Tile 1: Positions -->
<zero-grid-layout-item col-number="1" row-number="1" width="1" height="1">
  <zero-grid-pro>
    <grid-pro-genesis-datasource
      resource-name="ALL_POSITIONS"
    ></grid-pro-genesis-datasource>
  </zero-grid-pro>
</zero-grid-layout-item>
```

### 2.2 Add Entity Management for Trades

```html
<!-- Tile 2: Entity Management - Trades -->
<zero-grid-layout-item col-number="2" row-number="1" width="1" height="1">
  <entity-management
    resourceName="ALL_TRADES"
    [createFormUiSchema]="addTradeFormSchema"
    title="TRADES"
    createEvent="EVENT_TRADE_INSERT"
    updateEvent="EVENT_TRADE_MODIFY"
    deleteEvent="EVENT_TRADE_DELETE"
  ></entity-management>
</zero-grid-layout-item>
```

```typescript
// In your component.ts file
addTradeFormSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      scope: '#/properties/QUANTITY',
      label: 'Quantity',
    },
    {
      scope: '#/properties/PRICE',
      label: 'Price',
    },
    {
      scope: '#/properties/COUNTERPARTY_ID',
      options: {
        allOptionsResourceName: 'COUNTERPARTY',
        valueField: 'COUNTERPARTY_ID',
        labelField: 'NAME',
      },
      label: 'Counterparty',
    },
    {
      scope: '#/properties/INSTRUMENT_ID',
      options: {
        allOptionsResourceName: 'INSTRUMENT',
        valueField: 'INSTRUMENT_ID',
        labelField: 'NAME',
      },
      label: 'Instrument',
    },
    {
      scope: '#/properties/SIDE',
      label: 'Side',
    },
  ],
};

// ... other component code
```

## Step 3: Incorporate Donut Chart

### 3.1 Add Positions Donut Chart with Configuration

```html
<!-- Tile 3: Donut Chart -->
<zero-grid-layout-item col-number="1" row-number="2" width="1" height="1">
  <zero-g2plot-chart type="donut" [config]="donutChartConfig">
    <chart-datasource
      resourceName="ALL_CHART_DATA"
      server-fields="SIDE INSTRUMENT_SIDE_ALLOCATION"
      charts-fields="groupBy value"
      isSnapshot="false"
      [criteria]="allocationCriteria"
    ></chart-datasource>
  </zero-g2plot-chart>
</zero-grid-layout-item>
```

```typescript
// In your component.ts file
donutChartConfig = {
  angleField: 'value',
  colorField: 'groupBy',
  label: {
    type: 'spider',
    labelHeight: 28,
    content: '{name}\n{percentage}',
    style: {
      fill: 'white',
    },
  },
  interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
};

allocationCriteria = ''; // Empty string initially
```

## Step 4: Handle Row Selection Change
### 4.1 Add Event Handler in HTML

In your component HTML template, add an event handler for row selection change:

```html
 <zero-grid-pro
    // highlight-next-line
    (rowClicked)="onRowClicked($event)"
 >
    <grid-pro-genesis-datasource
        resource-name="ALL_POSITIONS"
    ></grid-pro-genesis-datasource>
 </zero-grid-pro>
```
### 4.2 Implement Function Handling Row Selection

Now, implement the `onRowClicked` function in your `component.ts` file:

```typescript
// In your component.ts file
onRowClicked(e: Event) {
    this.allocationCriteria = `((INSTRUMENT_ID == '${(e as CustomEvent).detail.data.INSTRUMENT_ID}'))`;
}
```
