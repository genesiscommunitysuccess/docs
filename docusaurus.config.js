module.exports = {
  title: 'Genesis Platform',
  tagline: 'Code Less, Do More',
  url: 'https://genesis.global/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'genesislcap', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.json')
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

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
      links: [
        {
          title: 'Docs',
          items: [],
        },
        {
          title: 'Community',
          items: [],
        },
        {
          title: 'More',
          items: [],
        },
      ],
      copyright: `© ${new Date().getFullYear()} My Project`,
    }
  },
  
};
