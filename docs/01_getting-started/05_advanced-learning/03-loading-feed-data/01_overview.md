---
title: 'Loading feed data - how to load feed data into an application'
sidebar_label: 'Loading feed data'
id: overview
keywords: [getting started, quick start, use cases, loading feed data, overview]
tags:
- getting started
- quick start
- use cases
- loading feed data
- overview
---
Some feeds provide static sets of data that you can download for processing by your application. A good example is traded data from an exchange. This exercise shows you the key points for loading these data files. In this case, we shall use Bloomberg issuance data. We shall load this, parse it to reformat it to Genesis format, then place it in a staging table in a Genesis application. Once it is in the staging table, the data can be passed to other tables within the application.

:::note
This guide is intended for:
- users who already have experience of creating a Genesis application
- users with a working knowledge of [Camel](../../../01_getting-started/07_glossary/01_glossary.md#camel-apache-camel)
  :::


## Prerequisites ##

You will need between 15 and 20 minutes to finish this guide.

Required software:
- IntelliJ IDEA
- Genesis Platform installed either on remote host or locally

Versions used while writing this guide:
- IntelliJ IDEA 2021.2.1
- Genesis Platform 5.2


## Steps ##

The main steps in loading the data are:

1.	Examine the format of the source data. You need to be able to map the data into a table in Genesis format.
2.	Define a Camel config (in the CFG module) to listen to a staging directory and push the file as a new event.
3.	Create a new Event Handler to process the event and push the data to the data server.
4.	Create some unit tests around the Event Handler to verify the load process.


## Source data
### A simple example
The simplest example of a source file would be a csv, where row 1 would always be the headers. These headers could directly be mapped to fields in your application’s database.
For example
```bash
INSTRUMENT,QUANTITY,TRADEPRICE,DATE
GBP1M=,80000,B,1.3211,140121
GBP1M=,55000,B,1.3203,140121
GBP3M=135000,S,13387,150121
```

### A real example
Reality is rarely that convenient. For this example, the incoming data is issuance data from Bloomberg, and its format is considerably more complex.

Here is an [example of the data](../../../01_getting-started/05_advanced-learning/03-loading-feed-data/03_example-source-data.md/) you can download from the Bloomberg Issuance feed.

Once you know this format, you need to create code that maps the fields so that they can be written to a table in your application.

#### Retrieving this data
You need to decide how to retrieve the data from the feed and write it to a staging area for your application. For example:


-	scheduled SFTP download every 15 minutes from the Bloomberg feed, writing the source files to a folder called **/runtime/inbound/bbg**
-	a Camel job created to do the same thing
-	simple copy and paste


## Configuration

Under your application's _application_**-script-config** project in the **resources/scripts** directory, you will find the _application_**-camel.kts** file. You will need to edit this file to contain the following route definition.

```kotlin
camel {
    routeHandler {
        val pathStr = "${GenesisPaths.genesisHome()}/runtime/inbound/"
        from("file:${pathStr}/bbg/?move=.camel/\${date:now:yyyyMMdd-HHmmssSSS}-\${headers.CamelFileName}&initialDelay=5000&readLock=changed&readLockCheckInterval=5000&readLockTimeout=60000")
            .process(fileEventProcessorProvider.createProcessor("ISSUANCE_EVENT_HANDLER", "EVENT_FILE_IMPORT_BBG_ISSUANCE", "FILE", "SOURCE_NAME"))
    }
}
```

The code does three things:
-	It looks for all files in the bbg folder and moves these to a subfolder called **.camel**.
-	It sets an initial delay before checking the file (5 seconds). It locks the source files in case you are running the application on multiple servers.
-	It uses the Genesis class `FileEventHandlerProcessor` to create an Event Handler called `ISSUANCE_EVENT_HANDLER` and an event called `EVENT_FILE_IMPORT_BBG_ISSUANCE`. This class generates a single message containing the raw contents of file. (There is also a file process called `CSVEventHandlerProcessor`, which performs an initial parsing of the contents to generate messages of fields and data.)

The code includes parameters, such as **move**.  There is a [huge range of other parameters](https://camel.apache.org/components/4.0.x/file-component.html#_query_parameters_87_parameters) that can be used.

### Finding the generated messages

In the example below, we have used the Genesis file processor class, and some Camel URI. The URI specifies:
-	the location of the files to be loaded (in this case any file found in /bbg)
-	configuration attributes (I.e. where the files will be archived)

Note that the first **ls** of the files in the **bbg** folder does not show the downloaded file – because it has automatically been moved to the **.camel** folder. Running **ls -al .camel** then shows the downloaded file.

```bash
[briss@dev-abc-briss1 inbound]$ cd bbg/
[briss@dev-abc-briss1 bbg]$ ls -al
total 12
drwxrwxr-x. 3 briss briss 4096 Nov 11 14:10 .
drwxrwxr-x. 6 briss briss 4096 Nov 10 18:33 ..
drwxrwxr-x. 2 briss briss 4096 Nov 11 14:10 .camel
[briss@dev-abc-briss1 bbg]$ ls -al .camel
total 388
drwxrwxr-x. 2 briss briss 4096 Nov 11 14:10 .
drwxrwxr-x. 3 briss briss 4096 Nov 11 14:10 ..
-rw-r--r--. 1 briss briss 387963 Nov 11 13:33 20211111-141036752-PREL_test_0900.out.20211111
[briss@dev-abc-briss1 bbg]$
```
## Creating the Event Handler


To handle the incoming content from Bloomberg, create an `eventHandler` called `ISSUANCE_EVENT_HANDLER`, and a newly created event type `EVENT_FILE_IMPORT_BBG_ISSUANCE`.  (By the way, there is nothing stopping you from having multiple processors generating the same event to be handled by a single `eventHandler`.)

Bloomberg has a very specific file structure. It would be possible to perform all the initial parsing with a specialized process and generate processed fields and data. However, in our example we use a basic **FileEventHandlerProcessor**. The parsing and formatting of the data is performed by a BBG-specific `eventHandler` (event type `EVENT_FILE_IMPORT_BBG_ISSUANCE`).


An `eventHandler` handles a specific single event. In this case, it implements the **Rx3ValidatingEventHandler** interface.

Each `eventHandler` specifies its message metadata and payload using type-safe classes. In this case, we know the input message from the Camel process will contain two string fields: "FILE" and "FILE_NAME". To allow our `eventHandler` to parse these fields automatically, you could declare a Kotlin data class like the one shown below:

```kotlin
data class BbgIssuanceFileImport(
    val file: String,
    val fileName: String
)
```

So the core class definition would look like the example below:

```kotlin
@Module
class BbgIssuanceFileImportEvent @Inject constructor(
    private val bbgFileImportReaderProvider: BbgFileImportReaderProvider,
    private val entityDb: RxEntityDb
) : Rx3ValidatingEventHandler<BbgIssuanceFileImport, EventReply> {
```

In the `eventHandler`, there are two code blocks that you need to specify:
- `onValidate`. This is where you validate the message before processing; return an `ack()` or `nack()`. If you do not want to add any validation, simply return an `ack()`.
- `onCommit`. This is where you specify the parsing that converts the raw data (defined as a collection of key-value pairs in the shape of a Map<String,String>) to Genesis format, and then sends it to a staging table for use in the application.

You also need to define any additional methods required to provide additional details about this `eventHandler`. For example, if the name of the `eventHandler` doesn't match the name of the class, you need to provide a `messageType()`. 

You can also add any additional modules that are required to perform the work via dependency injection, such as the `RxEntityDb` and the `BbgFileImportReaderProvider`, which is a utility class created to provide reading utilities for handling Bloomberg issuance files.

  In the following example, you can see a basic implementation overriding the message type and returning ack for both `onValidate` and `onCommit` functions.
  
```kotlin
@Module
class BbgIssuanceFileImportEvent @Inject constructor(
    private val bbgFileImportReaderProvider: BbgFileImportReaderProvider,
    private val entityDb: RxEntityDb
) : Rx3ValidatingEventHandler<BbgIssuanceFileImport, EventReply> {
    companion object {
        private val LOG = LoggerFactory.getLogger(BbgIssuanceFileImport::class.java)
    }

    override fun onValidate(message: Event<BbgIssuanceFileImport>): Single<EventReply> {
        return ack()
    }

    override fun onCommit(message: Event<BbgIssuanceFileImport>): Single<EventReply> {
        return ack()
    }

    override fun messageType(): String = "FILE_IMPORT_BBG_ISSUANCE"
}
```
:::note
Annotations of @Module and @Inject are required for Genesis Dependency Injection and Inversion of Control patterns. The @Module will be loaded at runtime, and the dependencies are injected into the BbgIssuanceFileImport `eventHandler`. In this case, the dependency is just RxEntityDb, which is being used to insert the data into the **ISSUANCE_DATA** table.
:::

All the work is performed in the `onCommit` block. The details can be found within the event message. This contains the `Map<String, String>` object specified as part of the class definition to get the message details.
For this handler, we are interested in the `FILE` property of the `Map`, which is the content of the file as a string.
- Here we split it by any end-of-line (EOLN) convention and then use a helper `BbgFileImportReader` class to parse the complex BBG structure and generate a list of fields and data elements.
- Each data row then calls the mapRow method to convert them one at a time into the `IssuanceData` object, and add them to a collection.
- Any exceptions are caught and added to an error list, which will be logged.
- A final NACK is issued if any errors are found.
- If there are no exceptions, then the `IssuanceData` elements generated are inserted into the ISSUANCE_DATA table using the associated repository.
- 
```kotlin
override fun onCommit(message: Event<BbgIssuanceFileImport>): Single<EventReply> {
    LOG.info("New file received")
    val details: Map<String, String> = message.details
    val fileName = details.fileName
    val issuanceList = mutableListOf<IssuanceData>()
    val errorMessages = mutableListOf<String?>()
    var fileHasErrors = false
    val lines = details.file.split("\r\n|\r|\n")
    try {
        val reader = bbgFileImportReaderProvider.readerInstance(fileName, lines)
        val rowCount: Int = reader.getRowCount()
        for (i in 0 until rowCount) {
            LOG.debug("line number {}", i)
            try {
                issuanceList.add(mapRow(reader, i))
            } catch (ex: ParseException) {
                errorMessages.add(ex.message)
                LOG.error("Encountered an error processing row {}", i, ex)
                fileHasErrors = true
            }
        }
    } catch (ex: ParseException) {
        LOG.error("Unable to process the file: $fileName", ex)
        errorMessages.add(ex.message)
        fileHasErrors = true
    } catch (ex: IOException) {
        LOG.error("Unable to process the file: $fileName", ex)
        errorMessages.add(ex.message)
        fileHasErrors = true
    }

    //We don't update anything in DB if there's a single error
    if (fileHasErrors) {
        LOG.error(
            "There were errors detected in the file. Not loading any rows.\n\nErrors :\n\n{}",
            errorMessages.joinToString(separator = "\n")
        )
        return Single.just(
            EventReply.EventNack(
                error = listOf(
                    StandardError(
                        code = "ERRORS_IN_FILE",
                        text = "Rejecting file as it contained one or more errors. See process logs for details"
                    )
                )
            )
        )
    } else {
        return entityDb.insertAll(issuanceList)
            .flatMap {
                ack()
            }
            .onErrorReturn { exception ->
                LOG.error("Error inserting issuance records in database: {}", issuanceList, exception)
                EventReply.EventNack(
                    error = listOf(
                        StandardError(
                            errorCode = ErrorCode.DATABASE_ERROR,
                            text = "Database error when inserting issuance records. See logs for more details."
                        )
                    )
                )
            }
            .doOnSuccess {
                LOG.info("{} Records successfully inserted for provided data ", issuanceList.size)
            }
    }
}
```
Other examples of `eventHandler` that load files probably have a different **onCommit** block. For example, the **CSVEventHandlerProcessor** processor discussed in the configuration section has already performed part of the processing, so within the GenesisSet there is a DETAILS.ROW that is a collection of rows, each being a GenesisSet (field/value pairs).
In that case, a different message class needs to be defined:

```kotlin
data class BbgIssuanceFileImport(
    val file: String,
    val fileName: String,
    val row: List<Map<String, String>> = emptyList()
)
```

For this reason, the **for** loops would look something like this:
```kotlin
for (val currentRow in details.row) {
```

## Testing
It is wise to create some tests around the `eventHandler`.
### Unit Tests
Due to the complexity of the Bloomberg feed, we should create unit tests around the parsing of the feed file (the `BbgFileImportReader` class). But separately, we can also create unit tests for this event.

In order to test the event, we use the `onCommit` block of the `BbgIssuanceFileImportEvent` class as well as **Mockito** to mock object behaviour.

```kotlin
@Test
fun testPrelOnCommitSuccess() {
    val rxEntityDb = Mockito.mock(RxEntityDb::class.java)
    val bbgFileImportReaderProvider = Mockito.mock(BbgFileImportReaderProvider::class.java)
    val bbgFileImportReader = Mockito.mock(BbgFileImportReader::class.java)
    Mockito.`when`(bbgFileImportReader.getRowCount()).thenReturn(1)
    val issuanceData = Mockito.mock(IssuanceData::class.java)
    Mockito.`when`(bbgFileImportReader.mapRow(ArgumentMatchers.anyInt())).thenReturn(issuanceData)
    Mockito.`when`(bbgFileImportReaderProvider.readerInstance(any(), any())).thenReturn(bbgFileImportReader)
    val insertResult = Mockito.mock(InsertResult::class.java) as InsertResult<IssuanceData>
    Mockito.`when`(rxEntityDb.insertAll(any<List<IssuanceData>>())).thenReturn(Single.just(listOf(insertResult)))
    val processor = BbgIssuanceFileImportEvent(bbgFileImportReaderProvider, rxEntityDb)
    val result = processor.onCommit(
        Event(
            details = BbgIssuanceFileImport(
                fileName = "PREL_sample.out.20211021",
                file = ""
            )
        )
    ).blockingGet()
    Assertions.assertTrue(result is EventReply.EventAck)
}
```
### Troubleshooting
Once you have deployed the new build, if it does not work first time, here is a check list to help identify common mistakes:

-	On start-up, look at the **Logs** directory for errors in **ISSUANCE_CAMEL.log** and **ISSUANCE_EVENT_HANDLER.log**.
-	Check that the Camel log has registered your route.
-	Check in the Event Handler log file that your new event has been registered.
-	Drop a test file into the staging directory and see the logs consume the file in the Camel log and log the contents with the Event Handler logs. In the BBG example below, the handler log shows the file contents and then an NACK error.

In this example, we can see **^M** characters are causing parse failures on dates. Copying between email attachments and downloads, DOS and LINUX copies, we have introduced a EOLN issue on split-line file contents.

```bash
|60.71| |N.S.|200000000.00|;2;3;3;13;200000.00;1; ;5;10/21/2021;13;150000.00;1; ;5;10/21/2021;13;100000.00;1; ;5;10/21/2021;|N.D.| |MIDSWAPS|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|N.S.|^M
END-OF-DATA^M
TIMEFINISHED=Thu Oct 21 05:53:27 EDT 2021^M
END-OF-FILE^M
   DETAILS.FILE_NAME = PRICED_sample.out.20211021
SOURCE_REF = 1
09 Nov 2021 13:22:02.997 4717730 [epollEventLoopGroup-3-2] TRACE global.genesis.net.netty.GenesisMessageEncoder - MESSAGE_TYPE = MSG_NACK
   ERROR[0].CODE = UNKNOWN_MESSAGE_TYPE
   ERROR[0].TEXT = Message type not supported
   ERROR[0].@type = FieldError
  ERROR[0].FIELD = EVENT_FILE_IMPORT_BBG_ISSUANCE
SOURCE_REF = 1
```
-	Finally, use DbMon to check the related staging table in the DATA_SERVER for the relevant rows – in this case, the ISSUANCE_DATA table.
## Conclusion 
That's it. You've seen how files can be fetched, parsed and placed on a staging table in an application.
