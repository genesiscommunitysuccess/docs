const baseUrl = process.env.BASE_URL || '/';
const routeBasePath = '/';

module.exports = {
  title: 'Low-code Platform For Financial Markets',
  tagline: 'The Platform with 50+ Modern Building Blocks to Accelerate App Development.',
  url: 'https://genesis.global/',
  baseUrl,
  favicon: 'img/favicon.ico',
  organizationName: 'genesislcap', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  trailingSlash: true,
  scripts: [
    {
      src: `${baseUrl}js/docs.iife.min.js`,
      async: true,
    }
  ],


  plugins: [
    [require.resolve('@cmfcmf/docusaurus-search-local'), {
      indexBlog: true,
      indexPages: true,
    }],
    [require.resolve('docusaurus-gtm-plugin'), {
      id: 'GTM-5GTR43J',
    }
    ]
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
        {to: 'getting-started/learn-the-basics/', label: 'Learning'},
        {to: 'server-modules', label: 'Server Modules'},
        {to: 'front-end', label: 'Front End'},
        {to: 'database', label: 'Database'},
        {to: 'operations', label: 'Operations'},
        {to: 'blog', label: 'Blog'},
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
        href: '/getting-started/learn-the-basics/',
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
