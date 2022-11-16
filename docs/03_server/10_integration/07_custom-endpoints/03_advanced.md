---
title: 'Custom endpoints - advanced'
sidebar_label: 'Advanced'
id: advanced
keywords: [server, integration, custom endpoints, advanced]
tags:
  - server
  - integration
  - custom endpoints
  - advanced
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## A more advanced example of custom endpoints

Here is a collection of three classes that make up two custom endpoints: one for file upload, and one for file download. The third class defines a common set of useful methods for use by both endpoints.

These endpoints do not implement the `requiresAuth()` method from the `WebEndpoint` interface, and instead use the default return value of `true`.

### AttachmentCommon

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
@Module
class AttachmentCommon @Inject constructor(
    @Named(SYS_DEF_ATTACHMENT_STORAGE_PATH) sysdefFileStoragePath: String,
    @Named(SYS_DEF_ATTACHMENT_MAX_SIZE_IN_BITS) sysdefPayloadMaxSize: Long,
    @Named(SYS_DEF_REQUEST_ATTACHMENT_FOLDER_PREFIX) sysdefReqFolderPrefix: String?,
    private val db: RxEntityDb,
) {
    var fileStoragePath: Path? = null
        private set
    var maxFileSize: Long = 0
        private set
    private var REQUEST_FOLDER_PREFIX: String? = null

    init {
        require(!validateAttachmentServerStorageSetup(sysdefFileStoragePath))
        setupMaxPayloadSize(sysdefPayloadMaxSize)
        setupReqFolderPrefix(sysdefReqFolderPrefix)
    }

    fun errorResponse(e: FileEndpointException): DefaultFullHttpResponse {
        val responseJson = ("{\"ERROR\": \"" + e.message + "\"}").toByteArray()
        val responseBuffer = Unpooled.wrappedBuffer(responseJson)
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            e.httpResponseStatus,
            responseBuffer
        )
        response.headers().add(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.APPLICATION_JSON)
        HttpUtil.setContentLength(response, responseJson.size.toLong())
        return response
    }

    fun errorResponse(errorMsg: String, errorResponseStatus: HttpResponseStatus?): DefaultFullHttpResponse {
        val responseJson = "{\"ERROR\": \"$errorMsg\"}".toByteArray()
        val responseBuffer = Unpooled.wrappedBuffer(responseJson)
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            errorResponseStatus,
            responseBuffer
        )
        response.headers().add(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.APPLICATION_JSON)
        HttpUtil.setContentLength(response, responseJson.size.toLong())
        return response
    }

    fun successResponse(responseText: String): DefaultFullHttpResponse {
        val responseJson = "{\"SUCCESS\": \"$responseText\"}".toByteArray()
        val responseBuffer = Unpooled.wrappedBuffer(responseJson)
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK,
            responseBuffer
        )
        response.headers().add(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.APPLICATION_JSON)
        HttpUtil.setContentLength(response, responseJson.size.toLong())
        return response
    }

    @Throws(FileEndpointException::class)
    fun getValidatedUserName(sessionAuthToken: String): String {
        val foundUserSession = db.get(UserSession.BySessionAuthToken(sessionAuthToken)).blockingGet()
        return foundUserSession?.userName
            ?: throw FileEndpointException("No session found for auth token",
                HttpResponseStatus.BAD_REQUEST)
    }

    fun getFullPathToFile(requestId: Int, fileName: String?): Path {
        return Paths.get(getFullPathToRequestAttachmentFolder(requestId).toString(), fileName)
    }

    fun getFullPathToApprovalFile(requestId: Int, approvalId: Int, fileName: String?): Path {
        return Paths.get(getFullPathToApprovalAttachmentFolder(requestId, approvalId).toString(), fileName)
    }

    fun getFullPathToFile(requestId: Int, approvalType: String?, fileName: String?): Path {
        return Paths.get(getFullPathToRequestAttachmentFolder(requestId).toString(), approvalType, fileName)
    }

    fun getFullPathToRequestAttachmentFolder(requestId: Int): Path {
        return Paths.get(fileStoragePath.toString(), getRequestFolder(requestId))
    }

    fun getFullPathToApprovalAttachmentFolder(requestId: Int, approvalId: Int): Path {
        return Paths.get(fileStoragePath.toString(), getRequestFolder(requestId), "approval_$approvalId")
    }

    private fun getRequestFolder(requestId: Int): String {
        return String.format("%s%s", REQUEST_FOLDER_PREFIX, requestId)
    }

    private fun validateAttachmentServerStorageSetup(sysdefFileStoragePath: String): Boolean {
        if (sysdefFileStoragePath.isEmpty()) {
            LOG.error("System Definition Item {} must be defined. Shutting down", SYS_DEF_ATTACHMENT_STORAGE_PATH)
            ProcessUtils.shutdownProcess(-1)
            return false
        } else {
            fileStoragePath = Paths.get(sysdefFileStoragePath)
            //Check it's a valid dir and you have write access
            if (!Files.exists(fileStoragePath)) {
                try {
                    Files.createDirectories(fileStoragePath)
                } catch (e: IOException) {
                    LOG.error("Unable to create file storage path configured in System Definition Item {}. Shutting down.",
                        SYS_DEF_ATTACHMENT_STORAGE_PATH, e)
                    ProcessUtils.shutdownProcess(-1)
                    return false
                }
            } else if (!Files.isWritable(fileStoragePath)) {
                LOG.error("No write access to file storage path configured in System Definition Item {}. Shutting down.",
                    SYS_DEF_ATTACHMENT_STORAGE_PATH)
                ProcessUtils.shutdownProcess(-1)
                return false
            }
        }
        return true
    }

    private fun setupMaxPayloadSize(sysdefPayloadMaxSize: Long?) {
        maxFileSize = if (sysdefPayloadMaxSize == null) {
            LOG.warn("System Definition Item {} not defined. Using default value 1Mb!",
                SYS_DEF_ATTACHMENT_MAX_SIZE_IN_BITS)
            1000000L // Default is 1 Mb
        } else {
            sysdefPayloadMaxSize
        }
    }

    private fun setupReqFolderPrefix(sysdefReqFolderPrefix: String?) {
        REQUEST_FOLDER_PREFIX = if (sysdefReqFolderPrefix == null || sysdefReqFolderPrefix.isEmpty()) {
            val defaultVal = "request_"
            LOG.warn("System Definition Item {} not defined. Using default value '{}'",
                SYS_DEF_REQUEST_ATTACHMENT_FOLDER_PREFIX,
                defaultVal)
            defaultVal
        } else {
            sysdefReqFolderPrefix
        }
    }

    companion object {
        private val LOG: Logger = LoggerFactory.getLogger(AttachmentCommon::class.java)
        const val ATTACHMENT_PATH = "attachment-handler"
        private const val SYS_DEF_ATTACHMENT_STORAGE_PATH = "ATTACHMENT_STORAGE_PATH"
        private const val SYS_DEF_REQUEST_ATTACHMENT_FOLDER_PREFIX = "REQUEST_ATTACHMENT_FOLDER_PREFIX"
        private const val SYS_DEF_ATTACHMENT_MAX_SIZE_IN_BITS = "ATTACHMENT_MAX_SIZE_IN_BITS"
    }
}
```

</TabItem>
<TabItem value="java">

```java
@Module
public class AttachmentCommon {

