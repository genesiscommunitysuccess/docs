"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[11119],{48433:function(e,t,n){n.r(t),n.d(t,{assets:function(){return b},contentTitle:function(){return r},default:function(){return d},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return c}});var o=n(87462),i=n(63366),a=(n(67294),n(3905)),s=(n(61839),["components"]),l={title:"Web Components - Listbox",sidebar_label:"Listbox",id:"listbox",keywords:["web","web components","listbox"],tags:["web","web components","listbox"]},r=void 0,p={unversionedId:"web/web-components/interaction/listbox",id:"web/web-components/interaction/listbox",title:"Web Components - Listbox",description:'An implementation of a listbox. While any DOM content is permissible as a child of the listbox, only alpha-option elements, option elements, and slotted items with role="option" will be treated as options and receive keyboard support.',source:"@site/docs/04_web/02_web-components/03_interaction/06_listbox.md",sourceDirName:"04_web/02_web-components/03_interaction",slug:"/web/web-components/interaction/listbox",permalink:"/next/web/web-components/interaction/listbox",draft:!1,tags:[{label:"web",permalink:"/next/tags/web"},{label:"web components",permalink:"/next/tags/web-components"},{label:"listbox",permalink:"/next/tags/listbox"}],version:"current",sidebarPosition:6,frontMatter:{title:"Web Components - Listbox",sidebar_label:"Listbox",id:"listbox",keywords:["web","web components","listbox"],tags:["web","web components","listbox"]},sidebar:"frontendSidebar",previous:{title:"Flipper",permalink:"/next/web/web-components/interaction/flipper"},next:{title:"Menu",permalink:"/next/web/web-components/interaction/menu"}},b={},c=[{value:"Set-up",id:"set-up",level:2},{value:"Usage",id:"usage",level:2},{value:"Additional resources",id:"additional-resources",level:2}],m={toc:c};function d(e){var t=e.components,n=(0,i.Z)(e,s);return(0,a.kt)("wrapper",(0,o.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"An implementation of a ",(0,a.kt)("a",{parentName:"p",href:"https://w3c.github.io/aria-practices/#Listbox"},"listbox"),". While any DOM content is permissible as a child of the listbox, only ",(0,a.kt)("a",{parentName:"p",href:"/web/web-components/form/option/"},(0,a.kt)("inlineCode",{parentName:"a"},"alpha-option"))," elements, ",(0,a.kt)("inlineCode",{parentName:"p"},"option")," elements, and slotted items with ",(0,a.kt)("inlineCode",{parentName:"p"},'role="option"')," will be treated as options and receive keyboard support."),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"listbox")," component has no internals related to form association. For a form-associated ",(0,a.kt)("inlineCode",{parentName:"p"},"listbox"),", see the ",(0,a.kt)("a",{parentName:"p",href:"/web/web-components/form/select/"},(0,a.kt)("inlineCode",{parentName:"a"},"alpha-select")," component"),"."),(0,a.kt)("h2",{id:"set-up"},"Set-up"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { provideDesignSystem, alphaListbox, alphaOption } from '@genesislcap/alpha-design-system';\n\nprovideDesignSystem().register(alphaListbox(), alphaOption());\n")),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html",metastring:"live",live:!0},'<div>\n  <label id="preferred-format">Preferred Format:</label><br />\n  <alpha-listbox aria-labelledby="preferred-format" name="preferred-format">\n    <alpha-option value="vinyl">Vinyl Record</alpha-option>\n    <alpha-option value="casette">Casette</alpha-option>\n    <alpha-option value="cd">Compact Disc</alpha-option>\n    <alpha-option value="digital">Digital</alpha-option>\n  </alpha-listbox>\n</div>\n')),(0,a.kt)("h2",{id:"additional-resources"},"Additional resources"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://w3c.github.io/aria-practices/#Listbox"},"W3C Component Aria Practices"))))}d.isMDXComponent=!0}}]);