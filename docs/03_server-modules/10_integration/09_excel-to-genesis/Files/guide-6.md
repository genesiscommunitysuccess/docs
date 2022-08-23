---
id: guide-6
sidebar_label: 'The Request Server file'
sidebar_position: 60
title: 'The Request Server file'
---



This file shows the Request Servers that have been generated. Each `requestReply`  makes snapshot data available to the front end.

```kotlin
requestReplies {
  requestReply("MARGIN_AGGREGATE", MARGIN_AGGREGATE)
  requestReply("FUND_ADMIN_BALANCES", FUND_ADMIN_BALANCES)
  requestReply("FUND_NAV", FUND_NAV)
  requestReply("MAPPING", MAPPING)
  requestReply("COL_SUMMARY", COL_SUMMARY)
  requestReply("SHEET", SHEET)
  requestReply("CASH_MGMT_DASHBOARD", CASH_MGMT_DASHBOARD_VIEW)
  requestReply("CONSOLIDATED_FUNDS", CONSOLIDATED_FUNDS_VIEW)
  requestReply("CASH_MVMNT_ORDERS", CASH_MVMNT_ORDERS_VIEW)
  requestReply("CUSTODY_POSITIONS", CUSTODY_POSITIONS_VIEW)
  requestReply("MARGIN_CALLS", MARGIN_CALLS_VIEW)
  requestReply("T_BILL_HOLDINGS", T_BILL_HOLDINGS_VIEW)
  requestReply("FUND_HOLDINGS", FUND_HOLDINGS_VIEW)
}
```