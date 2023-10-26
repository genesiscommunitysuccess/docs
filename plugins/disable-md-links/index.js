module.exports = function(context, options) {
    return {
      name: 'disable-md-links',
      async contentLoaded({ content, actions }) {
        const { createData, failBuild } = actions;
  
        // Check for .md links in the content
        if (content.match(/\[.*\]\(([^)]*\.md)\)/)) {
          console.error('Error: Markdown links are not allowed.');
          failBuild('Markdown links are not allowed.');
        }
      },
    };
  };
  