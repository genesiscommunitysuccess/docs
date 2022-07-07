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
    [require.resolve('docusaurus-gtm-plugin'),{
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
        blog: {
          path: 'blog',
          editLocalizedFiles: false,
          blogTitle: 'Blog title',
          blogDescription: 'Blog',
          blogSidebarCount: 5,
          blogSidebarTitle: 'All our posts',
          routeBasePath: 'blog',
          include: ['**/*.{md,mdx}'],
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
          ],
          postsPerPage: 10,
          blogListComponent: '@theme/BlogListPage',
          blogPostComponent: '@theme/BlogPostPage',
          blogTagsListComponent: '@theme/BlogTagsListPage',
          blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
          showReadingTime: true,
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
        { to: 'getting-started/learn-the-basics/', label: 'Getting Started' },
        { to: 'become-an-expert/', label: 'Become an Expert' },
        { to: 'tutorials/', label: 'Tutorials' },
        {to: 'blog/', label: 'Blog'}
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
