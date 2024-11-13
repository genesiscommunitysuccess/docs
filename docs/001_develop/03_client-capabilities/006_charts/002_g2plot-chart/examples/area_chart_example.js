import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

export const chartConfiguration = {
  xField: "groupBy",
  yField: "value",
  xAxis: {
    range: [0, 1],
    tickCount: 5,
  },
};

export const chartData = [
  {
    groupBy: "2006 Q3",
    value: 1,
  },
  {
    groupBy: "2006 Q4",
    value: 1.08,
  },
  {
    groupBy: "2007 Q1",
    value: 1.17,
  },
  {
    groupBy: "2007 Q2",
    value: 1.26,
  },
  {
    groupBy: "2007 Q3",
    value: 1.34,
  },
  {
    groupBy: "2007 Q4",
    value: 1.41,
  },
  {
    groupBy: "2008 Q1",
    value: 1.52,
  },
  {
    groupBy: "2008 Q2",
    value: 1.67,
  },
  {
    groupBy: "2008 Q3",
    value: 1.84,
  },
  {
    groupBy: "2008 Q4",
    value: 2.07,
  },
  {
    groupBy: "2009 Q1",
    value: 2.39,
  },
];

export default function AreaChartExample() {
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
      <rapid-g2plot-chart type="area" ref={chart}></rapid-g2plot-chart>
    </CodeSection>
  );
}
