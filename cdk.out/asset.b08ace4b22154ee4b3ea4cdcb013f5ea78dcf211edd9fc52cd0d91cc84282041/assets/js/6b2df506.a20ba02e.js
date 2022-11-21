"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[84893],{85162:function(t,e,n){n.d(e,{Z:function(){return r}});var l=n(67294),o=n(86010),a="tabItem_Ymn6";function r(t){var e=t.children,n=t.hidden,r=t.className;return l.createElement("div",{role:"tabpanel",className:(0,o.Z)(a,r),hidden:n},e)}},65488:function(t,e,n){n.d(e,{Z:function(){return k}});var l=n(87462),o=n(67294),a=n(86010),r=n(72389),i=n(67392),u=n(7094),s=n(12466),p="tabList__CuJ",d="tabItem_LNqP";function c(t){var e,n,r=t.lazy,c=t.block,k=t.defaultValue,y=t.values,m=t.groupId,h=t.className,g=o.Children.map(t.children,(function(t){if((0,o.isValidElement)(t)&&"value"in t.props)return t;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof t.type?t.type:t.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=y?y:g.map((function(t){var e=t.props;return{value:e.value,label:e.label,attributes:e.attributes}})),x=(0,i.l)(f,(function(t,e){return t.value===e.value}));if(x.length>0)throw new Error('Docusaurus error: Duplicate values "'+x.map((function(t){return t.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===k?k:null!=(e=null!=k?k:null==(n=g.find((function(t){return t.props.default})))?void 0:n.props.value)?e:g[0].props.value;if(null!==b&&!f.some((function(t){return t.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+f.map((function(t){return t.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var z=(0,u.U)(),N=z.tabGroupChoices,w=z.setTabGroupChoices,v=(0,o.useState)(b),C=v[0],L=v[1],T=[],B=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var A=N[m];null!=A&&A!==C&&f.some((function(t){return t.value===A}))&&L(A)}var E=function(t){var e=t.currentTarget,n=T.indexOf(e),l=f[n].value;l!==C&&(B(e),L(l),null!=m&&w(m,String(l)))},D=function(t){var e,n=null;switch(t.key){case"ArrowRight":var l,o=T.indexOf(t.currentTarget)+1;n=null!=(l=T[o])?l:T[0];break;case"ArrowLeft":var a,r=T.indexOf(t.currentTarget)-1;n=null!=(a=T[r])?a:T[T.length-1]}null==(e=n)||e.focus()};return o.createElement("div",{className:(0,a.Z)("tabs-container",p)},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.Z)("tabs",{"tabs--block":c},h)},f.map((function(t){var e=t.value,n=t.label,r=t.attributes;return o.createElement("li",(0,l.Z)({role:"tab",tabIndex:C===e?0:-1,"aria-selected":C===e,key:e,ref:function(t){return T.push(t)},onKeyDown:D,onFocus:E,onClick:E},r,{className:(0,a.Z)("tabs__item",d,null==r?void 0:r.className,{"tabs__item--active":C===e})}),null!=n?n:e)}))),r?(0,o.cloneElement)(g.filter((function(t){return t.props.value===C}))[0],{className:"margin-top--md"}):o.createElement("div",{className:"margin-top--md"},g.map((function(t,e){return(0,o.cloneElement)(t,{key:e,hidden:t.props.value!==C})}))))}function k(t){var e=(0,r.Z)();return o.createElement(c,(0,l.Z)({key:String(e)},t))}},50113:function(t,e,n){n.r(e),n.d(e,{assets:function(){return c},contentTitle:function(){return p},default:function(){return m},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return k}});var l=n(87462),o=n(63366),a=(n(67294),n(3905)),r=(n(61839),n(65488)),i=n(85162),u=["components"],s={title:"Layouts",id:"layouts"},p="Layouts",d={unversionedId:"fuse/features/layouts",id:"version-2022.3/fuse/features/layouts",title:"Layouts",description:"Introduction",source:"@site/versioned_docs/version-2022.3/00_fuse/03_features/03_layouts.md",sourceDirName:"00_fuse/03_features",slug:"/fuse/features/layouts",permalink:"/fuse/features/layouts",draft:!1,tags:[],version:"2022.3",sidebarPosition:3,frontMatter:{title:"Layouts",id:"layouts"},sidebar:"fuseSidebar",previous:{title:"Linked UI components",permalink:"/fuse/features/linked-ui-components"},next:{title:"Resources",permalink:"/fuse/features/resources"}},c={},k=[{value:"Introduction",id:"introduction",level:2},{value:"Layout Examples",id:"layout-examples",level:2},{value:"Vertical Page",id:"vertical-page",level:3},{value:"Horizontal Page",id:"horizontal-page",level:3},{value:"Component Examples",id:"component-examples",level:2},{value:"Vertical",id:"vertical",level:3},{value:"Horizontal",id:"horizontal",level:3},{value:"Nested",id:"nested",level:3},{value:"Alignment Examples",id:"alignment-examples",level:2},{value:"Vertical",id:"vertical-1",level:3},{value:"Horizontal",id:"horizontal-1",level:3}],y={toc:k};function m(t){var e=t.components,s=(0,o.Z)(t,u);return(0,a.kt)("wrapper",(0,l.Z)({},y,s,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"layouts"},"Layouts"),(0,a.kt)("h2",{id:"introduction"},"Introduction"),(0,a.kt)("p",null,"With Fuse you have full control over your layouts. This is achieved by utilizing two basic layout components (",(0,a.kt)("strong",{parentName:"p"},"vertical")," & ",(0,a.kt)("strong",{parentName:"p"},"horizontal"),") along with their various parameters. The ",(0,a.kt)("inlineCode",{parentName:"p"},"verticalLayout")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"horizontalLayout")," render their contents vertically and horizontally respectively. "),(0,a.kt)("p",null,"With layouts you can:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"display your elements in any layout you like by using the vertical and horizontal components"),(0,a.kt)("li",{parentName:"ul"},"use default options or override them for more control")),(0,a.kt)("h2",{id:"layout-examples"},"Layout Examples"),(0,a.kt)("h3",{id:"vertical-page"},"Vertical Page"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'ui("Vertical Layout") {\n    page("Page layout example") {\n            verticalLayout(...) {\n                entityManager (...) {},\n                entityManager (...) {}\n            }\n        }    \n    }\n')),(0,a.kt)("admonition",{type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"  ",(0,a.kt)("inlineCode",{parentName:"p"},"verticalLayout")," places components top-to-bottom in a column. By default it stretches the children to the entire length but we can explicitly set the width or height to control that.")),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"The image below shows a ",(0,a.kt)("inlineCode",{parentName:"p"},"verticalLayout")," of two elements with default parameters.")),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(4339).Z,width:"1919",height:"796"})),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"The image below shows a ",(0,a.kt)("inlineCode",{parentName:"p"},"verticalLayout")," of two elements. The first element has its width set to 50%.")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'ui("Vertical Layout") {\n    page("Page layout example") {\n            verticalLayout(...) {\n                entityManager (...) {\n                    attributes (\n                        "width" to "50%"\n                    )\n                },\n                entityManager (...) {}\n            }\n        }    \n    }\n')),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(32948).Z,width:"1919",height:"836"})),(0,a.kt)("h3",{id:"horizontal-page"},"Horizontal Page"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'ui("Horizontal Layout") {\n    page("Page Layout Example") {\n            horizontalLayout(...) {\n                entityManager (...) {},\n                entityManager (...) {}\n            }\n        }    \n    }\n}\n')),(0,a.kt)("admonition",{type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"  ",(0,a.kt)("inlineCode",{parentName:"p"},"horizontalLayout")," places components left-to-right in a row. By default it stretches the children to the entire length but we can explicitly set the width or height to control that.")),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"The image below shows a ",(0,a.kt)("inlineCode",{parentName:"p"},"horizontalLayout")," of two elements with default parameters")),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(29466).Z,width:"1915",height:"791"})),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"The image below shows a ",(0,a.kt)("inlineCode",{parentName:"p"},"horizontalLayout")," of two elements. The first element has its height set to 50%")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'ui("Horizontal Layout") {\n    page("Page Layout Example") {\n            horizontalLayout(...) {\n                entityManager (...) {\n                    attributes(\n                        "height" to "50%"\n                    )\n                },\n                entityManager (...) {}\n            }\n        }    \n    }\n}\n')),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(90350).Z,width:"1914",height:"834"})),(0,a.kt)("h2",{id:"component-examples"},"Component Examples"),(0,a.kt)("h3",{id:"vertical"},"Vertical"),(0,a.kt)("p",null,"Here we have an implementation of ",(0,a.kt)("inlineCode",{parentName:"p"},"verticalLayout")," within a form:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},"verticalLayout(...) {\n    form(...) {\n        verticalLayout(...) {\n            input{...},\n            input{...}\n            }\n        }\n    button(...) {}\n    }\n}\n")),(0,a.kt)("zero-design-system-provider",{style:{justifyContent:"center"}},(0,a.kt)("div",{style:{flexDirection:"column",margin:"10px",width:"80%"}},(0,a.kt)("zero-card",{id:"zero-form-card",style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column spacing-2x"},(0,a.kt)("zero-flex-layout",{class:"flex-column spacing-2x"},(0,a.kt)("form",{style:{display:"flex",flexDirection:"column",padding:"3px"}},(0,a.kt)("label",{htmlFor:"i1"},"Input 1"),(0,a.kt)("input",{type:"text",id:"i1",name:"i1",placeholder:"placeholder",style:{backgroundColor:" rgba(135, 155, 166, 0.06) ",borderRadius:"4px",height:"40px",border:"0",marginTop:"4px"}})),(0,a.kt)("form",{style:{display:"flex",flexDirection:"column",padding:"3px"}},(0,a.kt)("label",{htmlFor:"i1"},"Input 2"),(0,a.kt)("input",{type:"text",id:"i1",name:"i1",placeholder:"placeholder",style:{backgroundColor:" rgba(135, 155, 166, 0.06) ",borderRadius:"4px",height:"40px",border:"0",marginTop:"4px"}}))),(0,a.kt)("div",{style:{display:"flex",justifyContent:"right"}},(0,a.kt)("zero-button",{appearance:"primary-gradient",style:{width:"100px",display:"flex",justifyContent:"right"}},"Submit")))))),(0,a.kt)("h3",{id:"horizontal"},"Horizontal"),(0,a.kt)("p",null,"Implementation of ",(0,a.kt)("inlineCode",{parentName:"p"},"horizontalLayout")," within a form:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},"horizontalLayout(...) {\n    form(...) {\n        horizontalLayout(...) {\n            input{...},\n            input{...}\n            }\n        }\n    button(...) {}\n    }\n}\n")),(0,a.kt)("zero-design-system-provider",{style:{justifyContent:"center"}},(0,a.kt)("div",{style:{flexDirection:"column",margin:"10px",width:"80%"}},(0,a.kt)("zero-card",{id:"zero-form-card",style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column spacing-2x"},(0,a.kt)("zero-flex-layout",{class:"flex-row spacing-2x"},(0,a.kt)("form",{style:{display:"flex",flexDirection:"column",padding:"3px",flex:"1 1 auto"}},(0,a.kt)("label",{htmlFor:"i1"},"Input 1"),(0,a.kt)("input",{type:"text",id:"i1",name:"i1",placeholder:"placeholder",style:{backgroundColor:" rgba(135, 155, 166, 0.06) ",borderRadius:"4px",height:"40px",border:"0",marginTop:"4px"}})),(0,a.kt)("form",{style:{display:"flex",flexDirection:"column",padding:"3px",flex:"1 1 auto"}},(0,a.kt)("label",{htmlFor:"i2"},"Input 2"),(0,a.kt)("input",{type:"text",id:"i2",name:"i2",placeholder:"placeholder",style:{backgroundColor:" rgba(135, 155, 166, 0.06) ",borderRadius:"4px",height:"40px",border:"0",marginTop:"4px"}})),(0,a.kt)("form",{style:{display:"flex",flexDirection:"column",padding:"3px",flex:"1 1 auto"}},(0,a.kt)("label",{htmlFor:"i3"},"Input 3"),(0,a.kt)("input",{type:"text",id:"i3",name:"i3",placeholder:"placeholder",style:{backgroundColor:" rgba(135, 155, 166, 0.06) ",borderRadius:"4px",height:"40px",border:"0",marginTop:"4px"}}))),(0,a.kt)("div",{style:{display:"flex",justifyContent:"right"}},(0,a.kt)("zero-button",{appearance:"primary-gradient",style:{width:"100px",display:"flex",justifyContent:"right"}},"Submit")))))),(0,a.kt)("h3",{id:"nested"},"Nested"),(0,a.kt)("p",null,"Vertical and horizontal components can also be used together for a more complex structure."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},"verticalLayout(...) {\n    form(...) {\n        horizontalLayout(...) {\n            verticalLayout(...) {\n                input{...},\n                input{...}\n            },\n            verticalLayout(...) {\n                input{...},\n                input{...}\n            }\n        }\n    },\n    button(...) {}\n    }\n}\n")),(0,a.kt)("zero-design-system-provider",{style:{justifyContent:"center"}},(0,a.kt)("div",{style:{flexDirection:"column",margin:"10px",width:"80%"}},(0,a.kt)("zero-card",{id:"zero-form-card",style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column spacing-2x"},(0,a.kt)("zero-flex-layout",{class:"flex-row spacing-2x"},(0,a.kt)("zero-flex-layout",{class:"flex-column spacing-2x"},(0,a.kt)("form",{style:{display:"flex",flexDirection:"column",padding:"3px"}},(0,a.kt)("label",{htmlFor:"i1"},"Input 1"),(0,a.kt)("input",{type:"text",id:"i1",name:"i1",placeholder:"placeholder",style:{backgroundColor:" rgba(135, 155, 166, 0.06) ",borderRadius:"4px",height:"40px",border:"0",marginTop:"4px"}})),(0,a.kt)("form",{style:{display:"flex",flexDirection:"column",padding:"3px"}},(0,a.kt)("label",{htmlFor:"i2"},"Input 2"),(0,a.kt)("input",{type:"text",id:"i2",name:"i2",placeholder:"placeholder",style:{backgroundColor:" rgba(135, 155, 166, 0.06) ",borderRadius:"4px",height:"40px",border:"0",marginTop:"4px"}}))),(0,a.kt)("zero-flex-layout",{class:"flex-column spacing-2x"},(0,a.kt)("form",{style:{display:"flex",flexDirection:"column",padding:"3px"}},(0,a.kt)("label",{htmlFor:"i3"},"Input 3"),(0,a.kt)("input",{type:"text",id:"i3",name:"i3",placeholder:"placeholder",style:{backgroundColor:" rgba(135, 155, 166, 0.06) ",borderRadius:"4px",height:"40px",border:"0",marginTop:"4px"}})),(0,a.kt)("form",{style:{display:"flex",flexDirection:"column",padding:"3px"}},(0,a.kt)("label",{htmlFor:"i4"},"Input 4"),(0,a.kt)("input",{type:"text",id:"i4",name:"i4",placeholder:"placeholder",style:{backgroundColor:" rgba(135, 155, 166, 0.06) ",borderRadius:"4px",height:"40px",border:"0",marginTop:"4px"}})))),(0,a.kt)("div",{style:{display:"flex",justifyContent:"right"}},(0,a.kt)("zero-button",{appearance:"primary-gradient",style:{width:"100px",display:"flex",justifyContent:"right"}},"Submit")))))),(0,a.kt)("h3",{id:""}),(0,a.kt)("p",null,"Now that we've seen some basic examples of page and component layouts, let's dive a little deeper.\nNot only can we determine the direction of our elements but also their positioning within a given space.\nClick on the tabs below for more details."),(0,a.kt)(r.Z,{mdxType:"Tabs"},(0,a.kt)(i.Z,{value:"vertical",label:"Vertical Layout",default:!0,mdxType:"TabItem"},(0,a.kt)("h2",{id:"alignment-examples"},"Alignment Examples"),(0,a.kt)("h3",{id:"vertical-1"},"Vertical"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'ui("Vertical Layout") {\n    page("Layout") {\n        verticalLayout(...) {\n            button {...}\n            button {...}\n            button {...}\n        }\n    }\n}\n')),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"As mentioned above, children elements of the ",(0,a.kt)("inlineCode",{parentName:"p"},"verticalLayout")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"horizontalLayout")," components, stretch to the entire length by default. For the following examples, we will set the width of the buttons to ",(0,a.kt)("inlineCode",{parentName:"p"},"13%"),".")),(0,a.kt)("zero-design-system-provider",{style:{display:"flex",justifyContent:"center",borderRadius:"5px"}},(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",backgroundColor:"rgba( 207, 207, 207, 1)"}},(0,a.kt)("p",{style:{color:"black",padding:"4px",textAlign:"center",marginTop:"10px"}},"By default the position of the children element will be at the top left. The same as ",(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignItems.START"))," and ",(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.START"))),(0,a.kt)("zero-card",null,(0,a.kt)("zero-flex-layout",{class:"flex-column"},(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 3"))))),(0,a.kt)("h3",{id:"-1"}),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Value"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignItems.START"))),(0,a.kt)("td",{parentName:"tr",align:null},"Positions items at the top left")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignItems.CENTER"))),(0,a.kt)("td",{parentName:"tr",align:null},"Centers items along the x-axis")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignItems.END"))),(0,a.kt)("td",{parentName:"tr",align:null},"Positions items on the far right")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.START"))),(0,a.kt)("td",{parentName:"tr",align:null},"Positions items at the top left")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.CENTER"))),(0,a.kt)("td",{parentName:"tr",align:null},"Centers content along the x-axis. It also applies flex-wrap which means, depending on the height of the parent element, the children may take up the height equally distributed among each other. However, if the height is smaller, they would be spread out in a row instead. This applies to the following alignments of content as well")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.END"))),(0,a.kt)("td",{parentName:"tr",align:null},"Positions content on the far right.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.EVENLY"))),(0,a.kt)("td",{parentName:"tr",align:null},"Distributes space equally among the content. From the left of the first item, between items and on the right of the last item.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.AROUND"))),(0,a.kt)("td",{parentName:"tr",align:null},"Distributes the space equally between items. The space before the first item, and after the last, is half of that between them.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.BETWEEN"))),(0,a.kt)("td",{parentName:"tr",align:null},"The space is distributed evenly between items, with no space before the first item or after the last.")))),(0,a.kt)("zero-design-system-provider",{style:{display:"flex",justifyContent:"center"}},(0,a.kt)("zero-flex-layout",{class:"flex-column",style:{backgroundColor:"rgba( 207, 207, 207, 1)"}},(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignItems.CENTER"))),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",height:"25vh"}},(0,a.kt)("zero-flex-layout",{class:" flex-column items-center",style:{height:"0"}},(0,a.kt)("zero-button",{style:{flex:" 1 1 auto",width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{flex:" 1 1 auto",width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{flex:" 1 1 auto",width:"13%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},"In order to center the children elements both vertically and horizontally, simply add ",(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutJustify.CENTER"))," in addition to ",(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignItems.CENTER"))),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",height:"25vh"}},(0,a.kt)("zero-flex-layout",{class:"flex-column items-center justify-center"},(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignItems.END"))),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column items-end"},(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.CENTER"))," (no height set)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-wrap flex-column content-center"},(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.CENTER"))," (height set)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-wrap flex-column content-center",style:{height:"50px"}},(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.END"))," (no height set)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-end"},(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.END"))," (height set)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-end",style:{height:"50px"}},(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.EVENLY"))," (no height set)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-evenly"},(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 3"),(0,a.kt)("zero-button",{style:{width:"13%"}},"Button 4"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.EVENLY"))," (height set at 100px)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-evenly",style:{height:"100px"}},(0,a.kt)("zero-button",{style:{width:"13"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"13"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"13"}},"Button 3"),(0,a.kt)("zero-button",{style:{width:"13"}},"Button 4"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.EVENLY"))," (height set at 50px)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-evenly",style:{height:"50px"}},(0,a.kt)("zero-button",{style:{width:"13"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"13"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"13"}},"Button 3"),(0,a.kt)("zero-button",{style:{width:"13"}},"Button 4"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.AROUND"))," (no height set)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-around"},(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13"}},"Button 1"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13"}},"Button 2"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13"}},"Button 3"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13"}},"Button 4"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.AROUND"))," (height set at 100px)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-around",style:{height:"100px"}},(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 3"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 4"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.AROUND"))," (height set at 50px)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-around",style:{height:"50px"}},(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 3"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 4"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.BETWEEN"))," (no height set)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-between"},(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 3"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 4"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.BETWEEN"))," (height set at 100px)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-between",style:{height:"100px"}},(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 3"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 4"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.BETWEEN"))," (height set at 50px)"),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column"}},(0,a.kt)("zero-flex-layout",{class:"flex-column flex-wrap content-between",style:{height:"50px"}},(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 1"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 2"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 3"),(0,a.kt)("zero-button",{style:{flex:"1 1 auto",width:"13%"}},"Button 4"))))),(0,a.kt)("h3",{id:"-2"})),(0,a.kt)(i.Z,{value:"horizontal",label:"Horizontal Layout",mdxType:"TabItem"},(0,a.kt)("h3",{id:"horizontal-1"},"Horizontal"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-kotlin"},'ui("Horizontal Layout") {\n    page("Layout") {\n        horizontalLayout(...) {\n            button {...}\n            button {...}\n            button {...}\n        }\n    }\n}\n')),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"Button width is set to ",(0,a.kt)("inlineCode",{parentName:"p"},"27%"),". ")),(0,a.kt)("zero-design-system-provider",{style:{display:"flex",justifyContent:"center",borderRadius:"5px"}},(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",backgroundColor:"rgba( 207, 207, 207, 1)"}},(0,a.kt)("p",{style:{color:"black",padding:"4px",marginTop:"15px",textAlign:"center"}},"By default the position of the children element will be at the top left. The same as ",(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignItems.START"))," and ",(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.START"))),(0,a.kt)("zero-card",null,(0,a.kt)("zero-flex-layout",{class:"flex-row"},(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 3"))))),(0,a.kt)("h3",{id:"-3"}),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Value"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignItems.START"))),(0,a.kt)("td",{parentName:"tr",align:null},"Positions items at the top left.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignItems.CENTER"))),(0,a.kt)("td",{parentName:"tr",align:null},"Centers items along the y-axis.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignItems.END"))),(0,a.kt)("td",{parentName:"tr",align:null},"Positions items at the bottom left.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.START"))),(0,a.kt)("td",{parentName:"tr",align:null},"Positions content at the top left.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.CENTER"))),(0,a.kt)("td",{parentName:"tr",align:null},"Centers content along the y-axis.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.END"))),(0,a.kt)("td",{parentName:"tr",align:null},"Positions content at the bottom left.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.EVENLY"))),(0,a.kt)("td",{parentName:"tr",align:null},"Distributes space equally among the content. From the top of the first item, between items and on the bottom.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.AROUND"))),(0,a.kt)("td",{parentName:"tr",align:null},"Distributes the space equally between items. The space before the first item, and after the last, is half of that between items.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},(0,a.kt)("inlineCode",{parentName:"strong"},"LayoutAlignContent.BETWEEN"))),(0,a.kt)("td",{parentName:"tr",align:null},"The space is distributed evenly between items, with no space before the first item or after the last.")))),(0,a.kt)("zero-design-system-provider",{style:{display:"flex",justifyContent:"center"}},(0,a.kt)("zero-flex-layout",{class:"flex-column spacing-1x",style:{backgroundColor:"rgba( 207, 207, 207, 1)"}},(0,a.kt)("p",{style:{color:"black",marginTop:"20px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignItems.CENTER"))),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",height:"20vh"}},(0,a.kt)("zero-flex-layout",{class:" flex-row items-center"},(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},"In order to center the children elements both vertically and horizontally, simply add ",(0,a.kt)("b",null," ",(0,a.kt)("code",null,"LayoutJustify.CENTER"))," in addition to ",(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignItems.CENTER")),"."),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",height:"20vh"}},(0,a.kt)("zero-flex-layout",{class:"flex-row items-center justify-center"},(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignItems.END"))),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",height:"20vh"}},(0,a.kt)("zero-flex-layout",{class:"flex-row items-end"},(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.CENTER"))),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",height:"20vh"}},(0,a.kt)("zero-flex-layout",{class:"flex-wrap flex-row content-center"},(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.END"))),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",height:"20vh"}},(0,a.kt)("zero-flex-layout",{class:"flex-row flex-wrap content-end"},(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 3"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.EVENLY"))),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",height:"20vh"}},(0,a.kt)("zero-flex-layout",{class:"flex-row flex-wrap content-evenly"},(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 3"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 4"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.AROUND"))),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",height:"20vh"}},(0,a.kt)("zero-flex-layout",{class:"flex-row flex-wrap content-around"},(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 3"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 4"))),(0,a.kt)("p",{style:{color:"black",marginTop:"15px",textAlign:"center"}},(0,a.kt)("b",null,(0,a.kt)("code",null,"LayoutAlignContent.BETWEEN"))),(0,a.kt)("zero-card",{style:{display:"flex",flexDirection:"column",height:"20vh"}},(0,a.kt)("zero-flex-layout",{class:"flex-row flex-wrap content-between"},(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 1"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 2"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 3"),(0,a.kt)("zero-button",{style:{width:"27%"}},"Button 4"))))))))}m.isMDXComponent=!0},90350:function(t,e,n){e.Z=n.p+"assets/images/hl-em-attr-5e82ed6956da0c3970cc26f899f7f2d2.PNG"},29466:function(t,e,n){e.Z=n.p+"assets/images/hl-em1-d9a0df246ec1ba68b8f1291a97cecbe8.PNG"},32948:function(t,e,n){e.Z=n.p+"assets/images/vl-em-attr-00b6327c5626b5693b8b7c798be3d916.PNG"},4339:function(t,e,n){e.Z=n.p+"assets/images/vl-em2-1e5f185f6205a876b5787304f64f44c8.PNG"}}]);