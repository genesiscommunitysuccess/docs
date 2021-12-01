---
title: Genesis router
sidebar_label: Genesis Router
sidebar_position: 6
id: genesis-router

---

Genesis Router is responsible for communication between front-end and back-end. This is configured in file called genesis-router.xml file

Here is an example:

```xml
<router>
    <webPort>9064</webPort>
    <socketPort>9065</socketPort>

    <http>
        <handlers>
            <httpServerCodec>
                <maxInitialLineLength>4096</maxInitialLineLength>
                <maxHeaderSize>8192</maxHeaderSize>
                <maxChunkSize>8192</maxChunkSize>
                <validateHeaders>true</validateHeaders>
                <initialBufferSize>128</initialBufferSize>
            </httpServerCodec>
            <httpObjectAggregator>
                <maxContentLength>262144</maxContentLength>
                <closeOnExpectationFailed>false</closeOnExpectationFailed>
            </httpObjectAggregator>
        </handlers>
    </http>
    <routes>
        <route msgType="ALL_ORDERS" process="OEMS_DATASERVER"/>
        <route msgType="ALL_TRADES" process="OEMS_DATASERVER"/>
        <route msgType="ALL_ORDER_AUDITS" process="OEMS_DATASERVER"/>
    </routes>
    <whiteList name="ALL_ORDERS"/>
    <whiteList name="ALL_TRADES"/>
    <whiteList name="ALL_ORDER_AUDITS"/>
</router>
```

### Router configuration tags 

`socketPort`: This port is used for http/websockets

`webPort`: This port is used for tcp/ip socket

`dataserverPollingTimeout`: This setting contains the timeout for polling the data-server resources in the system. Dafult value is 60s

`authDisabled`: This tag if set to true, disables all authentication and is used for development mode. Default value is false

`nettyLoggingEnabled`: This tag if set to true, enables internal netty logging. Default value false

**Netty configuration**:

`httpServerCodecDefinition`: A combination of HttpRequestDecoder and HttpResponseEncoder which enables easier server side HTTP implementation.
For more information follow this [link](https://netty.io/4.1/api/io/netty/handler/codec/http/HttpServerCodec.html).

Different decoder options
  * maxInitialLineLength : default value: 4096
  * maxHeaderSize : default value 8192
  * maxChunkSize : default value 8192
  * validateHeaders : default value true
  * initialBufferSize : default value 128

`httpObjectAggregatorDefinition`: A ChannelHandler that aggregates an HttpMessage and its following HttpContents into a single FullHttpRequest or FullHttpResponse (depending on if it used to handle requests or responses) with no following HttpContents.
For more information follow this [link](https://netty.io/4.1/api/io/netty/handler/codec/http/HttpObjectAggregator.html)
  * maxContentLength - the maximum length of the aggregated content in bytes. Default value 262144
  * closeOnExpectationFailed - If a 100-continue response is detected but the content length is too large then true means close the connection. Otherwise the connection will remain open and data will be consumed and discarded until the next request is received. Default value false

**Allowed Resources**: It is possible to limit the resources to be exposed by the genesis router by using the `whitelist` tag (see example above). It is important to note that the following message types will always be allowed by default regardless of the whitelist definition:
EVENT_LOGIN_AUTH, EVENT_LOGOUT, MORE_ROWS, MORE_COLUMNS, DATA_LOGOFF, DATA_GET

**Message Routes**: You can redirect some microservice messages to particular processes using tag `routes.route` as shown above