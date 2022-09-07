---
title: 'Create a chart'
sidebar_label: 'Create a chart'
id: charts
---

Because we use Web Components, it is very easy to integrate third-party libraries with the Genesis low-code platform. 
In this example, we shall integrate the highcharts library with Genesis data.

## Section objectives
The goal of this section is to add a data chart to the UI.

## Add, declare and bind
Start by adding a new dependency to our project by running this command in terminal:

```shell title='/client/web/'
lerna add highcharts
lerna add highcharts-webcomponent
```

Then you have to declare it in your `components.ts` file by adding the following lines:

```typescript title='components.ts'
import Highcharts from 'highcharts';
import DarkUnica from 'highcharts/themes/dark-unica';

DarkUnica(Highcharts);
```

Now go back to your template file and declare a new chart:

```typescript title='home.template.ts'
<highcharts-chart :options=${x => x.chartOptions}></highcharts-chart>
```

As you can see, we bind `chartOptions` from our component definition to the `:options` property on the chart component.

You also need to declare datasource that will allow us to fetch data from the server

```typescript title='home.ts'
import {Datasource} from '@genesislcap/foundation-comms';

@observable public chartOptions = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Notional breakdown',
    },
    series: [],
};

@Datasource tradeDatasource: Datasource;
```

## Fetching the data
Now you will define how to fetch the data from the server and assign it to the `chartOptions`.

Use the snippet below, where:

- We start by initialising the data source with the requested `resourceName` (`ALL-POSITIONS`) and the fields that we want the data for (`QUANTITY` and `INSTRUMENT NAME`).
- Then we request a snapshot of the data and assign the result to the `series` property of chart options.

```typescript title="home.ts"
public async connectedCallback()
{
    super.connectedCallback();

    await this.positionDatasource.init({
        resourceName: 'ALL_POSITIONS',
        fields: 'QUANTITY INSTRUMENT_NAME ',
    }, true);

    const positionsRequest = await this.positionDatasource.snapshot();

    this.chartOptions = {
        ...this.chartOptions,
        series: [{
            name: 'Positions',
            colorByPoint: true,
            data: positionsRequest["ROW"].map(row => ({
                name: row.INSTRUMENT_NAME,
                y: row.QUANTITY,
            }))
        }]
    };
}
```

## Conclusiong
You should have a data chart that resembles something like this:

![](/img/charts.png)
