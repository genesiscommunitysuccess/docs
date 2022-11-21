"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[88218],{4785:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return s},default:function(){return h},frontMatter:function(){return l},metadata:function(){return d},toc:function(){return c}});var a=n(87462),o=n(63366),i=(n(67294),n(3905)),r=(n(61839),["components"]),l={title:"Micro-front-ends - Foundation Header",sidebar_label:"Foundation header",Id:"front-end-foundation-header",keywords:["web","frontend","ui","micro-front-ends","header","sidebar"],tags:["web","frontend","ui","micro-front-ends","header","sidebar"]},s="Foundation Header",d={unversionedId:"web/micro-front-ends/foundation-header",id:"web/micro-front-ends/foundation-header",title:"Micro-front-ends - Foundation Header",description:"API Reference",source:"@site/docs/04_web/05_micro-front-ends/03_foundation-header.md",sourceDirName:"04_web/05_micro-front-ends",slug:"/web/micro-front-ends/foundation-header",permalink:"/next/web/micro-front-ends/foundation-header",draft:!1,tags:[{label:"web",permalink:"/next/tags/web"},{label:"frontend",permalink:"/next/tags/frontend"},{label:"ui",permalink:"/next/tags/ui"},{label:"micro-front-ends",permalink:"/next/tags/micro-front-ends"},{label:"header",permalink:"/next/tags/header"},{label:"sidebar",permalink:"/next/tags/sidebar"}],version:"current",sidebarPosition:3,frontMatter:{title:"Micro-front-ends - Foundation Header",sidebar_label:"Foundation header",Id:"front-end-foundation-header",keywords:["web","frontend","ui","micro-front-ends","header","sidebar"],tags:["web","frontend","ui","micro-front-ends","header","sidebar"]},sidebar:"frontendSidebar",previous:{title:"Front-end reporting",permalink:"/next/web/micro-front-ends/front-end-reporting"},next:{title:"Entity Management",permalink:"/next/web/micro-front-ends/foundation-entity-management"}},u={},c=[{value:"API Reference",id:"api-reference",level:2},{value:"Introduction",id:"introduction",level:2},{value:"Header set-up",id:"header-set-up",level:2},{value:"Seed apps",id:"seed-apps",level:3},{value:"Manual set-up",id:"manual-set-up",level:3},{value:"Customising the header",id:"customising-the-header",level:2},{value:"Icon",id:"icon",level:3},{value:"Navigation items",id:"navigation-items",level:3},{value:"Control buttons",id:"control-buttons",level:3},{value:"Menu contents",id:"menu-contents",level:3}],p={toc:c};function h(e){var t=e.components,l=(0,o.Z)(e,r);return(0,i.kt)("wrapper",(0,a.Z)({},p,l,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"foundation-header"},"Foundation Header"),(0,i.kt)("h2",{id:"api-reference"},"API Reference"),(0,i.kt)("p",null,"The API reference ",(0,i.kt)("a",{parentName:"p",href:"../foundation-header_apiref/"},"can be found here"),"."),(0,i.kt)("h2",{id:"introduction"},"Introduction"),(0,i.kt)("p",null,"The Header micro front-end is a semi-batteries-included component. It consists of a navigation bar and flyout menu, with routing and account logout capabilities."),(0,i.kt)("p",null,"You can customise:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"the icon shown on the navigation bar and flyout menu (this shows the Genesis logo by default)"),(0,i.kt)("li",{parentName:"ul"},"navigation links at the left-hand side of the navigation bar"),(0,i.kt)("li",{parentName:"ul"},"the control buttons on the right-hand side of the navigation bar; these can be shown or hidden, and their behaviour controlled via event listeners"),(0,i.kt)("li",{parentName:"ul"},"The contents of the flyout menu")),(0,i.kt)("p",null,"Here is an example of the navigation bar with three navigation items, and all three control buttons shown.\n",(0,i.kt)("img",{alt:"Header with the standard genesis logo",src:n(44664).Z,width:"1952",height:"74"})),(0,i.kt)("p",null,"This next example is the same as the previous example, except the Genesis logo is replaced with a custom icon.\n",(0,i.kt)("img",{alt:"Header with a customised logo",src:n(52617).Z,width:"1955",height:"79"})),(0,i.kt)("p",null,"In this next example, we have put a set of example options set in the flyout menu.\n",(0,i.kt)("img",{alt:"The sidebar included with the header opened with some example content",src:n(56787).Z,width:"1946",height:"1276"})),(0,i.kt)("h2",{id:"header-set-up"},"Header set-up"),(0,i.kt)("h3",{id:"seed-apps"},"Seed apps"),(0,i.kt)("p",null,"A lot of the Genesis seed apps come with the Header set up by default. To verify, you can do a text search in the client code for the ",(0,i.kt)("inlineCode",{parentName:"p"},"<foundation-header>")," tag.\nIn this case, you only need to do the customisations described in ",(0,i.kt)("a",{parentName:"p",href:"#customising-the-header"},"customising the header"),"."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"The ",(0,i.kt)("inlineCode",{parentName:"p"},"allRoutes")," array, which you need to change to set the navigation buttons on the Header, is found in ",(0,i.kt)("strong",{parentName:"p"},"client/web/src/routes/config.ts"),".")),(0,i.kt)("h3",{id:"manual-set-up"},"Manual set-up"),(0,i.kt)("p",null,"To enable this micro front-end in your application, follow the steps below."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Add ",(0,i.kt)("inlineCode",{parentName:"li"},"@genesislcap/foundation-header")," as a dependency in your ",(0,i.kt)("strong",{parentName:"li"},"package.json")," file. Whenever you change the dependencies of your project, ensure you run the bootstrap command again. There is more information in the ",(0,i.kt)("a",{parentName:"li",href:"/next/web/basics/package-json-basics"},"pacakge.json basics")," page.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},'{\n  ...\n  "dependencies": {\n    "@genesislcap/foundation-header": "latest"\n  },\n  ...\n}\n')),(0,i.kt)("admonition",{type:"note"},(0,i.kt)("p",{parentName:"admonition"},"This page assumes you're already using the Login and Routing systems that are part of ",(0,i.kt)("inlineCode",{parentName:"p"},"foundation-ui")," for the logout and routing functionality."),(0,i.kt)("p",{parentName:"admonition"},"It is possible for you to set up routing manually, but that won't be covered in this tutorial.")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"In the top level class of your application, import and dependency inject the Navigation class.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript",metastring:"{1,6}","{1,6}":!0},"import { Navigation } from '@genesislcap/foundation-header';\n\n@customElement({ name, template, styles })\nexport class MainApplication extends FASTElement {\n  @inject(MainRouterConfig) config!: MainRouterConfig;\n  @inject(Navigation) navigation!: Navigation;\n\n    ...\n\n}\n")),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"If you haven't used the ",(0,i.kt)("inlineCode",{parentName:"p"},"inject")," annotation in your application yet, you'll need to get it from the ",(0,i.kt)("inlineCode",{parentName:"p"},"@microsoft/fast-foundation")," package.")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Set a reference to the ",(0,i.kt)("inlineCode",{parentName:"li"},"navigation")," object on the FAST router when you instantiate it; this will enable you to set up navigation functionality from the navigation bar in the ",(0,i.kt)("a",{parentName:"li",href:"#navigation-items"},"navigation items step"),".")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"// fast-router will likely have other attributes such as :config too\nconst MainTemplate: ViewTemplate<MainApplication> = html`\n  <fast-router :navigation=${(x) => x.navigation}></fast-router>\n`;\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Add the ",(0,i.kt)("inlineCode",{parentName:"li"},"foundation-header")," tag as part of the html that you set as the markup for the ",(0,i.kt)("inlineCode",{parentName:"li"},"defaultLayout")," in your router configuration.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript",metastring:"{3}","{3}":!0},"export const defaultLayout = new FASTElementLayout(html`\n<div class=\"container\">\n    \x3c!-- show-luminance-toggle-button boolean attribute added to show that button on the navigation bar --\x3e\n    <foundation-header show-luminance-toggle-button></foundation-header>\n    \x3c!-- Other markup --\x3e\n</div>`);\n\nexport class MainRouterConfig extends RouterConfiguration<LoginSettings> {\n\n    ...\n\n    public configure() {\n        this.title = 'Example app';\n        this.defaultLayout = defaultLayout;\n        ...\n    }\n}\n")),(0,i.kt)("h2",{id:"customising-the-header"},"Customising the header"),(0,i.kt)("h3",{id:"icon"},"Icon"),(0,i.kt)("p",null,"By default, the navigation bar and flyout menu show the Genesis logo. You can override this by setting the ",(0,i.kt)("inlineCode",{parentName:"p"},"logoSrc")," attribute. For example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<foundation-header logoSrc="https://icotar.com/avatar/genesis"></foundation-header>\n')),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"logoSrc")," defines the image that you want to display. Adding this attribute will update the logo on both the flyout and navigation bar. Omit the attribute to leave the Genesis logo."),(0,i.kt)("h3",{id:"navigation-items"},"Navigation items"),(0,i.kt)("p",null,"You can add navigation items can be added to the left-hand side of the navigation bar. For each element, you can set ",(0,i.kt)("inlineCode",{parentName:"p"},'slot="routes"')," attribute, so that navigation is controlled via a ",(0,i.kt)("inlineCode",{parentName:"p"},"@click")," event. The following is a really basic example for adding a 'Home' button:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},'html`\n<foundation-header\n    <zero-button\n        slot="routes"\n        value="1"\n        @click=${(x, c) => c.parent.navigation.navigateTo("home")}\n    >Home</zero-button>\n></foundation-header>`;\n')),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"navigation")," object referenced via the ",(0,i.kt)("inlineCode",{parentName:"p"},"parent")," object is why the ",(0,i.kt)("inlineCode",{parentName:"p"},"navigation")," object is added as an attribute to the ",(0,i.kt)("inlineCode",{parentName:"p"},"fast-router")," in the ",(0,i.kt)("a",{parentName:"p",href:"#header-set-up"},"setup step"),". From it, the ",(0,i.kt)("inlineCode",{parentName:"p"},"navigateTo")," method can be called, which allows the user to navigate around the finished application from the navigation buttons."),(0,i.kt)("p",null,"Moving on from this basic example, a dynamic set of routes can be configured, using the ",(0,i.kt)("inlineCode",{parentName:"p"},"repeat")," directive from FAST."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Add the routes configuration into an array in the router configuration class.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"export class MainRouterConfig extends RouterConfiguration<LoginSettings> {\n\n    // New configuration added to existing MainRouterConfig class\n    public allRoutes = [\n        { index: 1, path: 'protected', title: 'Home', icon: 'home', variant: 'solid' },\n        { index: 2, path: 'admin', title: 'Admin', icon: 'cog', variant: 'solid' },\n        { index: 3, path: 'reporting', title: 'Reporting', variant: 'solid' },\n    ];\n\n    ...\n}\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"When setting the navigation items, use the ",(0,i.kt)("inlineCode",{parentName:"li"},"repeat")," directive to iterate over the defined routes and create a navigation item for each.")),(0,i.kt)("p",null,"The following example creates a button with an associated logo for each of the three defined routes:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},'html`\n<foundation-header\n    ${repeat(\n        (x) => x.config.allRoutes,\n        html`\n            <zero-button\n                appearance="neutral-grey"\n                slot="routes"\n                value="${(x) => x.index}"\n                @click=${(x, c) => c.parent.navigation.navigateTo(x.path)}\n            >\n                <zero-icon variant="${(x) => x.variant}" name="${(x) => x.icon}"></zero-icon>\n                ${(x) => x.title}\n            </zero-button>\n        `\n    )}\n></foundation-header>`;\n')),(0,i.kt)("h3",{id:"control-buttons"},"Control buttons"),(0,i.kt)("p",null,"There are three control buttons that can be shown or hidden on the right-hand side of the navigation bar (these are hidden by default). Each one of them is a boolean attribute that can be added where the ",(0,i.kt)("inlineCode",{parentName:"p"},"<foundation-header>")," tag is defined. Each one dispatches an associated event when clicked."),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Logo"),(0,i.kt)("th",{parentName:"tr",align:null},"Toggle Attribute"),(0,i.kt)("th",{parentName:"tr",align:null},"Dispatched Event"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"Moon"),(0,i.kt)("td",{parentName:"tr",align:null},"show-luminance-toggle-button"),(0,i.kt)("td",{parentName:"tr",align:null},"luminance-icon-clicked")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"Misc"),(0,i.kt)("td",{parentName:"tr",align:null},"show-misc-toggle-button"),(0,i.kt)("td",{parentName:"tr",align:null},"misc-icon-clicked")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"Notifications"),(0,i.kt)("td",{parentName:"tr",align:null},"show-notification-button"),(0,i.kt)("td",{parentName:"tr",align:null},"notification-icon-clicked")))),(0,i.kt)("p",null,"Implementing the functionality of the buttons is up to the client. For example:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Define the functionality of the event callback in the class of a class which is a parent to the router.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"export class MainApplication extends FASTElement {\n\n    onMiscButtonPressed() {\n        // ... do something\n    }\n    ...\n}\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Set the event listener in the parent html to call the defined functionality.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"// fast-router will likely have other attributes such as :config too\nconst MainTemplate: ViewTemplate<MainApplication> = html`\n  <fast-router\n        :navigation=${(x) => x.navigation}\n        @misc-icon-clicked=${(x) => x.onMiscButtonPressed()}\n    >\n    </fast-router>\n`;\n")),(0,i.kt)("h3",{id:"menu-contents"},"Menu contents"),(0,i.kt)("p",null,"To set the content of the flyout menu, add the content in the html within an element that has the ",(0,i.kt)("inlineCode",{parentName:"p"},'slot="menu-contents"')," attribute."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<foundation-header>\n    <div slot="menu-contents">\n        \x3c!-- Example markup --\x3e\n        <p>GROUP SLOT</p>\n        <zero-tree-view>\n            <zero-tree-item>\n                <zero-icon variant="solid" name="location-arrow"></zero-icon>\n                Slot Tree Item\n            </zero-tree-item>\n            <zero-tree-item>\n                <zero-icon variant="solid" name="location-arrow"></zero-icon>\n                Slot Tree Item\n            </zero-tree-item>\n        </zero-tree-view>\n        <p>GROUP SLOT 2</p>\n        <zero-tree-view>\n            <zero-tree-item>\n                <zero-icon variant="solid" name="location-arrow"></zero-icon>\n                Slot Tree Item 2\n            </zero-tree-item>\n            <zero-tree-item>\n                <zero-icon variant="solid" name="location-arrow"></zero-icon>\n                Slot Tree Item 2\n            </zero-tree-item>\n        </zero-tree-view>\n    </div>\n</foundation-header>\n')))}h.isMDXComponent=!0},52617:function(e,t,n){t.Z=n.p+"assets/images/foundation-header-replaced-img-b80db7255c333a87c0e51847fcd0d940.png"},56787:function(e,t,n){t.Z=n.p+"assets/images/foundation-header-sidebar-4b144ff4858473628ede11161efae17c.png"},44664:function(e,t,n){t.Z=n.p+"assets/images/foundation-header-standard-3babcfc8fd5ebfa174bf3b8b40bde838.png"}}]);