You can write content using [GitHub-flavored Markdown syntax](https://github.github.com/gfm/).

## Markdown Syntax

To serve as an example page when styling markdown based Docusaurus sites!!!

## Headers

# H1 - Create the best documentation

## H2 - Create the best documentation

### H3 - Create the best documentation

#### H4 - Create the best documentation

##### H5 - Create the best documentation

###### H6 - Create the best documentation

***

## Emphasis

Emphasis, aka italics, with _asterisks_ or _underscores_.

Strong emphasis, aka bold, with **asterisks** or **underscores**.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

***

## Lists

1. First ordered list item
2. Another item
   * Unordered sub-list.
3. Actual numbers don't matter, just that it's a number
   1. Ordered sub-list
4. And another item.

* Unordered list can use asterisks
* Or minuses
* Or pluses

***

## Links

Link to another documentation page: [Platform](/getting-started/platform/)

External link: [Google](https://www.google.com/)

[Anchor link](#markdown-syntax) to a section on the same page

***

## Images

Stored in `static/img` folder and loaded as follows:

![](/img/this-is-what-a-genesis-application.png)

![alternative text](/img/this-is-what-a-genesis-application.png "Title text")

***

## Inline code references

Sentence with a `variable`.

Note: any code with angle brackets will need to be wrapped in an code block to prevent syntax errors e.g. `<category>`.

## Code Blocks

```javascript
var s = 'JavaScript syntax highlighting';
alert(s);
```

```python
s = "Python syntax highlighting"
print(s)
```

    No language indicated, so no syntax highlighting.
    But let's throw in a <b>tag</b>.

```js {2}
function highlightMe() {
  console.log('This line can be highlighted!');
}
```

## Loading code from a file

import CodeBlock from '@theme/CodeBlock';
import Example from '!!raw-loader!./examples/ui/helloWorld';

<CodeBlock className="language-ts">{Example}</CodeBlock>

***

## Tables

There must be at least 3 dashes separating each header cell. The outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily. You can also use inline Markdown.

| Markdown | Less | Pretty |
| --- | --- | --- |
| Still | renders | nicely |
| 1 | 2 | 3 |

Colons can be used to align columns.

| Tables | Are | Cool |
| --- | :---: | ---: |
| col 3 is | right-aligned | $1600 |
| col 2 is | centered | $12 |
| zebra stripes | are neat | $1 |

***

## Blockquotes

> Blockquotes are very handy in email to emulate reply text. This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can _put_ **Markdown** into a blockquote.

***

## Inline HTML

Markdown can embed HTML elements, and `details` HTML elements comes with default styling:

<details>
  <summary>Toggle me!</summary>
  <div>
    <div>This is the detailed content</div>
  </div>
</details>

You can use other elements too:

<dl>
<dt>Definition list</dt>
<dd>Is something people use sometimes.</dd>

<dt>Markdown in HTML</dt>
<dd>Does _not_ work **very** well. Use HTML <em>tags</em>.</dd>
</dl>


***

## Line Breaks

Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a _separate paragraph_.

This line is also a separate paragraph, but... This line is only separated by a single newline, so it's a separate line in the _same paragraph_.

***

## Admonitions

:::note

This is a note

:::

:::tip

This is a tip

:::

:::important

This is important

:::

:::caution

This is a caution

:::

:::warning

This is a warning

:::