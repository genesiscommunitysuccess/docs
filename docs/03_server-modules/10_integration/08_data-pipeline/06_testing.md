---
title: 'Testing'
sidebar_label: 'Testing'
id: testing
---

[Introduction](/server-modules/integration/data-pipeline/introduction/)  | [Basics](/server-modules/integration/data-pipeline/basics) | [Advanced](/server-modules/integration/data-pipeline/advanced) | [Examples](/server-modules/integration/data-pipeline/examples) | [Configuring runtime](/server-modules/integration/data-pipeline/configuring-runtime) | [Testing](/server-modules/integration/data-pipeline/testing)

To test a data pipeline you need:

- source data e.g. PostgreSQL
- a data pipeline script
- a test case class that extends `AbstractGenesisTestSupport`

This is an example test case that asserts that six trades are ingested from source PostgreSQL:

```kotlin
class DataPipelineTest : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        packageName = "global.genesis.datapipeline.pal"
        genesisHome = "/genesisHome"
        parser = { it }
        scriptFileName = "test-data-pipeline.kts"
    }
) {

    override fun createDictionary() = testDictionary()

    companion object {

        private val SOURCE_DATABASE_CONNECTION = DriverManager.getConnection("jdbc:postgresql://localhost:5432/?user=postgres&password=docker")

        @JvmStatic
        @BeforeClass
        fun setupSourceTable() {
            dbExecute(
                """
                CREATE TYPE source_trades_valid_sides AS ENUM ('buy', 'sell');
                CREATE TYPE source_trades_valid_states AS ENUM ('new', 'mod', 'canc');

                CREATE TABLE source_trades (
                	trd_id  VARCHAR ( 12 ) PRIMARY KEY,
                	inst VARCHAR ( 5 ) NOT NULL,
                	price DOUBLE PRECISION NOT NULL,
                	quantity INTEGER NOT NULL,
                	side VALID_SIDES NOT NULL,
                    traded_at TIMESTAMP NOT NULL,
                    trader VARCHAR (30) NOT NULL,
                    trade_state valid_states NOT NULL,
                    unsolicited BOOL,
                    orig_trd_id VARCHAR (12)
                );
            """.trimIndent()
            )
        }

        @JvmStatic
        @AfterClass
        fun closeConnection() {
            dbExecute("DROP TABLE IF EXISTS source_trades;")
            dbExecute("DROP TYPE IF EXISTS source_trades_valid_sides;")
            dbExecute("DROP TYPE IF EXISTS source_trades_valid_states;")
            SOURCE_DATABASE_CONNECTION.close()
        }

        private fun dbExecute(statement: String) {
            SOURCE_DATABASE_CONNECTION.execute(statement).blockingGet()
        }
    }

    @Test
    fun dataPipelineExecution() {
        Assume.assumeTrue(DB_LAYER == DbLayers.SQL)
        dbExecute(
            """
             INSERT INTO source_trades(trd_id, inst, price, quantity, side, traded_at, trader, trade_state, unsolicited, orig_trd_id)
             VALUES
              ('ITS_00000004', 'VOD', 126, 1500, 'sell', '2022-05-25 16:01:01', 'Trader.B', 'new', NULL , NULL),
              ('ITS_00000005', 'BT', 189.35, 5000, 'buy', '2022-05-25 16:02:02', 'Trader.B', 'new',NULL, NULL),
              ('ITS_00000006', 'VOD', 127, 2000, 'buy', '2022-05-25 14:03:03', 'Trader.B', 'mod', false, 'ITS_00000001'),
              ('ITS_00000003', 'BARC', 158, 2000, 'buy', '2022-05-25 15:03:03', 'Trader.B', 'canc', false, ''),
              ('ITS_00000008', 'BT', 189.56, 1000, 'sell', '2022-05-25 16:03:03', 'Trader.B', 'new', true, 'ITS_00000007'),
              ('ITS_00000009', 'BARC', 158, 2000, 'buy', '2022-05-25 16:04:04', 'Trader.B', 'canc', false, '');
            """.trimIndent()
        )

        Awaitility.await().atMost(Duration.ofSeconds(5)).until {
            rxDb.count("TRADE").blockingGet() == 6L
        }

        val tradeIds: List<String> = runBlocking {
            entityDb.getBulk<Trade>().toList()
        }.map { it.tradeId }

        val expectedTradeIds = listOf(
            "ITS_00000003-TradeStore",
            "ITS_00000004-TradeStore",
            "ITS_00000005-TradeStore",
            "ITS_00000006-TradeStore",
            "ITS_00000008-TradeStore",
            "ITS_00000009-TradeStore"
        )

        assert(tradeIds.containsAll(expectedTradeIds))
    }
}
```

And this is the data pipeline configuration that is tested:

```kotlin
sources {

    postgres("cdc-test") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = "docker"
        databaseName = "postgres"

        table {
            "public.source_trades" to mapper("incoming_trades", TRADE) {
                val tradeId = stringValue("trd_id")
                val instrument = stringValue("inst")
                val tradedAt = longValue("traded_at")
                val side = stringValue("side")
                val tradeState = stringValue("trade_state")

                TRADE {
                    TRADE_ID {
                        transform {
                            "${input.get(tradeId)}-TradeStore"
                        }
                    }

                    TRADE_TYPE {
                        sourceProperty = "side"
                    }

                    TRADE_DATE {
                        transform {
                            DateTime(input.get(tradedAt))
                        }
                    }

                    INSTRUMENT_ID {
                        transform {
                            "${input.get(instrument)}-RIC"
                        }
                    }

                    CURRENCY_ID {
                        transform {
                            "GBP"
                        }
                    }

                    QUANTITY {
                        sourceProperty = "quantity"
                    }

                    PRICE {
                        sourceProperty = "price"
                    }

                    RECORD_ID {
                        transform {
                            input.get(tradeId).removePrefix("ITS_").toLong()
                        }
                    }

                    TIMESTAMP {
                        transform {
                            input.get(tradedAt)
                        }
                    }
                }
            }
        }
    }
}


```

## Starting source PostgreSQL

There are various ways to start PostgreSQL as a test dependency. Here is a list of the few most common ones

### Testcontainers
You can start PostgreSQL as a test rule using [Testcontainers](https://www.testcontainers.org/). It has a [Postgres Module](https://www.testcontainers.org/modules/databases/postgres/) that has a pre-configured rule to use out of the box. However, it requires additional configuration for the Write Ahead Log (WAL) level, and it has to be set to `logical`. Below is a sample rule configuration:

```kotlin
PostgreSQLContainer("postgres:12.6-alpine")
  .withCommand("postgres", "-c", "fsync=off", "-c", "wal_level=logical")
```

### Docker image
You can start PostgreSQL as a Docker image as part of the test set-up or the environment set-up. The requirement for WAL level applies here as well. Below is a sample command to start PostgreSQL image:

```shell
docker run -tid -p 5432:5432 -e POSTGRES_PASSWORD=docker -e PGDATA=/tmp postgres:12.6-alpine -c wal_level=logical
```

### Standalone process
You can install and start PostgreSQL during environment set-up.
