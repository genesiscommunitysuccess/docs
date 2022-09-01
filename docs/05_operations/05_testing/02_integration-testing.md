---
title: 'Integration testing'
sidebar_label: 'Integration testing'
id: integration-testing
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## Database and service tests

Two types of test are included in the platform:

* database test (AbstractDatabaseTest)
* service test (AbstractGenesisTestSupport and GenesisTestSupport)

For both types, you need to start with a dictionary. This section will guide you through using GPAL dictionaries in Genesis tests.

:::note
As of Genesis 5.2, a sample test case that uses production dictionary will be created automatically when a new project is generated.
:::

## Types of dictionary

There are three types of dictionary you can use:

* Production dictionary
* Inline dictionary
* File dictionary

### Production dictionary

Use this type of dictionary if you want to test against the production dictionary. This is the preferred way of using a dictionary in product tests, as production and test dictionaries are always in sync.

This dictionary type is easiest to use, and it is supported in both Java and Kotlin. When writing a test extending `AbstractGenesisTestSupport`, the production dictionary is used by default. To use it from an `AbstractDatabaseTest` class, is a couple of lines of code:

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
override fun createMockDictionary(): GenesisDictionary = prodDictionary()
```

</TabItem>
<TabItem value="java">

```java
@Override
protected GenesisDictionary createMockDictionary() {
    return prodDictionary();
}
```

</TabItem>
</Tabs>

### Inline dictionary

When writing a test in Kotlin, you can the GPAL syntax to define a dictionary inline. Use this type of dictionary if the dictionary you want to use in your tests is different from the production dictionary. This dictionary should only be used in framework-type components where you want to test dictionaries that are distinct from your production dictionary.

```kotlin
val USER_NAME by field(name = "USER_NAME", type = STRING)
val AGE by field(name = "AGE", type = INT)

override fun createMockDictionary(): GenesisDictionary = testDictionary {
    table(name = "USER", id = 1) {
        USER_NAME
        AGE
        primaryKey {
            USER_NAME
        }
    }
}
```

:::important
Please note that the table definitions should be valid. If you specify an invalid table, e.g. by not defining a primary key, the test will fail.
:::

### File dictionary

Only use a File dictionary if the dictionary you want to test is:

-  different from the production dictionary
-  too big to be practical in an inline dictionary

Please note that the test will need to resolve the absolute location of the dictionary file, for example:

```java
@Override
protected GenesisDictionary createMockDictionary() throws Exception {
    return TestUtil.getDictionaryFromPath(Paths.get(this.getClass().getResource("/DeleteDependentRecords/Dictionaries/KeyIsIntAndString-dictionary.xml").toURI()).toString());
}
```

In `AbstractDatabaseTest`, you can also overwrite the `dictionaryName()` method:

```java
@Override
protected String dictionaryName() {
    return "/dictionaries/standard-dictionary.xml";
}
```

## Writing tests
There two types of test described here:

- Database tests - use this type for testing classes that require database access.
- Test support tests - use this type of test for testing a service.

Both types of test work with all three dictionary types.

### AbstractDatabaseTest

Use this for testing classes that require database access. These tests will instantiate an `RxDb` object, with a dictionary. The full range of database operations are available, including the update queue. However, no other Genesis components are provided. The only requirement for this type of test is a dictionary.

To write a database test, begin by extending `AbstractDatabaseTest`, and overwrite the  `createMockDictionary` method, as in the samples below.

In the first instance, we are using a **production directory**.

- in kotlin, through the `rxDb` property
- in Java, using the `getRxDb()` method

The test makes sure there are no records in the `USER` table. In both languages, the `RxDb` is available.

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class SampleKotlinTest : AbstractDatabaseTest() {

    override fun createMockDictionary(): GenesisDictionary = prodDictionary()

    @Test
    fun `test count`() {
        assert(rxDb.count("USER").blockingGet() == 0L)
    }
}
```

</TabItem>
<TabItem value="java">

```java
public class SampleJavaTest extends AbstractDatabaseTest {

    @Override
    protected GenesisDictionary createMockDictionary() throws Exception {
        return prodDictionary();
    }

    @Test
    public void testCount() {
        assert getRxDb().count("USER").blockingGet() == 0L;
    }
}
```

