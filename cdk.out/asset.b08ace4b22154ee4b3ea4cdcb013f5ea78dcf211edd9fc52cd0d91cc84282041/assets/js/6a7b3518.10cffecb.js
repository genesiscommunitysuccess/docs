"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[62222],{7644:function(e,n,r){r.r(n),r.d(n,{assets:function(){return p},contentTitle:function(){return s},default:function(){return g},frontMatter:function(){return a},metadata:function(){return d},toc:function(){return c}});var o=r(87462),t=r(63366),i=(r(67294),r(3905)),l=(r(61839),["components"]),a={id:"grid-pro-genesis-cell",title:"Grid Pro - Cell",keywords:["web","web components","grid","grid pro","cell"],tags:["web","web components","grid","grid pro","cell"]},s=void 0,d={unversionedId:"web/web-components/grids/grid-pro/grid-pro-genesis-cell",id:"version-2022.3/web/web-components/grids/grid-pro/grid-pro-genesis-cell",title:"Grid Pro - Cell",description:'This is a slotted component that allows a "visual approach" when configuring cell renderers. Each grid-pro-cell takes an ICellRendererFunc typed function.',source:"@site/versioned_docs/version-2022.3/04_web/02_web-components/02_grids/01_grid-pro/5-grid-pro-genesis-cell.md",sourceDirName:"04_web/02_web-components/02_grids/01_grid-pro",slug:"/web/web-components/grids/grid-pro/grid-pro-genesis-cell",permalink:"/web/web-components/grids/grid-pro/grid-pro-genesis-cell",draft:!1,tags:[{label:"web",permalink:"/tags/web"},{label:"web components",permalink:"/tags/web-components"},{label:"grid",permalink:"/tags/grid"},{label:"grid pro",permalink:"/tags/grid-pro"},{label:"cell",permalink:"/tags/cell"}],version:"2022.3",sidebarPosition:5,frontMatter:{id:"grid-pro-genesis-cell",title:"Grid Pro - Cell",keywords:["web","web components","grid","grid pro","cell"],tags:["web","web components","grid","grid pro","cell"]},sidebar:"frontendSidebar",previous:{title:"Grid Pro - Column",permalink:"/web/web-components/grids/grid-pro/grid-pro-genesis-column"},next:{title:"Grid Pro - Renderers",permalink:"/web/web-components/grids/grid-pro/grid-pro-renderers"}},p={},c=[{value:"Set-up",id:"set-up",level:2},{value:"Usage",id:"usage",level:2}],m={toc:c};function g(e){var n=e.components,r=(0,t.Z)(e,l);return(0,i.kt)("wrapper",(0,o.Z)({},m,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"This is a ",(0,i.kt)("inlineCode",{parentName:"p"},"slotted"),' component that allows a "visual approach" when configuring cell renderers. Each ',(0,i.kt)("inlineCode",{parentName:"p"},"grid-pro-cell")," takes an ",(0,i.kt)("inlineCode",{parentName:"p"},"ICellRendererFunc")," typed function."),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"grid-pro-cell")," must be used as a slot of the ",(0,i.kt)("a",{parentName:"p",href:"/web/web-components/grids/grid-pro/grid-pro-genesis-column/"},"Genesis Grid Pro Column"),". It can't be used separately, since it's just an extra visual layer for defining the cell renderer (which can also be configured directly from the ",(0,i.kt)("inlineCode",{parentName:"p"},"grid-pro-column")," definition prop)."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"Using ",(0,i.kt)("inlineCode",{parentName:"p"},"grid-pro-cell")," is not mandatory and it's for highly customised cases. Most of the features here can be achieved with just ",(0,i.kt)("inlineCode",{parentName:"p"},"grid-pro-column")," and/or ",(0,i.kt)("inlineCode",{parentName:"p"},"auto-cell-renderer-by-type")," prop on a given Grid Pro.")),(0,i.kt)("h2",{id:"set-up"},"Set-up"),(0,i.kt)("admonition",{type:"info"},(0,i.kt)("p",{parentName:"admonition"},"In the examples below, we refer to a sample ",(0,i.kt)("inlineCode",{parentName:"p"},"@genesislcap/alpha-design-system")," design system with an ",(0,i.kt)("inlineCode",{parentName:"p"},"alpha")," prefix. Your design system would probably have a different name/prefix, while still exposing the same API.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { provideDesignSystem } from '@genesislcap/alpha-design-system';\nimport { foundationGridComponents } from '@genesislcap/grid-pro';\n\nprovideDesignSystem().register(alphaAgGrid(), foundationGridComponents);\n")),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("p",null,"We can define ",(0,i.kt)("inlineCode",{parentName:"p"},"ColDef")," objects in different ways; in this example, it's being set in the context/component's own class:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="ColDef array setting custom headerName and others"',title:'"ColDef',array:!0,setting:!0,custom:!0,headerName:!0,and:!0,'others"':!0},"const multipleCustomColumnConfigArray: ColDef[] = [\n  {\n    headerName: 'Is Active',\n    field: 'IS_ACTIVE',\n    cellRenderer: GridProRendererTypes.boolean, // 'boolean' is a built-in cell renderer (will be used automatically if auto-cell-renderer-by-type is specified in the `grid-pro-grid` config)\n  },\n  {\n    headerName: 'Pending Approval ',\n    field: 'PENDING_APPROVAL',\n    width: 100,\n    cellRenderer: null, // 'null' means it will disable any cell renderer config (even if auto-cell-renderer-by-type is enabled)\n  },\n\n  ...\n];\n\nconst customLogLevelDef: any = {\n  headerName: 'Log Level',\n  field: 'LOG_LEVEL',\n};\n\nconst customLogLevelCellRenderer = (params) => {\n  return `<span style=\"color: ${params.value === 'TRACE' ? params.color : 'green'}\">Custom ${params.value}</span>`;\n};\n\nconst customLogLevelCellRendererParams = {color: 'orange'};\n\nconst myCustomTextRenderer = params => `<span style=\"color: ${params.color}\">Custom Access Level - ${params.value}</span>`;\n\nconst customCompleteDef: any = {\n  headerName: 'Access Level',\n  field: 'ACCESS_LEVEL',\n  cellRenderer: this.myCustomTextRenderer,\n  cellRendererParams: {\n    color: 'red',\n  },\n};\n")),(0,i.kt)("p",null,"When using ",(0,i.kt)("inlineCode",{parentName:"p"},"ColDef")," objects it's up to the application developer to decide the approach (array of definitions + repeat or one by one, there's no right or wrong here as the goal is flexibility):"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html",metastring:'title="Using the ColDef (with cellRenderer/cellRendererParams) objects in different ways"',title:'"Using',the:!0,ColDef:!0,"(with":!0,"cellRenderer/cellRendererParams)":!0,objects:!0,in:!0,different:!0,'ways"':!0},'<alpha-grid-pro auto-cell-renderer-by-type>\n  <grid-pro-genesis-datasource resourceName="EXAMPLE_DATA_RESOURCE" />\n\n  \x3c!-- When there\'s a main array of ColDef objects but there are extra conditions for the custom cellRenderer --\x3e\n  ${repeat(() => multipleCustomColumnConfigArray, html`\n    <grid-pro-column :definition="${x => x}">\n      ${when(x => x.cellRenderer, html`\n        <grid-pro-cell \n          :renderer="${x => x.cellRenderer}" \n          :rendererParams="${x => x.cellRendererParams}">\n        </grid-pro-cell>\n      `)}\n    </grid-pro-column>\n  `)} \n\n  \x3c!-- Using separate definitions for both grid-pro-column and grid-pro-cell --\x3e\n  <grid-pro-column :definition="${x => x.customLogLevelDef}">\n    <grid-pro-cell \n      :renderer="${x => x.customLogLevelCellRenderer}" \n      :rendererParams="${x => x.customLogLevelCellRendererParams}">\n    </grid-pro-cell>\n  </grid-pro-column>\n\n  \x3c!-- Skipping the grid-pro-cell usage but achieving the same result (custom cellRenderer/cellRendererParams) --\x3e\n  <grid-pro-column :definition="${x => x.customCompleteDef}" />\n\n</alpha-grid-pro>\n')))}g.isMDXComponent=!0}}]);