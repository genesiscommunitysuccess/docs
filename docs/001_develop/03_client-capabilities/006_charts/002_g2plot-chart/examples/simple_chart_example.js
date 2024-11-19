import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

const chartConfiguration = {
    width: 700,
    xField: "value",
    yField: "groupBy",
    seriesField: "series",
    legend: {
      position: "top-left",
    },
  };

  const chartData = [
    { groupBy: "1951", value: 38, series: "3" },
    { groupBy: "1952", value: 52, series: "5" },
    { groupBy: "1956", value: 61, series: "1" },
    { groupBy: "1957", value: 145, series: "2" },
    { groupBy: "1958", value: 48, series: "4" },
    { groupBy: "1996", value: 38, series: "6" },
    { groupBy: "1997", value: 52, series: "7" },
    { groupBy: "1999", value: 61, series: "8" },
    { groupBy: "1995", value: 145, series: "9" },
    { groupBy: "1994", value: 48, series: "10" },
  ];

export default function SimpleChartExample() {
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
      <rapid-g2plot-chart type="bar" ref={chart}></rapid-g2plot-chart>
    </CodeSection>
  );
}