    private static final Logger LOG = LoggerFactory.getLogger(AttachmentCommon.class);
    static final String ATTACHMENT_PATH = "attachment-handler";

    private static final String SYS_DEF_ATTACHMENT_STORAGE_PATH = "ATTACHMENT_STORAGE_PATH";
    private static final String SYS_DEF_REQUEST_ATTACHMENT_FOLDER_PREFIX = "REQUEST_ATTACHMENT_FOLDER_PREFIX";
    private static final String SYS_DEF_ATTACHMENT_MAX_SIZE_IN_BITS = "ATTACHMENT_MAX_SIZE_IN_BITS";

    private Path FILE_STORAGE_PATH;
    private long PAYLOAD_MAX_SIZE;
    private String REQUEST_FOLDER_PREFIX;
    private final RxEntityDb db;

    @Inject
    public AttachmentCommon(@Named(SYS_DEF_ATTACHMENT_STORAGE_PATH) String sysdefFileStoragePath,
                             @Named(SYS_DEF_ATTACHMENT_MAX_SIZE_IN_BITS) Long sysdefPayloadMaxSize,
                             @Named(SYS_DEF_REQUEST_ATTACHMENT_FOLDER_PREFIX) String sysdefReqFolderPrefix,
                             final RxEntityDb db) {
        this.db = db;

        if (!validateAttachmentServerStorageSetup(sysdefFileStoragePath)) {
            //Invalid setup, process will shut down
            return;
        }

        setupMaxPayloadSize(sysdefPayloadMaxSize);

        setupReqFolderPrefix(sysdefReqFolderPrefix);
    }

    public Path getFileStoragePath() {
        return FILE_STORAGE_PATH;
    }

    long getMaxFileSize() {
        return PAYLOAD_MAX_SIZE;
    }

    DefaultFullHttpResponse errorResponse(FileEndpointException e) {
        byte[] responseJson = ("{\"ERROR\": \"" + e.getMessage() + "\"}").getBytes();
        ByteBuf responseBuffer = Unpooled.wrappedBuffer(responseJson);
        DefaultFullHttpResponse response = new DefaultFullHttpResponse(
                HTTP_1_1,
                e.getHttpResponseStatus(),
                responseBuffer
        );
        response.headers().add(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.APPLICATION_JSON);
        HttpUtil.setContentLength(response, responseJson.length);
        return response;
    }

    DefaultFullHttpResponse errorResponse(String errorMsg, HttpResponseStatus errorResponseStatus) {
        byte[] responseJson = ("{\"ERROR\": \"" + errorMsg + "\"}").getBytes();
        ByteBuf responseBuffer = Unpooled.wrappedBuffer(responseJson);
        DefaultFullHttpResponse response = new DefaultFullHttpResponse(
                HTTP_1_1,
                errorResponseStatus,
                responseBuffer
        );
        response.headers().add(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.APPLICATION_JSON);
        HttpUtil.setContentLength(response, responseJson.length);
        return response;
    }

    DefaultFullHttpResponse successResponse(String responseText) {
        byte[] responseJson = ("{\"SUCCESS\": \"" + responseText + "\"}").getBytes();
        ByteBuf responseBuffer = Unpooled.wrappedBuffer(responseJson);
        DefaultFullHttpResponse response = new DefaultFullHttpResponse(
                HTTP_1_1,
                HttpResponseStatus.OK,
                responseBuffer
        );
        response.headers().add(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.APPLICATION_JSON);
        HttpUtil.setContentLength(response, responseJson.length);
        return response;
    }

    String getValidatedUserName(String sessionAuthToken) throws FileEndpointException {
        UserSession foundUserSession = db.get(new UserSession.BySessionAuthToken(sessionAuthToken)).blockingGet();
        if (foundUserSession != null) {
            return foundUserSession.getUserName();
        } else {
            throw new FileEndpointException("No session found for auth token", HttpResponseStatus.BAD_REQUEST);
        }
    }

    Path getFullPathToFile(int requestId, String fileName) {
        return Paths.get(getFullPathToRequestAttachmentFolder(requestId).toString(), fileName);
    }

    Path getFullPathToApprovalFile(int requestId, int approvalId, String fileName) {
        return Paths.get(getFullPathToApprovalAttachmentFolder(requestId, approvalId).toString(), fileName);
    }

    Path getFullPathToFile(int requestId, String approvalType, String fileName) {
        return Paths.get(getFullPathToRequestAttachmentFolder(requestId).toString(), approvalType, fileName);
    }

