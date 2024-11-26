import { useEffect, useRef } from "react";
import { CodeSection } from "../../../../../examples/ui/documentationBase";
import useIsBrowser from "@docusaurus/useIsBrowser";

export const chartData = [
  {
    ts_code: "000001.SH",
    trade_date: "2020-03-13",
    close: 2887.4265,
    open: 2804.2322,
    high: 2910.8812,
    low: 2799.9841,
    vol: 366450436,
    amount: 393019665.2,
  },
  {
    ts_code: "000001.SH",
    trade_date: "2020-03-12",
    close: 2923.4856,
    open: 2936.0163,
    high: 2944.4651,
    low: 2906.2838,
    vol: 307778457,
    amount: 328209202.4,
  },
  {
    ts_code: "000001.SH",
    trade_date: "2020-03-11",
    close: 2968.5174,
    open: 3001.7616,
    high: 3010.0286,
    low: 2968.5174,
    vol: 352470970,
    amount: 378766619,
  },
  {
    ts_code: "000001.SH",
    trade_date: "2020-03-10",
    close: 2996.7618,
    open: 2918.9347,
    high: 3000.2963,
    low: 2904.7989,
    vol: 393296648,
    amount: 425017184.8,
  },
  {
    ts_code: "000001.SH",
    trade_date: "2020-03-09",
    close: 2943.2907,
    open: 2987.1805,
    high: 2989.2051,
    low: 2940.7138,
    vol: 414560736,
    amount: 438143854.6,
  },
  {
    ts_code: "000001.SH",
    trade_date: "2020-03-06",
    close: 3034.5113,
    open: 3039.9395,
    high: 3052.4439,
    low: 3029.4632,
    vol: 362061533,
    amount: 377388542.7,
  },
  {
    ts_code: "000001.SH",
    trade_date: "2020-03-05",
    close: 3071.6771,
    open: 3036.1545,
    high: 3074.2571,
    low: 3022.9262,
    vol: 445425806,
    amount: 482770471.4,
  },
  {
    ts_code: "000001.SH",
    trade_date: "2020-03-04",
    close: 3011.6657,
    open: 2981.806,
    high: 3012.0035,
    low: 2974.3583,
    vol: 353338278,
    amount: 389893917.5,
  },
  {
    ts_code: "000001.SH",
    trade_date: "2020-03-03",
    close: 2992.8968,
    open: 3006.8888,
    high: 3026.842,
    low: 2976.623,
    vol: 410108047,
    amount: 447053681.5,
  },
  {
    ts_code: "000001.SH",
    trade_date: "2020-03-02",
    close: 2970.9312,
    open: 2899.31,
    high: 2982.5068,
    low: 2899.31,
    vol: 367333369,
    amount: 397244201.2,
  },
];

export const chartConfiguration = {
  width: 700,
  xField: "trade_date",
  yField: ["open", "close", "high", "low"],
};

export default function StockChartExample() {
  const isBrowser = useIsBrowser();
  const chart = useRef(null);

  if (isBrowser) {
    const RapidImports = require("../../../../../examples/ui/rapidImports");
    RapidImports.registerComponents();
  }

  useEffect(() => {
    chart.current.data = chartData;
    chart.current.config = chartConfiguration;
  });

  return (
    <CodeSection>
      <rapid-g2plot-chart type="stock" ref={chart}></rapid-g2plot-chart>
    </CodeSection>
  );
}
