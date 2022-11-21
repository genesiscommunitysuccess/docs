"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[95830],{35180:function(e,n,t){t.r(n),t.d(n,{assets:function(){return u},contentTitle:function(){return m},default:function(){return c},frontMatter:function(){return s},metadata:function(){return l},toc:function(){return d}});var a=t(87462),i=t(63366),r=(t(67294),t(3905)),o=(t(61839),["components"]),s={title:"Micro-front-ends - User Management",sidebar_label:"User Management",Id:"front-end-foundation-user-management",keywords:["web","user management","frontend","ui","micro-front-ends"],tags:["web","user management","frontend","ui","micro-front-ends"]},m=void 0,l={unversionedId:"web/micro-front-ends/foundation-user-management",id:"version-2022.3/web/micro-front-ends/foundation-user-management",title:"Micro-front-ends - User Management",description:"API reference",source:"@site/versioned_docs/version-2022.3/04_web/05_micro-front-ends/05_foundation-user-management.md",sourceDirName:"04_web/05_micro-front-ends",slug:"/web/micro-front-ends/foundation-user-management",permalink:"/web/micro-front-ends/foundation-user-management",draft:!1,tags:[{label:"web",permalink:"/tags/web"},{label:"user management",permalink:"/tags/user-management"},{label:"frontend",permalink:"/tags/frontend"},{label:"ui",permalink:"/tags/ui"},{label:"micro-front-ends",permalink:"/tags/micro-front-ends"}],version:"2022.3",sidebarPosition:5,frontMatter:{title:"Micro-front-ends - User Management",sidebar_label:"User Management",Id:"front-end-foundation-user-management",keywords:["web","user management","frontend","ui","micro-front-ends"],tags:["web","user management","frontend","ui","micro-front-ends"]},sidebar:"frontendSidebar",previous:{title:"Entity Management",permalink:"/web/micro-front-ends/foundation-entity-management"},next:{title:"Profile Management",permalink:"/web/micro-front-ends/foundation-profile-management"}},u={},d=[{value:"API reference",id:"api-reference",level:2},{value:"Introduction",id:"introduction",level:2},{value:"Set-up",id:"set-up",level:2},{value:"Config",id:"config",level:2},{value:"Columns",id:"columns",level:3},{value:"Permissions",id:"permissions",level:3},{value:"Persist column state",id:"persist-column-state",level:3}],p={toc:d};function c(e){var n=e.components,s=(0,i.Z)(e,o);return(0,r.kt)("wrapper",(0,a.Z)({},p,s,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"api-reference"},"API reference"),(0,r.kt)("p",null,"API reference ",(0,r.kt)("a",{parentName:"p",href:"../foundation-entity-management_apiref/"},"can be found here"),"."),(0,r.kt)("h2",{id:"introduction"},"Introduction"),(0,r.kt)("p",null,"The User Management micro front-end is used to manage the users on the front end. Two core components are used to manage the entities:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"the grid"),(0,r.kt)("li",{parentName:"ul"},"the form")),(0,r.kt)("p",null,"The grid contains an entity on each row and data in each column."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"User Management is a concrete use case of the ",(0,r.kt)("a",{parentName:"p",href:"/web/micro-front-ends/foundation-entity-management"},"Entity Management")," micro front-end, which is provided as part of ",(0,r.kt)("inlineCode",{parentName:"p"},"foundation-ui"),".")),(0,r.kt)("p",null,"Here is an example grid view for managing users:\n",(0,r.kt)("img",{alt:"Example user management grid",src:t(78636).Z,width:"1961",height:"357"})),(0,r.kt)("h2",{id:"set-up"},"Set-up"),(0,r.kt)("p",null,"To enable this micro-front-end in your application, follow the steps below:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Add ",(0,r.kt)("inlineCode",{parentName:"li"},"@genesislcap/foundation-entity-management")," as a dependency in your ",(0,r.kt)("em",{parentName:"li"},"package.json")," file. Whenever you change the dependencies of your project, ensure you run the ",(0,r.kt)("inlineCode",{parentName:"li"},"$ npm run bootstrap")," command again. You can find more information in the ",(0,r.kt)("a",{parentName:"li",href:"/web/basics/package-json-basics"},"pacakge.json basics")," page.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'{\n  ...\n  "dependencies": {\n    "@genesislcap/foundation-entity-management": "latest"\n  },\n  ...\n}\n')),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Import and declare the class in the page of the class where you wish to use the user manager. Then add User Management to the template html where required:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"// Import\nimport { Users, } from '@genesislcap/foundation-entity-management';\n\n// Declare class\nUsers;\n\n// Example html with the user management\n// You can customise this with additional fields, see futher in this documentation\nexport const AdminTemplate: ViewTemplate = html`\n  <zero-tabs>\n    <zero-tab-panel slot=\"tabpanel\">\n      <zero-error-boundary>\n        <user-management></user-management>\n      </zero-error-boundary>\n    </zero-tab-panel>\n  </zero-tabs>\n`;\n")),(0,r.kt)("h2",{id:"config"},"Config"),(0,r.kt)("p",null,"You can customise the functionality of User Management through the properties you set in the html. This section covers the main properties that you can customise. For a full list of all of the properties, ",(0,r.kt)("a",{parentName:"p",href:"../foundation-entity-management_apiref/foundation-entity-management.users/#properties"},"see here"),"."),(0,r.kt)("h3",{id:"columns"},"Columns"),(0,r.kt)("p",null,"The primary way to configure the User Management functionality is via the columns that are displayed on the grid."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'// Default usage, will contain the "default" columns:\n//    username, first name, last name, email, last login\n// as well as the additional entity and status columns\n<user-management></user-management>\n')),(0,r.kt)("p",null,"The default columns are contained in the ",(0,r.kt)("a",{parentName:"p",href:"../foundation-entity-management_apiref/foundation-entity-management.userscolumnconfig"},"UserColumnConfig")," variable. The ",(0,r.kt)("inlineCode",{parentName:"p"},"Entity")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"Status")," columns are always added to the grid."),(0,r.kt)("p",null,"To configure the columns yourself, set the ",(0,r.kt)("inlineCode",{parentName:"p"},"columns")," attribute when you define the User Management in the html. You can mix in your custom column config with the default user columns config, using the javascript ",(0,r.kt)("inlineCode",{parentName:"p"},"spread")," operator."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'// Custom usage, will contain the "default" columns:\n//    username, first name, last name, email, last login\n// the custom "userColumns"\n// as well as the additional entity and status columns\n<user-management :columns=${() => [...UsersColumnConfig, ...userColumns]}>\n</user-management>\n')),(0,r.kt)("p",null,"To see a more verbose version of this example, ",(0,r.kt)("a",{parentName:"p",href:"../foundation-entity-management_apiref/foundation-entity-management.users/#example"},"see the second example here"),"."),(0,r.kt)("h3",{id:"permissions"},"Permissions"),(0,r.kt)("p",null,"In contrast to Entity Management, we have a different way of displaying buttons and performing actions here. In this case, they are displayed if the user has the appropriate permissions from the server."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"INSERT_USER")," - the user can add new users"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"DELETE_USER")," - the user can delete users"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"AMEND_USER")," - the user can update existing users")),(0,r.kt)("h3",{id:"persist-column-state"},"Persist column state"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"persist-column-state-key")," is a string value, which is used to control how the column states are persisted through actions such as page changes or refreshes. When using this micro front-end, it is set to ",(0,r.kt)("inlineCode",{parentName:"p"},"entity_profiles_management"),"."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"For more info on ",(0,r.kt)("inlineCode",{parentName:"p"},"persist-column-state-key")," see ",(0,r.kt)("a",{parentName:"p",href:"/web/micro-front-ends/foundation-entity-management#persist-column-state"},"the section in the entity management."))))}c.isMDXComponent=!0},78636:function(e,n,t){n.Z=t.p+"assets/images/foundation-user-management-59debec79e7ed877b9080baf5312004e.png"}}]);