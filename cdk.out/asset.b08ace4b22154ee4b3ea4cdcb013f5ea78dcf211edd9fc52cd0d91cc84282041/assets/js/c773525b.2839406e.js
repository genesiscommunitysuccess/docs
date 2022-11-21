"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[79808],{56418:function(e,n,r){r.r(n),r.d(n,{assets:function(){return p},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return l},metadata:function(){return d},toc:function(){return c}});var t=r(87462),o=r(63366),a=(r(67294),r(3905)),i=(r(61839),["components"]),l={id:"grid-pro-renderers",title:"Grid Pro - Renderers",keywords:["web","web components","grid","grid pro","renderers"],tags:["web","web components","grid","grid pro","renderers"]},s=void 0,d={unversionedId:"web/web-components/grids/grid-pro/grid-pro-renderers",id:"version-2022.3/web/web-components/grids/grid-pro/grid-pro-renderers",title:"Grid Pro - Renderers",description:"When dealing with data, you usually have to render the data in a way that is meaningful to the user. This is the purpose of the grid-pro-renderers. The rendering can vary from one column to another, from boolean typed columns that need to be rendered as a checkbox to a column that needs to be rendered as a percentage.",source:"@site/versioned_docs/version-2022.3/04_web/02_web-components/02_grids/01_grid-pro/6-grid-pro-renderers.md",sourceDirName:"04_web/02_web-components/02_grids/01_grid-pro",slug:"/web/web-components/grids/grid-pro/grid-pro-renderers",permalink:"/web/web-components/grids/grid-pro/grid-pro-renderers",draft:!1,tags:[{label:"web",permalink:"/tags/web"},{label:"web components",permalink:"/tags/web-components"},{label:"grid",permalink:"/tags/grid"},{label:"grid pro",permalink:"/tags/grid-pro"},{label:"renderers",permalink:"/tags/renderers"}],version:"2022.3",sidebarPosition:6,frontMatter:{id:"grid-pro-renderers",title:"Grid Pro - Renderers",keywords:["web","web components","grid","grid pro","renderers"],tags:["web","web components","grid","grid pro","renderers"]},sidebar:"frontendSidebar",previous:{title:"Grid Pro - Cell",permalink:"/web/web-components/grids/grid-pro/grid-pro-genesis-cell"},next:{title:"Data grid",permalink:"/web/web-components/grids/data-grid"}},p={},c=[{value:"Built-in examples",id:"built-in-examples",level:2}],u={toc:c};function m(e){var n=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,t.Z)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"When dealing with data, you usually have to render the data in a way that is meaningful to the user. This is the purpose of the ",(0,a.kt)("inlineCode",{parentName:"p"},"grid-pro-renderers"),". The rendering can vary from one column to another, from boolean typed columns that need to be rendered as a ",(0,a.kt)("inlineCode",{parentName:"p"},"checkbox")," to a column that needs to be rendered as a percentage."),(0,a.kt)("p",null,"We currently support the following scenarios:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"no renderer")),": when no renderer is specified in a Column Definition, the column will be rendered as a string (raw value). ",(0,a.kt)("br",null),(0,a.kt)("br",null),"\n",(0,a.kt)("em",{parentName:"p"},"This may be affected if the ",(0,a.kt)("inlineCode",{parentName:"em"},"auto-cell-renderer-by-type")," prop in the target Grid Pro is set to ",(0,a.kt)("inlineCode",{parentName:"em"},"true")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"built-in renderer")),": we currently have two cell renderers that are ready to use (",(0,a.kt)("strong",{parentName:"p"},"Actions Menu")," and ",(0,a.kt)("strong",{parentName:"p"},"Boolean"),"). You can use them by specifying the ",(0,a.kt)("inlineCode",{parentName:"p"},"cellRenderer")," property and referencing them directly, or, in the ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")," (more to be added) case, it can be configured automatically if the target Grid Pro is correctly configured. ",(0,a.kt)("br",null),(0,a.kt)("br",null),"\n",(0,a.kt)("em",{parentName:"p"},"This may be affected if the ",(0,a.kt)("inlineCode",{parentName:"em"},"auto-cell-renderer-by-type")," prop in the target Grid Pro is set to ",(0,a.kt)("inlineCode",{parentName:"em"},"false")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"custom renderer")),": can be either a function or a full custom component. See the ",(0,a.kt)("a",{parentName:"p",href:"/web/web-components/grids/grid-pro/grid-pro-genesis-cell/"},"Genesis Grid Pro Cell")," section for more info and examples."))),(0,a.kt)("h2",{id:"built-in-examples"},"Built-in examples"),(0,a.kt)("p",null,"We currently support the following built-in cell renderers:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"boolean")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"actionsMenu"))),(0,a.kt)("hr",null),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"boolean"))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title=" Cell Renderer can be specified in a ColDef"',title:'"',Cell:!0,Renderer:!0,can:!0,be:!0,specified:!0,in:!0,a:!0,'ColDef"':!0},"const myBooleanColDef: ColDef = {\n  headerName: 'Is Active',\n  field: 'IS_ACTIVE',\n  cellRenderer: GridProRendererTypes.boolean,\n};\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html",metastring:'title="Using the ColDef with a boolean cell renderer"',title:'"Using',the:!0,ColDef:!0,with:!0,a:!0,boolean:!0,cell:!0,'renderer"':!0},"<foundation-grid-pro>\n  ...\n  <grid-pro-column :definition=${x => x.myBooleanColDef}></grid-pro-column>\n  ...\n</foundation-grid-pro>\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html",metastring:"title=\"Enabling the 'auto cell renderer by type' feature, will automatically render boolean cell values as a checkbox\"",title:'"Enabling',the:!0,"'auto":!0,cell:!0,renderer:!0,by:!0,"type'":!0,"feature,":!0,will:!0,automatically:!0,render:!0,boolean:!0,values:!0,as:!0,a:!0,'checkbox"':!0},"<foundation-grid-pro auto-cell-renderer-by-type>\n  ...\n</foundation-grid-pro>\n")),(0,a.kt)("hr",null),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"actionsMenu"))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="GridProActionMenuItem config array used to generate the Actions Menu ColDef"',title:'"GridProActionMenuItem',config:!0,array:!0,used:!0,to:!0,generate:!0,the:!0,Actions:!0,Menu:!0,'ColDef"':!0},"import { getActionsMenuDef } from '@genesislcap/grid-pro';\n\nconst myActionsMenuColDef = getActionsMenuDef(\n  [\n    {\n      name: 'View',\n      callback: rowData => logger.debug('VIEWW!!!', rowData),\n    },\n    {\n      name: 'Delete',\n      callback: rowData => logger.debug('DELETE!!!', rowData),\n    },\n  ],\n  {\n    headerName: 'Test Actions',\n    width: 140,\n  },\n  '+',\n);\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html",metastring:'title="Using the ColDef with an actions menu cell renderer"',title:'"Using',the:!0,ColDef:!0,with:!0,an:!0,actions:!0,menu:!0,cell:!0,'renderer"':!0},"<foundation-grid-pro>\n  ...\n  <grid-pro-column :definition=${x => x.myActionsMenuColDef}></grid-pro-column>\n  ...\n</foundation-grid-pro>\n")),(0,a.kt)("p",null,"Behind the scenes, the ",(0,a.kt)("inlineCode",{parentName:"p"},"getActionsMenuDef"),' helper builds the "actions menu" ',(0,a.kt)("inlineCode",{parentName:"p"},"ColDef")," for you."),(0,a.kt)("admonition",{type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"You can always build the ",(0,a.kt)("inlineCode",{parentName:"p"},"ColDef")," yourself, but the built-in helper can be useful in common cases. ")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx",metastring:"title=\"You can use 'overrideDef' to override all the default values used in this helper\"",title:'"You',can:!0,use:!0,"'overrideDef'":!0,to:!0,override:!0,all:!0,the:!0,default:!0,values:!0,used:!0,in:!0,this:!0,'helper"':!0},"const getActionsMenuDef = (\n  actions: AgActionMenuItem[],\n  overrideDef: ColDef = {},\n  customActionsOpenerName: string = '\u22ee') => {\n  const actionsMenuDef: ColDef = {\n    cellRenderer: GridProRendererTypes.actionsMenu,\n    cellRendererParams: {actions, buttonText: customActionsOpenerName},\n    cellStyle: {border: 'none', overflow: 'visible'},\n    field: 'actions',\n    headerName: 'Actions',\n    width: 150,\n  };\n\n  return {...actionsMenuDef, ...overrideDef};\n};\n")))}m.isMDXComponent=!0}}]);