---
id: excel-tut-5
sidebar_label: 'The event handler file'
sidebar_position: 50
title: 'The event handler file'
---

This file provides insert, modify and delete events for each table generated.


```kotlin

eventHandler {

  eventHandler<CashMgmtDashboard>(name = "CASH_MGMT_DASHBOARD_INSERT") {
    onCommit { event ->
      val cashMgmtDashboard = event.details
      entityDb.insert(cashMgmtDashboard)
      ack()
    }
  }
  eventHandler<CashMgmtDashboard>(name = "CASH_MGMT_DASHBOARD_MODIFY") {
    onCommit { event ->
      val cashMgmtDashboard = event.details
      entityDb.modify(cashMgmtDashboard)
      ack()
    }
  }
  eventHandler<CashMgmtDashboard>(name = "CASH_MGMT_DASHBOARD_DELETE") {
    onCommit { event ->
      val cashMgmtDashboard = event.details
      entityDb.delete(cashMgmtDashboard)
      ack()
    }
  }
  eventHandler<ConsolidatedFunds>(name = "CONSOLIDATED_FUNDS_INSERT") {
    onCommit { event ->
      val consolidatedFunds = event.details
      entityDb.insert(consolidatedFunds)
      ack()
    }
  }
  eventHandler<ConsolidatedFunds>(name = "CONSOLIDATED_FUNDS_MODIFY") {
    onCommit { event ->
      val consolidatedFunds = event.details
      entityDb.modify(consolidatedFunds)
      ack()
    }
  }
  eventHandler<ConsolidatedFunds>(name = "CONSOLIDATED_FUNDS_DELETE") {
    onCommit { event ->
      val consolidatedFunds = event.details
      entityDb.delete(consolidatedFunds)
      ack()
    }
  }
  eventHandler<CashMvmntOrders>(name = "CASH_MVMNT_ORDERS_INSERT") {
    onCommit { event ->
      val cashMvmntOrders = event.details
      entityDb.insert(cashMvmntOrders)
      ack()
    }
  }
  eventHandler<CashMvmntOrders>(name = "CASH_MVMNT_ORDERS_MODIFY") {
    onCommit { event ->
      val cashMvmntOrders = event.details
      entityDb.modify(cashMvmntOrders)
      ack()
    }
  }
  eventHandler<CashMvmntOrders>(name = "CASH_MVMNT_ORDERS_DELETE") {
    onCommit { event ->
      val cashMvmntOrders = event.details
      entityDb.delete(cashMvmntOrders)
      ack()
    }
  }
  eventHandler<MarginAggregate>(name = "MARGIN_AGGREGATE_INSERT") {
    onCommit { event ->
      val marginAggregate = event.details
      entityDb.insert(marginAggregate)
      ack()
    }
  }
  eventHandler<MarginAggregate>(name = "MARGIN_AGGREGATE_MODIFY") {
    onCommit { event ->
      val marginAggregate = event.details
      entityDb.modify(marginAggregate)
      ack()
    }
  }
  eventHandler<MarginAggregate>(name = "MARGIN_AGGREGATE_DELETE") {
    onCommit { event ->
      val marginAggregate = event.details
      entityDb.delete(marginAggregate)
      ack()
    }
  }
  eventHandler<CustodyPositions>(name = "CUSTODY_POSITIONS_INSERT") {
    onCommit { event ->
      val custodyPositions = event.details
      entityDb.insert(custodyPositions)
      ack()
    }
  }
  eventHandler<CustodyPositions>(name = "CUSTODY_POSITIONS_MODIFY") {
    onCommit { event ->
      val custodyPositions = event.details
      entityDb.modify(custodyPositions)
      ack()
    }
  }
  eventHandler<CustodyPositions>(name = "CUSTODY_POSITIONS_DELETE") {
    onCommit { event ->
      val custodyPositions = event.details
      entityDb.delete(custodyPositions)
      ack()
    }
  }
  eventHandler<MarginCalls>(name = "MARGIN_CALLS_INSERT") {
    onCommit { event ->
      val marginCalls = event.details
      entityDb.insert(marginCalls)
      ack()
    }
  }
  eventHandler<MarginCalls>(name = "MARGIN_CALLS_MODIFY") {
    onCommit { event ->
      val marginCalls = event.details
      entityDb.modify(marginCalls)
      ack()
    }
  }
  eventHandler<MarginCalls>(name = "MARGIN_CALLS_DELETE") {
    onCommit { event ->
      val marginCalls = event.details
      entityDb.delete(marginCalls)
      ack()
    }
  }
  eventHandler<FundAdminBalances>(name = "FUND_ADMIN_BALANCES_INSERT") {
    onCommit { event ->
      val fundAdminBalances = event.details
      entityDb.insert(fundAdminBalances)
      ack()
    }
  }
  eventHandler<FundAdminBalances>(name = "FUND_ADMIN_BALANCES_MODIFY") {
    onCommit { event ->
      val fundAdminBalances = event.details
      entityDb.modify(fundAdminBalances)
      ack()
    }
  }
  eventHandler<FundAdminBalances>(name = "FUND_ADMIN_BALANCES_DELETE") {
    onCommit { event ->
      val fundAdminBalances = event.details
      entityDb.delete(fundAdminBalances)
      ack()
    }
  }
  eventHandler<FundNav>(name = "FUND_NAV_INSERT") {
    onCommit { event ->
      val fundNav = event.details
      entityDb.insert(fundNav)
      ack()
    }
  }
  eventHandler<FundNav>(name = "FUND_NAV_MODIFY") {
    onCommit { event ->
      val fundNav = event.details
      entityDb.modify(fundNav)
      ack()
    }
  }
  eventHandler<FundNav>(name = "FUND_NAV_DELETE") {
    onCommit { event ->
      val fundNav = event.details
      entityDb.delete(fundNav)
      ack()
    }
  }
  eventHandler<TBillHoldings>(name = "T_BILL_HOLDINGS_INSERT") {
    onCommit { event ->
      val tBillHoldings = event.details
      entityDb.insert(tBillHoldings)
      ack()
    }
  }
  eventHandler<TBillHoldings>(name = "T_BILL_HOLDINGS_MODIFY") {
    onCommit { event ->
      val tBillHoldings = event.details
      entityDb.modify(tBillHoldings)
      ack()
    }
  }
  eventHandler<TBillHoldings>(name = "T_BILL_HOLDINGS_DELETE") {
    onCommit { event ->
      val tBillHoldings = event.details
      entityDb.delete(tBillHoldings)
      ack()
    }
  }
  eventHandler<FundHoldings>(name = "FUND_HOLDINGS_INSERT") {
    onCommit { event ->
      val fundHoldings = event.details
      entityDb.insert(fundHoldings)
      ack()
    }
  }
  eventHandler<FundHoldings>(name = "FUND_HOLDINGS_MODIFY") {
    onCommit { event ->
      val fundHoldings = event.details
      entityDb.modify(fundHoldings)
      ack()
    }
  }
  eventHandler<FundHoldings>(name = "FUND_HOLDINGS_DELETE") {
    onCommit { event ->
      val fundHoldings = event.details
      entityDb.delete(fundHoldings)
      ack()
    }
  }
  eventHandler<Mapping>(name = "MAPPING_INSERT") {
    onCommit { event ->
      val mapping = event.details
      entityDb.insert(mapping)
      ack()
    }
  }
  eventHandler<Mapping>(name = "MAPPING_MODIFY") {
    onCommit { event ->
      val mapping = event.details
      entityDb.modify(mapping)
      ack()
    }
  }
  eventHandler<Mapping>(name = "MAPPING_DELETE") {
    onCommit { event ->
      val mapping = event.details
      entityDb.delete(mapping)
      ack()
    }
  }
  eventHandler<ColSummary>(name = "COL_SUMMARY_INSERT") {
    onCommit { event ->
      val colSummary = event.details
      entityDb.insert(colSummary)
      ack()
    }
  }
  eventHandler<ColSummary>(name = "COL_SUMMARY_MODIFY") {
    onCommit { event ->
      val colSummary = event.details
      entityDb.modify(colSummary)
      ack()
    }
  }
  eventHandler<ColSummary>(name = "COL_SUMMARY_DELETE") {
    onCommit { event ->
      val colSummary = event.details
      entityDb.delete(colSummary)
      ack()
    }
  }
  eventHandler<Sheet>(name = "SHEET_INSERT") {
    onCommit { event ->
      val sheet = event.details
      entityDb.insert(sheet)
      ack()
    }
  }
  eventHandler<Sheet>(name = "SHEET_MODIFY") {
    onCommit { event ->
      val sheet = event.details
      entityDb.modify(sheet)
      ack()
    }
  }
  eventHandler<Sheet>(name = "SHEET_DELETE") {
    onCommit { event ->
      val sheet = event.details
      entityDb.delete(sheet)
      ack()
    }
  }
}

```