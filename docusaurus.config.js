require('dotenv').config();

const baseUrl = process.env.BASE_URL || '/';
const routeBasePath = '/';
const apiPullPlugin = require('./pull-api-docs');
const processedMap = require('./plugins/api-docs/processedMap');
const GTM_ID = process.env.GTM_ID || 'GTM-5GTR43J'; // default to uat GTM_ID, prod one should be set on CI (master)

module.exports = {
  title: 'Low-code Platform For Financial Markets',
  tagline: 'The Platform with 50+ Modern Building Blocks to Accelerate App Development.',
  url: 'https://genesis.global/',
  baseUrl,
  favicon: 'img/favicon.ico',
  organizationName: 'genesislcap', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  trailingSlash: true,
  onBrokenLinks: 'throw', // please do NOT change this to 'warn', fix or remove your broken links instead
  onDuplicateRoutes: 'throw',
  clientModules: [
    './src/client-modules/genesislcap.js'
  ],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects(existingPath) {
          if (existingPath.includes('/server') && !existingPath.includes('/tags')) {
            // Redirect from /server-modules/team/X to /server/team/X
            return [
              existingPath.replace('/server', '/server-modules'),
            ];
          }
          if (existingPath.includes('/web') && !existingPath.includes('/tags')) {
            // Redirect from /front-end/team/X to /web/team/X
            return [
              existingPath.replace('/web', '/front-end'),
            ];
          }
          return undefined; // Return a false value: no redirect created
        },
      },
    ],
    [require.resolve('@cmfcmf/docusaurus-search-local'), {
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
      }
    }],
    [require.resolve('docusaurus-gtm-plugin'), {
      id: GTM_ID,
    }],
    // TODO: Perhaps we move these to the api-docs manifest setup
    // Declares a local plugin, plugins array takes a set of functions to execute to
    // load in the plugin. Anonymous function used here to simulate the same thing, and
    // return an object that declares a function to execute as part of the `loadContent`
    // step in the docusaurus lifecycle
    () => ({
      loadContent: apiPullPlugin.loadContent(),
    }),
    ['./plugins/api-docs', {
      manifest: require('./plugins/api-docs/manifest.json'),
      processedMap,
    }],
    'docusaurus-plugin-matomo'
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs
        docs: {
          breadcrumbs: false,
          routeBasePath,
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [require('mdx-mermaid')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }
    ],
  ],
  themes: ['@docusaurus/theme-live-codeblock'],
  themeConfig: {
    colorMode: {
      disableSwitch: true
    },
    navbar: {
      items: [

        //keep this commented out until we have multiple versions
        // {type: 'docsVersionDropdown', className: "version-menu"},

        {to: 'getting-started', label: 'Learning'},
        {to: 'database', label: 'Database'},
        {to: 'server', label: 'Server'},
        {to: 'web', label: 'Web'},
        {to: 'operations', label: 'Operations'},
        {to: 'fuse', label: 'Early access'},
        {
          href: "/resource/stackoverflow-onboarding",
          className: "so-icon",
          "aria-label": "StackOverflow",
          position: "right"
        }
      ],
      logo: {
        alt: 'Genesis Documentation',
        src: 'img/logo-icon--light.svg',
        width: 25,
        height: 25,
        href: '/getting-started',
        target: '_self'
      },
      title: 'DOCUMENTATION'
    },
    footer: {
      links: [],
      copyright: `© genesis global ${new Date().getFullYear()}. All rights reserved.`,
    },
    prism: {
      additionalLanguages: ['java', 'kotlin', 'powershell', 'groovy'],
    },
    matomo: {
      matomoUrl: 'https://newgenesisglobal.matomo.cloud/',
      siteId: '2',
      phpLoader: 'matomo.php',
      jsLoader: 'matomo.js',
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