</TabItem>
</Tabs>



Here is a similar test using an **inline dictionary**.

In this test, we define two fields and a table that uses these. We make sure there are no records in the `USER` table. Since we are creating a stand-alone dictionary, we can start with id 1.


```kotlin
class SampleKotlinTest : AbstractDatabaseTest() {

    val USER_NAME by field(name = "USER_NAME", type = STRING)
    val AGE by field(name = "AGE", type = INT)

    override fun createMockDictionary(): GenesisDictionary = testDictionary {
        table(name = "USER", id = 1) {
            USER_NAME
            AGE
            primaryKey {
                USER_NAME
            }
        }
    }

    @Test
    fun `test count`() {
        assert(rxDb.count("USER").blockingGet() == 0L)
    }
}
```


Finally, here is a test using a **file dictionary**.

In this test, the dictionary is read from an external file.

In all other regards, the database tests are normal JUnit tests. If you need additional components, you need to construct them or mock them. You won’t be able to specify a `GENESIS_HOME` folder for additional configuration.

If you add the `genesis-generated-dao` jar to your classpath, you will be able to use repository classes as normal.


<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class SampleKotlinTest : AbstractDatabaseTest() {

    override fun dictionaryName() = "/genesisHome/genesis/cfg/genesis-dictionary.xml"

    @Test
    fun `test count`() {
        assert(rxDb.count("USER").blockingGet() == 0L)
    }
}
```

</TabItem>
<TabItem value="java">

```java
public class SampleJavaTest extends AbstractDatabaseTest {

    @Test
    public void testCount() {
        assert getRxDb().count("USER").blockingGet() == 0L;
    }

    @Nullable
    @Override
    protected String dictionaryName() {
        return "/genesisHome/genesis/cfg/genesis-dictionary.xml"
    }
}
```

</TabItem>
</Tabs>


### AbstractGenesisTestSupport

This is a more powerful type of test. In addition to setting up the database, it offers:

- start-up of a Genesis service in memory
- scanning of a `GENESIS_HOME` folder for additional configuration
- injection of other components directly into the test
- mock auth-perms
- asynchronous message handling with timeout and parsing

To create a test, you need to provide a `GenesisTestConfig` instance in the constructor:

| Property | Required | Sets |
| --- | --- | --- |
| packageName | yes | corresponds to the <package/> tag in processes.xml |
| genesisHome | yes | GENESIS_HOME folder for additional configuration |
| parser | yes | function that takes a GenesisSet and transforms it, this will determine the generic type of AbstractGenesisTestSupport |
| initialDataFile | no | csv files to load into the database |
| configFileName | no | corresponds to the <config/> tag in processes.xml |
| authCacheOverride | no | overrides auth-perms map to test |

Any path provided for `genesisHome` and `initialDataFile` must be an absolute location.

To use `AbstractGenesisTestSupport`, create a new class and extend:

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class UserControllerTest : AbstractGenesisTestSupport<EventResponse>(
    GenesisTestConfig {
        packageName = "global.genesis.auth.manager"
        genesisHome = "/genesisHome"
        initialDataFile = "standard-user-setup.csv"
        authCacheOverride = "USER_VISIBILITY"
        parser = EventResponse
        configFileName = "config.xml"
    }
) {
  // no tests defined yet
}
```

</TabItem>
<TabItem value="java">

```java
public class UserControllerJavaTest extends AbstractGenesisTestSupport<EventResponse> {

    public UserControllerJavaTest() {
        super(
                new GenesisTestConfigImpl.Builder<EventResponse>()
                        .addPackageName("global.genesis.auth.manager")
                        .setGenesisHome("/genesisHome")
                        .addInitialDataFile("standard-user-setup.csv")
                        .setParser(EventResponse.Companion)
                        .setConfigFileName("config.xml")
                        .build()
        );
    }
}
```

</TabItem>
</Tabs>

### Parsing messages

`AbstractGenesisTestSupport` tests require a parser. This should take a `GenesisSet` and transform it. 

This is so that all logic dealing with reading values in these messages is in a single place, and that this can be dealt with by the test support class, so that it can return a type-safe object for the test to verify. 

