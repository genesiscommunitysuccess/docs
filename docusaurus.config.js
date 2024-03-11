require("dotenv").config();

const baseUrl = process.env.BASE_URL || '/';
const routeBasePath = '/';
const GTM_ID = process.env.GTM_ID || 'GTM-5GTR43J'; // default to uat GTM_ID, prod one should be set on CI (master)

module.exports = async function createConfigAsync() {
  return {
    title: "Low-code Platform For Financial Markets",
    tagline:
      "The Platform with 50+ Modern Building Blocks to Accelerate App Development.",
    url: "https://learn.genesis.global/",
    baseUrl,
    favicon: "img/favicon.ico",
    organizationName: "genesislcap",
    projectName: "docs",
    trailingSlash: true,
    markdown: {
      format: "detect",
    },
    onBrokenLinks: "throw", // please do NOT change this to 'warn', fix or remove your broken links instead
    onBrokenMarkdownLinks: "throw", // please do NOT change this to 'warn', fix or remove your broken links instead
    onDuplicateRoutes: "throw",
    clientModules: ["./src/client-modules/genesislcap.js"],
    webpack: {
      jsLoader: (isServer) => ({
        loader: require.resolve("esbuild-loader"),
        options: {
          loader: "tsx",
          format: isServer ? "cjs" : undefined,
          target: isServer ? "node12" : "es2017",
        },
      }),
    },
    scripts: [
      {
        src: "https://myaskai.com/ev-embed-chat-js-min?id=IxBBJkH6SbnXxwP5IBMjEVZX7alEdk",
        id: "IxBBJkH6SbnXxwP5IBMjEVZX7alEdk",
        defer: true,
      },
    ],
    plugins: [
      [
        "@docusaurus/plugin-client-redirects",
        {
          createRedirects(existingPath) {
            if (
              existingPath.includes("/server") &&
              !existingPath.includes("/tags")
            ) {
              // Redirect from /server-modules/team/X to /server/team/X
              return [existingPath.replace("/server", "/server-modules")];
            }
            if (
              existingPath.includes("/web") &&
              !existingPath.includes("/tags")
            ) {
              // Redirect from /front-end/team/X to /web/team/X
              return [existingPath.replace("/web", "/front-end")];
            }
            return undefined; // Return a false value: no redirect created
          },
        },
      ],
      [
        require.resolve("@cmfcmf/docusaurus-search-local"),
        {
          indexBlog: true,
          indexPages: true,
          indexDocSidebarParentCategories: 3,
          lunr: {
            // This controls how quickly the boost given by a common word reaches saturation. Increasing it
            // will slow down the rate of saturation and lower values result in quicker saturation. The
            // default value is 1.2. If the collection of documents being indexed have high occurrences
            // of words that are not covered by a stop word filter, these words can quickly dominate any
            // similarity calculation. In these cases, this value can be reduced to get more balanced results.
            k1: 1.2,
            // By default, we rank pages where the search term appears in the title higher than pages where
            // the search term appears in just the text. This is done by "boosting" title matches with a
            // higher value than content matches. The concrete boosting behavior can be controlled by changing
            // the following settings.
            titleBoost: 10,
            contentBoost: 1,
            tagsBoost: 5,
            parentCategoriesBoost: 2, // Only used when indexDocSidebarParentCategories > 0
          },
        },
      ],
      [
        require.resolve("docusaurus-gtm-plugin"),
        {
          id: GTM_ID,
        },
      ],
      (process.env["COPY_DOCS"] === 'true' ? [require.resolve('api-docs-sync'), {
        manifest: require(require.resolve('api-docs-sync/manifest')).default,
        processedMap: require(require.resolve('api-docs-sync/processedMap')),
      }] : null),
      "./plugins/webpack-options",
    ],
    presets: [
      [
        "@docusaurus/preset-classic",
        {
          // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs
          docs: {
            /**
             * Enabling edit this page functionality and making the last updated timestamp visible.
             */
            editUrl:
              "https://github.com/genesiscommunitysuccess/docs/edit/master/",
            showLastUpdateTime: true,
            /**
             * editCurrentVersion: false allows people to make changes to any version of the docs they find an issue with.
             * Alternatively, we could direct all edits to the current version. However, with our infrequent docs releases,
             * that would leave the default unchanged even after their edit was accepted, which may confuse contributors.
             */
            editCurrentVersion: false,
            breadcrumbs: false,
            routeBasePath,
            sidebarPath: require.resolve("./sidebars.js"),
            remarkPlugins: [(await import("mdx-mermaid")).default],
            lastVersion: "current",
            versions: {
              current: {
                label: "Current",
                banner: "none",
              },
              previous: {
                banner: "none",
                label: "Previous",
              },
            },
          },
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
        },
      ],
    ],
    themes: ["@docusaurus/theme-live-codeblock"],
    themeConfig: {
      webpackOptions: {
        options: {
          // will be merged into the final config using webpack-merge
          optimization: {
            // TODO: remove the temporary hack where we throw the iife bundle into node_modules manually.
            // Will likely need these to avoid minification breaking things.
            // mangleExports: false,
            // minimize: false,
          },
        },
      },
      colorMode: {
        disableSwitch: true,
      },
      navbar: {
        items: [
          { type: "docsVersionDropdown", className: "version-menu " },
          {
            type: "doc",
            docId: "getting-started/introduction",
            label: "Learning",
          },
          {
            type: "doc",
            docId: "database/database-landing",
            label: "Database",
          },
          { type: "doc", docId: "server/server-modules", label: "Server" },
          { type: "doc", docId: "web/front-end", label: "Web" },
          { type: "doc", docId: "operations/operations", label: "Operations" },
          {
            type: "html",
            position: "right",
            value:
              "<a href='' onclick=\"window.open('https://github.com/genesiscommunitysuccess/docs/issues/new?title=New+Feedback+from+learn.genesis.global&body=Thank+you+for+giving+us+your+feedback.%20Please+provide%20it%20below.%0a%0a%23%23%20My%20Issue/Idea/Suggestion%0a%0a%23%23%20Current%20Page%0a%0a'+window.location.href+window.location.hash,'_blank')\" class=\"feedback\" style=\"text-decoration:none\">Give us Feedback</a>",
          },
          {
            href: "https://stackoverflow.com/c/genesis-global/questions",
            className: "so-icon",
            "aria-label": "StackOverflow",
            position: "right",
          },
        ],
        logo: {
          alt: "Genesis Documentation",
          src: "img/logo-icon--light.svg",
          width: 25,
          height: 25,
          href: "/getting-started",
          target: "_self",
        },
        title: "DOCUMENTATION",
      },
      footer: {
        links: [],
        copyright: `© genesis global ${new Date().getFullYear()}. All rights reserved.`,
      },
      prism: {
        additionalLanguages: ["java", "kotlin", "powershell", "groovy"],
      },
    },
    i18n: {
      defaultLocale: "en",
      locales: ["en"],
      localeConfigs: {
        en: {
          htmlLang: "en-GB",
        },
      },
    },
  };
};
