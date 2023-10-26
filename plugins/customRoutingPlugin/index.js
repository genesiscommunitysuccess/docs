module.exports = async function customRoutingPlugin(context, options) {
    return {
      name: 'custom-routing-plugin',
      async configureRoutes(routes) {
        routes.forEach((route) => {
          if (route.path.startsWith('/archives/')) {
            // If the route is in the 'archives' section, set the docId to 'archives'
            route.routes[0].doc = 'archives';
          } else if (route.path.startsWith('/docs/')) {
            // If the route is in the 'docs' section, set the docId to 'docs'
            route.routes[0].doc = 'docs';
          }
        });
      },
    };
  };