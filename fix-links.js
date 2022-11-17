const fs = require("fs")

/**
 * Sorry about the very crude regex.
 * It captures:
 *   [links like this](/foo/bar)
 * It does *not* capture:
 *   [links like this](./foo/bar)
 *   [links like this](http://foo/bar)
 *   [links like this](/img/foo/bar.png)
 */
const regex = /\[([^\]]+)\]\(\/(?!img)([^)]+)\)/g
const replaceWith = "../"
const walkDirectory = (root, depth = 1) => {
    const entries = fs.readdirSync(root, {withFileTypes: true})

    const dirs = entries.filter(e => e.isDirectory())
    const files = entries.filter(e => e.isFile() && e.name.endsWith(".md"))

    const replacedPath = replaceWith.repeat(depth)

    for (const file of files) {
        const path = `${root}/${file.name}`
        const data = fs.readFileSync(path).toString()
        const hasMatches = regex.test(data)
        if (hasMatches) {
            const replaced = data.replaceAll(regex, "[$1](" + replacedPath + "$2)")
            console.log(replaced)
            console.log(path)
            process.exit(0)
        }
        // for (const match of matches) {
        //     console.log(replacedPath, depth, path, match[2])
        // }
    }

    for (const dir of dirs) {
        walkDirectory(`${root}/${dir.name}`, depth + 1)
    }
}

walkDirectory("./docs")
walkDirectory("./versioned_docs/version-2022.3")