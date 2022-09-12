---
title: 'How to load feed data into an application'
sidebar_label: 'Loading feed data'
id: loading-feed-data
---
Some feeds provide static sets of data that you can download for processing by your application. A good example is traded data from an exchange. This exercise shows you the key points for loading these data files. In this case, we shall use Bloomberg issuance data. We shall load this, parse it to reformat it to Genesis format, then place it in a staging table in a Genesis application. Once it is in the staging table, the data can be passed to other tables within the application.

:::note
This guide is intended for:
- users who already have experience of creating a Genesis application
- users with a working knowledge of [Camel](docs/01_getting-started/07_glossary/01_glossary.md#camel-apache-camel)
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

Here is an [example of the data](docs/01_getting-started/05_use-cases/03-loading-feed-data/03_example-source-data.md/) you can download from the Bloomberg Issuance feed.

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

The code includes parameters, such as **move**.  There is a [huge range of other parameters]( https://camel.apache.org/components/2.x/file-component.html#_query_parameters_87_parameters
) that can be used.

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


To handle the incoming content from Bloomberg, create an Event Handler called `ISSUANCE_EVENT_HANDLER`, and a newly created event type `EVENT_FILE_IMPORT_BBG_ISSUANCE`.  (By the way, there is nothing stopping you from having multiple processors generating the same event to be handled by a single Event Handler.)

Bloomberg has a very specific file structure. It would be possible to perform all the initial parsing with a specialized process and generate processed fields and data. However, in our example we use a basic **FileEventHandlerProcessor**. The parsing and formatting of the data is performed by a BBG-specific Event Handler (event type `EVENT_FILE_IMPORT_BBG_ISSUANCE`).


An Event Handler handles a specific single event. In this case, the Event Handler inherits from the **AbstractEventHandler** class.

```java
@Module
public class BbgIssuanceFileImport extends AbstractEventHandler {
```
In the Event Handler, there are two code blocks that you need to specify:
- `onValidate`. This is where you validate the message before processing; return an **ACK** or **NAK**. If you do not want to add any validation, simply return an **ACK**.
- `onCommit`. This is where you specify the parsing that converts the raw data to Genesis format and sends it to a staging table for use in the application.
  You also need to define a construct that passes the details to the parent class. This must identify the `EventManager`, the `EventType`, and `MetaData`, as well as any additional modules that are required to perform the work, such as a data table repository.
  In the following example, we have left the metadata empty (this has to be passed).
```java
public BbgIssuanceFileImport(final EventManager eventManager,
                             final IssuanceDataRx3Repository issuanceDataRx3Repository) {
    super(eventManager, EVENT_NAME, getMetaData());
    this.eventManager = eventManager;
    this.issuanceDataRx3Repository = issuanceDataRx3Repository;
}
```
:::note
Annotations of @Module and @Inject are required for Genesis Dependency Injection and Inversion of Control patterns. The @Module will be loaded at runtime, and the dependencies are injected into the BbgInsuranceFileImport Event Handler. In this case, the dependencies are EventManager, and IssuanceDataRx3Repository, which is being used to insert the data into the **ISSUANCE_DATA** table.
:::
If you don’t want to perform any validation, then you can set up the **onValidate** block to ensure that the event manager returns an ACK in every case.
```java
@Override
public void onValidate(Message message, boolean b) {
    eventManager.sendAck(message);
}
```
All the work is performed in the `onCommit` block. The details can be found with the message. This contains the GenesisSet to get message details.
For this handler, we are interested in the `DETAILS.FILE` property of the GenesisSet, which is the content of the file as a string.
- Here we split it by any end-of-line (EOLN) convention and then use a helper `BbgFileImportReader` class to parse the complex BBG structure and generate a list of fields and data elements.
- Each data row then calls the mapRow method to convert them one at a time into the `IssuanceData` object, and add them to a collection.
- Any exceptions are caught and added to an error list, which will be logged.
- A final NACK is issued if any errors are found.
- If there are no exceptions, then the `IssuanceData` elements generated are inserted into the ISSUANCE_DATA table using the associated repository.
```java
@Override
public void onCommit(final Message message, boolean b) {
    LOG.info("New file received");
    final GenesisSet details = message.getGenesisSet().getGenesisSet(DETAILS);
    assert details != null;
    final String fileName = details.getString("FILE_NAME");
    final List<IssuanceData> issuanceList = new ArrayList<>();
    final List<String> errorMessages = new ArrayList<>();
    final List<String> headers = new ArrayList<>();
    boolean fileHasErrors = false;
    final String[] lines =
            Objects.requireNonNull(message.getGenesisSet().getString("DETAILS.FILE")).split("\r\n|\r|\n");
    try {
        final BbgFileImportReader reader = BbgFileImportReader.instance(fileName, lines);
        final int rowCount = reader.getRowCount();
        for (int i = 0; i < rowCount; i++) {
            LOG.debug("line number {}", i);
            try {
                issuanceList.add(mapRow(reader, i));
            } catch (ParseException ex) {
                errorMessages.add(ex.getMessage());
                LOG.error("Encountered an error processing row {}", i, ex);
                fileHasErrors = true;
            }
        }
    } catch (ParseException | IOException ex) {
        LOG.error("Unable to process the file: " + fileName, ex);
        errorMessages.add(ex.getMessage());
        fileHasErrors = true;
    }
    //We don't update anything in DB if there's a single error
    if (fileHasErrors) {
        LOG.error("There were errors detected in the file. Not loading any rows.\n\nErrors :\n\n{}", String.join("\n", errorMessages));
        eventManager.handleError(
                new SetProblem("ERRORS_IN_FILE", "Rejecting file as it contained one or more errors. See process logs for details"),
                message);
    } else {
        WriteResult writeResult = issuanceDataRx3Repository.insertAll(issuanceList).blockingGet();
        if (writeResult.isError()) {
            eventManager.handleError(
                    new SetProblem("ERRORS_IN_FILE", "Rejecting file as one or more errors saving to database. See process logs for details"),
                    message);
        } else {
            LOG.info("{} Records successfully inserted for provided data ", issuanceList.size());
            eventManager.sendAck(message);
        }
    }
}
```
Other examples of event handlers that load files probably have a different **onCommit** block. For example, the **CSVEventHandlerProcessor** processor discussed in the configuration section has already performed part of the processing, so within the GenesisSet there is a DETAILS.ROW that is a collection of rows, each being a GenesisSet (field/value pairs). For this reason, the **for** loops look something like this:
```java
for (GenesisSet row : Objects.requireNonNull(Objects.requireNonNull(details).getArray("ROW", GenesisSet.class))) {
```
## Testing
It is wise to create some tests around the Event Handler.
### Unit Tests
Due to the complexity of the Bloomberg feed, we create unit tests around the parsing of the feed file (the `BbgFileImportReader` class). Again, we use the `onCommit` block of the `BbgIssuanceFileImport` class.
```java
@Test
    @SuppressWarnings("unchecked")
    public void testPrelOnCommitSuccess() throws IOException {
        EventManager eventManager = Mockito.mock(EventManager.class);
        IssuanceDataRx3Repository issuanceDataRx3Repository = Mockito.mock(IssuanceDataRx3Repository.class);
        IssuanceKeyMapRx3Repository issuanceKeyMapRx3Repository = Mockito.mock(IssuanceKeyMapRx3Repository.class);
        DatatypeMapRx3Repository datatypeMapRx3Repository = Mockito.mock(DatatypeMapRx3Repository.class);
        Mockito.when(issuanceKeyMapRx3Repository.getByIssuanceDataKey(Mockito.any(String.class))).thenReturn(Maybe.empty());
        Mockito.when(datatypeMapRx3Repository.getRangeByDatasourceIdDatasourceFieldDatasourceFromValue("BBG")).thenReturn(Flowable.empty());
        BbgIssuanceFileImport processor =
                new BbgIssuanceFileImport(eventManager, issuanceDataRx3Repository, issuanceKeyMapRx3Repository, datatypeMapRx3Repository);
        Message message = Mockito.mock(Message.class);
        GenesisSet genesisSet = Mockito.mock(GenesisSet.class);
        GenesisSet detailsGenesisSet = Mockito.mock(GenesisSet.class);
        Mockito.when(message.getGenesisSet()).thenReturn(genesisSet);
        Mockito.when(genesisSet.getGenesisSet(DETAILS)).thenReturn(detailsGenesisSet);
        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(Objects.requireNonNull(classLoader.getResource("inbound/PREL_sample.out.20211021")).getFile());
        String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
        Mockito.when(detailsGenesisSet.getString("FILE_NAME")).thenReturn(file.toString());
        Mockito.when(genesisSet.getString("DETAILS.FILE")).thenReturn(content);
        WriteResult writeResult = Mockito.mock(WriteResult.class);
        Single<WriteResult> singleWriteResult = Mockito.mock(Single.class);
        Mockito.when(writeResult.isError()).thenReturn(false);
        Mockito.when(singleWriteResult.blockingGet()).thenReturn(writeResult);
        Mockito.when(issuanceDataRx3Repository.insertAll(Mockito.any(List.class))).thenReturn(singleWriteResult);
        ArgumentCaptor<List<IssuanceData>> captor = ArgumentCaptor.forClass(List.class);
        processor.onCommit(message, false);
        Mockito.verify(issuanceDataRx3Repository).insertAll(captor.capture());
        List<IssuanceData> issuanceDataLists = captor.getValue();
        Assertions.assertEquals(426, issuanceDataLists.size());
        IssuanceData issuanceData0 = issuanceDataLists.get(0);
        IssuanceData issuanceDataN = issuanceDataLists.get(issuanceDataLists.size() - 1);
        Assertions.assertEquals("SDIPRO 1e-06 12/31/24 1001", issuanceData0.getIssuanceDataKey());
        Assertions.assertEquals("TWD", issuanceData0.getCurrencyCode());
        Assertions.assertNull(issuanceData0.getMaturityDate());
        Assertions.assertTrue(Objects.requireNonNull(issuanceData0.getMessageUrl()).endsWith("PREL_sample.out.20211021#123"));
        //Assertions.assertEquals("file://C:\\Workspace\\briss-server\\primary-issuance-event-handler\\target\\test-classes\\inbound\\PREL_sample.out.20211021#123", issuanceData0.getMessageUrl());
        Assertions.assertEquals("MINEMK 0 12/31/26 ICPS", issuanceDataN.getIssuanceDataKey());
        Assertions.assertEquals( new DateTime(2026,12, 31, 0, 0), issuanceDataN.getMaturityDate());
        Assertions.assertEquals("file://PREL_sample.out.20211021#562", issuanceDataN.getMessageUrl());
        Mockito.verify(eventManager, Mockito.times(1)).sendAck(Mockito.any(Message.class));
    }Collapse
```
### Troubleshooting
Once you have deployed the new build, if it does not work first time, here is a check list to help identify common mistakes:
-	On start-up, look at the **Logs** directory for errors in **ISSUANCE_CAMEL.log** and **ISSUANCE_EVENT_HANDLER.log**.
-	Check that the Camel log has registered your route.
-	Check in the Event Handler log file that your new event has been registered.
-	Drop a test file into the staging directory and see the logs consume the file in the Camel log and log the contents with the Event Handler logs. In the BBG example below, the handler log shows the file contents and then an NACK error. In this example, we can see **^M** characters are causing parse failures on dates. Copying between email attachments and downloads, DOS and LINUX copies, we have introduced a EOLN issue on split-line file contents.
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
## Conclusion ##
That's it. You've seen how files can be fetched, parsed and placed on a staging table in an application.