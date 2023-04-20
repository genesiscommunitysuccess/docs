import commonJS from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import filesize from 'rollup-plugin-filesize';
import litcss from 'rollup-plugin-lit-css';
import styles from 'rollup-plugin-styles';
import transformTaggedTemplate from 'rollup-plugin-transform-tagged-template';
import { visualizer } from 'rollup-plugin-visualizer';
import { transformCSSFragment, transformHTMLFragment } from './transform-fragments';

const parserOptions = {
  sourceType: 'module',
};

/**
 * We may want to output variants, ie. https://github.com/rollup/rollup-starter-lib/blob/master/rollup.config.js
 * Aligning with what FAST are doing for now. We could raise a PR against FAST to output variants and then adjust.
 * Also the plugins have moved, ie. @rollup/plugin-commonjs, but keeping aligned to FAST for now.
 */
export default (packageName, globals = undefined) =>
  () => {
    const external = globals ? Object.keys(globals) : undefined;
    const output = [
      {
        file: `src/client-modules/${packageName}.iife.min.js`,
        format: 'iife',
        plugins: [terser()],
        globals,
      }
    ];
    return {
      context: 'this',
      input: 'iife.ts',
      output,
      external,
      onwarn(warning, warn) {
        // The IIFE export doesn't have a namespace since component exports
        // are expected to be top-level objects
        if (warning.code === 'MISSING_NAME_OPTION_FOR_IIFE_EXPORT') {
          return;
        }

        const nodeModulesNamespaceConflict =
          warning.reexporter && warning.reexporter.indexOf('node_modules') !== -1;
        const nodeModulesCircularDependency =
          warning.importer && warning.importer.indexOf('node_modules') !== -1;

        if (nodeModulesNamespaceConflict || nodeModulesCircularDependency) {
          return;
        }

        warn(warning);
      },
      plugins: [
        resolve({
          browser: true,
        }),
        commonJS(),
        typescript({
          outputToFilesystem: false,
          sourceMap: false,
          tsconfig: 'tsconfig.build.json',
        }),
        json(),
        styles({ mode: 'emit' }),
        litcss({ specifier: '@microsoft/fast-element' }),
        transformTaggedTemplate({
          tagsToProcess: ['css'],
          transformer: transformCSSFragment,
          parserOptions,
        }),
        transformTaggedTemplate({
          tagsToProcess: ['html'],
          transformer: transformHTMLFragment,
          parserOptions,
        }),
        filesize({
          showMinifiedSize: false,
          showBrotliSize: true,
        }),
        /**
         * Run via 'build:rollup:stats'.
         * This only generates one output even though in prod builds we have more. Not sure why that is as if we set open
         * to true, it'll open twice. Not convinced size reporting in the output is 100%, I think the author makes a case
         * as to why that is. Using the percentage info presented in the tooltip might be a better indicator as to a
         * chucks impact on the overall bundle.
         * To view simply open the stats file in your browser, ie. dist/{packageName}.stats.html
         */
        process.env.ANALYZE &&
          visualizer((outputOptions) => {
            return {
              title: `Rollup Visualizer - ${outputOptions.file}`,
              filename: outputOptions.file.replace('.js', '.stats.html'),
              gzipSize: true,
              brotliSize: true,
            };
          }),
      ],
    };
  };