    public Path getFullPathToRequestAttachmentFolder(int requestId) {
        return Paths.get(getFileStoragePath().toString(), getRequestFolder(requestId));
    }

    public Path getFullPathToApprovalAttachmentFolder(int requestId, int approvalId) {
        return Paths.get(getFileStoragePath().toString(), getRequestFolder(requestId), "approval_" + approvalId);
    }

    private String getRequestFolder(int requestId) {
        return String.format("%s%s", REQUEST_FOLDER_PREFIX, requestId);
    }

    private boolean validateAttachmentServerStorageSetup(final String sysdefFileStoragePath) {
        if (sysdefFileStoragePath.isEmpty()) {
            LOG.error("System Definition Item {} must be defined. Shutting down", SYS_DEF_ATTACHMENT_STORAGE_PATH);
            ProcessUtils.shutdownProcess(-1);
            return false;
        } else {
            this.FILE_STORAGE_PATH = Paths.get(sysdefFileStoragePath);
            //Check it's a valid dir and you have write access
            if (!Files.exists(FILE_STORAGE_PATH)) {
                try {
                    Files.createDirectories(FILE_STORAGE_PATH);
                } catch (IOException e) {
                    LOG.error("Unable to create file storage path configured in System Definition Item {}. Shutting down.",
                            SYS_DEF_ATTACHMENT_STORAGE_PATH, e);
                    ProcessUtils.shutdownProcess(-1);
                    return false;
                }
            } else if (!Files.isWritable(FILE_STORAGE_PATH)) {
                LOG.error("No write access to file storage path configured in System Definition Item {}. Shutting down.",
                        SYS_DEF_ATTACHMENT_STORAGE_PATH);
                ProcessUtils.shutdownProcess(-1);
                return false;
            }
        }
        return true;
    }

    private void setupMaxPayloadSize(Long sysdefPayloadMaxSize) {
        if (sysdefPayloadMaxSize == null) {
            LOG.warn("System Definition Item {} not defined. Using default value 1Mb!", SYS_DEF_ATTACHMENT_MAX_SIZE_IN_BITS);
            this.PAYLOAD_MAX_SIZE = 1000000L;  // Default is 1 Mb
        } else {
            this.PAYLOAD_MAX_SIZE = sysdefPayloadMaxSize;
        }
    }

