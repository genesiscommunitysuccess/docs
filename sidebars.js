import sidebarItemsData from './static/data/sidebar-items-data.json';

module.exports = {
  developSidebar: [
    'develop/platform-overview',
    {
      type: 'category',
      label: 'Development environment',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Development environment',
        description: sidebarItemsData['/develop/development-environments'].description,
        slug: '/develop/development-environments',
        keywords: ['Development environment', 'environment'],
      },
      items: [
        {
          type: 'autogenerated',
          dirName: '001_develop/01_development-environment'
        },
      ],
    },
    {
      type: 'category',
      label: 'Server capabilities',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Server capabilities',
        description: sidebarItemsData['/develop/server-capabilities'].description,
        slug: '/develop/server-capabilities',
        keywords: ['server capabilities', 'server', 'capabilities'],
      },
      items: [
        {
          type: 'autogenerated',
          dirName: '001_develop/02_server-capabilities'
        },
      ],
    },
    {
      type: 'category',
      label: 'Client capabilities (Web UI)',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Client capabilities (Web UI)',
        description: sidebarItemsData['/develop/client-capabilities'].description,
        slug: '/develop/client-capabilities',
        keywords: ['client capabilities', 'client', 'capabilities'],
      },
      items: [
        {
          type: 'autogenerated',
          dirName: '001_develop/03_client-capabilities'
        },
      ],
    },
    {
      type: 'category',
      label: 'Business components',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Business components',
        description: sidebarItemsData['/develop/business-components'].description,
        slug: '/develop/business-components',
        keywords: ['business components', 'components'],
      },
      items: [
        {
          type: 'autogenerated',
          dirName: '001_develop/04_business-components'
        },
      ],
    },
    'develop/glossary',
  ],
  howtoSidebar: [
    'how-to/how-to-landing',
    {
      type: 'category',
      label: 'Master the basics',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'how-to/ht-front-end-example'
        },
        {
          type: 'doc',
          id: 'how-to/ht-create-simple-page',
        },
        {
          type: 'doc',
          id: 'how-to/ht-join-expose',
        },
        {
          type: 'doc',
          id: 'how-to/ht-shareable-enums',
        },
        {
          type: 'doc',
          id: 'how-to/ht-kotlin'
        },
      ],
    },
    {
      type: 'category',
      label: 'Enhance your application',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'how-to/ht-auth',
        },
        {
          type: 'doc',
          id: 'how-to/ht-audit',
        },        
        {
          type: 'doc',
          id: 'how-to/ht-ingest-csv'
        },
        {
          type: 'doc',
          id: 'how-to/ht-notify-email',
        },
        {
          type: 'doc',
          id: 'how-to/ht-rest',
        },
        {
          type: 'doc',
          id: 'how-to/ht-jms',
        },
        {
          type: 'doc',
          id: 'how-to/ht-consume-kafka',
        },
        {
          type: 'doc',
          id: 'how-to/ht-consume-bloomberg',
        },
        {
          type: 'doc',
          id: 'how-to/ht-fdc3',
        }
      ],
    },    
    {
      type: 'category',
      label: 'Test your application',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'how-to/ht-prepare-test',
        },
        {
          type: 'doc',
          id: 'how-to/ht-web-unit-test',
        },
        {
          type: 'doc',
          id: 'how-to/ht-web-e2e-test',
        },
      ],
    },
    {
      type: "category",
      label: "Build a full-stack application",
      collapsed: true,
      items: [
        {
          type: "category",
          label: "ALM application",
          collapsed: true,
          items: [
            {
              type: "autogenerated",
              dirName: "002_how-to/40_alm-app",
            },
          ],
        },
        {
          type: "category",
          label: "OTE application",
          collapsed: true,
          items: [
            {
              type: "autogenerated",
              dirName: "002_how-to/50_ote-app",
            },
          ],
        },
      ],
    }
  ],
  buildDeployOperateSidebar: [
    'build-deploy-operate/bdo-overview',
    {
      type: 'category',
      label: 'Build',
      link: {type: 'doc', id: 'build-deploy-operate/build/bdo-build-overview'},
      collapsed: true,
      items: [
        {
          type: 'autogenerated',
          dirName: '003_build-deploy-operate/01_build'
        },
      ],
    },
    {
      type: 'category',
      label: 'Deploy',
      link: {type: 'doc', id: 'build-deploy-operate/deploy/bdo-deploy-overview'},
      collapsed: true,
      items: [
        {
          type: 'autogenerated',
          dirName: '003_build-deploy-operate/02_deploy'
        },
      ],
    },
    {
      type: 'category',
      label: 'Operate',
      link: {type: 'doc', id: 'build-deploy-operate/operate/bdo-operate-overview'},
      collapsed: true,
      items: [
        {
          type: 'autogenerated',
          dirName: '003_build-deploy-operate/03_operate'
        },
      ],
    },
  ],
  releaseNotesSidebar: [
    'release-notes/latest-release',
    {
      type: 'category',
      label: 'Previous releases',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Version 8',
          items: [{ type: 'autogenerated', dirName: '004_release-notes/001_platform/8' }],
        },{
          type: 'category',
          label: 'Version 7',
          items: [{ type: 'autogenerated', dirName: '004_release-notes/001_platform/7' }],
        },
      ],
    }, 
  ],
};