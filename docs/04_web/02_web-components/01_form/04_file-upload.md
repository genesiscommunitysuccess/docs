---
title: 'Web Components - File Upload'
sidebar_label: 'File Upload'
id: file-upload
keywords: [web, web components, file upload]
tags:
    - web
    - web components
    - file upload
---

The file upload component can be used to **`select single/multiple files`** from the local file system.  Selected files can be uploaded to a server using the **`upload`** button. In addition to that the uploaded files can be viewed in the **`grid`**. The grid also provides a **`download`** button to download the uploaded files.

![](/img/file-upload-component.PNG)

## Set-up

```ts
import { provideDesignSystem, zeroFileUpload } from '@genesislcap/zero-design-system';

provideDesignSystem().register(zeroFileUpload());
```

## Usage
It can be used with default values as shown below:

```html title="Basic example"
   <zero-file-upload></zero-file-upload>
```
or you can customize it by passing the attributes as shown below: These attributes are explained in the next section.

```html title="Customized example"
    <zero-file-upload
        label="Upload Files"
        accept="image/*,.doc,.docx,application/pdf"
        file-size-limit-bytes="104857600"
        uploaded-files-resource-name="ALL_FILE_ATTACHMENTS"
        entity-id="Demo"
        field-name="ENTITY_ID"
        upload-key="series"
        grid-fields="FILE_NAME DOWNLOAD LAST_UPDATED_BY LAST_UPDATED_AT"
        :downloadEventName=${(x, c) => x.handleDownload.bind(c.event)}
    ></zero-file-upload>
```

## Attributes and props
The following attributes can be used to customize the file upload component:

- **`label`**: The label that will appear in file upload component. 
- **`accept`**: The file types that the file input should be able to select. Multiple file types can be specified by separating them with a comma like this `accept="image/*,.doc,.docx,application/pdf"`. By default all file types are allowed.

- **`fileSizeLimitBytes`**: The maximum file size in bytes that is supported by file input. Default value is `104_857_600` (100MiB).

- **`uploadedFilesResource`**: The resource that will be used to display the uploaded files in grid. Defaults to `ALL_FILE_ATTACHMENTS`.

- **`uploadEventName`**: The name of the endpoint that will be used to upload the files. Defaults to `attachment-handler/upload`.

- **`fieldName`**: field name that will be used for filtering the files list.

- **`entityId`**: Unique identifier value against which the files will be uploaded. This value will also be used to filter the files list.

- **`uploadKey`**: Unique key that will be used to upload the files.

- **`grid-fields`**: Name of fields that you want to display as grid columns from the metadata of the grid data source. By Default all the fields from grid data source metadata will be displayed. They must be specified in the format `FILE_NAME DOWNLOAD LAST_UPDATED_BY LAST_UPDATED_AT`. Fields will be displayed in the same order as they are specified here. Include `DOWNLOAD` in the list if you want to display the download button in the grid along with `downloadEventName`.

- **`errorOut`**: The event that is triggered when an error occurs during the upload process.

- **`downloadEventName`**: An observable of type function that will receive the rowData Object for the row whose download button is clicked. The function should return the name of the endpoint that will be used to download the file. This is required in order to enable the download functionality. See *example* below: 
```html
    <zero-file-upload 
    :downloadEventName=${(x, c) => x.handleDownload.bind(c.event)}
    ></zero-file-upload>
```
```ts {5}
  public handleDownload(data) {
    return `gwf/attachment-handler/download?attachment-id=${data.FILE_ATTACHMENT_ID}`;
  }
```
## Use cases

* Uploading and Downloading files
* Displaying uploaded files in a grid