`EventResponse` is provided as an option. This parses messages into either an `EventResponse.Ack` or an `EventResponse.Nack`. The `Ack` does not hold a lot of data, but the `Nack` will provide `errorCode` and text properties to test failure conditions.

It is recommended that the response type is a [sealed class in Kotlin](https://kotlinlang.org/docs/sealed-classes.html) with a companion object that implements `(GenesisSet) -> xxx`, where `xxx` is your sealed class.

```kotlin
sealed class LoginResponse {
    data class LoginAuthAck(
        val sessionAuthToken: String,
        val refreshAuthToken: String,
        val sessionId: String,
        val userName: String,
        val daysToPasswordExpiry: Int?,
        val notifyExpiry: Int?
    ) : LoginResponse()

    data class LoginAuthNack(
        val errorCode: AuthFailure,
        val text: String
    ) : LoginResponse()

    data class LogoutNack(val errorCode: AuthFailure) : LoginResponse()
    object LogoutAck : LoginResponse()
    object Other : LoginResponse()

    companion object : (GenesisSet) -> LoginResponse {
        override fun invoke(genesisSet: GenesisSet): LoginResponse =
            when (genesisSet.getString("MESSAGE_TYPE")) {
                "EVENT_LOGIN_AUTH_ACK" -> LoginAuthAck(
                    sessionAuthToken = genesisSet.getString("SESSION_AUTH_TOKEN")!!,
                    refreshAuthToken = genesisSet.getString("REFRESH_AUTH_TOKEN")!!,
                    sessionId = genesisSet.getString("SESSION_ID")!!,
                    userName = genesisSet.getString("USER_NAME")!!,
                    daysToPasswordExpiry = genesisSet.getInteger("DETAILS.DAYS_TO_PASSWORD_EXPIRY"),
                    notifyExpiry = genesisSet.getInteger("DETAILS.NOTIFY_EXPIRY")
                )
                "EVENT_LOGIN_AUTH_NACK" -> {
                    val firstError = genesisSet.getArray<GenesisSet>("ERROR")!!
                        .filterNotNull()
                        .first()

                    LoginAuthNack(
                        errorCode = AuthFailure.valueOf(firstError.getString("CODE")!!),
                        text = firstError.getString("TEXT", "NOT_SET")
                    )
                }
                "LOGOUT_ACK" -> LogoutAck
                "LOGOUT_NACK" -> LogoutNack(
                    AuthFailure.valueOf(genesisSet.getString("CODE")!!)
                )
                else -> Other
            }
    }
}
```

Having this parsing logic outside your tests cases makes these a lot simpler to write. For example, using the sealed class and parser above, testing the logging in and logging out again, becomes very simple:

```kotlin
@Test
fun `test logout - success`() {
    val message = sendMessage(buildLoginSet())      // build login request
        .blockingGet()                              // await response
        .assertedCast<LoginResponse.LoginAuthAck>() // assert message is LoginAuthNack
        
    sendMessage(buildLogoutSet(message.sessionId))  // build logout request with 
                                                    //    provided session id
        .blockingGet()                              // await response
        .assertedCast<LoginResponse.LogoutAck>()    // assert message is LogoutAck
}

@Test
fun `test logout - failure on session not found`() {
    val message = sendMessage(buildLogoutSet("invalid...")) // send logout request 
                                                            //    with invalid id
        .blockingGet()                                     
        .assertedCast<LoginResponse.LogoutNack>()           
        
    assert(message.errorCode == AuthFailure.SESSION_NOT_FOUND)
}
```

`buildLoginSet` and `buildLogoutSet` supporting functions

```kotlin
private fun buildLoginSet(overrides: GenesisSet.() -> Unit = {}): GenesisSet {
    val set = GenesisSet()
    set.setString("MESSAGE_TYPE", "EVENT_LOGIN_AUTH")
    set.setDirect("DETAILS.USER_NAME", USER_NAME)
    set.setDirect("DETAILS.PASSWORD", "beONneON*74")
    set.overrides()
    return set
}

private fun buildLogoutSet(sessionId: String): GenesisSet {
    val set = GenesisSet()
    set.setString("USER_NAME", USER_NAME)
    set.setString("SESSION_ID", sessionId)
    set.setString("MESSAGE_TYPE", "EVENT_LOGOUT")
    return set
}
```

### Sending messages

There are two functions for sending messages to a service:

- one uses RxJava2 Single
- the other uses Kotlin coroutines 

Whichever one you use, shouldn’t make a whole lot of difference in your test. The method `sendMessage(…)` will return a `Single`, this will require a call to `blockingGet()` for every message you’re interested in. `sendMessageAsync` will require you to wrap your test in a `runBlocking { … }` block.

```kotlin
@Test
fun `test logon failure - incorrect password (rxjava)`() {
    val loginSet = buildLoginSet { setDirect("DETAILS.PASSWORD", "WRONG") }
    
    val message = sendMessage(loginSet)
        .blockingGet()
        .assertedCast<LoginResponse.LoginAuthNack>()
        
    assert(message.errorCode == AuthFailure.INCORRECT_CREDENTIALS) { message.toString() }
}

@Test
fun `test logon failure - incorrect password (coroutines)`() = runBlocking {
    val loginSet = buildLoginSet { setDirect("DETAILS.PASSWORD", "WRONG") }
    
    val message = sendMessageAsync(loginSet)
        .assertedCast<LoginResponse.LoginAuthNack>()
        
    assert(message.errorCode == AuthFailure.INCORRECT_CREDENTIALS) { message.toString() }
}
```

Both functions take a `GenesisSet` and, optionally, a timeout. If no timeout is provided, it will default to 500. Timeouts are set in milliseconds. Behind the scenes, a call will be made to `GenesisMessageClient`, which will handle source refs and waiting for a response (within the timeout).

### Type-safe tests for Request Servers

Below is an example of writing a type-safe test for a Request Server,using a `RequestReplyWorkflow`. `RequestReplyWorkflow` requires two type parameters. 

- The first is the inbound class.
- The second is the outbound class.

```kotlin
    object CompanyFlow : RequestReplyWorkflow<Company.ById, Company> by requestReplyWorkflowBuilder()

    @Test
    fun `test req rep`(): Unit = runBlocking {
        val request = Company.ById("1")

        val reply = sendRequest(CompanyFlow, request)

        assertEquals(1, reply.size)
        assertEquals("1", reply.first().companyId)
    }
```

### Overriding the system definition

You can override system definition properties in your test class by overriding the `systemDefinition()` function.

### assertedCast

This extension function can be called on any value with a type parameter. If the value is of that type, it will be cast to that type; if not, the call will fail with an `AssertError`, and a helpful description.

```kotlin
// message will be LoginResponse; our generic response type
val message = sendMessageAsync(loginSet)

// loginAuthAck will be of type LoginResponse.LoginAuthAck
val loginAuthAck = message
    .assertedCast<LoginResponse.LoginAuthAck>()
```

### assertIsAuditedBy

This function helps assertions related to audit tables. It will check that all fields in the audited record match the audit record.
In the test below, we build a request to insert a user. We then get the user from the database to make sure it exists. Next, we check a USER_ATTRIBUTE row has been created. Finally, we check to make sure a matching row in USER_AUDIT has been created.

```kotlin
@Test
fun `test add users - success`() = runBlocking {
    sendMessageAsync(buildUserSet(INSERT_USER))
        .assertedCast<EventResponse.Ack>()

    val user = userRepo.getByName("test-user")
        ?: throw IllegalArgumentException("User not found!")

    assert(user.userName == "test-user") { user }
    assert(user.firstName == "Test") { user }
    assert(user.lastName == "User") { user }
    assert(user.emailAddress == "test-user@genesis.global") { user }
    assert(user.status == "PASSWORD_EXPIRED") { user }

    assert(passwordService.passwordIsValid(user, "TestPass123")) { "Password check failed" }

    val attributes = attributeRepo.getByUserName(user.userName)
        ?: throw IllegalArgumentException("Attributes not found!")

    assert(attributes.accessType == AccessType.ALL) { attributes }

    val userAudit = userAuditRepo.getRangeByUnderlyingId("tuser")
        .consumeAsFlow()
        .first()

    // assert all fields in user match in userAudit
    user assertIsAuditedBy userAudit

    assert(userAudit.auditEventType == "INSERT_USER") { userAudit.toString() }
    assert(userAudit.auditEventUser == "JohnDoe") { userAudit.toString() }

}
```