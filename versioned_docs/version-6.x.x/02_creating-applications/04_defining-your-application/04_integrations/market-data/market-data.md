---
id: market-data
title: Market data
sidebar_label: Market data
sidebar_position: 10

---
The Genesis LCNC Platform provides a separate distribution for connecting to external vendors for market data. 

This distribution includes:

- field and table definitions to facilitate subscriptions and store market data
- micro-services to query the data from the front end and to control subscription through the standard event model, and the libraries that comprise the market data engine (MDE), which is the core of the Genesis vendor-specific market data adaptors.

In order to integrate market data to your Genesis project, you need to install the Genesis Market Data distribution, and the relevant adaptor distribution for the vendor from whom you wish to consume data.


## Provided data model
The market data distribution comes with the fields and tables required to get start started subscribing to market data immediately. As with the field definitions and stock tables provided by any Genesis distribution, these can be extended or modified as you see fit in order to fit your data model.

The tables provided are detailed below:

| Name| Description|
|------------------------------------|--------------------|
| INSTRUMENT_PRICE_SUBSCRIPTION | An instrument code and a primary exchange ID; this is the default subscription table for exchange traded securities. | 
| FX_SUBSCRIPTION | An instrument code only representing the currency pair; this is the default subscription table for OTC FX subscriptions. |
| FIXED_INCOME_SUBSCRIPTION | An instrument code (usually an ISIN) of a fixed-income instrument. This is the default subscription table for OTC fixed income subscriptions. |
| INSTRUMENT_L1_PRICE | The standard fields for the top of book (Bid, Ask) and standard indicators (Open, Close, High Low etc.) for exchange-traded securities. |
| TIME_AND_SALES | Data on trades that have occurred in a particular securities market. Unlike the price tables, new entries do not overwrite old entries in this table, so it can be used as a primitive time-series database. |
| FIXED_INCOME_PRICE | Fields for standard fixed-income instrument markets (clean price, dirty price etc.) | 
| FX_RATE | Standard fields for an OTC FX quote, such as bid and ask rates, as well as quoted currency. |

To ensure low latency, the price tables can be configured as Genesis HFT memory-mapped tables, rather than using the standard database mechanism. This configuration will be explained in a later section.

It is also worth noting that the price tables can be configured as Genesis HFT memory mapped tables for low latency rather than using the standard database mechanism. This configuration will be explained in a later section.

## Provided services

### Event handler
The market data event handler provides two events to enable the front end and other services to easily subscribe to prices, `EVENT_SUBSCRIBE_TO_PRICE` and `EVENT_UNSUBSCRIBE_FROM_PRICE`.

### Data server
The market data data server provides a kotlin script configurable mechanism for delivering market data from the price tables to the front end.