    private void setupReqFolderPrefix(String sysdefReqFolderPrefix) {
        if (sysdefReqFolderPrefix == null || sysdefReqFolderPrefix.isEmpty()) {
            String defaultVal = "request_";
            LOG.warn("System Definition Item {} not defined. Using default value '{}'",
                    SYS_DEF_REQUEST_ATTACHMENT_FOLDER_PREFIX,
                    defaultVal);
            this.REQUEST_FOLDER_PREFIX = defaultVal;
        } else {
            this.REQUEST_FOLDER_PREFIX = sysdefReqFolderPrefix;
        }
    }
}
```

</TabItem>
</Tabs>

### AttachmentDownloadEndpoint

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
@Module
class AttachmentDownloadEndpoint
@Inject constructor(
    private val registry: WebEndpointRegistry,
    private val attachmentCommon: AttachmentCommon,
    private val db: RxEntityDb
) : WebEndpoint {
    @PostConstruct
    fun init() {
        registry.registerEndpoint(AttachmentCommon.ATTACHMENT_PATH, this)
    }

    override fun allowedMethods(): Set<RequestType> {
        return ALLOWED_HTTP_METHODS
    }

    override fun name(): String {
        return "download"
    }

    override fun process(method: String, request: FullHttpRequest, conn: Channel): Any {

        val parameters = QueryStringDecoder(request.uri()).parameters()
        val requestAttachment: RequestAttachment
        return try {
            val parametersList = parameters[FORM_ATTACHMENT_ID]
            if (parametersList == null || parametersList.size == 0) {
                LOG.error("{} is not present in request parameters.", FORM_ATTACHMENT_ID)
                throw FileEndpointException("$FORM_ATTACHMENT_ID is not present in request parameters.",
                    HttpResponseStatus.INTERNAL_SERVER_ERROR)
            }
            //Validate attachment id and get the validated attachment details from Db
            val attachmentId = validateAttachmentId(parametersList[0])
            requestAttachment = getValidatedFileUploadId(attachmentId)

            // Retrieve and return the file, check exists and readable else error
            val pathToFile: Path? = if (requestAttachment.requestApprovalId != null) {
                attachmentCommon.getFullPathToApprovalFile(requestAttachment.requestId,
                    requestAttachment.requestApprovalId!!,
                    requestAttachment.fileName)
            } else {
                attachmentCommon.getFullPathToFile(requestAttachment.requestId, requestAttachment.fileName)
            }
            if (pathToFile == null) {
                throw FileEndpointException("Unable to find file for " +
                    FORM_ATTACHMENT_ID + " " + requestAttachment.byAttachmentId(),
                    HttpResponseStatus.INTERNAL_SERVER_ERROR)
            }
            val fileToSend = pathToFile.toFile()
            if (!fileToSend.exists() || fileToSend.isDirectory || !fileToSend.canRead()) {
                throw FileEndpointException("Unable to find file for " +
                    FORM_ATTACHMENT_ID + " " + requestAttachment.byAttachmentId(),
                    HttpResponseStatus.INTERNAL_SERVER_ERROR)
            }

            //Create chunkedFile and reply with it
            val chunkedFile = getChunkedFile(fileToSend)

            //Send response with file
            val response: HttpResponse = DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK)
            HttpUtil.setContentLength(response, fileToSend.length())
            setContentTypeHeader(response, fileToSend)

            // Write the initial line and the header.
            conn.write(response)
            LOG.debug("Returning file {}", fileToSend.absolutePath)
            HttpChunkedInput(chunkedFile)
        } catch (e: FileEndpointException) {
            attachmentCommon.errorResponse(e.message?: e.toString(), e.httpResponseStatus)
        }
    }

    @Throws(FileEndpointException::class)
    private fun getValidatedFileUploadId(attachmentId: Int): RequestAttachment {
        //Make sure dealId is valid, else reject
        return try {
            val requestAttachment = RequestAttachment.builder().setAttachmentId(attachmentId).build()
            val foundRequestAttachment = db.get(requestAttachment).blockingGet()
            if (foundRequestAttachment == null) {
                //Not a valid attachment ID
                LOG.error("Received {} {} which is not known to system", FORM_ATTACHMENT_ID, attachmentId)
                throw FileEndpointException("Unknown $FORM_ATTACHMENT_ID $attachmentId received",
                    HttpResponseStatus.BAD_REQUEST)
            } else if (foundRequestAttachment.fileName.isEmpty()) {
                LOG.error("Received {} {} which is in DB but no FILE_NAME set on Db Record",
                    FORM_ATTACHMENT_ID,
                    attachmentId)
                throw FileEndpointException("No FileName found for $FORM_ATTACHMENT_ID $attachmentId",
                    HttpResponseStatus.INTERNAL_SERVER_ERROR)
            }
            foundRequestAttachment
        } catch (e: FileEndpointException) {
            throw e
        } catch (e: Exception) {
            LOG.error("Unable to lookup {} {} in DB", FORM_ATTACHMENT_ID, attachmentId, e)
            throw FileEndpointException("Unable to validate $FORM_ATTACHMENT_ID $attachmentId exists in DB",
                HttpResponseStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Throws(FileEndpointException::class)
    private fun getChunkedFile(fileToChunk: File): ChunkedFile {
        return try {
            LOG.debug("Chunking file {}. Total space of file = {}", fileToChunk.absolutePath, fileToChunk.totalSpace)
            ChunkedFile(fileToChunk)
        } catch (e: IOException) {
            LOG.error("Unable to chunk file {}", fileToChunk.absoluteFile, e)
            throw FileEndpointException("Unable to convert original file to send",
                HttpResponseStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Throws(FileEndpointException::class)
    private fun validateAttachmentId(attachmentId: String?): Int {
        if (attachmentId == null || attachmentId.isEmpty()) {
            LOG.error("Received no {} parameter", FORM_ATTACHMENT_ID)
            throw FileEndpointException("No $FORM_ATTACHMENT_ID supplied", HttpResponseStatus.BAD_REQUEST)
        }
        return try {
            attachmentId.toInt()
        } catch (e: NumberFormatException) {
            LOG.error("Received invalid format for {} parameter - {} - must be an int",
                FORM_ATTACHMENT_ID,
                attachmentId)
            throw FileEndpointException("No $FORM_ATTACHMENT_ID supplied", HttpResponseStatus.BAD_REQUEST)
        }
    }

    companion object {
        private val LOG = LoggerFactory.getLogger(AttachmentDownloadEndpoint::class.java)
        private val ALLOWED_HTTP_METHODS: Set<RequestType> = setOf(RequestType.GET)
        private const val FORM_ATTACHMENT_ID = "attachment-id"
        private fun setContentTypeHeader(response: HttpResponse, file: File) {
            val mimeTypesMap = MimetypesFileTypeMap()
            response.headers()[HttpHeaderNames.CONTENT_TYPE] = mimeTypesMap.getContentType(file.path)
            response.headers()["Content-disposition"] = "attachment; filename=" + file.name
            response.headers()["Access-Control-Expose-Headers"] =
                "Content-disposition, Content-Type, Accept, X-Requested-With"
        }
    }
}
```

</TabItem>
<TabItem value="java">

