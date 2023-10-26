require('dotenv').config();

const baseUrl = process.env.BASE_URL || '/';
const routeBasePath = '/';
const GTM_ID = process.env.GTM_ID || 'GTM-5GTR43J'; // default to uat GTM_ID, prod one should be set on CI (master)

const DEV_ANALYTICS = 'https://cdn.matomo.cloud/newgenesisglobal.matomo.cloud/container_cyD5hUgS_dev_faea79accbcd255c7f124004.js';
const PROD_ANALYTICS = 'https://cdn.matomo.cloud/newgenesisglobal.matomo.cloud/container_cyD5hUgS.js';
const MATOMO_URL = GTM_ID === 'GTM-5GTR43J' ? DEV_ANALYTICS : PROD_ANALYTICS;
const path = require('path');

module.exports = {
  title: 'Low-code Platform For Financial Markets',
  tagline: 'The Platform with 50+ Modern Building Blocks to Accelerate App Development.',
  url: 'https://genesis.global/',
  baseUrl,
  favicon: 'img/favicon.ico',
  organizationName: 'genesislcap',
  projectName: 'docs',
  trailingSlash: true,
  onBrokenLinks: 'throw', // please do NOT change this to 'warn', fix or remove your broken links instead
  onBrokenMarkdownLinks: 'throw', // please do NOT change this to 'warn', fix or remove your broken links instead
  onDuplicateRoutes: 'throw',
  clientModules: [
    './src/client-modules/genesislcap.js',
  ],
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'tsx',
        format: isServer ? 'cjs' : undefined,
        target: isServer ? 'node12' : 'es2017',
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
    './plugins/customRoutingPlugin',
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects(existingPath) {
          if (existingPath.includes('/server') && !existingPath.includes('/tags')) {
            // Redirect from /server-modules/team/X to /server/team/X
            return [existingPath.replace('/server', '/server-modules')];
          }
          if (existingPath.includes('/web') && !existingPath.includes('/tags')) {
            // Redirect from /front-end/team/X to /web/team/X
            return [existingPath.replace('/web', '/front-end')];
          }
          return undefined; // Return a false value: no redirect created
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'archives',
        path: 'archives',
        routeBasePath: 'archives',
        sidebarPath: require.resolve('./sidebarsArchives.js'),
      },
    ],
    [
      require.resolve('@cmfcmf/docusaurus-search-local'),
      {
        indexBlog: true,
        indexPages: true,
        indexDocSidebarParentCategories: 3,
        lunr: {
          k1: 1.2,
          titleBoost: 10,
          contentBoost: 1,
          tagsBoost: 5,
          parentCategoriesBoost: 2,
        },
      },
    ],
    [require.resolve('docusaurus-gtm-plugin'), {
      id: GTM_ID,
    }],
    'docusaurus-plugin-matomo',
    './plugins/webpack-options',
    './plugins/disable-md-links',
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          editUrl: 'https://github.com/genesiscommunitysuccess/docs/edit/master/',
          showLastUpdateTime: true,
          editCurrentVersion: false,
          breadcrumbs: false,
          routeBasePath,
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [require('mdx-mermaid')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themes: ['@docusaurus/theme-live-codeblock'],
  themeConfig: {
    webpackOptions: {
      options: {
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
        { type: 'doc', docId: 'getting-started/introduction', label: 'Learning'},
        { type: 'doc', docId: 'database/database-landing', label: 'Database' },
        { type: 'doc', docId: 'server/server-modules', label: 'Server' },
        { type: 'doc', docId: 'web/front-end', label: 'Web' },
        { type: 'doc', docId: 'operations/operations', label: 'Operations' },
        {
          type: "html",
          position: "right",
          value: '<a href="https://github.com/genesiscommunitysuccess/docs/issues/new?title=New+Feedback+from+learn.genesis.global&body=Thank+you+for+giving+us+your+feedback.%20Please+provide+it+below.%0a%0a%23%23+My+Issue/Idea/Suggestion%0a%0a" target="_blank" class="feedback" style="text-decoration:none">Give us Feedback</a>',
        },
        {
          href: "https://stackoverflow.com/c/genesis-global/questions",
          className: "so-icon",
          "aria-label": "StackOverflow",
          position: "right",
        },
      ],
      logo: {
        alt: 'Genesis Documentation',
        src: 'img/logo-icon--light.svg',
        width: 25,
        height: 25,
        href: '/getting-started',
        target: '_self',
      },
      title: 'DOCUMENTATION',
    },
    footer: {
      links: [],
      copyright: `© genesis global ${new Date().getFullYear()}. All rights reserved.`,
    },
    prism: {
      additionalLanguages: ['java', 'kotlin', 'powershell', 'groovy'],
    },
    matomo: {
      matomoUrl: MATOMO_URL,
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        htmlLang: 'en-GB',
      },
    },
  },
};
