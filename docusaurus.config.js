const baseUrl = process.env.BASE_URL || '/';
const routeBasePath = '/';

module.exports = {
  title: 'Low-Code / No-Code For Financial Markets',
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
      indexPages: true
    }]
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs
        docs: {
          routeBasePath,
          sidebarPath: require.resolve('./sidebars.json'),
          remarkPlugins: [require('mdx-mermaid')],
          lastVersion: "current",
          versions: {
            current: {
              label: "5.x.x",
              path: ""
            }
          }
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
      logo: {
        alt: 'Genesis Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'right',
          // dropdownItemsAfter: [{to: '/versions', label: 'All versions'}],
          dropdownActiveClassDisabled: true,
          },
        {to: 'https://genesis.global/contact-us/', label: 'Register for a Demo', position: 'right', className: 'demo'}
      ]
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `© genesis global ${new Date().getFullYear()}. All rights reserved.`,
    },
    prism: {
      additionalLanguages: ['java', 'kotlin', 'powershell', 'groovy'],
    },
  },
  
};
