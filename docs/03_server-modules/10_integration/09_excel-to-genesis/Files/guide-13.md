---
id: guide-13
sidebar_label: 'The view dictionary'
sidebar_position: 48
title: 'The view dictionary'
---

This file contains all the views that have been created by the conversion process.


```kotlin
views {
  view ("CASH_MGMT_DASHBOARD_VIEW", CASH_MGMT_DASHBOARD) {
    joins {
      joining(MAPPING) {
        on(CASH_MGMT_DASHBOARD.ACCT_CODE to MAPPING.BLOOMBERG_REFERENCE_NO)
      }
      joining(CUSTODY_POSITIONS) {
        on(CASH_MGMT_DASHBOARD.ACCOUNT_NUMBER to CUSTODY_POSITIONS.ACCOUNT_NUMBER_PREFERRED_PER_FORMATTED)
      }
      joining(FUND_ADMIN_BALANCES) {
        // unable to join using: "${"      "}${ACCT_CODE}"
        on(CASH_MGMT_DASHBOARD.ACCT_CODE to FUND_ADMIN_BALANCES.BALANCE_DATE)
      }
      joining(FUND_NAV) {
        on(CASH_MGMT_DASHBOARD.ACCT_CODE to FUND_NAV.BALANCE_DATE)
      }
    }
    fields {
      CASH_MGMT_DASHBOARD.allFields()
      MAPPING.CLIENT_LEGAL_NAME
      CUSTODY_POSITIONS.AVAILABLE_BALANCE_END_OF_DAY
      FUND_ADMIN_BALANCES.CURRENT_INVESTABLE
      FUND_NAV.MV_PLUS_PENDING
      derivedField("CONSOLIDATE_FUND", STRING) {
        // B: VLOOKUP(A2,ConsolidationMapping,2,FALSE)
        withInput(CASH_MGMT_DASHBOARD.ACCT_CODE, MAPPING.CLIENT_LEGAL_NAME) { ACCT_CODE, MAPPING_CLIENT_LEGAL_NAME -> 
          if(ACCT_CODE == null) return@withInput null
          if(MAPPING_CLIENT_LEGAL_NAME == null) return@withInput null
          MAPPING_CLIENT_LEGAL_NAME
        }
      }
      derivedField("CUSTODY_AVAILABLE_BALANCE_EOD", DOUBLE) {
        // F: VLOOKUP(D2,CustodyBalanceRange,3,FALSE)
        withInput(CASH_MGMT_DASHBOARD.ACCOUNT_NUMBER, CUSTODY_POSITIONS.AVAILABLE_BALANCE_END_OF_DAY) { ACCOUNT_NUMBER, CUSTODY_POSITIONS_AVAILABLE_BALANCE_END_OF_DAY -> 
          if(ACCOUNT_NUMBER == null) return@withInput null
          if(CUSTODY_POSITIONS_AVAILABLE_BALANCE_END_OF_DAY == null) return@withInput null
          CUSTODY_POSITIONS_AVAILABLE_BALANCE_END_OF_DAY
        }
      }
      derivedField("PERCENT_OF_NAV", DOUBLE) {
        // G: (F2/Q2)*100
        withInput(CASH_MGMT_DASHBOARD.ACCOUNT_NUMBER, CUSTODY_POSITIONS.AVAILABLE_BALANCE_END_OF_DAY, CASH_MGMT_DASHBOARD.ACCT_CODE, FUND_NAV.MV_PLUS_PENDING) { ACCOUNT_NUMBER, CUSTODY_POSITIONS_AVAILABLE_BALANCE_END_OF_DAY, ACCT_CODE, FUND_NAV_MV_PLUS_PENDING -> 
          if(ACCOUNT_NUMBER == null) return@withInput null
          if(CUSTODY_POSITIONS_AVAILABLE_BALANCE_END_OF_DAY == null) return@withInput null
          if(ACCT_CODE == null) return@withInput null
          if(FUND_NAV_MV_PLUS_PENDING == null) return@withInput null
          val CUSTODY_AVAILABLE_BALANCE_EOD = CUSTODY_POSITIONS_AVAILABLE_BALANCE_END_OF_DAY
          val NAV = FUND_NAV_MV_PLUS_PENDING
          (CUSTODY_AVAILABLE_BALANCE_EOD / NAV) * 100.0
        }
      }
      derivedField("FUND_ADMIN_BAL", DOUBLE) {
        // J: VLOOKUP(CONCATENATE("      ",A2),AIMData,3,FALSE)
        withInput(CASH_MGMT_DASHBOARD.ACCT_CODE, FUND_ADMIN_BALANCES.CURRENT_INVESTABLE) { ACCT_CODE, FUND_ADMIN_BALANCES_CURRENT_INVESTABLE -> 
          if(ACCT_CODE == null) return@withInput null
          if(FUND_ADMIN_BALANCES_CURRENT_INVESTABLE == null) return@withInput null
          FUND_ADMIN_BALANCES_CURRENT_INVESTABLE
        }
      }
      derivedField("BALANCE_DIFF", DOUBLE) {
        // K: ABS((F2-J2)/J2)
        withInput(CASH_MGMT_DASHBOARD.ACCOUNT_NUMBER, CUSTODY_POSITIONS.AVAILABLE_BALANCE_END_OF_DAY, CASH_MGMT_DASHBOARD.ACCT_CODE, FUND_ADMIN_BALANCES.CURRENT_INVESTABLE) { ACCOUNT_NUMBER, CUSTODY_POSITIONS_AVAILABLE_BALANCE_END_OF_DAY, ACCT_CODE, FUND_ADMIN_BALANCES_CURRENT_INVESTABLE -> 
          if(ACCOUNT_NUMBER == null) return@withInput null
          if(CUSTODY_POSITIONS_AVAILABLE_BALANCE_END_OF_DAY == null) return@withInput null
          if(ACCT_CODE == null) return@withInput null
          if(FUND_ADMIN_BALANCES_CURRENT_INVESTABLE == null) return@withInput null
          val CUSTODY_AVAILABLE_BALANCE_EOD = CUSTODY_POSITIONS_AVAILABLE_BALANCE_END_OF_DAY
          val FUND_ADMIN_BAL = FUND_ADMIN_BALANCES_CURRENT_INVESTABLE
          java.lang.Math.abs((CUSTODY_AVAILABLE_BALANCE_EOD - FUND_ADMIN_BAL) / FUND_ADMIN_BAL)
        }
      }
      derivedField("NAV", DOUBLE) {
        // Q: VLOOKUP(A2,NAVRange,4,FALSE)
        withInput(CASH_MGMT_DASHBOARD.ACCT_CODE, FUND_NAV.MV_PLUS_PENDING) { ACCT_CODE, FUND_NAV_MV_PLUS_PENDING -> 
          if(ACCT_CODE == null) return@withInput null
          if(FUND_NAV_MV_PLUS_PENDING == null) return@withInput null
          FUND_NAV_MV_PLUS_PENDING
        }
      }
    }
  }
  view ("CONSOLIDATED_FUNDS_VIEW", CONSOLIDATED_FUNDS) {
    fields {
      CONSOLIDATED_FUNDS.allFields()
      derivedField("HOLDINGS_LEVEL", DOUBLE) {
        // J: IF(G2<>0,H2/G2,0)
        withInput(CONSOLIDATED_FUNDS.SUM_OF_NAV, CONSOLIDATED_FUNDS.SUM_OF_FUND_HOLDINGS_LEVEL) { SUM_OF_NAV, SUM_OF_FUND_HOLDINGS_LEVEL -> 
          if(SUM_OF_NAV == null) return@withInput null
          if(SUM_OF_FUND_HOLDINGS_LEVEL == null) return@withInput null
          if (SUM_OF_NAV != 0.0) SUM_OF_FUND_HOLDINGS_LEVEL / SUM_OF_NAV else 0.0
        }
      }
      derivedField("GLF_LEVEL", DOUBLE) {
        // K: IF(G2<>0,I2/G2,0)
        withInput(CONSOLIDATED_FUNDS.SUM_OF_NAV, CONSOLIDATED_FUNDS.SUM_OF_GLF_HOLDINGS) { SUM_OF_NAV, SUM_OF_GLF_HOLDINGS -> 
          if(SUM_OF_NAV == null) return@withInput null
          if(SUM_OF_GLF_HOLDINGS == null) return@withInput null
          if (SUM_OF_NAV != 0.0) SUM_OF_GLF_HOLDINGS / SUM_OF_NAV else 0.0
        }
      }
    }
  }
  view ("CASH_MVMNT_ORDERS_VIEW", CASH_MVMNT_ORDERS) {
    joins {
      joining(CASH_MGMT_DASHBOARD) {
        on(CASH_MVMNT_ORDERS.ACCOUNT to CASH_MGMT_DASHBOARD.ACCT_CODE)
      }
    }
    fields {
      CASH_MVMNT_ORDERS.allFields()
      CASH_MGMT_DASHBOARD.MAX_DEPOSIT_AMOUNT_BASED_ON_PERCENT_LIMIT
      CASH_MGMT_DASHBOARD.POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT
      derivedField("SIDE", STRING) {
        // E: IF(VLOOKUP(C2, 'Cash Mgmt Dashboard'!$A$2:$Y$11, 22,FALSE)="SWEEP", "Buy", "Sell")
        withInput(CASH_MVMNT_ORDERS.ACCOUNT, CASH_MGMT_DASHBOARD.MAX_DEPOSIT_AMOUNT_BASED_ON_PERCENT_LIMIT) { ACCOUNT, CASH_MGMT_DASHBOARD_MAX_DEPOSIT_AMOUNT_BASED_ON_PERCENT_LIMIT -> 
          if(ACCOUNT == null) return@withInput null
          if(CASH_MGMT_DASHBOARD_MAX_DEPOSIT_AMOUNT_BASED_ON_PERCENT_LIMIT == null) return@withInput null
          if (CASH_MGMT_DASHBOARD_MAX_DEPOSIT_AMOUNT_BASED_ON_PERCENT_LIMIT == "SWEEP") "Buy" else "Sell"
        }
      }
      derivedField("FINAL_QUANTITY", DOUBLE) {
        // F: I2
        withInput(CASH_MVMNT_ORDERS.ACCOUNT, CASH_MGMT_DASHBOARD.POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT) { ACCOUNT, CASH_MGMT_DASHBOARD_POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT -> 
          if(ACCOUNT == null) return@withInput null
          if(CASH_MGMT_DASHBOARD_POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT == null) return@withInput null
          val SUGGESTED_QUANTITY = (CASH_MGMT_DASHBOARD_POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT / 10000.0) * 10000.0
          SUGGESTED_QUANTITY
        }
      }
      derivedField("SUGGESTED_QUANTITY", DOUBLE) {
        // I: ROUNDDOWN(VLOOKUP(C2, 'Cash Mgmt Dashboard'!$A$2:$Y$11, 23,FALSE)/10000,0)*10000
        withInput(CASH_MVMNT_ORDERS.ACCOUNT, CASH_MGMT_DASHBOARD.POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT) { ACCOUNT, CASH_MGMT_DASHBOARD_POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT -> 
          if(ACCOUNT == null) return@withInput null
          if(CASH_MGMT_DASHBOARD_POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT == null) return@withInput null
          (CASH_MGMT_DASHBOARD_POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT / 10000.0) * 10000.0
        }
      }
      derivedField("SECURITY_MAP", STRING) {
        // A: _xlfn.CONCAT(C2,B2)
        withInput(CASH_MVMNT_ORDERS.ACCOUNT, CASH_MVMNT_ORDERS.SECURITY) { ACCOUNT, SECURITY -> 
          if(ACCOUNT == null) return@withInput null
          if(SECURITY == null) return@withInput null
          "${ACCOUNT}${SECURITY}"
        }
      }
    }
  }
  view ("CUSTODY_POSITIONS_VIEW", CUSTODY_POSITIONS) {
    fields {
      CUSTODY_POSITIONS.allFields()
      derivedField("COMPOSITE_ACCOUNT_NUM", STRING) {
        // A: _xlfn.CONCAT(B2,C2)
        withInput(CUSTODY_POSITIONS.ACCOUNT_NAME, CUSTODY_POSITIONS.ACCOUNT_NUMBER_PREFERRED_PER_FORMATTED) { ACCOUNT_NAME, ACCOUNT_NUMBER_PREFERRED_PER_FORMATTED -> 
          if(ACCOUNT_NAME == null) return@withInput null
          if(ACCOUNT_NUMBER_PREFERRED_PER_FORMATTED == null) return@withInput null
          "${ACCOUNT_NAME}${ACCOUNT_NUMBER_PREFERRED_PER_FORMATTED}"
        }
      }
    }
  }
  view ("MARGIN_CALLS_VIEW", MARGIN_CALLS) {
    fields {
      MARGIN_CALLS.allFields()
      derivedField("RECALLACTIONFOUND", DOUBLE) {
        // V: IF(ISERR(SEARCH("Delivery", U2,1)), 0, SEARCH("Delivery", U2,1))
        withInput(MARGIN_CALLS.ACTION) { ACTION -> 
          if(ACTION == null) return@withInput null
          try {global.genesis.dictionary.pal.util.ExcelFormulaHelper.search("Delivery", ACTION, 1.0)} catch (e: Exception) {0.0}
        }
      }
      derivedField("RECALLACTIONFOUND_1", DOUBLE) {
        // W: IF(ISERR(SEARCH("Recall", U2,1)), 0, SEARCH("Recall", U2,1))
        withInput(MARGIN_CALLS.ACTION) { ACTION -> 
          if(ACTION == null) return@withInput null
          try {global.genesis.dictionary.pal.util.ExcelFormulaHelper.search("Recall", ACTION, 1.0)} catch (e: Exception) {0.0}
        }
      }
      derivedField("TYPE", STRING) {
        // X: IF(W2>0,"Inflow", IF(V2>0, "Outflow", "NO Flow"))
        withInput(MARGIN_CALLS.ACTION) { ACTION -> 
          if(ACTION == null) return@withInput null
          val RECALLACTIONFOUND_1 = try {global.genesis.dictionary.pal.util.ExcelFormulaHelper.search("Recall", ACTION, 1.0)} catch (e: Exception) {0.0}
          val RECALLACTIONFOUND = try {global.genesis.dictionary.pal.util.ExcelFormulaHelper.search("Delivery", ACTION, 1.0)} catch (e: Exception) {0.0}
          if (RECALLACTIONFOUND_1 > 0.0) "Inflow" else if (RECALLACTIONFOUND > 0.0) "Outflow" else "NO Flow"
        }
      }
    }
  }
  view ("T_BILL_HOLDINGS_VIEW", T_BILL_HOLDINGS) {
    fields {
      T_BILL_HOLDINGS.allFields()
      derivedField("TBILLID", STRING) {
        // A: _xlfn.CONCAT(B2,D2)
        withInput(T_BILL_HOLDINGS.ACCOUNT_CODE, T_BILL_HOLDINGS.ISIN) { ACCOUNT_CODE, ISIN -> 
          if(ACCOUNT_CODE == null) return@withInput null
          if(ISIN == null) return@withInput null
          "${ACCOUNT_CODE}${ISIN}"
        }
      }
    }
  }
  view ("FUND_HOLDINGS_VIEW", FUND_HOLDINGS) {
    fields {
      FUND_HOLDINGS.allFields()
      derivedField("FUND_COMP_ID", STRING) {
        // A: _xlfn.CONCAT(B2,C2)
        withInput(FUND_HOLDINGS.ACCOUNT_CODE, FUND_HOLDINGS.SECURITY_DESCRIPTION) { ACCOUNT_CODE, SECURITY_DESCRIPTION -> 
          if(ACCOUNT_CODE == null) return@withInput null
          if(SECURITY_DESCRIPTION == null) return@withInput null
          "${ACCOUNT_CODE}${SECURITY_DESCRIPTION}"
        }
      }
    }
  }
}
```