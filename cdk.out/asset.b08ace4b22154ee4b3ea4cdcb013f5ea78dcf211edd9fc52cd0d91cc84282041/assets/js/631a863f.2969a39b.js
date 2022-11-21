"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[63189],{92241:function(e,n,o){o.r(n),o.d(n,{assets:function(){return p},contentTitle:function(){return l},default:function(){return g},frontMatter:function(){return a},metadata:function(){return d},toc:function(){return m}});var t=o(87462),r=o(63366),i=(o(67294),o(3905)),s=(o(61839),["components"]),a={id:"grid-pro-genesis-column",title:"Grid Pro - Column",keywords:["web","web components","grid","grid pro","column"],tags:["web","web components","grid","grid pro","column"]},l=void 0,d={unversionedId:"web/web-components/grids/grid-pro/grid-pro-genesis-column",id:"version-2022.3/web/web-components/grids/grid-pro/grid-pro-genesis-column",title:"Grid Pro - Column",description:'This is a slotted component that allows a more "visual approach" when defining columns. Each grid-pro-column takes a ColDef typed object.',source:"@site/versioned_docs/version-2022.3/04_web/02_web-components/02_grids/01_grid-pro/4-grid-pro-genesis-column.md",sourceDirName:"04_web/02_web-components/02_grids/01_grid-pro",slug:"/web/web-components/grids/grid-pro/grid-pro-genesis-column",permalink:"/web/web-components/grids/grid-pro/grid-pro-genesis-column",draft:!1,tags:[{label:"web",permalink:"/tags/web"},{label:"web components",permalink:"/tags/web-components"},{label:"grid",permalink:"/tags/grid"},{label:"grid pro",permalink:"/tags/grid-pro"},{label:"column",permalink:"/tags/column"}],version:"2022.3",sidebarPosition:4,frontMatter:{id:"grid-pro-genesis-column",title:"Grid Pro - Column",keywords:["web","web components","grid","grid pro","column"],tags:["web","web components","grid","grid pro","column"]},sidebar:"frontendSidebar",previous:{title:"Grid Pro - Genesis datasource",permalink:"/web/web-components/grids/grid-pro/grid-pro-genesis-datasource"},next:{title:"Grid Pro - Cell",permalink:"/web/web-components/grids/grid-pro/grid-pro-genesis-cell"}},p={},m=[{value:"Usage",id:"usage",level:2}],c={toc:m};function g(e){var n=e.components,o=(0,r.Z)(e,s);return(0,i.kt)("wrapper",(0,t.Z)({},c,o,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"This is a ",(0,i.kt)("inlineCode",{parentName:"p"},"slotted"),' component that allows a more "visual approach" when defining columns. Each ',(0,i.kt)("inlineCode",{parentName:"p"},"grid-pro-column")," takes a ",(0,i.kt)("inlineCode",{parentName:"p"},"ColDef")," typed object."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"Customising column definitions using this approach is useful when on ",(0,i.kt)("strong",{parentName:"p"},"connected data")," cases, where the data will be dynamic but there's still a need for extra definitions (e.g. events, transformers, etc).")),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("p",null,"We can define ",(0,i.kt)("inlineCode",{parentName:"p"},"ColDef")," objects in different ways, in this example it's being set in the context/component's own class:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="ColDef array setting custom headerName and others"',title:'"ColDef',array:!0,setting:!0,custom:!0,headerName:!0,and:!0,'others"':!0},"public myMultipleCustomColumnConfigArray: ColDef[] = [\n  {\n    headerName: 'Country',\n    field: 'country',\n    // cellRenderer, etc\n  },\n  {\n    headerName: 'Custom Year Header',\n    field: 'year',\n    width: 100,\n    // cellRenderer, etc\n  },\n];\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="Two ColDef objects setting custom headerName and others"',title:'"Two',ColDef:!0,objects:!0,setting:!0,custom:!0,headerName:!0,and:!0,'others"':!0},"public mySingleCustomColumnConfigObj: ColDef = [\n  {\n    headerName: 'Type',\n    field: 'type',\n    width: 50,\n    // cellRenderer, etc\n  },\n];\n\npublic myOtherSingleCustomColumnConfigObj: ColDef = [\n  {\n    headerName: 'Counterparty Name',\n    field: 'counterparty',\n    // cellRenderer, etc\n  },\n];\n")),(0,i.kt)("p",null,"When using ",(0,i.kt)("inlineCode",{parentName:"p"},"ColDef")," objects, it's up to you to decide the approach (array of definitions + repeat or one by one; there's no right or wrong here, as the goal is flexibility):"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html",metastring:'title="Using the ColDef array of objects with an extra single object"',title:'"Using',the:!0,ColDef:!0,array:!0,of:!0,objects:!0,with:!0,an:!0,extra:!0,single:!0,'object"':!0},"<foundation-grid-pro>\n  ${repeat(x => x.myMultipleCustomColumnConfigArray, html`\n    <grid-pro-column :definition=${x => x}></grid-pro-column>\n  `)}\n\n  <grid-pro-column :definition=${x => x.mySingleCustomColumnConfigObj}></grid-pro-column>\n  <grid-pro-column :definition=${x => x.myOtherSingleCustomColumnConfigObj}></grid-pro-column>\n\n</foundation-grid-pro>\n")))}g.isMDXComponent=!0}}]);