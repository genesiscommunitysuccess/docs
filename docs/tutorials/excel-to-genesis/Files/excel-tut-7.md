---
id: excel-tut-7
sidebar_label: 'The data server file'
sidebar_position: 70
title: 'The data server file'
---



This file shows the data servers that have been generated. Each `query`  makes real-time data available to the front end.

```kotlin
dataServer {

  query("MARGIN_AGGREGATE", MARGIN_AGGREGATE)
  query("FUND_ADMIN_BALANCES", FUND_ADMIN_BALANCES)
  query("FUND_NAV", FUND_NAV)
  query("MAPPING", MAPPING)
  query("COL_SUMMARY", COL_SUMMARY)
  query("SHEET", SHEET)
  query("CASH_MGMT_DASHBOARD", CASH_MGMT_DASHBOARD_VIEW)
  query("CONSOLIDATED_FUNDS", CONSOLIDATED_FUNDS_VIEW)
  query("CASH_MVMNT_ORDERS", CASH_MVMNT_ORDERS_VIEW)
  query("CUSTODY_POSITIONS", CUSTODY_POSITIONS_VIEW)
  query("MARGIN_CALLS", MARGIN_CALLS_VIEW)
  query("T_BILL_HOLDINGS", T_BILL_HOLDINGS_VIEW)
  query("FUND_HOLDINGS", FUND_HOLDINGS_VIEW)
}

```