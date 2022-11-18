const fs = require("fs")

/**
 * Sorry about the very crude regex.
 * It captures:
 *   [links like this](/foo/bar)
 * It does *not* capture:
 *   [links like this](./foo/bar)
 *   [links like this](http://foo/bar)
 *   [links like this](/img/foo/bar.png)
 *   [links like this](/foo/bar.md)
 */
const regex = /\[([^\]]+)\]\(\/(?!img)([^)]+(?<!md#?(.*)))\)/
const replaceWith = "../"

const walkDirectory = (root, depth = 0) => {
    const entries = fs.readdirSync(root, { withFileTypes: true })
    const dirs = entries.filter(e => e.isDirectory())
    const files = entries.filter(e => e.isFile() && e.name.endsWith(".md"))

    let paths = []
    for (const dir of dirs) {
        paths = paths.concat(walkDirectory(`${root}/${dir.name}`, depth + 1))
    }
    for (const file of files) {
        const path = `${root}/${file.name}`
        const data = fs.readFileSync(path).toString('utf8')
        if (regex.test(data)) {
            paths.push({path, depth})
        }
    }
    return paths
}

const replaceFile = (path, depth) => {
    const data = fs.readFileSync(path).toString('utf8')
    const replaced = replaceString(data, depth)
    fs.writeFileSync(path, replaced)
}

const replaceString = (data, depth) => {
    const globalRegex = new RegExp(regex, "g")
    const replacedPath = replaceWith.repeat(depth)
    return data.replaceAll(globalRegex, "[$1](" + replacedPath + "$2)")
}

const runMain = () => {
    const paths = [].concat(
        walkDirectory("./docs"),
        walkDirectory("./versioned_docs/version-2022.3")
    )

    for (const {path, depth} of paths) {
        replaceFile(path, depth)
    }
}

const runTests = () => {
    const assert = require('node:assert')
    const test = (actual, expected) => {
        console.log(`Testing '${actual}'`)
        assert.equal(replaceString(actual, 1), expected)
    }
    test("foo [bar](/baz)", "foo [bar](../baz)")
    test("foo [bar](../baz)", "foo [bar](../baz)")
    test("foo [bar](/baz) boo [fish](/test)", "foo [bar](../baz) boo [fish](../test)")
    test("[bar](/f/baz.md)", "[bar](/f/baz.md)")
    test("[bar](/f/baz.md#test)", "[bar](/f/baz.md#test)")
}

if (process.argv[2] === "--test") {
    runTests()
} else {
    runMain()
}