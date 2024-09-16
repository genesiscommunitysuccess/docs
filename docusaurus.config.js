// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

require("dotenv").config();

const baseUrl = process.env.BASE_URL || "/";
const routeBasePath = "/";
const GTM_ID = process.env.GTM_ID || "GTM-5GTR43J"; // default to uat GTM_ID, prod one should be set on CI (master)

/** @type {import('@docusaurus/types').Config} */
const config = {
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
    mermaid: true,
  },
  onBrokenLinks: "throw", // please do NOT change this to 'warn', fix or remove your broken links instead
  onBrokenMarkdownLinks: "throw", // please do NOT change this to 'warn', fix or remove your broken links instead
  onDuplicateRoutes: "throw",
  clientModules: ["./src/client-modules/genesislcap.js"],
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
      require.resolve("docusaurus-gtm-plugin"),
      {
        id: GTM_ID,
      },
    ],
    process.env["COPY_DOCS"] === "true"
      ? [
          require.resolve("api-docs-sync"),
          {
            manifest: require(require.resolve("api-docs-sync/manifest"))
              .default,
            processedMap: require(require.resolve(
              "api-docs-sync/processedMap"
            )),
          },
        ]
      : null,
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
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
          sidebarPath: "./sidebars.js",
          lastVersion: "current",
          versions: {
            current: {
              label: "Current",
              banner: "none",
            },
            previous: {
              label: "Previous",
              banner: "none",
            }
          },
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],
  themes: [
    "@docusaurus/theme-mermaid",
    "@docusaurus/theme-live-codeblock",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        docsRouteBasePath: routeBasePath,
        useAllContextsWithNoSearchContext: true,
      }),
    ],
  ],
  themeConfig: {
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    colorMode: {
      disableSwitch: true,
      defaultMode: "light",
      respectPrefersColorScheme: false,
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
        { type: "doc", docId: "components/components", label: "Components", when: { routeMatch: "docs" } },
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

export default config;
