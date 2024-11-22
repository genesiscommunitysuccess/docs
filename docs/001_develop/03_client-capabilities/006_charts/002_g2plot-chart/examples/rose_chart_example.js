import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

export const chartConfiguration = {
    width: 700,
    xField: 'groupBy',
    yField: 'value',
    seriesField: 'series',
    radius: 0.9,
    legend: {
      position: 'bottom',
    },
  };
  
  export const chartData = [
    { groupBy: '1951', value: 38, series: '3' },
    { groupBy: '1952', value: 52, series: '7' },
    { groupBy: '1956', value: 61, series: '1' },
    { groupBy: '1957', value: 145, series: '2' },
    { groupBy: '1958', value: 48, series: '4' },
  ];
  

export default function RoseChartExample() {
  const isBrowser = useIsBrowser();
  const chart = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    chart.current.config = chartConfiguration;
    chart.current.data = chartData;
  });

  return (
    <CodeSection>
      <rapid-g2plot-chart type="rose" ref={chart}></rapid-g2plot-chart>
    </CodeSection>
  );
}
