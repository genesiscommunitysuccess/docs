"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[29387],{85162:function(e,t,n){n.d(t,{Z:function(){return r}});var a=n(67294),s=n(86010),i="tabItem_Ymn6";function r(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",className:(0,s.Z)(i,r),hidden:n},t)}},65488:function(e,t,n){n.d(t,{Z:function(){return g}});var a=n(87462),s=n(67294),i=n(86010),r=n(72389),o=n(67392),l=n(7094),u=n(12466),d="tabList__CuJ",p="tabItem_LNqP";function c(e){var t,n,r=e.lazy,c=e.block,g=e.defaultValue,m=e.values,k=e.groupId,h=e.className,y=s.Children.map(e.children,(function(e){if((0,s.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=m?m:y.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),v=(0,o.l)(f,(function(e,t){return e.value===t.value}));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===g?g:null!=(t=null!=g?g:null==(n=y.find((function(e){return e.props.default})))?void 0:n.props.value)?t:y[0].props.value;if(null!==b&&!f.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var N=(0,l.U)(),S=N.tabGroupChoices,T=N.setTabGroupChoices,E=(0,s.useState)(b),A=E[0],w=E[1],R=[],I=(0,u.o5)().blockElementScrollPositionUntilNextRender;if(null!=k){var C=S[k];null!=C&&C!==A&&f.some((function(e){return e.value===C}))&&w(C)}var D=function(e){var t=e.currentTarget,n=R.indexOf(t),a=f[n].value;a!==A&&(I(t),w(a),null!=k&&T(k,String(a)))},G=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a,s=R.indexOf(e.currentTarget)+1;n=null!=(a=R[s])?a:R[0];break;case"ArrowLeft":var i,r=R.indexOf(e.currentTarget)-1;n=null!=(i=R[r])?i:R[R.length-1]}null==(t=n)||t.focus()};return s.createElement("div",{className:(0,i.Z)("tabs-container",d)},s.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},h)},f.map((function(e){var t=e.value,n=e.label,r=e.attributes;return s.createElement("li",(0,a.Z)({role:"tab",tabIndex:A===t?0:-1,"aria-selected":A===t,key:t,ref:function(e){return R.push(e)},onKeyDown:G,onFocus:D,onClick:D},r,{className:(0,i.Z)("tabs__item",p,null==r?void 0:r.className,{"tabs__item--active":A===t})}),null!=n?n:t)}))),r?(0,s.cloneElement)(y.filter((function(e){return e.props.value===A}))[0],{className:"margin-top--md"}):s.createElement("div",{className:"margin-top--md"},y.map((function(e,t){return(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==A})}))))}function g(e){var t=(0,r.Z)();return s.createElement(c,(0,a.Z)({key:String(t)},e))}},15478:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return d},default:function(){return k},frontMatter:function(){return u},metadata:function(){return p},toc:function(){return g}});var a=n(87462),s=n(63366),i=(n(67294),n(3905)),r=(n(61839),n(65488)),o=n(85162),l=["components"],u={title:"Integration testing",sidebar_label:"Integration testing",id:"integration-testing",keywords:["operations","integration","testing"],tags:["operations","integration","testing"]},d=void 0,p={unversionedId:"operations/testing/integration-testing",id:"version-2022.3/operations/testing/integration-testing",title:"Integration testing",description:"Database and service tests",source:"@site/versioned_docs/version-2022.3/05_operations/06_testing/02_integration-testing.md",sourceDirName:"05_operations/06_testing",slug:"/operations/testing/integration-testing",permalink:"/operations/testing/integration-testing",draft:!1,tags:[{label:"operations",permalink:"/tags/operations"},{label:"integration",permalink:"/tags/integration"},{label:"testing",permalink:"/tags/testing"}],version:"2022.3",sidebarPosition:2,frontMatter:{title:"Integration testing",sidebar_label:"Integration testing",id:"integration-testing",keywords:["operations","integration","testing"],tags:["operations","integration","testing"]},sidebar:"operationsSidebar",previous:{title:"Component testing",permalink:"/operations/testing/component-testing"},next:{title:"Unit testing",permalink:"/operations/testing/unit-testing"}},c={},g=[{value:"Database and service tests",id:"database-and-service-tests",level:2},{value:"Types of dictionary",id:"types-of-dictionary",level:2},{value:"Production dictionary",id:"production-dictionary",level:3},{value:"Inline dictionary",id:"inline-dictionary",level:3},{value:"File dictionary",id:"file-dictionary",level:3},{value:"Writing tests",id:"writing-tests",level:2},{value:"AbstractDatabaseTest",id:"abstractdatabasetest",level:3},{value:"AbstractGenesisTestSupport",id:"abstractgenesistestsupport",level:3},{value:"Parsing messages",id:"parsing-messages",level:3},{value:"Sending messages",id:"sending-messages",level:3},{value:"Type-safe tests for Request Servers",id:"type-safe-tests-for-request-servers",level:3},{value:"Overriding the system definition",id:"overriding-the-system-definition",level:3},{value:"assertedCast",id:"assertedcast",level:3},{value:"assertIsAuditedBy",id:"assertisauditedby",level:3}],m={toc:g};function k(e){var t=e.components,n=(0,s.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"database-and-service-tests"},"Database and service tests"),(0,i.kt)("p",null,"Two types of test are included in the platform:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"database test (AbstractDatabaseTest)"),(0,i.kt)("li",{parentName:"ul"},"service test (AbstractGenesisTestSupport and GenesisTestSupport)")),(0,i.kt)("p",null,"For both types, you need to start with a dictionary. This section will guide you through using GPAL dictionaries in Genesis tests."),(0,i.kt)("admonition",{type:"note"},(0,i.kt)("p",{parentName:"admonition"},"As of Genesis 5.2, a sample test case that uses production dictionary will be created automatically when a new project is generated.")),(0,i.kt)("h2",{id:"types-of-dictionary"},"Types of dictionary"),(0,i.kt)("p",null,"There are three types of dictionary you can use:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Production dictionary"),(0,i.kt)("li",{parentName:"ul"},"Inline dictionary"),(0,i.kt)("li",{parentName:"ul"},"File dictionary")),(0,i.kt)("h3",{id:"production-dictionary"},"Production dictionary"),(0,i.kt)("p",null,"Use this type of dictionary if you want to test against the production dictionary. This is the preferred way of using a dictionary in product tests, as production and test dictionaries are always in sync."),(0,i.kt)("p",null,"This dictionary type is easiest to use, and it is supported in both Java and Kotlin. When writing a test extending ",(0,i.kt)("inlineCode",{parentName:"p"},"AbstractGenesisTestSupport"),", the production dictionary is used by default. To use it from an ",(0,i.kt)("inlineCode",{parentName:"p"},"AbstractDatabaseTest")," class, is a couple of lines of code:"),(0,i.kt)(r.Z,{defaultValue:"kotlin",values:[{label:"Kotlin",value:"kotlin"},{label:"Java",value:"java"}],mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"kotlin",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},"override fun createMockDictionary(): GenesisDictionary = prodDictionary()\n"))),(0,i.kt)(o.Z,{value:"java",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"@Override\nprotected GenesisDictionary createMockDictionary() {\n    return prodDictionary();\n}\n")))),(0,i.kt)("h3",{id:"inline-dictionary"},"Inline dictionary"),(0,i.kt)("p",null,"When writing a test in Kotlin, you can the GPAL syntax to define a dictionary inline. Use this type of dictionary if the dictionary you want to use in your tests is different from the production dictionary. This dictionary should only be used in framework-type components where you want to test dictionaries that are distinct from your production dictionary."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'val USER_NAME by field(name = "USER_NAME", type = STRING)\nval AGE by field(name = "AGE", type = INT)\n\noverride fun createMockDictionary(): GenesisDictionary = testDictionary {\n    table(name = "USER", id = 1) {\n        USER_NAME\n        AGE\n        primaryKey {\n            USER_NAME\n        }\n    }\n}\n')),(0,i.kt)("admonition",{type:"important"},(0,i.kt)("p",{parentName:"admonition"},"Please note that the table definitions should be valid. If you specify an invalid table, e.g. by not defining a primary key, the test will fail.")),(0,i.kt)("h3",{id:"file-dictionary"},"File dictionary"),(0,i.kt)("p",null,"Only use a File dictionary if the dictionary you want to test is:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"different from the production dictionary"),(0,i.kt)("li",{parentName:"ul"},"too big to be practical in an inline dictionary")),(0,i.kt)("p",null,"Please note that the test will need to resolve the absolute location of the dictionary file, for example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},'@Override\nprotected GenesisDictionary createMockDictionary() throws Exception {\n    return TestUtil.getDictionaryFromPath(Paths.get(this.getClass().getResource("/DeleteDependentRecords/Dictionaries/KeyIsIntAndString-dictionary.xml").toURI()).toString());\n}\n')),(0,i.kt)("p",null,"In ",(0,i.kt)("inlineCode",{parentName:"p"},"AbstractDatabaseTest"),", you can also overwrite the ",(0,i.kt)("inlineCode",{parentName:"p"},"dictionaryName()")," method:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},'@Override\nprotected String dictionaryName() {\n    return "/dictionaries/standard-dictionary.xml";\n}\n')),(0,i.kt)("h2",{id:"writing-tests"},"Writing tests"),(0,i.kt)("p",null,"There two types of test described here:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Database tests - use this type for testing classes that require database access."),(0,i.kt)("li",{parentName:"ul"},"Test support tests - use this type of test for testing a service.")),(0,i.kt)("p",null,"Both types of test work with all three dictionary types."),(0,i.kt)("h3",{id:"abstractdatabasetest"},"AbstractDatabaseTest"),(0,i.kt)("p",null,"Use this for testing classes that require database access. These tests will instantiate an ",(0,i.kt)("inlineCode",{parentName:"p"},"RxDb")," object, with a dictionary. The full range of database operations are available, including the update queue. However, no other Genesis components are provided. The only requirement for this type of test is a dictionary."),(0,i.kt)("p",null,"To write a database test, begin by extending ",(0,i.kt)("inlineCode",{parentName:"p"},"AbstractDatabaseTest"),", and overwrite the  ",(0,i.kt)("inlineCode",{parentName:"p"},"createMockDictionary")," method, as in the samples below."),(0,i.kt)("p",null,"In the first instance, we are using a ",(0,i.kt)("strong",{parentName:"p"},"production directory"),"."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"in Kotlin, through the ",(0,i.kt)("inlineCode",{parentName:"li"},"rxDb")," property"),(0,i.kt)("li",{parentName:"ul"},"in Java, using the ",(0,i.kt)("inlineCode",{parentName:"li"},"getRxDb()")," method")),(0,i.kt)("p",null,"The test makes sure there are no records in the ",(0,i.kt)("inlineCode",{parentName:"p"},"USER")," table. In both languages, the ",(0,i.kt)("inlineCode",{parentName:"p"},"RxDb")," is available."),(0,i.kt)(r.Z,{defaultValue:"kotlin",values:[{label:"Kotlin",value:"kotlin"},{label:"Java",value:"java"}],mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"kotlin",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'class SampleKotlinTest : AbstractDatabaseTest() {\n\n    override fun createMockDictionary(): GenesisDictionary = prodDictionary()\n\n    @Test\n    fun `test count`() {\n        assert(rxDb.count("USER").blockingGet() == 0L)\n    }\n}\n'))),(0,i.kt)(o.Z,{value:"java",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},'public class SampleJavaTest extends AbstractDatabaseTest {\n\n    @Override\n    protected GenesisDictionary createMockDictionary() throws Exception {\n        return prodDictionary();\n    }\n\n    @Test\n    public void testCount() {\n        assert getRxDb().count("USER").blockingGet() == 0L;\n    }\n}\n')))),(0,i.kt)("p",null,"Here is a similar test using an ",(0,i.kt)("strong",{parentName:"p"},"inline dictionary"),"."),(0,i.kt)("p",null,"In this test, we define two fields and a table that uses these. We make sure there are no records in the ",(0,i.kt)("inlineCode",{parentName:"p"},"USER")," table. Since we are creating a stand-alone dictionary, we can start with id 1."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'class SampleKotlinTest : AbstractDatabaseTest() {\n\n    val USER_NAME by field(name = "USER_NAME", type = STRING)\n    val AGE by field(name = "AGE", type = INT)\n\n    override fun createMockDictionary(): GenesisDictionary = testDictionary {\n        table(name = "USER", id = 1) {\n            USER_NAME\n            AGE\n            primaryKey {\n                USER_NAME\n            }\n        }\n    }\n\n    @Test\n    fun `test count`() {\n        assert(rxDb.count("USER").blockingGet() == 0L)\n    }\n}\n')),(0,i.kt)("p",null,"Finally, here is a test using a ",(0,i.kt)("strong",{parentName:"p"},"file dictionary"),"."),(0,i.kt)("p",null,"In this test, the dictionary is read from an external file."),(0,i.kt)("p",null,"In all other regards, the database tests are normal JUnit tests. If you need additional components, you need to construct them or mock them. You won\u2019t be able to specify a ",(0,i.kt)("inlineCode",{parentName:"p"},"GENESIS_HOME")," folder for additional configuration."),(0,i.kt)("p",null,"If you add the ",(0,i.kt)("inlineCode",{parentName:"p"},"genesis-generated-dao")," jar to your classpath, you will be able to use repository classes as normal."),(0,i.kt)(r.Z,{defaultValue:"kotlin",values:[{label:"Kotlin",value:"kotlin"},{label:"Java",value:"java"}],mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"kotlin",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'class SampleKotlinTest : AbstractDatabaseTest() {\n\n    override fun dictionaryName() = "/genesisHome/genesis/cfg/genesis-dictionary.xml"\n\n    @Test\n    fun `test count`() {\n        assert(rxDb.count("USER").blockingGet() == 0L)\n    }\n}\n'))),(0,i.kt)(o.Z,{value:"java",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},'public class SampleJavaTest extends AbstractDatabaseTest {\n\n    @Test\n    public void testCount() {\n        assert getRxDb().count("USER").blockingGet() == 0L;\n    }\n\n    @Nullable\n    @Override\n    protected String dictionaryName() {\n        return "/genesisHome/genesis/cfg/genesis-dictionary.xml"\n    }\n}\n')))),(0,i.kt)("h3",{id:"abstractgenesistestsupport"},"AbstractGenesisTestSupport"),(0,i.kt)("p",null,"This is a more powerful type of test. In addition to setting up the database, it offers:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"start-up of a Genesis service in memory"),(0,i.kt)("li",{parentName:"ul"},"scanning of a ",(0,i.kt)("inlineCode",{parentName:"li"},"GENESIS_HOME")," folder for additional configuration"),(0,i.kt)("li",{parentName:"ul"},"injection of other components directly into the test"),(0,i.kt)("li",{parentName:"ul"},"mock auth-perms"),(0,i.kt)("li",{parentName:"ul"},"asynchronous message handling with timeout and parsing")),(0,i.kt)("p",null,"To create a test, you need to provide a ",(0,i.kt)("inlineCode",{parentName:"p"},"GenesisTestConfig")," instance in the constructor:"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Property"),(0,i.kt)("th",{parentName:"tr",align:null},"Required"),(0,i.kt)("th",{parentName:"tr",align:null},"Sets"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"packageName"),(0,i.kt)("td",{parentName:"tr",align:null},"yes"),(0,i.kt)("td",{parentName:"tr",align:null},"corresponds to the ",(0,i.kt)("package",null)," tag in processes.xml")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"genesisHome"),(0,i.kt)("td",{parentName:"tr",align:null},"yes"),(0,i.kt)("td",{parentName:"tr",align:null},"GENESIS_HOME folder for additional configuration")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"parser"),(0,i.kt)("td",{parentName:"tr",align:null},"yes"),(0,i.kt)("td",{parentName:"tr",align:null},"function that takes a GenesisSet and transforms it, this will determine the generic type of AbstractGenesisTestSupport")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"initialDataFile"),(0,i.kt)("td",{parentName:"tr",align:null},"no"),(0,i.kt)("td",{parentName:"tr",align:null},"csv files to load into the database")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"configFileName"),(0,i.kt)("td",{parentName:"tr",align:null},"no"),(0,i.kt)("td",{parentName:"tr",align:null},"corresponds to the ",(0,i.kt)("config",null)," tag in processes.xml")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"authCacheOverride"),(0,i.kt)("td",{parentName:"tr",align:null},"no"),(0,i.kt)("td",{parentName:"tr",align:null},"overrides auth-perms map to test")))),(0,i.kt)("p",null,"Any path provided for ",(0,i.kt)("inlineCode",{parentName:"p"},"genesisHome")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"initialDataFile")," must be an absolute location."),(0,i.kt)("p",null,"To use ",(0,i.kt)("inlineCode",{parentName:"p"},"AbstractGenesisTestSupport"),", create a new class and extend:"),(0,i.kt)(r.Z,{defaultValue:"kotlin",values:[{label:"Kotlin",value:"kotlin"},{label:"Java",value:"java"}],mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"kotlin",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'class UserControllerTest : AbstractGenesisTestSupport<EventResponse>(\n    GenesisTestConfig {\n        packageName = "global.genesis.auth.manager"\n        genesisHome = "/genesisHome"\n        initialDataFile = "standard-user-setup.csv"\n        authCacheOverride = "USER_VISIBILITY"\n        parser = EventResponse\n        configFileName = "config.xml"\n    }\n) {\n  // no tests defined yet\n}\n'))),(0,i.kt)(o.Z,{value:"java",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},'public class UserControllerJavaTest extends AbstractGenesisTestSupport<EventResponse> {\n\n    public UserControllerJavaTest() {\n        super(\n                new GenesisTestConfigImpl.Builder<EventResponse>()\n                        .addPackageName("global.genesis.auth.manager")\n                        .setGenesisHome("/genesisHome")\n                        .addInitialDataFile("standard-user-setup.csv")\n                        .setParser(EventResponse.Companion)\n                        .setConfigFileName("config.xml")\n                        .build()\n        );\n    }\n}\n')))),(0,i.kt)("h3",{id:"parsing-messages"},"Parsing messages"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"AbstractGenesisTestSupport")," tests require a parser. This should take a ",(0,i.kt)("inlineCode",{parentName:"p"},"GenesisSet")," and transform it. "),(0,i.kt)("p",null,"This is so that all logic dealing with reading values in these messages is in a single place, and that this can be dealt with by the test support class, so that it can return a type-safe object for the test to verify. "),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"EventResponse")," is provided as an option. This parses messages into either an ",(0,i.kt)("inlineCode",{parentName:"p"},"EventResponse.Ack")," or an ",(0,i.kt)("inlineCode",{parentName:"p"},"EventResponse.Nack"),". The ",(0,i.kt)("inlineCode",{parentName:"p"},"Ack")," does not hold a lot of data, but the ",(0,i.kt)("inlineCode",{parentName:"p"},"Nack")," will provide ",(0,i.kt)("inlineCode",{parentName:"p"},"errorCode")," and text properties to test failure conditions."),(0,i.kt)("p",null,"It is recommended that the response type is a ",(0,i.kt)("a",{parentName:"p",href:"https://kotlinlang.org/docs/sealed-classes.html"},"sealed class in Kotlin")," with a companion object that implements ",(0,i.kt)("inlineCode",{parentName:"p"},"(GenesisSet) -> xxx"),", where ",(0,i.kt)("inlineCode",{parentName:"p"},"xxx")," is your sealed class."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'sealed class LoginResponse {\n    data class LoginAuthAck(\n        val sessionAuthToken: String,\n        val refreshAuthToken: String,\n        val sessionId: String,\n        val userName: String,\n        val daysToPasswordExpiry: Int?,\n        val notifyExpiry: Int?\n    ) : LoginResponse()\n\n    data class LoginAuthNack(\n        val errorCode: AuthFailure,\n        val text: String\n    ) : LoginResponse()\n\n    data class LogoutNack(val errorCode: AuthFailure) : LoginResponse()\n    object LogoutAck : LoginResponse()\n    object Other : LoginResponse()\n\n    companion object : (GenesisSet) -> LoginResponse {\n        override fun invoke(genesisSet: GenesisSet): LoginResponse =\n            when (genesisSet.getString("MESSAGE_TYPE")) {\n                "EVENT_LOGIN_AUTH_ACK" -> LoginAuthAck(\n                    sessionAuthToken = genesisSet.getString("SESSION_AUTH_TOKEN")!!,\n                    refreshAuthToken = genesisSet.getString("REFRESH_AUTH_TOKEN")!!,\n                    sessionId = genesisSet.getString("SESSION_ID")!!,\n                    userName = genesisSet.getString("USER_NAME")!!,\n                    daysToPasswordExpiry = genesisSet.getInteger("DETAILS.DAYS_TO_PASSWORD_EXPIRY"),\n                    notifyExpiry = genesisSet.getInteger("DETAILS.NOTIFY_EXPIRY")\n                )\n                "EVENT_LOGIN_AUTH_NACK" -> {\n                    val firstError = genesisSet.getArray<GenesisSet>("ERROR")!!\n                        .filterNotNull()\n                        .first()\n\n                    LoginAuthNack(\n                        errorCode = AuthFailure.valueOf(firstError.getString("CODE")!!),\n                        text = firstError.getString("TEXT", "NOT_SET")\n                    )\n                }\n                "LOGOUT_ACK" -> LogoutAck\n                "LOGOUT_NACK" -> LogoutNack(\n                    AuthFailure.valueOf(genesisSet.getString("CODE")!!)\n                )\n                else -> Other\n            }\n    }\n}\n')),(0,i.kt)("p",null,"Having this parsing logic outside your tests cases makes these a lot simpler to write. For example, using the sealed class and parser above, testing the logging in and logging out again, becomes very simple:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'@Test\nfun `test logout - success`() {\n    val message = sendMessage(buildLoginSet())      // build login request\n        .blockingGet()                              // await response\n        .assertedCast<LoginResponse.LoginAuthAck>() // assert message is LoginAuthNack\n        \n    sendMessage(buildLogoutSet(message.sessionId))  // build logout request with \n                                                    //    provided session id\n        .blockingGet()                              // await response\n        .assertedCast<LoginResponse.LogoutAck>()    // assert message is LogoutAck\n}\n\n@Test\nfun `test logout - failure on session not found`() {\n    val message = sendMessage(buildLogoutSet("invalid...")) // send logout request \n                                                            //    with invalid id\n        .blockingGet()                                     \n        .assertedCast<LoginResponse.LogoutNack>()           \n        \n    assert(message.errorCode == AuthFailure.SESSION_NOT_FOUND)\n}\n')),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"buildLoginSet")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"buildLogoutSet")," supporting functions"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'private fun buildLoginSet(overrides: GenesisSet.() -> Unit = {}): GenesisSet {\n    val set = GenesisSet()\n    set.setString("MESSAGE_TYPE", "EVENT_LOGIN_AUTH")\n    set.setDirect("DETAILS.USER_NAME", USER_NAME)\n    set.setDirect("DETAILS.PASSWORD", "beONneON*74")\n    set.overrides()\n    return set\n}\n\nprivate fun buildLogoutSet(sessionId: String): GenesisSet {\n    val set = GenesisSet()\n    set.setString("USER_NAME", USER_NAME)\n    set.setString("SESSION_ID", sessionId)\n    set.setString("MESSAGE_TYPE", "EVENT_LOGOUT")\n    return set\n}\n')),(0,i.kt)("h3",{id:"sending-messages"},"Sending messages"),(0,i.kt)("p",null,"There are two functions for sending messages to a service:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"one uses RxJava2 Single"),(0,i.kt)("li",{parentName:"ul"},"the other uses Kotlin coroutines ")),(0,i.kt)("p",null,"Whichever one you use, shouldn\u2019t make a whole lot of difference in your test. The method ",(0,i.kt)("inlineCode",{parentName:"p"},"sendMessage(\u2026)")," will return a ",(0,i.kt)("inlineCode",{parentName:"p"},"Single"),", this will require a call to ",(0,i.kt)("inlineCode",{parentName:"p"},"blockingGet()")," for every message you\u2019re interested in. ",(0,i.kt)("inlineCode",{parentName:"p"},"sendMessageAsync")," will require you to wrap your test in a ",(0,i.kt)("inlineCode",{parentName:"p"},"runBlocking { \u2026 }")," block."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'@Test\nfun `test logon failure - incorrect password (rxjava)`() {\n    val loginSet = buildLoginSet { setDirect("DETAILS.PASSWORD", "WRONG") }\n    \n    val message = sendMessage(loginSet)\n        .blockingGet()\n        .assertedCast<LoginResponse.LoginAuthNack>()\n        \n    assert(message.errorCode == AuthFailure.INCORRECT_CREDENTIALS) { message.toString() }\n}\n\n@Test\nfun `test logon failure - incorrect password (coroutines)`() = runBlocking {\n    val loginSet = buildLoginSet { setDirect("DETAILS.PASSWORD", "WRONG") }\n    \n    val message = sendMessageAsync(loginSet)\n        .assertedCast<LoginResponse.LoginAuthNack>()\n        \n    assert(message.errorCode == AuthFailure.INCORRECT_CREDENTIALS) { message.toString() }\n}\n')),(0,i.kt)("p",null,"Both functions take a ",(0,i.kt)("inlineCode",{parentName:"p"},"GenesisSet")," and, optionally, a timeout. If no timeout is provided, it will default to 500. Timeouts are set in milliseconds. Behind the scenes, a call will be made to ",(0,i.kt)("inlineCode",{parentName:"p"},"GenesisMessageClient"),", which will handle source refs and waiting for a response (within the timeout)."),(0,i.kt)("h3",{id:"type-safe-tests-for-request-servers"},"Type-safe tests for Request Servers"),(0,i.kt)("p",null,"Below is an example of writing a type-safe test for a Request Server,using a ",(0,i.kt)("inlineCode",{parentName:"p"},"RequestReplyWorkflow"),". ",(0,i.kt)("inlineCode",{parentName:"p"},"RequestReplyWorkflow")," requires two type parameters. "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"The first is the inbound class."),(0,i.kt)("li",{parentName:"ul"},"The second is the outbound class.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'    object CompanyFlow : RequestReplyWorkflow<Company.ById, Company> by requestReplyWorkflowBuilder()\n\n    @Test\n    fun `test req rep`(): Unit = runBlocking {\n        val request = Company.ById("1")\n\n        val reply = sendRequest(CompanyFlow, request)\n\n        assertEquals(1, reply.size)\n        assertEquals("1", reply.first().companyId)\n    }\n')),(0,i.kt)("h3",{id:"overriding-the-system-definition"},"Overriding the system definition"),(0,i.kt)("p",null,"You can override system definition properties in your test class by overriding the ",(0,i.kt)("inlineCode",{parentName:"p"},"systemDefinition()")," function."),(0,i.kt)("h3",{id:"assertedcast"},"assertedCast"),(0,i.kt)("p",null,"This extension function can be called on any value with a type parameter. If the value is of that type, it will be cast to that type; if not, the call will fail with an ",(0,i.kt)("inlineCode",{parentName:"p"},"AssertError"),", and a helpful description."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},"// message will be LoginResponse; our generic response type\nval message = sendMessageAsync(loginSet)\n\n// loginAuthAck will be of type LoginResponse.LoginAuthAck\nval loginAuthAck = message\n    .assertedCast<LoginResponse.LoginAuthAck>()\n")),(0,i.kt)("h3",{id:"assertisauditedby"},"assertIsAuditedBy"),(0,i.kt)("p",null,"This function helps assertions related to audit tables. It will check that all fields in the audited record match the audit record.\nIn the test below, we build a request to insert a user. We then get the user from the database to make sure it exists. Next, we check a USER_ATTRIBUTE row has been created. Finally, we check to make sure a matching row in USER_AUDIT has been created."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'@Test\nfun `test add users - success`() = runBlocking {\n    sendMessageAsync(buildUserSet(INSERT_USER))\n        .assertedCast<EventResponse.Ack>()\n\n    val user = userRepo.getByName("test-user")\n        ?: throw IllegalArgumentException("User not found!")\n\n    assert(user.userName == "test-user") { user }\n    assert(user.firstName == "Test") { user }\n    assert(user.lastName == "User") { user }\n    assert(user.emailAddress == "test-user@genesis.global") { user }\n    assert(user.status == "PASSWORD_EXPIRED") { user }\n\n    assert(passwordService.passwordIsValid(user, "TestPass123")) { "Password check failed" }\n\n    val attributes = attributeRepo.getByUserName(user.userName)\n        ?: throw IllegalArgumentException("Attributes not found!")\n\n    assert(attributes.accessType == AccessType.ALL) { attributes }\n\n    val userAudit = userAuditRepo.getRangeByUnderlyingId("tuser")\n        .consumeAsFlow()\n        .first()\n\n    // assert all fields in user match in userAudit\n    user assertIsAuditedBy userAudit\n\n    assert(userAudit.auditEventType == "INSERT_USER") { userAudit.toString() }\n    assert(userAudit.auditEventUser == "JohnDoe") { userAudit.toString() }\n\n}\n')))}k.isMDXComponent=!0}}]);