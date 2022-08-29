---
title: 'Create a chart'
sidebar_label: 'Create a chart'
id: charts
---

Because web components it is very easy to integrate 3rd party libraries with our platform. 
You will see that on the example of integrating highcharts library with Genesis data.

You start with add new dependency to our project by running this command in terminal

```shell title='/client/web/'
lerna add highcharts
lerna add highcharts-webcomponent
```

Then you have to declare it in your `components.ts` file by adding following lines

```typescript title='components.ts'
import Highcharts from 'highcharts';
import DarkUnica from 'highcharts/themes/dark-unica';

DarkUnica(Highcharts);
```

Now go back to your template file and declare new chart in there

```typescript title='home.template.ts'
<highcharts-chart :options=${x => x.chartOptions}></highcharts-chart>
```

As you can see we bind `chartOptions` from our component definition to the `:options` property on the chart component.
Additionally, you need to declare datasource that will allow us to fetch data from the server

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

Now you will take care of fetching the data from the server and assigning it to the `chartOptions`.

You start by initializing data source with requested `resourceName` and fields that we want the data for.

Then you request snapshot of the data and assign the result to `series` property of chart options.

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

#### Final result

![](/img/charts.png)
