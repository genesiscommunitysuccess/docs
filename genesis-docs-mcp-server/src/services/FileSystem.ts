import { globby } from 'globby';
import path from 'path'

export type FileSystem = {
  docsFiles: () => Promise<string[]>;
}

async function runGlobby(searchTerm: string) {
  const projectRoot = path.resolve(__dirname, '../..'); // Go up to project root
  const mdFiles = await globby(`${projectRoot}/dist/docs/${searchTerm}`);
  return mdFiles;
}

let docs: string[] | null = null

const fileSystemBuilder = (): FileSystem => {
  return {
    async docsFiles() {
      if (!docs) {
        docs = await runGlobby('**/*.mdx')
      }
      return docs
    },
  }
}

export const fileSystem = fileSystemBuilder()