```java
@Module
public class AttachmentDownloadEndpoint implements WebEndpoint {

    private static final Logger LOG = LoggerFactory.getLogger(AttachmentDownloadEndpoint.class);
    private static final Set<RequestType> ALLOWED_HTTP_METHODS = ImmutableSet.of(RequestType.GET);

    private final WebEndpointRegistry registry;
    private final AttachmentCommon attachmentCommon;
    private final RxEntityDb db;

    private static final String FORM_ATTACHMENT_ID = "attachment-id";

    @Inject
    public AttachmentDownloadEndpoint(final WebEndpointRegistry registry,
                                      final AttachmentCommon attachmentCommon,
                                      final RxEntityDb db) {
        this.registry = registry;
        this.db = db;
        this.attachmentCommon = attachmentCommon;
    }

    @PostConstruct
    public void init() {
        this.registry.registerEndpoint(AttachmentCommon.ATTACHMENT_PATH, this);
    }

    @NotNull
    @Override
    public Set<RequestType> allowedMethods() {
        return ALLOWED_HTTP_METHODS;
    }

    @NotNull
    @Override
    public String name() {
        return "download";
    }

    @NotNull
    @Override
    public Object process(@NotNull String s, FullHttpRequest fullHttpRequest, @NotNull Channel channel) {

        //Lookup the attachment-id, handle any errors
        Map<String, List<String>> parameters = new QueryStringDecoder(fullHttpRequest.uri()).parameters();

        RequestAttachment requestAttachment;
        try {
            List<String> parametersList = parameters.get(FORM_ATTACHMENT_ID);
            if (parametersList == null || parametersList.size() == 0) {
                LOG.error("{} is not present in request parameters.", FORM_ATTACHMENT_ID);
                throw new FileEndpointException(FORM_ATTACHMENT_ID + " is not present in request parameters.", HttpResponseStatus.INTERNAL_SERVER_ERROR);
            }
            //Validate attachment id and get the validated attachment details from Db
            int attachmentId = validateAttachmentId(parametersList.get(0));
            requestAttachment = getValidatedFileUploadId(attachmentId);

            // Retrieve and return the file, check exists and readable else error
            Path pathToFile;
            if (requestAttachment.getRequestApprovalId() != null) {
                pathToFile = attachmentCommon.getFullPathToApprovalFile(requestAttachment.getRequestId(), requestAttachment.getRequestApprovalId(), requestAttachment.getFileName());
            } else {
                pathToFile = attachmentCommon.getFullPathToFile(requestAttachment.getRequestId(), requestAttachment.getFileName());
            }

            if (pathToFile == null) {
                throw new FileEndpointException("Unable to find file for " +
                        FORM_ATTACHMENT_ID + " " + requestAttachment.byAttachmentId(), HttpResponseStatus.INTERNAL_SERVER_ERROR);
            }

            File fileToSend = pathToFile.toFile();
            if(!fileToSend.exists() || fileToSend.isDirectory() || !fileToSend.canRead()) {
                throw new FileEndpointException("Unable to find file for " +
                        FORM_ATTACHMENT_ID + " " + requestAttachment.byAttachmentId(), HttpResponseStatus.INTERNAL_SERVER_ERROR);
            }

            //Create chunkedFile and reply with it
            ChunkedFile chunkedFile = getChunkedFile(fileToSend);

            //Send response with file
            HttpResponse response = new DefaultHttpResponse(HTTP_1_1, OK);
            HttpUtil.setContentLength(response, fileToSend.length());
            setContentTypeHeader(response, fileToSend);

            // Write the initial line and the header.
            channel.write(response);

            LOG.debug("Returning file {}", fileToSend.getAbsolutePath());

            return new HttpChunkedInput(chunkedFile);
        } catch (FileEndpointException e) {
            return attachmentCommon.errorResponse(e.getMessage(), e.getHttpResponseStatus());
        }
    }

    private RequestAttachment getValidatedFileUploadId(Integer attachmentId) throws FileEndpointException {
        //Make sure dealId is valid, else reject
        try {
            RequestAttachment requestAttachment = RequestAttachment.builder().setAttachmentId(attachmentId).build();
            RequestAttachment foundRequestAttachment = db.get(requestAttachment).blockingGet();
           if (foundRequestAttachment == null) {
                //Not a valid attachment ID
                LOG.error("Received {} {} which is not known to system", FORM_ATTACHMENT_ID, attachmentId);
                throw new FileEndpointException("Unknown " + FORM_ATTACHMENT_ID + " " + attachmentId + " received", HttpResponseStatus.BAD_REQUEST);
            } else if (foundRequestAttachment.getFileName().isEmpty()) {
                LOG.error("Received {} {} which is in DB but no FILE_NAME set on Db Record", FORM_ATTACHMENT_ID, attachmentId);
                throw new FileEndpointException("No FileName found for " + FORM_ATTACHMENT_ID + " " + attachmentId, HttpResponseStatus.INTERNAL_SERVER_ERROR);
            }
            return foundRequestAttachment;
        } catch (FileEndpointException e) {
            throw e;
        } catch (Exception e) {
            LOG.error("Unable to lookup {} {} in DB", FORM_ATTACHMENT_ID, attachmentId, e);
            throw new FileEndpointException("Unable to validate " + FORM_ATTACHMENT_ID + " " + attachmentId + " exists in DB", HttpResponseStatus.INTERNAL_SERVER_ERROR);
        }

    }

    private ChunkedFile getChunkedFile(File fileToChunk) throws FileEndpointException {
        try {
            LOG.debug("Chunking file {}. Total space of file = {}", fileToChunk.getAbsolutePath(), fileToChunk.getTotalSpace());
            return new ChunkedFile(fileToChunk);
        } catch (IOException e) {
            LOG.error("Unable to chunk file {}", fileToChunk.getAbsoluteFile(), e);
            throw new FileEndpointException("Unable to convert original file to send", HttpResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private int validateAttachmentId(String attachmentId) throws FileEndpointException {
        if (attachmentId == null || attachmentId.isEmpty()) {
            LOG.error("Received no {} parameter", FORM_ATTACHMENT_ID);
            throw new FileEndpointException("No " + FORM_ATTACHMENT_ID + " supplied", HttpResponseStatus.BAD_REQUEST);
        }
        try {
            return Integer.parseInt(attachmentId);
        } catch (NumberFormatException e) {
            LOG.error("Received invalid format for {} parameter - {} - must be an int", FORM_ATTACHMENT_ID, attachmentId);
            throw new FileEndpointException("No " + FORM_ATTACHMENT_ID + " supplied", HttpResponseStatus.BAD_REQUEST);
        }
    }

    private static void setContentTypeHeader(HttpResponse response, File file) {
        MimetypesFileTypeMap mimeTypesMap = new MimetypesFileTypeMap();
        response.headers().set(CONTENT_TYPE, mimeTypesMap.getContentType(file.getPath()));
        response.headers().set("Content-disposition", "attachment; filename=" + file.getName());
        response.headers().set("Access-Control-Expose-Headers", "Content-disposition, Content-Type, Accept, X-Requested-With");
    }
}
```

</TabItem>
</Tabs>

