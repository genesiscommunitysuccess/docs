---
title: 'Data Pipeline - Testing'
sidebar_label: 'Testing'
id: testing
keywords: [server, integration, data pipeline, testing]
tags:
  - server
  - integration
  - data pipeline
  - testing
---

[Introduction](../../../../server/integration/data-pipeline/introduction/)  | [Basics](../../../../server/integration/data-pipeline/basics) | [Advanced](../../../../server/integration/data-pipeline/advanced) | [Examples](../../../../server/integration/data-pipeline/examples) | [Configuring runtime](../../../../server/integration/data-pipeline/configuring-runtime) | [Testing](../../../../server/integration/data-pipeline/testing)

To test a data pipeline you need:

- source data e.g. PostgreSQL
- a data pipeline script
- a test case class that extends `AbstractGenesisTestSupport`

This is an example test case that asserts six trades are ingested from source PostgreSQL. We use the (Testcontainers)[https://www.testcontainers.org/] library to stand up a database and tear it down once the test has finished. Other approaches are also mentioned below:

```kotlin
class DataPipelineTest : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        packageName = "global.genesis.datapipeline.pal"
        genesisHome = "/genesisHome"
        parser = { it }
        scriptFileName = "test-data-pipeline.kts"
    }
) {

    override fun systemDefinition(): Map<String, Any> {
        return mapOf<String, Any>(
            "postgres_sink_port" to postgreSqlContainer.firstMappedPort
        )
    }

    private companion object {
        lateinit var con: Connection

        @JvmStatic
        @BeforeClass
        fun beforeClass() {
            postgreSqlContainer.start()

            val properties = Properties().also {
                it["password"] = postgreSqlContainer.password
                it["user"] = postgreSqlContainer.username
            }
            con = postgreSqlContainer.jdbcDriverInstance.connect(postgreSqlContainer.jdbcUrl, properties)

            con.createStatement().execute(
                "CREATE TYPE source_trades_valid_sides AS ENUM ('buy', 'sell');"
            )

            con.createStatement().execute(
                "CREATE TYPE source_trades_valid_states AS ENUM ('new', 'mod', 'canc');"
            )

            con.createStatement().execute(
                """CREATE TABLE source_trades (
                    trd_id VARCHAR(12) PRIMARY KEY,
                    inst VARCHAR (5) NOT NULL,
                    price DOUBLE PRECISION NOT NULL,
                    quantity INTEGER NOT NULL,
                    side source_trades_valid_sides NOT NULL,
                    traded_at TIMESTAMP NOT NULL,
                    trader VARCHAR (30) NOT NULL,
                    trade_state source_trades_valid_states NOT NULL,
                    unsolicited BOOL,
                    orig_trd_id VARCHAR (12));
                """.trimIndent()
            )
        }

        @JvmStatic
        @AfterClass
        fun afterClass() {
            postgreSqlContainer.close()
        }

        @JvmField
        @ClassRule
        var postgreSqlContainer: PostgreSQLContainer<*> = PostgreSQLContainer("postgres:12.6-alpine")
            .withCommand("postgres", "-c", "fsync=off", "-c", "wal_level=logical")
            .withExposedPorts(5432)
    }

    @Test
    fun dataPipelineExecution() {
        Assume.assumeTrue(DB_LAYER == DbLayers.SQL)
        con.createStatement().execute(
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
pipelines {

    postgresSource("cdc-test") {
        hostname = "localhost"
        port = systemDefinition.getItem("postgres_sink_port") as Int,
        username = "postgres"
        password = "docker"
        databaseName = "postgres"

        table {
            "public.source_trades" to map("incoming_trades", TRADE) {
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
                        property = "side"
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
                        property = "quantity"
                    }

                    PRICE {
                        property = "price"
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

There are various ways to start PostgreSQL as a test dependency. Here is a list of the most common ones:

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
