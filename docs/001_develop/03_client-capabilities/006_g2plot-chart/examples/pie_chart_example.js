import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

export const chartConfiguration = {
    width: 600,
    angleField: 'value',
    colorField: 'groupBy',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
      style: {
        fill: 'white',
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        content: '',
      },
    },
  };
  
  export const chartData = [
    { groupBy: 'Exam 1', value: 27 },
    { groupBy: 'Exam 2', value: 25 },
    { groupBy: 'Exam 3', value: 18 },
    { groupBy: 'Exam 4', value: 15 },
    { groupBy: 'Exam 5', value: 10 },
    { groupBy: 'Exam 6', value: 5 },
  ];
  

export default function PieChartExample() {
  const isBrowser = useIsBrowser();
  const chart = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    chart.current.config = chartConfiguration;
    chart.current.data = chartData;
  });

  return (
    <CodeSection>
      <rapid-g2plot-chart type="pie" ref={chart}></rapid-g2plot-chart>
    </CodeSection>
  );
}
