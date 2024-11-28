You can override the name of a field using various operators, this is necessary in the case a field name is the same as another table's field name.

- `withAlias <NAME>` gives the field an alternative `NAME`
- `withPrefix` adds a prefix to the field name

`withFormat <FORMAT_MASK>` can also be used to override `DATE`, `DATETIME` and numerical fields to be sent as a String in a particular format by using format masks.
- `DATE`/`DATETIME` format patterns should adhere to the [Joda DateTime format](https://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html)
- numerical format patterns should adhere to the Java [DecimalFormat](https://docs.oracle.com/javase/6/docs/api/java/text/DecimalFormat.html)
  
 