### AttachmentUploadEndpoint
<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
@Module
class AttachmentUploadEndpoint
@Inject constructor(
    private val registry: WebEndpointRegistry,
    private val attachmentCommon: AttachmentCommon,
    private val db: RxEntityDb,
) : WebEndpoint {
    @PostConstruct
    fun init() {
        registry.registerEndpoint(AttachmentCommon.ATTACHMENT_PATH, this)
    }

    override fun allowedMethods(): Set<RequestType> {
        return ALLOWED_HTTP_METHODS
    }

    override fun name(): String {
        return "upload"
    }

    override fun process(method: String, request: FullHttpRequest, conn: Channel): Any {
        try {
            //Get user from session token
            val username = attachmentCommon.getValidatedUserName(request.headers()["SESSION_AUTH_TOKEN"])

            //Get and validate request input
            var requestId: Int? = null
            var requestApprovalId: Int? = null
            var isRccFinalAction = false
            val uploadedFiles: MutableList<MemoryFileUpload> = ArrayList()
            val uploadedFilesDescriptions: MutableList<String> = ArrayList()
            val uploadedAttachmentTypes: MutableList<AttachmentType> = ArrayList()
            val dataFactory = DefaultHttpDataFactory(false)
            dataFactory.setMaxLimit(attachmentCommon.maxFileSize)
            try {
                val postDecoder = HttpPostRequestDecoder(dataFactory, request)
                val postData = postDecoder.bodyHttpDatas

                //Parse out all the data we need
                for (data in postData) {
                    // General Post Content
                    if (data.httpDataType == InterfaceHttpData.HttpDataType.Attribute) {
                        val attribute = data as MemoryAttribute
                        LOG.debug("attribute {}", attribute)
                        LOG.debug("attribute.getName() {}", attribute.name)
                        LOG.debug("attribute.getValue() {}", attribute.value)
                        when (attribute.name) {
                            FORM_REQUEST_ID -> {
                                requestId = attribute.value.toInt()
                                LOG.debug("requestId : $requestId")
                            }
                            FORM_REQUEST_APPROVAL_ID -> {
                                requestApprovalId = attribute.value.toInt()
                                LOG.debug("approvalId : $requestApprovalId")
                            }
                            FORM_FILE_DESCRIPTION -> {
                                val fileDescription = attribute.value
                                uploadedFilesDescriptions.add(fileDescription)
                                LOG.debug("File-{} description : {}", uploadedFilesDescriptions.size, fileDescription)
                            }
                            FORM_ATTACHMENT_TYPE -> {
                                val attachmentType = attribute.value
                                uploadedAttachmentTypes.add(AttachmentType.valueOf(attachmentType))
                                LOG.debug("File-{} attachment-type : {}", uploadedAttachmentTypes.size, attachmentType)
                            }
                            IS_RCC_FINAL_ACTION -> {
                                val rccFinalAction = attribute.value
                                LOG.debug("rccFinalAction {}", rccFinalAction)
                                if ("true" == rccFinalAction) {
                                    isRccFinalAction = true
                                    LOG.debug("IS rccFinalAction {}", isRccFinalAction)
                                }
                            }
                            else -> LOG.debug("Ignoring unknown form attribute {} : {}",
                                attribute.name,
                                attribute.value)
                        }
                    } else if (data.httpDataType == InterfaceHttpData.HttpDataType.FileUpload) {
                        // File Uploaded
                        val fileUpload = data as MemoryFileUpload
                        uploadedFiles.add(fileUpload)
                        LOG.debug("File-{} file-name : {}", uploadedFiles.size, fileUpload.name)
                    }
                }
                if (uploadedFiles.size == 0) {
                    LOG.error("No file uploaded with request")
                    throw FileEndpointException("No file uploaded", HttpResponseStatus.BAD_REQUEST)
                }

                // Check if the request is valid
                if (!isRccFinalAction) {
                    isValidRequest(requestId!!)
                }
                val uploadTime = DateTime()
                for ((currentIndex, uploadedFile) in uploadedFiles.withIndex()) {
                    val fileDescription = uploadedFilesDescriptions[currentIndex]
                    val attachmentType = uploadedAttachmentTypes[currentIndex]
                    val requestAttachmentRecord: RequestAttachment = getRequestAttachment(requestId!!,
                        requestApprovalId,
                        uploadedFile.filename,
                        fileDescription,
                        attachmentType,
                        uploadTime,
                        username)
                    saveFile(requestAttachmentRecord, uploadedFile)
                    updateDb(requestAttachmentRecord)
                }
            } catch (ex: ErrorDataDecoderException) {
                LOG.error("Error decoding file", ex)
                throw FileEndpointException(ex.message, HttpResponseStatus.BAD_REQUEST)
            } catch (e: FileEndpointException) {
                throw e
            } catch (e: java.lang.Exception) {
                LOG.error("File upload failed to process!", e)
                throw FileEndpointException("File upload failed", HttpResponseStatus.BAD_REQUEST)
            }
        } catch (e: FileEndpointException) {
            return attachmentCommon.errorResponse(e)
        }
        return attachmentCommon.successResponse("Request attachment(s) added successfully")
    }

    @Throws(FileEndpointException::class)
    private fun saveFile(requestAttachmentRecord: RequestAttachment, uploadFile: MemoryFileUpload) {
        LOG.debug("Saving uploaded file with details: {}", requestAttachmentRecord)
        val newFileFullName: Path
        var filePath = attachmentCommon.getFullPathToRequestAttachmentFolder(requestAttachmentRecord.requestId)
        if (requestAttachmentRecord.requestApprovalId != null) {
            newFileFullName = attachmentCommon.getFullPathToFile(requestAttachmentRecord.requestId,
                "approval_" + requestAttachmentRecord.requestApprovalId,
                requestAttachmentRecord.fileName)
            filePath = attachmentCommon.getFullPathToApprovalAttachmentFolder(requestAttachmentRecord.requestId,
                requestAttachmentRecord.requestApprovalId!!)
        } else {
            newFileFullName =
                attachmentCommon.getFullPathToFile(requestAttachmentRecord.requestId, requestAttachmentRecord.fileName)
        }
        try {
            Files.createDirectories(filePath)
            Files.createFile(newFileFullName)
            Files.write(newFileFullName, uploadFile.get())
            LOG.debug("Uploaded file {} written", newFileFullName)
        } catch (e: FileAlreadyExistsException) {
            val errorMsg = "File " + requestAttachmentRecord.fileName + " already exists against this request."
            LOG.error(errorMsg, e)
            throw FileEndpointException(errorMsg, HttpResponseStatus.INTERNAL_SERVER_ERROR)
        } catch (e: IOException) {
            val errorMsg = "Error handling uploaded file " + e.message
            LOG.error(errorMsg, e)
            throw FileEndpointException(errorMsg, HttpResponseStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private fun updateDb(requestAttachment: RequestAttachment) {
        db.insert(requestAttachment).subscribe()
    }

    private fun getRequestAttachment(
        requestId: Int, requestApprovalId: Int?, fileName: String,
        fileDescription: String, attachmentType: AttachmentType, uploadTime: DateTime, userName: String,
    ): RequestAttachment {
        val requestAttachment: Builder = RequestAttachment.builder()
            .setRequestId(requestId)
            .setFileName(fileName)
            .setFileDescription(fileDescription)
            .setAttachmentType(attachmentType)
            .setLastUpdatedBy(userName)
            .setLastUpdatedAt(uploadTime)
        if (requestApprovalId != null) {
            requestAttachment.setRequestApprovalId(requestApprovalId)
        }
        return requestAttachment.build()
    }

    private fun isValidRequest(requestId: Int) {
        val request = db.get(Request.byId(requestId)).blockingGet()
        if (request != null) {
            if (request.requestState == RequestState.CLOSED || request.requestState == RequestState.APPROVED_PENDING_IMPLEMENTATION) {
                throw FileEndpointException("Request ID $requestId not in valid state to attach files",
                    HttpResponseStatus.BAD_REQUEST)
            }
        } else {
            throw FileEndpointException("Request ID $requestId not found", HttpResponseStatus.BAD_REQUEST)
        }
    }

    companion object {
        private val LOG = LoggerFactory.getLogger(AttachmentUploadEndpoint::class.java)
        private val ALLOWED_HTTP_METHODS: Set<RequestType> = setOf(RequestType.POST)
        private const val FORM_REQUEST_ID = "request-id"
        private const val FORM_REQUEST_APPROVAL_ID = "request-approval-id"
        private const val FORM_FILE_DESCRIPTION = "file-description"
        private const val FORM_ATTACHMENT_TYPE = "attachment-type"
        private const val IS_RCC_FINAL_ACTION = "is_rcc_final_action"
    }
}
```

</TabItem>
<TabItem value="java">

```java
@Module
public class AttachmentUploadEndpoint implements WebEndpoint {

    private static final Logger LOG = LoggerFactory.getLogger(AttachmentUploadEndpoint.class);
    private static final Set<RequestType> ALLOWED_HTTP_METHODS = ImmutableSet.of(RequestType.POST);
    private static final String FORM_REQUEST_ID = "request-id";
    private static final String FORM_REQUEST_APPROVAL_ID = "request-approval-id";
    private static final String FORM_FILE_DESCRIPTION = "file-description";
    private static final String FORM_ATTACHMENT_TYPE = "attachment-type";
    private static final String IS_RCC_FINAL_ACTION = "is_rcc_final_action";

    private final WebEndpointRegistry registry;
    private final AttachmentCommon attachmentCommon;
    private final RxEntityDb db;

    @Inject
    public AttachmentUploadEndpoint(final WebEndpointRegistry registry,
                                    final RxEntityDb db,
                                    final AttachmentCommon attachmentCommon) {
        this.registry = registry;
        this.db = db;
        this.attachmentCommon = attachmentCommon;
    }

    @PostConstruct
    public void init() {
        this.registry.registerEndpoint(AttachmentCommon.ATTACHMENT_PATH, this);
    }

    @NotNull
    @Override
    public String name() {
        return "upload";
    }

    @NotNull
    @Override
    public Set<RequestType> allowedMethods() {
        return ALLOWED_HTTP_METHODS;
    }

    @NotNull
    @Override
    public Object process(@NotNull String s, @NotNull FullHttpRequest fullHttpRequest, @NotNull Channel channel) {
        try {
            //Get user from session token
            String username = attachmentCommon.getValidatedUserName(fullHttpRequest.headers().get("SESSION_AUTH_TOKEN"));

            //Get and validate request input
            Integer requestId = null;
            Integer requestApprovalId = null;
            Boolean isRccFinalAction = false;

            List<MemoryFileUpload> uploadedFiles = new ArrayList<>();
            List<String> uploadedFilesDescriptions = new ArrayList<>();
            List<AttachmentType> uploadedAttachmentTypes = new ArrayList<>();
            DefaultHttpDataFactory dataFactory = new DefaultHttpDataFactory(false);
            dataFactory.setMaxLimit(attachmentCommon.getMaxFileSize());
            try {
                HttpPostRequestDecoder postDecoder = new HttpPostRequestDecoder(dataFactory, fullHttpRequest);
                List<InterfaceHttpData> postData = postDecoder.getBodyHttpDatas();

                //Parse out all the data we need
                for (InterfaceHttpData data : postData) {
                    // General Post Content
                    if (data.getHttpDataType() == InterfaceHttpData.HttpDataType.Attribute) {
                        MemoryAttribute attribute = (MemoryAttribute) data;

                        LOG.debug("attribute {}", attribute);
                        LOG.debug("attribute.getName() {}", attribute.getName());
                        LOG.debug("attribute.getValue() {}", attribute.getValue());

                        switch (attribute.getName()) {
                            case FORM_REQUEST_ID:
                                requestId = Integer.parseInt(attribute.getValue());
                                LOG.debug("requestId : " + requestId);
                                break;
                            case FORM_REQUEST_APPROVAL_ID:
                                requestApprovalId = Integer.parseInt(attribute.getValue());
                                LOG.debug("approvalId : " + requestApprovalId);
                                break;
                            case FORM_FILE_DESCRIPTION:
                                String fileDescription = attribute.getValue();
                                uploadedFilesDescriptions.add(fileDescription);
                                LOG.debug("File-{} description : {}", uploadedFilesDescriptions.size(), fileDescription);
                                break;
                            case FORM_ATTACHMENT_TYPE:
                                String attachmentType = attribute.getValue();
                                uploadedAttachmentTypes.add(AttachmentType.valueOf(attachmentType));
                                LOG.debug("File-{} attachment-type : {}", uploadedAttachmentTypes.size(), attachmentType);
                                break;
                            case IS_RCC_FINAL_ACTION:
                                String rccFinalAction = attribute.getValue();
                                LOG.debug("rccFinalAction {}", rccFinalAction);
                                if("true".equals(rccFinalAction)){
                                    isRccFinalAction = true;
                                    LOG.debug("IS rccFinalAction {}", isRccFinalAction);
                                }
                                break;
                            default:
                                LOG.debug("Ignoring unknown form attribute {} : {}", attribute.getName(), attribute.getValue());
                                break;
                        }
                    } else if (data.getHttpDataType() == InterfaceHttpData.HttpDataType.FileUpload) {
                        // File Uploaded
                        MemoryFileUpload fileUpload = (MemoryFileUpload) data;
                        uploadedFiles.add(fileUpload);
                        LOG.debug("File-{} file-name : {}", uploadedFiles.size(), fileUpload.getName());
                    }
                }
                if (uploadedFiles.size() == 0) {
                    LOG.error("No file uploaded with request");
                    throw new FileEndpointException("No file uploaded", HttpResponseStatus.BAD_REQUEST);
                }

                // Check if the request is valid
                if(!isRccFinalAction){
                    isValidRequest(requestId);
                }

                DateTime uploadTime = new DateTime();
                int currentIndex = 0;
                for (MemoryFileUpload uploadedFile : uploadedFiles) {

                    String fileDescription = uploadedFilesDescriptions.get(currentIndex);
                    AttachmentType attachmentType = uploadedAttachmentTypes.get(currentIndex);

                    RequestAttachment requestAttachmentRecord = getRequestAttachment(requestId, requestApprovalId, uploadedFile.getFilename(),fileDescription, attachmentType, uploadTime, username);

                    saveFile(requestAttachmentRecord, uploadedFile);
                    updateDb(requestAttachmentRecord);

                    currentIndex++;
                }
            } catch (HttpPostRequestDecoder.ErrorDataDecoderException ex) {
                LOG.error("Error decoding file", ex);
                throw new FileEndpointException(ex.getMessage(), HttpResponseStatus.BAD_REQUEST);
            } catch (FileEndpointException e) {
                throw e;
            } catch (Exception e) {
                LOG.error("File upload failed to process!", e);
                throw new FileEndpointException("File upload failed", HttpResponseStatus.BAD_REQUEST);
            }
        } catch (FileEndpointException e) {
            return attachmentCommon.errorResponse(e);
        }
        return attachmentCommon.successResponse("Request attachment(s) added successfully");
    }

    private void saveFile(RequestAttachment requestAttachmentRecord, MemoryFileUpload uploadFile) throws FileEndpointException {

        LOG.debug("Saving uploaded file with details: {}", requestAttachmentRecord);

        Path newFileFullName;
        Path filePath = attachmentCommon.getFullPathToRequestAttachmentFolder(requestAttachmentRecord.getRequestId());

        if (requestAttachmentRecord.getRequestApprovalId() != null) {
            newFileFullName = attachmentCommon.getFullPathToFile(requestAttachmentRecord.getRequestId(), "approval_" + requestAttachmentRecord.getRequestApprovalId(), requestAttachmentRecord.getFileName());
            filePath = attachmentCommon.getFullPathToApprovalAttachmentFolder(requestAttachmentRecord.getRequestId(), requestAttachmentRecord.getRequestApprovalId());

        } else {
            newFileFullName = attachmentCommon.getFullPathToFile(requestAttachmentRecord.getRequestId(), requestAttachmentRecord.getFileName());
        }

        try {

            Files.createDirectories(filePath);
            Files.createFile(newFileFullName);
            Files.write(newFileFullName, uploadFile.get());
            LOG.debug("Uploaded file {} written", newFileFullName);

        } catch (FileAlreadyExistsException e) {

            String errorMsg = "File " + requestAttachmentRecord.getFileName() + " already exists against this request.";
            LOG.error(errorMsg, e);
            throw new FileEndpointException(errorMsg, HttpResponseStatus.INTERNAL_SERVER_ERROR);

        } catch (IOException e) {

            String errorMsg = "Error handling uploaded file " + e.getMessage();
            LOG.error(errorMsg, e);
            throw new FileEndpointException(errorMsg, HttpResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void updateDb(RequestAttachment requestAttachment) {
        db.insert(requestAttachment).subscribe();
    }

    // Turn the received request meta into a dao DB record for writing
    private RequestAttachment getRequestAttachment(Integer requestId, Integer requestApprovalId, String fileName,
                                                   String fileDescription, AttachmentType attachmentType, DateTime uploadTime, String userName) {
        RequestAttachment.Builder requestAttachment =
                RequestAttachment.builder()
                        .setRequestId(requestId)
                        .setFileName(fileName)
                        .setFileDescription(fileDescription)
                        .setAttachmentType(attachmentType)
                        .setLastUpdatedBy(userName)
                        .setLastUpdatedAt(uploadTime);

        if (requestApprovalId != null) {
            requestAttachment.setRequestApprovalId(requestApprovalId);
        }
        return requestAttachment.build();
    }

    private void isValidRequest(Integer requestId) throws FileEndpointException {
        @Nullable Request request = db.get(new Request.ById(requestId)).blockingGet();
        if (request != null) {
            if (request.getRequestState().equals(RequestState.CLOSED) ||
                request.getRequestState().equals(RequestState.APPROVED_PENDING_IMPLEMENTATION)
            ) {
                throw new FileEndpointException("Request ID " + requestId + " not in valid state to attach files", HttpResponseStatus.BAD_REQUEST);
            }
        } else {
            throw new FileEndpointException("Request ID " + requestId + " not found", HttpResponseStatus.BAD_REQUEST);
        }
    }
}
```

</TabItem>
</Tabs>
