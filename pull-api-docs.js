const fs = require("fs");
const path = require("path");

const copiedModules = {};

/**
 * Copies the api reference documents out of the microfrontends into
 * the docs directory
 *
 * Skips subsequent copies otherwise it gets into an infinite loop
 */
const copyMicroFrontendApiDocs = () => {
  const microFrontends = ["foundation-header"];

  microFrontends.forEach((mf) => {
    if (mf in copiedModules) {
      console.log(`Skipping ${mf} as the docs are already copied.`);
      return;
    }
    const readDir = `./node_modules/@genesislcap/${mf}/docs/api/`;
    const writeDir = `./docs/04_front-end/05_micro-front-ends/${mf}_apiref`;
    if (!fs.existsSync(writeDir)) {
      fs.mkdirSync(writeDir);
    }

    const filesToCopy = fs.readdirSync(readDir);

    // Copy files
    filesToCopy.forEach((fileName) => {
      const inputFile = path.join(readDir, fileName);
      const outputFile = path.join(writeDir, `${fileName}`);
      fs.copyFileSync(inputFile, outputFile);
    });

    copiedModules[`${mf}`] = true;
  });
};

module.exports = {
  loadContent() {
    copyMicroFrontendApiDocs();
  },
};
