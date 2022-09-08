const baseUrl = process.env.BASE_URL || '/';
const routeBasePath = '/';

const apiPullPlugin = require('./pull-api-docs');

const GTM_ID =  process.env.GTM_ID || 'GTM-5GTR43J'; // default to uat GTM_ID, prod one should be set on CI (master) 

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
  scripts: [
    {
      src: `${baseUrl}js/docs.iife.min.js`,
      async: true,
    }
  ],


  plugins: [
    [
      "docusaurus2-dotenv",
      {
        path: "./.env",
        systemvars: true,
      },
    ],
    [require.resolve('docusaurus-gtm-plugin'), {
      id: GTM_ID,
    }],
    // Declares a local plugin, plugins array takes a set of functions to execute to 
    // load in the plugin. Anonymous function used here to simulate the same thing, and
    // return an object that declares a function to execute as part of the `loadContent`
    // step in the docusaurus lifecycle
    () => ({
      loadContent: apiPullPlugin.loadContent(),
    })
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
        {to: 'getting-started', label: 'Learning'},
        {to: 'database', label: 'Database'},
        {to: 'server-modules', label: 'Server'},
        {to: 'front-end', label: 'Web'},
        {to: 'operations', label: 'Operations'},
        {type: 'docsVersionDropdown', position: 'right', className: "version-menu"},
        {
          href: "https://stackoverflow.com/",
          className: "so-icon",
          "aria-label": "StackOverflow",
          position: "right"
        }
      ],
      logo: {
        alt: 'Genesis Logo',
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

