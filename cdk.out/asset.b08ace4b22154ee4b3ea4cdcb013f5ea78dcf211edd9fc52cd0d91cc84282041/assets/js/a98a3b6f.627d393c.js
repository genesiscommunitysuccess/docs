"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[45990],{88341:function(e,n,t){t.r(n),t.d(n,{assets:function(){return u},contentTitle:function(){return d},default:function(){return k},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return m}});var a=t(87462),o=t(63366),i=(t(67294),t(3905)),r=(t(61839),t(74915)),l=t(72451),p=["components"],s={title:"Webpack",sidebar_label:"Webpack",id:"webpack",keywords:["web","webpack"],tags:["web","webpack"]},d=void 0,c={unversionedId:"web/integrations/webpack",id:"web/integrations/webpack",title:"Webpack",description:"Genesis Foundation works great with TypeScript and Webpack, using a fairly standard set-up. Let's take a look at how you can set up such a project, starting from scratch.",source:"@site/docs/04_web/04_integrations/05_webpack.md",sourceDirName:"04_web/04_integrations",slug:"/web/integrations/webpack",permalink:"/next/web/integrations/webpack",draft:!1,tags:[{label:"web",permalink:"/next/tags/web"},{label:"webpack",permalink:"/next/tags/webpack"}],version:"current",sidebarPosition:5,frontMatter:{title:"Webpack",sidebar_label:"Webpack",id:"webpack",keywords:["web","webpack"],tags:["web","webpack"]},sidebar:"frontendSidebar",previous:{title:"Vue",permalink:"/next/web/integrations/vue"},next:{title:"Introduction",permalink:"/next/web/micro-front-ends/introduction"}},u={},m=[{value:"Setting up the package",id:"setting-up-the-package",level:2},{value:"Adding configuration and source",id:"adding-configuration-and-source",level:2},{value:"Using the components",id:"using-the-components",level:2}],h={toc:m};function k(e){var n=e.components,t=(0,o.Z)(e,p);return(0,i.kt)("wrapper",(0,a.Z)({},h,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Genesis Foundation works great with TypeScript and Webpack, using a fairly standard set-up. Let's take a look at how you can set up such a project, starting from scratch."),(0,i.kt)("h2",{id:"setting-up-the-package"},"Setting up the package"),(0,i.kt)("p",null,"First, let's make a directory for our new project. From the terminal:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"mkdir alpha-webpack\n")),(0,i.kt)("p",null,"Next, let's move into that directory, where we'll set up our project:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"cd alpha-webpack\n")),(0,i.kt)("p",null,"From here, we'll initialize npm:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"npm init\n")),(0,i.kt)("p",null,"Follow the prompts from npm, answering each question in turn. You can always accept the defaults at first and then make changes later in the package.json file."),(0,i.kt)("p",null,"Next, we'll install the Genesis Foundation packages, along with supporting libraries. To do that, run this command:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"npm install --save @genesislcap/alpha-design-system lodash-es\n")),(0,i.kt)("p",null,"We also need to install the Webpack build tooling:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"npm install --save-dev clean-webpack-plugin ts-loader typescript webpack webpack-cli webpack-dev-server\n")),(0,i.kt)("h2",{id:"adding-configuration-and-source"},"Adding configuration and source"),(0,i.kt)("p",null,"Now that we've got our basic package and dependencies set up, let's create some source files and get things configured. Since we're going to be writing a bit of code, now is a great time to involve a code editor in the process. If you're looking for a great editor for TypeScript and front end in general, we highly recommend ",(0,i.kt)("a",{parentName:"p",href:"https://code.visualstudio.com/"},"VS Code"),"."),(0,i.kt)("p",null,"Open the ",(0,i.kt)("inlineCode",{parentName:"p"},"alpha-webpack")," folder in your favorite editor. You should see your ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," along with a ",(0,i.kt)("inlineCode",{parentName:"p"},"package-lock.json")," and a ",(0,i.kt)("inlineCode",{parentName:"p"},"node_modules")," folder."),(0,i.kt)("p",null,"First, let's create a ",(0,i.kt)("inlineCode",{parentName:"p"},"src")," folder where we'll put all our TypeScript code. In the ",(0,i.kt)("inlineCode",{parentName:"p"},"src")," folder, add a ",(0,i.kt)("inlineCode",{parentName:"p"},"main.ts")," file. You can leave the file empty for now. We'll come back it in a bit."),(0,i.kt)("p",null,"Next, in the root of your project folder, add a ",(0,i.kt)("inlineCode",{parentName:"p"},"tsconfig.json")," file to configure the TypeScript compiler. Here's an example starter config that you can put into that file:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "compilerOptions": {\n    "pretty": true,\n    "target": "ES2015",\n    "module": "ES2015",\n    "moduleResolution": "node",\n    "importHelpers": true,\n    "experimentalDecorators": true,\n    "declaration": true,\n    "declarationMap": true,\n    "sourceMap": true,\n    "noEmitOnError": true,\n    "strict": true,\n    "outDir": "dist/build",\n    "rootDir": "src",\n    "lib": [\n      "dom",\n      "esnext"\n    ]\n  },\n  "include": [\n    "src"\n  ]\n}\n')),(0,i.kt)("p",null,"You can learn more about ",(0,i.kt)("inlineCode",{parentName:"p"},"tsconfig.json")," options in ",(0,i.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/docs/handbook/tsconfig-json.html"},"the official TypeScript documentation"),"."),(0,i.kt)("p",null,"Next, create a ",(0,i.kt)("inlineCode",{parentName:"p"},"webpack.config.js")," file in the root of your project folder with the following source:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const { CleanWebpackPlugin } = require(\"clean-webpack-plugin\");\n\nmodule.exports = function(env, { mode }) {\n  const production = mode === 'production';\n  return {\n    mode: production ? 'production' : 'development',\n    devtool: production ? 'source-map' : 'inline-source-map',\n    entry: {\n      app: ['./src/main.ts']\n    },\n    output: {\n      filename: 'bundle.js'\n    },\n    resolve: {\n      extensions: ['.ts', '.js'],\n      modules: ['src', 'node_modules']\n    },\n    devServer: {\n      port: 9000,\n      historyApiFallback: true,\n      writeToDisk: true,\n      open: !process.env.CI,\n      lazy: false\n    },\n    plugins: [\n      new CleanWebpackPlugin()\n    ],\n    module: {\n      rules: [\n        {\n          test: /\\.ts$/i,\n          use: [\n            {\n              loader: 'ts-loader'\n            }\n          ],\n          exclude: /node_modules/\n        }\n      ]\n    }\n  }\n}\n")),(0,i.kt)("p",null,"This set-up uses ",(0,i.kt)("inlineCode",{parentName:"p"},"ts-loader")," to process TypeScript. It will also enable both a production mode and a development mode that watches your source, recompiling and refreshing your browser as things change. You can read more about Webpack configuration in ",(0,i.kt)("a",{parentName:"p",href:"https://webpack.js.org/"},"the official Webpack documentation"),"."),(0,i.kt)("p",null,"To enable easy execution of both our production and development builds, let's add some script commands to our ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," file. Find the ",(0,i.kt)("inlineCode",{parentName:"p"},"scripts")," section of your ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," file and add the following two scripts:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'"scripts": {\n  "build": "webpack --mode=production",\n  "dev": "webpack serve"\n}\n')),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"build")," script will build your TypeScript for production deployment.  The ",(0,i.kt)("inlineCode",{parentName:"p"},"dev")," script will run the development web server so you can write code and see the results in your browser. You can run these scripts with ",(0,i.kt)("inlineCode",{parentName:"p"},"npm run build")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"npm run dev")," respectively."),(0,i.kt)("p",null,"To complete our set-up, we need to add an ",(0,i.kt)("inlineCode",{parentName:"p"},"index.html")," file to the root of our project. We'll start with some basic content as follows:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>Genesis Foundation Webpack</title>\n  </head>\n  <body>\n    <script src="dist/bundle.js"><\/script>\n  </body>\n</html>\n')),(0,i.kt)("p",null,"There's nothing special about the HTML yet, other than the ",(0,i.kt)("inlineCode",{parentName:"p"},"script")," tag in the ",(0,i.kt)("inlineCode",{parentName:"p"},"body")," that references the ",(0,i.kt)("inlineCode",{parentName:"p"},"bundle.js")," file that our Webpack build will produce."),(0,i.kt)("h2",{id:"using-the-components"},"Using the components"),(0,i.kt)("p",null,"With all the basic pieces in place, let's run our app in dev mode with ",(0,i.kt)("inlineCode",{parentName:"p"},"npm run dev"),". Webpack should build your project and open your default browser with your ",(0,i.kt)("inlineCode",{parentName:"p"},"index.html")," page. Right now, it should be blank, since we haven't added any code or interesting HTML. Let's change that."),(0,i.kt)("p",null,"First, open your ",(0,i.kt)("inlineCode",{parentName:"p"},"src/main.ts")," file and add the following code:"),(0,i.kt)(r.Z,{className:"language-ts",mdxType:"CodeBlock"},l.Z),(0,i.kt)("p",null,"This code uses the Genesis Foundation Design System to register the ",(0,i.kt)("inlineCode",{parentName:"p"},"<alpha-card>")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"<alpha-button>")," components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace the contents of the ",(0,i.kt)("inlineCode",{parentName:"p"},"<body>")," in your ",(0,i.kt)("inlineCode",{parentName:"p"},"index.html")," file with the following markup:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<body>\n  <alpha-card>\n    <h2>Hello World!</h2>\n    <alpha-button appearance="accent">Click Me</alpha-button>\n  </alpha-card>\n  <style>\n    :not(:defined) {\n      visibility: hidden;\n    }\n\n    alpha-card {\n      padding: 16px;\n      display: flex;\n      flex-direction: column;\n    }\n\n    h2 {\n      font-size: var(--type-ramp-plus-5-font-size);\n      line-height: var(--type-ramp-plus-5-line-height);\n    }\n\n    alpha-card > alpha-button{\n      align-self: flex-end;\n    }\n  </style>\n  <script src="dist/bundle.js"><\/script>\n</body>\n')),(0,i.kt)("p",null,"After saving your ",(0,i.kt)("inlineCode",{parentName:"p"},"index.html")," file, refresh your browser and you should see a card with text and a button."),(0,i.kt)("p",null,"Congratulations! You're now set up to use Genesis Foundation, TypeScript, and Webpack. You can import and use more components, build your own components, and when you are ready, build and deploy your website or app to production."))}k.isMDXComponent=!0},72451:function(e,n){n.Z="import { \n  provideDesignSystem, \n  alphaCard, \n  alphaButton,\n  alphaTextField\n} from '@genesislcap/alpha-design-system';\n\nprovideDesignSystem()\n    .register(\n        alphaCard(),\n        alphaButton(),\n        alphaTextField()\n    );"}}]);