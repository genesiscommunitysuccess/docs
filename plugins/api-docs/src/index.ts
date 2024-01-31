// @ts-ignore
import fs from "fs-extra";
import path from "path";
import {
  createOutputDuplexStream,
  createUrlTransformerSteam,
} from "./fileStreams";
import { PackageConfig } from "./types";
import { pipeline } from "stream";
import { copyImgFile, createApiDoc } from "./copyFunctions";

type PluginOptions = {
  manifest: { packages: Array<PackageConfig> };
  processedMap: Record<string, string>;
};

/**
 * Curried function which copies files from an input directory to an output directory,
 * using a provided copy function.
 * The copy function is used to differentiate between file types
 */
function copyDirectoryFiles(packageRootDir: string, outputRootDir: string) {
  return async function ({
    inputDir,
    outputDir,
    copyFn,
  }: {
    inputDir: string;
    outputDir: string;
    copyFn: (inputFile: string, outputFile: string) => Promise<void>;
  }) {
    const inputFullDir = path.join(packageRootDir, inputDir);
    const outputFullDir = path.join(outputRootDir, outputDir);
    await fs.ensureDir(outputFullDir);

    /**
     * Copy files using copyFn
     */
    const filesInDir = await fs.readdir(inputFullDir);
    for await (const fileName of filesInDir) {
      const inputFile = path.join(inputFullDir, fileName);
      const outputFile = path.join(outputFullDir, fileName);
      await copyFn(inputFile, outputFile);
    }
  };
}

async function copyPackageFiles(
  manifest: PluginOptions["manifest"],
  processedMap: PluginOptions["processedMap"],
) {
  const { packages } = manifest;
  const packagesToProcess = packages.filter(
    (pkg) => pkg.enabled && !(pkg.name in processedMap),
  );
  if (!packagesToProcess.length) {
    console.log("[api-docs-plugin] No packages awaiting processing.");
    return;
  }
  for await (const pkg of packagesToProcess) {
    const packageRootDir = path.join(process.cwd(), "node_modules", pkg.name);
    const outputRootDir = path.join(process.cwd(), pkg.output.directory);
    await fs.ensureDir(outputRootDir);

    const copyDirFiles = copyDirectoryFiles(packageRootDir, outputRootDir);

    if (pkg.src.api_docs && pkg.output.api_docs) {
      await copyDirFiles({
        inputDir: pkg.src.api_docs,
        outputDir: pkg.output.api_docs,
        copyFn: createApiDoc,
      });
    }
    if (pkg.src.img_dir && pkg.output.img_dir) {
      await copyDirFiles({
        inputDir: pkg.src.img_dir,
        outputDir: pkg.output.img_dir,
        copyFn: copyImgFile,
      });
    }

    /**
     * Write readme file, use git to merge in acceptable changes to existing file after write occurs
     */
    const readmeStreamTransformer = createUrlTransformerSteam(pkg.output);
    const readmeDuplexStream = createOutputDuplexStream(
      pkg.output,
      outputRootDir,
      readmeStreamTransformer,
    );
    const packageReadmeFile = path.join(packageRootDir, pkg.src.readme);
    const readStream = fs.createReadStream(packageReadmeFile, {
      encoding: "utf8",
    });
    pipeline(readStream, readmeDuplexStream, (err) => {
      if (err) {
        console.error(`Pipeline failed. ${err}`);
      }
    });

    /**
     * Mark as processed
     * TODO: I think this doesn't actually work
     */
    const packageJson = await fs.readJson(
      path.join(packageRootDir, "package.json"),
    );
    processedMap[pkg.name] = packageJson.version;
  }
}

export default async function (_ctx: any, options: PluginOptions) {
  let { manifest, processedMap } = options;
  if (!manifest) {
    throw new Error("[api-docs-plugin] Please provide a manifest file.");
  }
  if (!processedMap) {
    throw new Error(
      "[api-docs-plugin] Please provide a processedMap instance.",
    );
  }
  let status = true;
  let error: Error | null;
  try {
    await copyPackageFiles(manifest, processedMap);
  } catch (e: unknown) {
    status = false;
    error = e as Error;
  }
  return {
    name: "api-docs-plugin",
    async loadContent() {
      if (!status) {
        throw new Error(
          `[api-docs-plugin] Failed to process api documentation. ${error?.toString()}`,
        );
      } else {
        console.log(
          "[api-docs-plugin] Finished processing api documentation.\n",
        );
      }
    },
  };
}
