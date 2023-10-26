---
title: 'Custom endpoints - examples'
sidebar_label: 'Examples'
id: examples
keywords: [server, integration, custom endpoints, examples]
tags:
  - server
  - integration
  - custom endpoints
  - examples
---

The example below is a collection of custom endpoints supporting SAML authentication. The `LoginPostEndPoint`, `LoginUrlRequestEndPoint`, `LogoutEndPoint`, and `MetadataEndPoint` all extend this `AbstractSamlEndPoint`.

## IdpListEndpoint
```kotlin
@Module
class IdpListEndpoint @Inject constructor(
    private val registry: WebEndpointRegistry,
    private val samlConfig: SamlConfig
) : WebEndpoint {

    @PostConstruct
    fun init() {
        registry.registerEndpoint("saml", this)
    }

    override fun allowedMethods(): Set<RequestType> = setOf(RequestType.GET)

    override fun name(): String = "list"

    override fun process(method: String, request: FullHttpRequest, conn: Channel): Any {
        val responseJson = genesisSet {
            "IDPS" with samlConfig.idpSettings.map { (name, idp) ->
                genesisSet {
                    "ID" with name
                    "DESCRIPTION" with name
                }
            }
        }.toJsonBytes()
        val responseBuffer = Unpooled.wrappedBuffer(responseJson)
        val response = DefaultFullHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK, responseBuffer)
        response.headers().add(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.APPLICATION_JSON)
        response.headers().add(HttpHeaderNames.CONTENT_LENGTH, responseJson.size)
        return response
    }

    override fun requiresAuth(): Boolean = false
}
```

## AbstractSamlEndPoint
```kotlin
abstract class AbstractSamlEndPoint(
    private val name: String,
    private val registry: WebEndpointRegistry,
    private val allowedMethods: Set<RequestType>
) : WebEndpoint {

    constructor(
        name: String,
        registry: WebEndpointRegistry,
        vararg requestTypes: RequestType
    ) : this(name, registry, requestTypes.toSet())

    @PostConstruct
    fun init() {
        LOG.info("Initiating Genesis SAML endpoint")
        registry.registerEndpoint("saml", this)
    }

    final override fun requiresAuth(): Boolean = false

    final override fun allowedMethods(): Set<RequestType> = allowedMethods
    final override fun name(): String = name

    final override fun process(
        method: String,
        request: FullHttpRequest,
        conn: Channel
    ): Single<HttpResponse> {
        val decoder = QueryStringDecoder(request.uri())
        val hostName = conn.remoteAddress().toString().substringBefore(":")
        return when (val idp = decoder.parameters()["idp"]?.firstOrNull()) {
            null -> Single.just(unauthorised())
            else -> process(idp, request, hostName)
        }
    }

    abstract fun process(
        idp: String,
        request: FullHttpRequest,
        hostName: String
    ): Single<HttpResponse>

    protected fun unauthorised(): DefaultHttpResponse {
        val httpResponse = DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.UNAUTHORIZED)
        HttpUtil.setContentLength(httpResponse, 0)
        return httpResponse
    }

    companion object {
        private val LOG = LoggerFactory.getLogger(AbstractSamlEndPoint::class.java)
    }
}
```

### LoginPostEndPoint
```kotlin
@Module
class LoginPostEndPoint @Inject constructor(
    registry: WebEndpointRegistry,
    private val authService: SamlAuthService,
    private val samlConfig: SamlConfig
) : AbstractSamlEndPoint("logon", registry, RequestType.POST) {
    private val factory = DefaultHttpDataFactory(true)

    override fun process(
        idp: String,
        request: FullHttpRequest,
        hostName: String
    ): Single<HttpResponse> = rxSingle<HttpResponse> {
        val decoder = HttpPostRequestDecoder(factory, request)
        val paramsAsList = decoder.bodyHttpDatas
            .filterIsInstance<Attribute>()
            .groupBy { it.name }
            .mapValues { (_, value) -> value.map { it.getString(it.charset) } }

        val uri = request.uri()
        val httpRequest = HttpRequest(uri, paramsAsList, uri)

        val token = authService.logon(idp, hostName, httpRequest)

        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.FOUND
        )

        val enc = QueryStringEncoder(samlConfig.loginEndpoint)
        enc.addParam("SSO_TOKEN", token)

        response.headers()[HttpHeaderNames.LOCATION] = enc.toUri().toString()
        HttpUtil.setContentLength(response, 0)
        response
    }.onErrorReturn { throwable ->
        if (throwable !is Exception) throw throwable
        LOG.warn("Error while processing saml request", throwable)
        unauthorised()
    }

    companion object {
        private val LOG = LoggerFactory.getLogger(LoginPostEndPoint::class.java)
    }
}
```

### LoginUrlRequestEndPoint
```kotlin
@Module
class LoginUrlRequestEndPoint @Inject constructor(
    registry: WebEndpointRegistry,
    private val authService: SamlAuthService
) : AbstractSamlEndPoint("login", registry, RequestType.GET) {

    override fun process(
        idp: String,
        request: FullHttpRequest,
        hostName: String
    ): Single<HttpResponse> = rxSingle {
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.FOUND
        )
        val url = authService.buildRequest(idp)
        response.headers()[HttpHeaderNames.LOCATION] = url.toString()
        HttpUtil.setContentLength(response, 0)
        response
    }
}
```

### LogoutEndPoint
```kotlin
@Module
class LogoutEndPoint @Inject constructor(
    registry: WebEndpointRegistry
) : AbstractSamlEndPoint("logout", registry, RequestType.POST, RequestType.GET) {
    override fun process(
        idp: String,
        request: FullHttpRequest,
        hostName: String
    ): Single<HttpResponse> {
        LOG.debug("LOGOUT request {}", request.content())

        return Single.just(unauthorised())
    }

    companion object {
        private val LOG = LoggerFactory.getLogger(LogoutEndPoint::class.java)
    }
}
```

### MetadataEndPoint
```kotlin
@Module
class MetadataEndPoint @Inject constructor(
    registry: WebEndpointRegistry,
    private val authService: SamlAuthService
) : AbstractSamlEndPoint("metadata", registry, RequestType.GET) {

    override fun process(
        idp: String,
        request: FullHttpRequest,
        hostName: String
    ): Single<HttpResponse> = rxSingle {
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK
        )
        val body = authService.metadata(idp).toByteArray()
        response.content().writeBytes(body)
        HttpUtil.setContentLength(response, body.size.toLong())
        response
    }
}
```
