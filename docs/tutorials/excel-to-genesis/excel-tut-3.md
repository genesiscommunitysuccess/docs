---
id: excel-tut-3
sidebar_label: 'Check the files'
sidebar_position: 30
title: 'Check the files and load the data'
---



Now you have run the conversion script, let's look at the files that have been created:

![](/img/the-command-and-what-it-gives-you.png)

The conversion has created a folder called **`/home/core/run/cash.cfg`**. This contains:

* The field definitions are in the file `cash-fields-dictionary.kts`
* The table definitions are in the file `cash-tables-dictionary.kts`
* The views definitions are in the file `cash-view-dictionary.kts`
* There 10 files of data. The data from each worksheet has been extracted to a separate csv file.

### The Fields file

Inside the file `cash-fields-dictionary.kts`, you can see all the fields that have been defined.

```kotlin
fields {
  field(name = "ACCOUNT", type = STRING)
  field(name = "ACCOUNT_CODE", type = STRING)
  field(name = "ACCOUNT_CURRENCY", type = STRING)
  field(name = "ACCOUNT_NAME", type = STRING)
  field(name = "ACCOUNT_NUMBER", type = STRING)
  field(name = "ACCOUNT_NUMBER_PREFERRED_PER_FORMATTED", type = STRING)
  field(name = "ACCT_CODE", type = STRING)
  field(name = "ACTION", type = STRING)
  field(name = "AGREEMENT_DESCRIPTION", type = STRING)
  field(name = "ASSET_TYPE", type = STRING)
  field(name = "AVAILABLE_BALANCE_DATE", type = STRING)
  field(name = "AVAILABLE_BALANCE_END_OF_DAY", type = DOUBLE)
  field(name = "AVAILABLE_BALANCE_PREVIOUS_DAY_CLOSING", type = DOUBLE)
  field(name = "BALANCE_DATE", type = STRING)
  field(name = "BASE_ADJUSTED_COLLATERAL_VALUE_HELD_BY_CPTY", type = DOUBLE)
  field(name = "BASE_ADJUSTED_COLLATERAL_VALUE_HELD_BY_PRINCIPAL", type = LONG)
  field(name = "BASE_ADJUSTED_EXPOSURE", type = DOUBLE)
  field(name = "BASE_CALL_AMOUNT", type = DOUBLE)
  field(name = "BASE_COUNTERPARTY_IA", type = LONG)
  field(name = "BASE_CURRENCY", type = STRING)
  field(name = "BASE_MIN_TRANSFER_COUNTERPARTY", type = LONG)
  field(name = "BASE_MIN_TRANSFER_PRINCIPAL", type = LONG)
  field(name = "BASE_PRINCIPAL_IA", type = LONG)
  field(name = "BASE_THRESHOLD_COUNTERPARTY", type = STRING)
  field(name = "BASE_THRESHOLD_PRINCIPAL", type = STRING)
  field(name = "BASE_TOTAL_EXPOSURE_AMOUNT", type = DOUBLE)
  field(name = "BLOOMBERG_REFERENCE_NO", type = STRING)
  field(name = "BROKER", type = STRING)
  field(name = "CLIENT_LEGAL_NAME", type = STRING)
  field(name = "CONSOLIDATED_FUNDS", type = STRING)
  field(name = "COUNTERPARTY", type = STRING)
  field(name = "COUNTERPARTY_AMOUNT", type = LONG)
  field(name = "CURRENCY", type = STRING)
  field(name = "CURRENT_FUNDING_POSN", type = DOUBLE)
  field(name = "CURRENT_INVESTABLE", type = DOUBLE)
  field(name = "CURRENT_NONINVESTABLE", type = DOUBLE)
  field(name = "CUSTODY_BALANCE", type = STRING)
  field(name = "CUSTODY_CASH_ACCOUNT", type = STRING)
  field(name = "DAYS_TO_MATURITY", type = DOUBLE)
  field(name = "DEPOSIT_AMOUNT_ON_MAY_IN_PERCENT_HAIR_CUT_AND_MAX_PERCENT_ON_FUNDS", type = DOUBLE)
  field(name = "DISPUTE_AGE", type = LONG)
  field(name = "DISPUTE_VALUE", type = LONG)
  field(name = "EXPECTED_BALANCE_AFTER_REDEMPTION_PER_DEPOSIT_CASH_ONLY_NO_TBILLS", type = DOUBLE)
  field(name = "EXPECTED_CASH_BALANCE_PERCENT", type = DOUBLE)
  field(name = "EXPECTED_MARGIN_INFLOWS", type = DOUBLE)
  field(name = "EXPECTED_MARGIN_OUTFLOWS", type = DOUBLE)
  field(name = "EXP_MARGIN_INFLOW", type = DOUBLE)
  field(name = "EXP_MARGIN_OUTFLOWS", type = DOUBLE)
  field(name = "FIELD_2", type = STRING)
  field(name = "FUND_ADMIN_BALANCE", type = DOUBLE)
  field(name = "FUND_HOLDINGS_LEVEL", type = DOUBLE)
  field(name = "ISIN", type = STRING)
  field(name = "MAX_DEPOSIT_AMOUNT_BASED_ON_PERCENT_LIMIT", type = DOUBLE)
  field(name = "MKTVALL", type = DOUBLE)
  field(name = "MULTIPLE_ITEMS", type = STRING)
  field(name = "MV_PLUS_PENDING", type = DOUBLE)
  field(name = "NAV_ID", type = STRING)
  field(name = "NET_AVAILABLE_BALANCE", type = DOUBLE)
  field(name = "NOTES", type = STRING)
  field(name = "OPEN_INVESTABLE", type = DOUBLE)
  field(name = "OPEN_NONINVESTABLE", type = DOUBLE)
  field(name = "ORDERG_PRICE", type = LONG)
  field(name = "PERCENT_OF_FUNDS_ALL", type = DOUBLE)
  field(name = "POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT", type = DOUBLE)
  field(name = "PREVIOUS_CLOSE_BALANCE", type = DOUBLE)
  field(name = "PRINCIPAL", type = STRING)
  field(name = "REPORTING_ADJUSTED_EXPOSURE", type = DOUBLE)
  field(name = "REPORTING_CALL_AMOUNT", type = DOUBLE)
  field(name = "ROW_LABELS", type = STRING)
  field(name = "SECURITY", type = STRING)
  field(name = "SECURITY_DESCRIPTION", type = STRING)
  field(name = "SUGGESTED_ACTION", type = STRING)
  field(name = "SUM_OF_FUND_HOLDINGS_LEVEL", type = DOUBLE)
  field(name = "SUM_OF_GLF_HOLDINGS", type = DOUBLE)
  field(name = "SUM_OF_NAV", type = DOUBLE)
  field(name = "SUM_OF_REPORTING_CALL_AMOUNT", type = DOUBLE)
  field(name = "SUM_OF_TBILLS_HOLDINGS", type = DOUBLE)
  field(name = "TA_ACCOUTNS", type = STRING)
  field(name = "TA_REGISTRATION_NAME", type = STRING)
  field(name = "TBILLS_HOLDINGS", type = DOUBLE)
  field(name = "UNDERLYING_PARSEKEY", type = STRING)
  field(name = "UPDATE_CASH", type = STRING)
}
```

