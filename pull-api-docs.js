const fs = require("fs");
const path = require("path");

const copyMicroFrontendApiDocs = () => {
  const microFrontends = ["foundation-header"];

  microFrontends.forEach((mf) => {
    const readDir = `./node_modules/@genesislcap/${mf}/docs/api/`;
    const writeDir = `./docs/04_front-end/05_micro-front-ends/${mf}_apiref`;
    if (!fs.existsSync(writeDir)) {
      fs.mkdirSync(writeDir);
    }

    const filesToCopy = fs.readdirSync(readDir);

    console.log(filesToCopy);

    // Copy files
    filesToCopy.forEach((fileName) => {
      const inputFile = path.join(readDir, fileName);
      const outputFile = path.join(writeDir, `${fileName}`);
      fs.copyFileSync(inputFile, outputFile);
    });

  });
};

module.exports = {
  loadContent() {
    copyMicroFrontendApiDocs();
  },
};
