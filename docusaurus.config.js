require('dotenv').config();

const baseUrl = process.env.BASE_URL || '/';
const routeBasePath = '/';
const processedMap = require('./plugins/api-docs/processedMap');
const GTM_ID = process.env.GTM_ID || 'GTM-5GTR43J'; // default to uat GTM_ID, prod one should be set on CI (master)

const DEV_ANALYTICS = 'https://cdn.matomo.cloud/newgenesisglobal.matomo.cloud/container_cyD5hUgS_dev_faea79accbcd255c7f124004.js';
const PROD_ANALYTICS = 'https://cdn.matomo.cloud/newgenesisglobal.matomo.cloud/container_cyD5hUgS.js';
const MATOMO_URL = GTM_ID === 'GTM-5GTR43J' ? DEV_ANALYTICS : PROD_ANALYTICS;

/**
 * For local / debug purposes.
 * If truthy it will include the current version (labeled as Next) in the version selector dropdown.
**/
const SHOW_NEXT = !!process.env.SHOW_NEXT
/**
 * The above controls whether the user can see 'Next' in the dropdown, but this controls whether we actually build
 * the Next version of the docs at all. We do *not* want Next available on the live site, but do everywhere else
**/
const BUILD_NEXT = SHOW_NEXT || process.env.BRANCH === undefined || process.env.BRANCH !== 'master'

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
    './src/client-modules/genesislcap.js'
  ],
  scripts: [
    {
      src: "https://feedback.fish/ff.js?pid=d642786cff63aa",
      defer: true
    }
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
    (process.env["COPY_DOCS"] === 'true' ? ['./plugins/api-docs', {
      manifest: require('./plugins/api-docs/manifest.json'),
      processedMap,
    }] : null),
    'docusaurus-plugin-matomo',
    './plugins/webpack-options'
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
          includeCurrentVersion: BUILD_NEXT,
          versions: {
            '2023.1': {
              'banner': 'none'
            },
            '2022.4': {
              'banner': 'none'
            },
            '2022.3': {
              'banner': 'none'
            },
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }
    ],
  ],
  themes: ['@docusaurus/theme-live-codeblock'],
  themeConfig: {
    webpackOptions: {
      options: { // will be merged into the final config using webpack-merge
        optimization: {
          // TODO: remove the temporary hack where we throw the iife bundle into node_modules manually.
          // Will likely need these to avoid minification breaking things.
          // mangleExports: false,
          // minimize: false,
        },
      }
    },
    colorMode: {
      disableSwitch: true
    },
    navbar: {
      items: [
        { type: 'docsVersionDropdown', className: 'version-menu ' + (BUILD_NEXT && !SHOW_NEXT ? 'version-menu--hide-next' : '') },
        { type: 'doc', docId: 'getting-started/introduction', label: 'Learning' },
        { type: 'doc', docId: 'database/database-landing', label: 'Database' },
        { type: 'doc', docId: 'server/server-modules', label: 'Server' },
        { type: 'doc', docId: 'web/front-end', label: 'Web' },
        { type: 'doc', docId: 'operations/operations', label: 'Operations' },
        {
          type: "html",
          position: "right",
          value: '<a class="feedback" data-feedback-fish>Give us Feedback</a>',
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

