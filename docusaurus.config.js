module.exports = {
  title: 'Genesis Platform',
  tagline: 'Code Less, Do More',
  url: 'https://genesis.global/',
  baseUrl: process.env.BASE_URL || '/',
  favicon: 'img/favicon.ico',
  organizationName: 'genesislcap', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  trailingSlash: true,
  scripts: [
    {
        src: "/js/fast-components.iife.min.js",
        async: true,
    },
],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.json')
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
      }
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `© genesis global ${new Date().getFullYear()}. All rights reserved.`,
    },
    prism: {
      additionalLanguages: ['java', 'kotlin', 'powershell'],
    },
  },
  
};
