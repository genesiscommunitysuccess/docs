---
id: guide-12
sidebar_label: 'The tables dictionary'
sidebar_position: 46
title: 'The tables dictionary'
---

This file contains all the tables that have been created by the conversion proceess.

```kotlin
tables {
  table (name = "CASH_MGMT_DASHBOARD", id = 10000) {
    // Source: Cash Mgmt Dashboard
    ACCT_CODE                                                            // A
    ACCOUNT_NAME                                                         // C
    ACCOUNT_NUMBER                                                       // D
    ACCOUNT_CURRENCY                                                     // E
    AVAILABLE_BALANCE_DATE                                               // H
    PREVIOUS_CLOSE_BALANCE                                               // I
    EXPECTED_MARGIN_INFLOWS                                              // L (aggregation SUMIF(MarginAcccounts,A2,MarginInflows))
    EXPECTED_MARGIN_OUTFLOWS                                             // M (aggregation SUMIF(MarginAcccounts,A2,MarginOutFlows))
    NET_AVAILABLE_BALANCE                                                // N (aggregation MIN(F2,J2)+M2)
    TBILLS_HOLDINGS                                                      // O (aggregation SUMIF(TBillHoldings,A2,TBillSum))
    CURRENT_FUNDING_POSN                                                 // P unable to parse: IFERROR(VLOOKUP(A2,GLFHoldingsRange,3,FALSE),0); see log for details
    FUND_HOLDINGS_LEVEL                                                  // R (aggregation SUMIF(FundAcctRande,A2,FundValues))
    PERCENT_OF_FUNDS_ALL                                                 // S (aggregation R2/Q2)
    SUGGESTED_ACTION                                                     // T (aggregation IF(K22>10%,IF(J22>F22+M22,"SWEEP","CheckReconciliation"),IF(AND(N22>0,S22<=8%),"SWEEP",IF(AND(N22<0,#REF!> 0),"Redeem","Not Able to recommend"))))
    DEPOSIT_AMOUNT_ON_MAY_IN_PERCENT_HAIR_CUT_AND_MAX_PERCENT_ON_FUNDS   // U (aggregation IF(N2>=0,MIN(N2*0.8, Q2*0.08-R2),IF(T2="Redeem",-MIN(-N2,#REF!))))
    MAX_DEPOSIT_AMOUNT_BASED_ON_PERCENT_LIMIT                            // V (aggregation Q2*0.08-R2)
    POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT                                  // W (aggregation MIN(O2, V2-U2))
    EXPECTED_BALANCE_AFTER_REDEMPTION_PER_DEPOSIT_CASH_ONLY_NO_TBILLS    // X (aggregation F3-U3)
    EXPECTED_CASH_BALANCE_PERCENT                                        // Y (aggregation X2/Q2)
    primaryKey {
      ACCT_CODE
    }
  }
  table (name = "CONSOLIDATED_FUNDS", id = 10001) {
    // Source: Consolidated Funds
    CONSOLIDATED_FUNDS           // A
    CUSTODY_BALANCE              // B
    FUND_ADMIN_BALANCE           // C
    SUM_OF_TBILLS_HOLDINGS       // D
    EXP_MARGIN_OUTFLOWS          // E
    EXP_MARGIN_INFLOW            // F
    SUM_OF_NAV                   // G
    SUM_OF_FUND_HOLDINGS_LEVEL   // H
    SUM_OF_GLF_HOLDINGS          // I
    primaryKey {
      CONSOLIDATED_FUNDS
    }
  }
  table (name = "CASH_MVMNT_ORDERS", id = 10002) {
    // Source: Cash Mvmnt Orders
    SECURITY               // B
    ACCOUNT                // C
    BROKER                 // D
    ORDERG_PRICE           // G
    UPDATE_CASH            // H
    CUSTODY_CASH_ACCOUNT   // J
    TA_ACCOUTNS            // K
    TA_REGISTRATION_NAME   // L
    primaryKey {
      ACCOUNT
      SECURITY
    }
  }
  table (name = "MARGIN_AGGREGATE", id = 10003) {
    // Source: Margin Aggregate
    ACTION           // A
    MULTIPLE_ITEMS   // B
    FIELD_2          // C
    primaryKey {
      ACTION
    }
  }
  table (name = "CUSTODY_POSITIONS", id = 10004) {
    // Source: 1. Custody Positions
    ACCOUNT_NAME                             // B
    ACCOUNT_NUMBER_PREFERRED_PER_FORMATTED   // C
    ACCOUNT_CURRENCY                         // D
    AVAILABLE_BALANCE_END_OF_DAY             // E
    AVAILABLE_BALANCE_DATE                   // F
    AVAILABLE_BALANCE_PREVIOUS_DAY_CLOSING   // G
    primaryKey {
      ACCOUNT_NAME
      ACCOUNT_NUMBER_PREFERRED_PER_FORMATTED
    }
    indices {
      unique {
        ACCOUNT_NUMBER_PREFERRED_PER_FORMATTED
      }
    }
  }
  table (name = "MARGIN_CALLS", id = 10005) {
    // Source: 2. Margin Calls
    PRINCIPAL                                          // A
    AGREEMENT_DESCRIPTION                              // B
    COUNTERPARTY                                       // C
    BASE_THRESHOLD_PRINCIPAL                           // D
    BASE_MIN_TRANSFER_PRINCIPAL                        // E
    BASE_THRESHOLD_COUNTERPARTY                        // F
    BASE_MIN_TRANSFER_COUNTERPARTY                     // G
    BASE_TOTAL_EXPOSURE_AMOUNT                         // H
    BASE_ADJUSTED_COLLATERAL_VALUE_HELD_BY_PRINCIPAL   // I
    BASE_PRINCIPAL_IA                                  // J
    BASE_ADJUSTED_COLLATERAL_VALUE_HELD_BY_CPTY        // K
    BASE_COUNTERPARTY_IA                               // L
    BASE_CALL_AMOUNT                                   // M
    BASE_ADJUSTED_EXPOSURE                             // N
    COUNTERPARTY_AMOUNT                                // O
    DISPUTE_AGE                                        // P
    DISPUTE_VALUE                                      // Q
    REPORTING_ADJUSTED_EXPOSURE                        // R
    REPORTING_CALL_AMOUNT                              // S
    BASE_CURRENCY                                      // T
    ACTION                                             // U
    primaryKey {
      PRINCIPAL
    }
  }
  table (name = "FUND_ADMIN_BALANCES", id = 10006) {
    // Source: 3. Fund Admin Balances
    BALANCE_DATE            // A
    OPEN_INVESTABLE         // B
    CURRENT_INVESTABLE      // C
    OPEN_NONINVESTABLE      // D
    CURRENT_NONINVESTABLE   // E
    primaryKey {
      BALANCE_DATE
    }
  }
  table (name = "FUND_NAV", id = 10007) {
    // Source: 4. Fund NAV
    BALANCE_DATE      // A
    NAV_ID            // B
    ACCOUNT_CODE      // C
    MV_PLUS_PENDING   // D
    MKTVALL           // E
    primaryKey {
      BALANCE_DATE
    }
  }
  table (name = "T_BILL_HOLDINGS", id = 10008) {
    // Source: 5. T Bill Holdings
    ACCOUNT_CODE           // B
    SECURITY_DESCRIPTION   // C
    ISIN                   // D
    ASSET_TYPE             // E
    DAYS_TO_MATURITY       // F
    UNDERLYING_PARSEKEY    // G
    CURRENCY               // H
    MKTVALL                // I
    MV_PLUS_PENDING        // J
    primaryKey {
      ACCOUNT_CODE
      ISIN
    }
  }
  table (name = "FUND_HOLDINGS", id = 10009) {
    // Source: 6. Fund Holdings
    ACCOUNT_CODE           // B
    SECURITY_DESCRIPTION   // C
    ISIN                   // D
    ASSET_TYPE             // E
    DAYS_TO_MATURITY       // F
    UNDERLYING_PARSEKEY    // G
    CURRENCY               // H
    MKTVALL                // I
    MV_PLUS_PENDING        // J
    primaryKey {
      ACCOUNT_CODE
      SECURITY_DESCRIPTION
    }
  }
  table (name = "MAPPING", id = 10010) {
    // Source: Mapping
    BLOOMBERG_REFERENCE_NO   // A
    CLIENT_LEGAL_NAME        // B
    primaryKey {
      BLOOMBERG_REFERENCE_NO
    }
  }
  table (name = "COL_SUMMARY", id = 10011) {
    // Source: Col Summary
    ROW_LABELS                     // A
    SUM_OF_REPORTING_CALL_AMOUNT   // B
    primaryKey {
      ROW_LABELS
    }
  }
  table (name = "SHEET", id = 10012) {
    // Source: Sheet2
    NOTES   // A
    primaryKey {
      NOTES
    }
  }
}
```