The fields are automatically sampled by the command to allocate a type. If it is not sure, it allocates a the field as STRONG. Most of these will be correct, but you will need to handle exceptions.

Note that our example contains some long field names. Ideally, these should be shortened before the conversion process, but these long field names still work.

Illegal characters in field names have been automatically converted. You can see here that the % sign has been changed to PERCENT.

![](/img/percent-has-been-changed.png)

### The tables file

Inside the file `cash-tables-dictionary.kts`, the source of each table is included as a comment at the beginning.

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



Table IDs are sequential from the first one created, starting with the `-t` number supplied when you ran the script.

Each field in the table has a comment showing the column it came from, as well as relevant notes on the function (e.g aggregation).

If the conversion process was not able to parse a field, this is clearly marked on the comment.

![](/img/unable-to-parse.png)

You will have to deal with this, perhaps by creating a consolidator.

The first column in each worksheet is always used as the primary key for the table.

\**Note that it has handled a concatenation, where the primary key is created from the first two columns.

### The Views file

Inside the file `cash-view-dictionary.kts`, you can see that the script has been able to find where tables need joins. Exceptions are highlighted.

In the example here, the first worksheet has been converted. This has created a view with two joins successfully. But it has not been possible to create a third join:

![](/img/views-2.png)

The conversion has created derived fields - simple calculations based on other fields in the view. Our example includes both IF statements and VAL.

![](/img/views-derived-fields-2.png)

### The data files

There is one data file for each of the sheets in the workbook.
For example, here is a look at the top of the first sheet in the workbook:


![](/img/top-dashboard.png)

And here are the first ten rows of the data file:

```
"ACCT_CODE","ACCOUNT_NAME","ACCOUNT_NUMBER","ACCOUNT_CURRENCY","AVAILABLE_BALANCE_DATE","PREVIOUS_CLOSE_BALANCE","EXPECTED_MARGIN_INFLOWS","EXPECTED_MARGIN_OUTFLOWS","NET_AVAILABLE_BALANCE","TBILLS_HOLDINGS","CURRENT_FUNDING_POSN","FUND_HOLDINGS_LEVEL","PERCENT_OF_FUNDS_ALL","SUGGESTED_ACTION","DEPOSIT_AMOUNT_ON_MAY_IN_PERCENT_HAIR_CUT_AND_MAX_PERCENT_ON_FUNDS","MAX_DEPOSIT_AMOUNT_BASED_ON_PERCENT_LIMIT","POTENTIAL_ADDITIONAL_TBILLS_DEPOSIT","EXPECTED_BALANCE_AFTER_REDEMPTION_PER_DEPOSIT_CASH_ONLY_NO_TBILLS","EXPECTED_CASH_BALANCE_PERCENT"
"22HS002","HARRISON GEM DEBT TOTAL RET","400515-73293786","USD","2018-06-06T00:00",,"6324131.264","-710000.0","1.5792632929E8","0.0","0.0","0.0","0.0","DEPOSIT","1.26341063432E8","1.3646971152574575E8","0.0",,"0.0"
"24HS015","HARRISON GEM BOND","400515-73293684","USD","2018-06-06T00:00",,"940000.0","-1524265.8","1.4552071188E8","4.490730003118515E7","0.0","0.0","0.0","DEPOSIT","1.1641656950400001E8","3.827067500084964E8","4.490730003118515E7","3.0628408176E7","0.0079230701035628"
"21HS001","HARRISON GEM LOC DBT OLAY","400515-73294157","USD","2018-06-06T00:00",,"5870000.0","-3560000.0","1.5986032965E8","1.1378883589836652E9","0.0","1.860230439E7","0.006464116805936957","DEPOSIT","1.2788826372000001E8","2.662978900060171E8","1.3840962628601706E8","3.553206592999999E7","0.012347041512300127"
"31HS091","HARRISON GLOBAL HIGH YIELD BOND US FIXE","400515-73423766","USD","2018-06-06T00:00","2.818183719E7","0.0","-885648.28","9234858.05","0.0","0.0","2.256239879E7","0.023281613162053506","DEPOSIT","7387886.440000001","7.33792984052206E7","0.0","2732619.8899999987","0.0028197267404966907"
"21HS118","HARRISON GEM LOCAL CCY RATES","400515-74216790","USD","2018-06-06T00:00","8.7873232E7","0.0","-220000.0","6811542.99","1.9983200001186796E7","0.0","0.0","0.0","DEPOSIT","5449234.392000001","2.228452513942915E7","1.6835290747429147E7","1582308.5979999993","0.007029476743250574"
"30HS123","HARRISON-GB CORP BD (US SL)-AMEU","400515-74429794","USD","2018-06-06T00:00","3223323.0","0.0","0.0","7307726.11","0.0","0.0","85660.62000000011","6.451190070137826E-5","DEPOSIT","5846180.888","1.3136917620546082E8","0.0","1461545.4519999996","0.0011007050272339245"
"30HS056","HARRISON HIGH INCOME-EMD","400515-73294790","USD","2018-06-06T00:00","1.468687899E7","0.0","-320000.0","1.477901352E7","0.0","0.0","0.0","0.0","DEPOSIT","1.1823210816E7","4.3218194548963524E7","0.0","3275802.704","0.007503887450193767"
"21HS184","HARRISON GEM LOC DEBT EX-ASIA","400515-76690541","USD","2018-06-06T00:00","1.007845887E7","0.0","0.0","1.008958349E7","0.0","0.0","0.0","0.0","DEPOSIT","1023728.0723177514","1266863.4894932173","0.0","9065855.41768225","0.7084580886529274"
"37HS191","HARRISON GLB CORP FX T BD 2020","400515-77050130","USD","2018-06-06T00:00","62024.18","0.0","0.0","-176715.13","0.0","0.0","0.0","0.0","DEPOSIT","false","2.9759165768984433E7","0.0","-176715.13","-5.878793110603057E-4"
```


## Loading the data
You can load the data from all the files into the database in one simple command:

 `**sendIt -a` 

So you are ready now to [generate your server application](/tutorials/excel-to-genesis/excel-tut-4/).