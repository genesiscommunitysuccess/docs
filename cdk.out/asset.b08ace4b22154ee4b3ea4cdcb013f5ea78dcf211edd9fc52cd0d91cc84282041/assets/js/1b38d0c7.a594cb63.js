"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[48361],{85162:function(e,n,t){t.d(n,{Z:function(){return r}});var a=t(67294),s=t(86010),o="tabItem_Ymn6";function r(e){var n=e.children,t=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",className:(0,s.Z)(o,r),hidden:t},n)}},65488:function(e,n,t){t.d(n,{Z:function(){return m}});var a=t(87462),s=t(67294),o=t(86010),r=t(72389),l=t(67392),i=t(7094),u=t(12466),p="tabList__CuJ",c="tabItem_LNqP";function d(e){var n,t,r=e.lazy,d=e.block,m=e.defaultValue,y=e.values,g=e.groupId,f=e.className,h=s.Children.map(e.children,(function(e){if((0,s.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=y?y:h.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),b=(0,l.l)(v,(function(e,n){return e.value===n.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===m?m:null!=(n=null!=m?m:null==(t=h.find((function(e){return e.props.default})))?void 0:t.props.value)?n:h[0].props.value;if(null!==k&&!v.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var T=(0,i.U)(),w=T.tabGroupChoices,N=T.setTabGroupChoices,_=(0,s.useState)(k),S=_[0],x=_[1],Z=[],z=(0,u.o5)().blockElementScrollPositionUntilNextRender;if(null!=g){var E=w[g];null!=E&&E!==S&&v.some((function(e){return e.value===E}))&&x(E)}var I=function(e){var n=e.currentTarget,t=Z.indexOf(n),a=v[t].value;a!==S&&(z(n),x(a),null!=g&&N(g,String(a)))},C=function(e){var n,t=null;switch(e.key){case"ArrowRight":var a,s=Z.indexOf(e.currentTarget)+1;t=null!=(a=Z[s])?a:Z[0];break;case"ArrowLeft":var o,r=Z.indexOf(e.currentTarget)-1;t=null!=(o=Z[r])?o:Z[Z.length-1]}null==(n=t)||n.focus()};return s.createElement("div",{className:(0,o.Z)("tabs-container",p)},s.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":d},f)},v.map((function(e){var n=e.value,t=e.label,r=e.attributes;return s.createElement("li",(0,a.Z)({role:"tab",tabIndex:S===n?0:-1,"aria-selected":S===n,key:n,ref:function(e){return Z.push(e)},onKeyDown:C,onFocus:I,onClick:I},r,{className:(0,o.Z)("tabs__item",c,null==r?void 0:r.className,{"tabs__item--active":S===n})}),null!=t?t:n)}))),r?(0,s.cloneElement)(h.filter((function(e){return e.props.value===S}))[0],{className:"margin-top--md"}):s.createElement("div",{className:"margin-top--md"},h.map((function(e,n){return(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==S})}))))}function m(e){var n=(0,r.Z)();return s.createElement(d,(0,a.Z)({key:String(n)},e))}},1544:function(e,n,t){t.r(n),t.d(n,{assets:function(){return d},contentTitle:function(){return p},default:function(){return g},frontMatter:function(){return u},metadata:function(){return c},toc:function(){return m}});var a=t(87462),s=t(63366),o=(t(67294),t(3905)),r=(t(61839),t(65488)),l=t(85162),i=["components"],u={title:"Design System Tokens - Typography",sidebar_label:"Typography",id:"typography",keywords:["web","design system","tokens","typography"],tags:["web","design system","tokens","typography"]},p=void 0,c={unversionedId:"web/design-systems/tokens/typography",id:"version-2022.3/web/design-systems/tokens/typography",title:"Design System Tokens - Typography",description:"You can adjust any of the defaults in the src/_config/values folder of your design system.",source:"@site/versioned_docs/version-2022.3/04_web/03_design-systems/05_tokens/02_typography.md",sourceDirName:"04_web/03_design-systems/05_tokens",slug:"/web/design-systems/tokens/typography",permalink:"/web/design-systems/tokens/typography",draft:!1,tags:[{label:"web",permalink:"/tags/web"},{label:"design system",permalink:"/tags/design-system"},{label:"tokens",permalink:"/tags/tokens"},{label:"typography",permalink:"/tags/typography"}],version:"2022.3",sidebarPosition:2,frontMatter:{title:"Design System Tokens - Typography",sidebar_label:"Typography",id:"typography",keywords:["web","design system","tokens","typography"],tags:["web","design system","tokens","typography"]},sidebar:"frontendSidebar",previous:{title:"Colour",permalink:"/web/design-systems/tokens/colour"},next:{title:"Sizing",permalink:"/web/design-systems/tokens/sizing"}},d={},m=[{value:"Body font",id:"body-font",level:2},{value:"Usage in your code",id:"usage-in-your-code",level:3},{value:"Font sizes and line heights",id:"font-sizes-and-line-heights",level:2},{value:"Usage in your code",id:"usage-in-your-code-1",level:3}],y={toc:m};function g(e){var n=e.components,t=(0,s.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},y,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"You can adjust any of the defaults in the ",(0,o.kt)("inlineCode",{parentName:"p"},"src/_config/values")," folder of your design system."),(0,o.kt)("h2",{id:"body-font"},"Body font"),(0,o.kt)("p",null,"This the base typeface for most of the components. You can modify the default as needed."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"export const bodyFontValue = '\"Segoe UI\", Arial, Helvetica, sans-serif';\n")),(0,o.kt)("h3",{id:"usage-in-your-code"},"Usage in your code"),(0,o.kt)(r.Z,{defaultValue:"css",values:[{label:"CSS",value:"css"},{label:"JavaScript",value:"token"}],mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"css",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-css"},"font-family: var(--body-font);\n"))),(0,o.kt)(l.Z,{value:"token",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import {bodyFont} from '@genesislcap/alpha-design-system';\n\nconst styles = css`\n  :host {\n    font-family: ${bodyFont};\n}`;\n")))),(0,o.kt)("h2",{id:"font-sizes-and-line-heights"},"Font sizes and line heights"),(0,o.kt)("p",null,"This is a group of variables describing the font size and line-height hierarchy."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"export const typeRampBaseFontSizeValue = '14px';\nexport const typeRampBaseLineHeightValue = '20px';\n// ... remaining variables\n")),(0,o.kt)("h3",{id:"usage-in-your-code-1"},"Usage in your code"),(0,o.kt)(r.Z,{defaultValue:"css",values:[{label:"CSS",value:"css"},{label:"JavaScript",value:"token"}],mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"css",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-css"},"font-size: var(--type-ramp-minus-1-font-size);\nline-height: var(--type-ramp-minus-1-line-height);\n"))),(0,o.kt)(l.Z,{value:"token",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import {typeRampMinus1FontSize, typeRampMinus1LineHeight} from '@genesislcap/alpha-design-system';\n\nconst styles = css`\n  :host {\n    font-size: ${typeRampMinus1FontSize};\n    line-height: ${typeRampMinus1LineHeight};\n}`;\n")))),(0,o.kt)("p",null,(0,o.kt)("typography-tokens",null)))}g.isMDXComponent=!0}}]);