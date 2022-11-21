"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[63535],{85162:function(e,t,n){n.d(t,{Z:function(){return s}});var r=n(67294),a=n(86010),i="tabItem_Ymn6";function s(e){var t=e.children,n=e.hidden,s=e.className;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(i,s),hidden:n},t)}},65488:function(e,t,n){n.d(t,{Z:function(){return d}});var r=n(87462),a=n(67294),i=n(86010),s=n(72389),o=n(67392),l=n(7094),c=n(12466),u="tabList__CuJ",m="tabItem_LNqP";function p(e){var t,n,s=e.lazy,p=e.block,d=e.defaultValue,v=e.values,h=e.groupId,g=e.className,f=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=v?v:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,o.l)(k,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===d?d:null!=(t=null!=d?d:null==(n=f.find((function(e){return e.props.default})))?void 0:n.props.value)?t:f[0].props.value;if(null!==y&&!k.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+k.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var N=(0,l.U)(),T=N.tabGroupChoices,S=N.setTabGroupChoices,w=(0,a.useState)(y),C=w[0],I=w[1],M=[],x=(0,c.o5)().blockElementScrollPositionUntilNextRender;if(null!=h){var j=T[h];null!=j&&j!==C&&k.some((function(e){return e.value===j}))&&I(j)}var L=function(e){var t=e.currentTarget,n=M.indexOf(t),r=k[n].value;r!==C&&(x(t),I(r),null!=h&&S(h,String(r)))},Z=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r,a=M.indexOf(e.currentTarget)+1;n=null!=(r=M[a])?r:M[0];break;case"ArrowLeft":var i,s=M.indexOf(e.currentTarget)-1;n=null!=(i=M[s])?i:M[M.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:(0,i.Z)("tabs-container",u)},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":p},g)},k.map((function(e){var t=e.value,n=e.label,s=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:C===t?0:-1,"aria-selected":C===t,key:t,ref:function(e){return M.push(e)},onKeyDown:Z,onFocus:L,onClick:L},s,{className:(0,i.Z)("tabs__item",m,null==s?void 0:s.className,{"tabs__item--active":C===t})}),null!=n?n:t)}))),s?(0,a.cloneElement)(f.filter((function(e){return e.props.value===C}))[0],{className:"margin-top--md"}):a.createElement("div",{className:"margin-top--md"},f.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==C})}))))}function d(e){var t=(0,s.Z)();return a.createElement(p,(0,r.Z)({key:String(t)},e))}},41320:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return u},default:function(){return h},frontMatter:function(){return c},metadata:function(){return m},toc:function(){return d}});var r=n(87462),a=n(63366),i=(n(67294),n(3905)),s=(n(61839),n(65488)),o=n(85162),l=["components"],c={title:"Metrics",sidebar_label:"Metrics",id:"metrics",keywords:["operations","metrics"],tags:["operations","metrics"]},u=void 0,m={unversionedId:"operations/metrics/metrics",id:"version-2022.3/operations/metrics/metrics",title:"Metrics",description:"The Genesis Metrics module enables you to capture metrics for specific components of your application. You achieve this by inserting programmatic calls into appropriate places in your code.",source:"@site/versioned_docs/version-2022.3/05_operations/07_metrics/01_metrics.md",sourceDirName:"05_operations/07_metrics",slug:"/operations/metrics/metrics",permalink:"/operations/metrics/metrics",draft:!1,tags:[{label:"operations",permalink:"/tags/operations"},{label:"metrics",permalink:"/tags/metrics"}],version:"2022.3",sidebarPosition:1,frontMatter:{title:"Metrics",sidebar_label:"Metrics",id:"metrics",keywords:["operations","metrics"],tags:["operations","metrics"]},sidebar:"operationsSidebar",previous:{title:"Unit testing",permalink:"/operations/testing/unit-testing"},next:{title:"Artifact access",permalink:"/operations/artifactory/artifact-access"}},p={},d=[{value:"Set-up (example using SLF4J and GRAPHITE)",id:"set-up-example-using-slf4j-and-graphite",level:2},{value:"Metrics API",id:"metrics-api",level:2},{value:"Counters",id:"counters",level:3},{value:"Meters",id:"meters",level:3},{value:"Latency",id:"latency",level:3},{value:"Histograms",id:"histograms",level:3}],v={toc:d};function h(e){var t=e.components,n=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},v,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"The Genesis Metrics module enables you to capture metrics for specific components of your application. You achieve this by inserting programmatic calls into appropriate places in your code."),(0,i.kt)("p",null,"Any metrics system will have an effect on the performance of the application it is monitoring. The extra code (log statements, metrics, etc) will have an impact in some way. "),(0,i.kt)("p",null,"Genesis uses the well-known ",(0,i.kt)("a",{parentName:"p",href:"https://metrics.dropwizard.io/4.2.0/"},"metrics")," library, which is commonly used in Java apps. In all known Genesis applications, the impact is negligible; the benefits far outweigh the very tiny impact on performance. "),(0,i.kt)("p",null,"To make use of the metric calls, you must set ",(0,i.kt)("inlineCode",{parentName:"p"},"MetricsEnabled")," to ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," in the ",(0,i.kt)("a",{parentName:"p",href:"/server/configuring-runtime/system-definitions/"},"system definition file"),". In addition, you should define the ",(0,i.kt)("inlineCode",{parentName:"p"},"MetricsReportType")," to include a comma-separated list of ",(0,i.kt)("inlineCode",{parentName:"p"},"MetricsReportType")," outputs, which should include at least one of the following:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Console - sends metrics straight to the console"),(0,i.kt)("li",{parentName:"ul"},"SLF4J - will append metrics to an ",(0,i.kt)("a",{parentName:"li",href:"http://www.slf4j.org/"},"SLF4J")," Logger"),(0,i.kt)("li",{parentName:"ul"},"GRAPHITE - will send metrics to a ",(0,i.kt)("a",{parentName:"li",href:"https://graphiteapp.org/"},"Graphite")," service, which needs to be up and running",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"This requires some additional settings for ",(0,i.kt)("inlineCode",{parentName:"li"},"MetricsGraphiteURL")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"MetricsGraphitePort")," which identify the Graphite server.")))),(0,i.kt)("h2",{id:"set-up-example-using-slf4j-and-graphite"},"Set-up (example using SLF4J and GRAPHITE)"),(0,i.kt)("p",null,"In this example, we use a SLF4J log and Graphite server to capture metrics. Detailed set-up of a Graphite server is beyond the scope of this document, but it can be run in a ",(0,i.kt)("a",{parentName:"p",href:"http://docker.com"},"docker container")," as described ",(0,i.kt)("a",{parentName:"p",href:"https://registry.hub.docker.com/r/hopsoft/graphite-statsd#!"},"here")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'item(name = "MetricsEnabled", value = "true")\nitem(name = "MetricsReportType", value = "GRAPHITE,SLF4J")\n\nitem(name = "MetricsGraphiteURL", value = "localhost")\nitem(name = "MetricsGraphitePort", value = "2003")\nitem(name = "MetricsReportIntervalSecs", value = "60") // Optional, defaults to 10 seconds if not specified\n')),(0,i.kt)("h2",{id:"metrics-api"},"Metrics API"),(0,i.kt)("p",null,"To use the API, include the following in your project dependencies:"),(0,i.kt)(s.Z,{defaultValue:"maven",values:[{label:"Gradle",value:"gradle"},{label:"Maven",value:"maven"}],mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"gradle",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'implementation("global.genesis:genesis-metrics")\n\n'))),(0,i.kt)(o.Z,{value:"maven",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-xml"},"<dependency>\n    <groupId>global.genesis</groupId>\n    <artifactId>genesis-metrics</artifactId>\n</dependency>\n")))),(0,i.kt)("p",null,"The object ",(0,i.kt)("inlineCode",{parentName:"p"},"MetricService")," is available via the dependency injection mechanism. Simply mark a constructor with the ",(0,i.kt)("inlineCode",{parentName:"p"},"@Inject")," annotation and the parameters will be resolved automatically."),(0,i.kt)("p",null,"Once the ",(0,i.kt)("inlineCode",{parentName:"p"},"MetricService")," object is in scope, you can invoke methods on it to retrieve the appropriate metric objects."),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"MetricService")," distinguishes between two different kind of metrics; process and resource.\nProcess metrics are values that will exist once and only once per process, current memory utilisation, GC stats etc."),(0,i.kt)("p",null,"Resource metrics represent data about a named resource that may be one or more resources hosted within a process.\nDataservers, event handlers, reqreps and consolidators are all examples of named resources."),(0,i.kt)("p",null,"For a consistent approach and to make things easier for operations and support staff, the Genesis framework enforces a standard convention for the naming of metrics."),(0,i.kt)("p",null,"For process level metrics:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"genesis.$groupName.$processName.$hostname.process.$metricClassifier.$metricName\n")),(0,i.kt)("p",null,"For resource level metrics:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"genesis.$groupName.$processName.$hostname.$resourceClassifier.$resourceName.$metricClassifier.$metricName\n")),(0,i.kt)("p",null,"Where:\n",(0,i.kt)("inlineCode",{parentName:"p"},"$groupName")," is the value in the groupId field of the process definition (or unknown if missing)\n",(0,i.kt)("inlineCode",{parentName:"p"},"$processName")," is the name defined in the processes definition\n",(0,i.kt)("inlineCode",{parentName:"p"},"$hostname")," is the machine hostname\n",(0,i.kt)("inlineCode",{parentName:"p"},"$resourceClassifier")," is the type of resource being monitored in the plural form, e.g. dataservers\n",(0,i.kt)("inlineCode",{parentName:"p"},"$resourceName")," is the name given to the resource in its XML or GPAL definition\n",(0,i.kt)("inlineCode",{parentName:"p"},"$metricClassifier")," is a qualifying name for the metric value, used to organise the resulting dir structure\n",(0,i.kt)("inlineCode",{parentName:"p"},"$metricName")," is the thing actually being measured, such as 'latency', 'rate', 'count'"),(0,i.kt)("p",null,"The path separator is a period '.'"),(0,i.kt)("p",null,"Any of the above parameters can contain any number of periods to further sub-divide the classifiers as required."),(0,i.kt)("p",null,"Path sanitisation is performed in order to ensure path consistency. Any character in the following set:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"*@/\\\u2019\u201d;:|[]{}()&^%$,\n")),(0,i.kt)("p",null,"will be replaced with an underscore."),(0,i.kt)("p",null,"To create metrics, use the ","[meter]",", ","[timer]",", ","[histogram]"," and ","[counter]"," functions."),(0,i.kt)("p",null,"You can also register custom gauge implementations using the ","[registerCustomGauge]"," function."),(0,i.kt)("p",null,"The metric functions ","[meter]",", ","[timer]",", ","[histogram]"," and ","[counter]"," are also lookup functions into the metric registry.\nAs such, path sanitisation only occurs if the non-sanitised path does not already have a mapping. This is to avoid string\nscans and regex evaluation on every lookup to retrieve a metric object. In order to maximise performance (for example\nwhen counting messages in a high volume stream) do not use any upper-case or forbidden characters in your classifiers\nor names, or store the metric object in a local variable and do not perform a lookup each time it needs to be used."),(0,i.kt)("h3",{id:"counters"},"Counters"),(0,i.kt)(s.Z,{defaultValue:"kotlin",values:[{label:"Kotlin",value:"kotlin"},{label:"Java",value:"java"}],mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"kotlin",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'class UserAuthentication @Inject constructor(\n    val metricService: MetricService\n) {\n\n        fun login(user: User) {\n\n            val userLoginCounter = metricService.counter("users", user.userName, "active-sessions", "count")\n            userLoginCounter.increment()\n\n            // functional code would go here\n        }\n\n        fun logout(user: User) {\n\n            val userLoginCounter = metricService.counter("users", user.userName, "active-sessions", "count")\n            userLoginCounter.decrement()\n\n            // functional code would go here\n        }\n    }\n\n'))),(0,i.kt)(o.Z,{value:"java",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},'class UserAuthentication {\n\n    private final MetricService metricService;\n\n    @Inject\n    public UserAuthentication(MetricService metricService) {\n        this.metricService= metricService;\n    }\n\n    void login(User user) {\n\n        var userLoginCounter = metricService.counter("users", user.userName, "active-sessions", "count")\n        userLoginCounter.increment();\n\n        // functional code would go here\n    }\n\n    void logout(User user) {\n\n        var userLoginCounter = metricService.counter("users", user.userName, "active-sessions", "count")\n        userLoginCounter.decrement();\n\n        // functional code would go here\n    }\n}\n')))),(0,i.kt)("h3",{id:"meters"},"Meters"),(0,i.kt)(s.Z,{defaultValue:"kotlin",values:[{label:"Kotlin",value:"kotlin"},{label:"Java",value:"java"}],mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"kotlin",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'class UserAuthentication @Inject constructor(\n    val metricService: MetricService\n) {\n\n    fun login(user: User) {\n\n        val throughput = metricService.meter("groups", user.groupName, "login", "rate")\n        throughput.mark()\n\n        // functional code would go here\n    }\n}\n'))),(0,i.kt)(o.Z,{value:"java",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},'class UserAuthentication {\n\n    private final MetricService metricService;\n\n    @Inject\n    public UserAuthentication(MetricService metricService) {\n        this.metricService= metricService;\n    }\n\n    void login(User user) {\n\n        var throughput = = metricService.meter("users", user.userName, "login", "rate")\n        throughput.mark();\n\n        // functional code would go here\n    }\n}\n')))),(0,i.kt)("h3",{id:"latency"},"Latency"),(0,i.kt)(s.Z,{defaultValue:"kotlin",values:[{label:"Kotlin",value:"kotlin"},{label:"Java",value:"java"}],mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"kotlin",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'class UserAuthentication @Inject constructor(\n    val metricService: MetricService\n) {\n    fun login(user: User) {\n\n        val userLoginTime = metricService.latency("users", user.userName, "login", "latency").time()\n\n        // functional code would go here\n\n        userLoginTime.stop()\n    }\n}\n'))),(0,i.kt)(o.Z,{value:"java",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},'class UserAuthentication {\n    private final MetricService metricService;\n\n    @Inject\n    public UserAuthentication(MetricService metricService) {\n        this.metricService= metricService;\n    }\n\n    void login(User user) {\n\n        LatencyContext userLoginTime = metricService.latency("users", user.userName, "login", "latency").time()\n\n        // functional code would go here\n\n        userLoginTime.stop();\n\n    }\n}\n')))),(0,i.kt)("h3",{id:"histograms"},"Histograms"),(0,i.kt)(s.Z,{defaultValue:"kotlin",values:[{label:"Kotlin",value:"kotlin"},{label:"Java",value:"java"}],mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"kotlin",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'class Queue @Inject constructor(val name: String, val metricService: MetricService) {\n\n        fun queueRequest(request: MetricUtilsTest.Request) {\n            val histogram = metricService.histogram("queues", name, "size", "histogram")\n            histogram.update(request.size.toLong())\n\n            // functional code would go  here\n        }\n    }\n'))),(0,i.kt)(o.Z,{value:"java",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},'class Queue {\n    private String name;\n    private final MetricService metricService;\n    \n    @Inject\n    public Queue(String name, MetricService metricService)\n    \n    void queueRequest(Request request) {\n\n        var histogram = metricService.histogram("queues", name, "size", "histogram");\n\n        histogram.update(request.size);\n\n        // functional code would go  here\n    }\n}\n')))))}h.isMDXComponent=!0}}]);