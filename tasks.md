1. Create an mcp server

You are in a docusaurus documentation repo for a software platform. The repo contains a lot of information written in markdown documents. When you run the application, it converts these markdown pages into documentation pages that can be viewed on the website

We also want to expose the documentation by MCP (model context protocol).

# What we need to do

You need to help me setup an MCP server API on this repo. First we need to install the MCP sdk and then init it with a basic tool to test it's working.

We tried some previous implementations using this https://www.npmjs.com/package/@modelcontextprotocol/sdk but we struggled to get the SSE transport working

I found this tool/framework which I think we can use https://www.npmjs.com/package/mcp-framework

There is documentation here that you can can look at https://mcp-framework.com/docs/introduction

What we need to do

a. Update claude.md with some key info - you should always keep claude.md up to date where necesssary, you may use git for checking diffs etc but you don't need to do git add for the user
b. The aim is to make claude code the MCP client
c. Investigate the docs to see how to make an MCP server. This will be in the current repo and run separately to docusouras using a different npm script
d. Run the commands to init a basic server as suggested
e. Tell me what configuration I need to set in ~/.claude.json to get you to connect in to the server

Then we can test

2. Expose all of the routes

We've implemented basic MCP server but it doesn't do anything useful. Let's make a tool which lets the AI look at all of the routes where the markdown files are

In docusaurus it creates a route per markdown file, and we want to return all of the routes

The tool should take one parameter, which is a search term for filtering on the routes, or it takes * to return all of the routes

# What we need to do

a. Implement the tool interface using the parameters I previously said
b. Is there a way of using docusaurus or some other tool to generate the list of all of the routes? IF not, we can use the filesystem to check for the .md and .mdx files
c. Implement the tool using the best way from (b)

3. Expose the markdown documents via each route

Let's create a tool which allows an AI client to input the markdown route received from the route and api docs search tools and look at the markdown

# What we need to do

a. Add a new tool. It should have a required parameter for the md or mdx path to view. It should have optional parameters for getting offsets and line counts so we can look at specific parts of the file
b. Add context saying that it's useful to use the other two tools to search for the filepaths to view
c. Implement the tool to view the file using the input parameters
