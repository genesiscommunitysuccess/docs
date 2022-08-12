---
title: 'Code snippets'
sidebar_label: 'Code snippets'
id: code-snippets
---

The following code snippets can be imported into IntelliJ to speed up repetitive development tasks, mainly around the declaration of Genesis scripts and configuration.

To import the below live templates, download the Genesis [settings.zip](/file/settings.zip) file and import this into your IDE. This can be done by selecting `File > Manage IDE Settings > Import Settings`.

## Fields, Tables and Views

<table>
<tr>
<td> Shortcut </td><td> Snippet </td>
</tr>
<tr>
<td>fld</td>
<td>

```kt
field(name = "$NAME$", type = $TYPE$)
```

</td>
</tr>
<tr>
<td>nfld</td>
<td>

```kt
field(name = "$NAME$", type = $TYPE$, nullable = true)
```

</td>
</tr>
<tr>
<td>tbl</td>
<td>

```kt
table( name= "$NAME$", id = $ID$) {
    primaryKey { }
}
```

</td>
</tr>
<tr>
<td>vw</td>
<td>

```kt
view("$NAME$", $TYPE$) {
    joins { }
    fields { }
}
```

</td>
</tr>
</table>

## Server modules

<table>
<tr>
<td> Shortcut </td> <td>Component</td> <td> Snippet </td>
</tr>
<tr>
<td>csl</td>
<td>Consolidator</td>
<td>

```kt
consolidator($LISTEN_TABLE$, $AGGREGATION_TABLE$) {
    select { }
    groupBy { }
    where { }
}
```

</td>
</tr>
<tr>
<td>dpcsv</td>
<td>Data Pipeline</td>
<td>

```kt
csv("") {
    location = ""
    delimiter = ','
    hasHeader = true
    
    mapper("", $TABLE$) {
        where { true }
    }
}
```

</td>
</tr>
<tr>
<td>ehdl</td>
<td>Event Handler</td>
<td>

```kt
eventHandler<$TYPE$>("$NAME$") {
    onCommit { event ->
        
        ack()
    }
}
```

</td>
</tr>
<tr>
<td>dpjson</td>
<td>Data Pipeline</td>
<td>

```kt
json("") {
    location = ""

    mapper("", $TABLE$) {
        where { true }
    }
}
```

</td>
</tr>
<tr>
<td>dpmssql</td>
<td>Data Pipeline</td>
<td>

```kt
msSql("") {
    hostname = ""
    port = 1433
    username = ""
    password = ""
    databaseName = ""

    table {
    }
}
```

</td>
</tr>
<tr>
<td>dporacle</td>
<td>Data Pipeline</td>
<td>

```kt
oracle("") {
    hostname = ""
    port = 1433
    username = ""
    password = ""
    databaseName = ""

    table {
    }
}
```

</td>
</tr>
<tr>
<td>dppsql</td>
<td>Data Pipeline</td>
<td>

```kt
postgres("") {
    hostname = ""
    port = 5432
    username = ""
    password = ""
    databaseName = ""

    table {
    }
}
```

</td>
</tr>
<tr>
<td>dpxml</td>
<td>Data Pipeline</td>
<td>

```kt
xml("") {
    location = ""
    tagName = ""

    mapper("", $TABLE$) {
        where { true }
    }
}
```

</td>
</tr>
</table>

## Runtime configuration

<table>
<tr>
<td> Shortcut </td> <td> Snippet </td>
</tr>
<tr>
<td>prcs</td>
<td>

```xml
<process name="$NAME$">
    <groupId>$GROUP$</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
    <module>$MODULE$</module>
    <package>$PACKAGE$</package>
    <script>$SCRIPT$</script>
    <description>$DESCRIPTION$</description>
    <classpath>$CLASS_PATH$</classpath>
    <language>pal</language>
</process>
```

</td>
</tr>
</table>

## Define and tweak snippets

You can define and tweak Genesis snippets within your JetBrains products.
To do so, open the settings for your IDE of choice and search for "Live Templates".

Do you have some super fancy snippets that you think colleagues and the Genesis community could benefit from? Get in touch and we can add them to the official settings distribution!