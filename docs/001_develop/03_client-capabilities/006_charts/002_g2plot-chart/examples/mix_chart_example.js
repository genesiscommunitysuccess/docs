import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

const averageData = [
  { date: "2015-02", value: 21168 },
  { date: "2015-08", value: 21781 },
  { date: "2016-01", value: 23818 },
  { date: "2017-02", value: 25316 },
  { date: "2018-01", value: 26698 },
  { date: "2018-08", value: 27890 },
];

const offSetValues = {
  value1: 0.148,
  value2: 36,
  value3: 0.055,
  value4: 20,
};

export const chartConfiguration = {
  appendPadding: 8,
  tooltip: { shared: true },
  syncViewPadding: true,
  plots: [
    {
      type: "column",
      options: {
        data: [
          { date: "2015-02", value: 160 },
          { date: "2015-08", value: 245 },
          { date: "2016-01", value: 487 },
          { date: "2017-02", value: 500 },
          { date: "2018-01", value: 503 },
          { date: "2018-08", value: 514 },
        ],
        xField: "date",
        yField: "value",
        yAxis: {
          type: "log",
          max: 100000,
        },
        meta: {
          date: {
            sync: true,
          },
          value: {
            alias: "Example",
          },
        },
        label: {
          position: "middle",
        },
      },
    },
    {
      type: "line",
      options: {
        data: averageData,
        xField: "date",
        yField: "value",
        xAxis: false,
        yAxis: {
          type: "log",
          max: 100000,
        },
        label: {
          offsetY: -8,
        },
        meta: {
          value: {
            alias: "Test",
          },
        },
      },
    },
    {
      type: "line",
      options: {
        data: [
          { date: "2015-02", value: null },
          { date: "2015-08", value: 0.029 },
          { date: "2016-01", value: 0.094 },
          { date: "2017-02", value: 0.148 },
          { date: "2018-01", value: 0.055 },
          { date: "2018-08", value: 0.045 },
        ],
        xField: "date",
        yField: "value",
        xAxis: false,
        yAxis: {
          line: null,
          grid: null,
          position: "right",
          max: 0.16,
          tickCount: 8,
        },
        meta: {
          date: {
            sync: "date",
          },
          value: {
            alias: "Percent",
            formatter: (v) => `${(v * 100).toFixed(1)}%`,
          },
        },
        smooth: true,
        label: {
          callback: (value) => {
            return {
              offsetY:
                value === offSetValues.value1
                  ? offSetValues.value2
                  : value === offSetValues.value3
                  ? 0
                  : offSetValues.value4,
              style: {
                fill: "#1AAF8B",
                fontWeight: 700,
                stroke: "#fff",
                lineWidth: 1,
              },
            };
          },
        },
      },
    },
  ],
};

export default function MixChartExample() {
  const isBrowser = useIsBrowser();
  const chart = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    chart.current.config = chartConfiguration;
  });

  return (
    <CodeSection>
      <rapid-g2plot-chart type="mix" ref={chart}></rapid-g2plot-chart>
    </CodeSection>
  );
}
