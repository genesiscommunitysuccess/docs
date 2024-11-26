import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

export const chartConfiguration = {
  width: 700,
  xField: "groupBy",
  yField: "value",
  label: {
    position: "middle",
    style: {
      fill: "#FFFFFF",
      opacity: 0.6,
    },
  },
  xAxis: {
    label: {
      autoHide: true,
      autoRotate: false,
    },
  },
};

export const chartData = [
  {
    groupBy: "Exam 1",
    value: 38,
  },
  {
    groupBy: "Exam 2",
    value: 52,
  },
  {
    groupBy: "Exam 3",
    value: 61,
  },
  {
    groupBy: "Exam 4",
    value: 145,
  },
  {
    groupBy: "Exam 5",
    value: 48,
  },
  {
    groupBy: "Exam 6",
    value: 38,
  },
];

export default function ColumnChartExample() {
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
      <rapid-g2plot-chart type="column" ref={chart}></rapid-g2plot-chart>
    </CodeSection>
  );
}
