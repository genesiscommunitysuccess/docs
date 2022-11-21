"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[22562],{40612:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return s},default:function(){return u},frontMatter:function(){return r},metadata:function(){return d},toc:function(){return p}});var a=n(87462),o=n(63366),l=(n(67294),n(3905)),i=(n(61839),["components"]),r={title:"Go to the next level - Create a form to input data",sidebar_label:"Create a form to input data",id:"forms",keywords:["getting started","quick start","next level","forms"],tags:["getting started","quick start","next level","forms"]},s=void 0,d={unversionedId:"getting-started/go-to-the-next-level/forms",id:"getting-started/go-to-the-next-level/forms",title:"Go to the next level - Create a form to input data",description:"Section objectives",source:"@site/docs/01_getting-started/03_go-to-the-next-level/06_forms.md",sourceDirName:"01_getting-started/03_go-to-the-next-level",slug:"/getting-started/go-to-the-next-level/forms",permalink:"/next/getting-started/go-to-the-next-level/forms",draft:!1,tags:[{label:"getting started",permalink:"/next/tags/getting-started"},{label:"quick start",permalink:"/next/tags/quick-start"},{label:"next level",permalink:"/next/tags/next-level"},{label:"forms",permalink:"/next/tags/forms"}],version:"current",sidebarPosition:6,frontMatter:{title:"Go to the next level - Create a form to input data",sidebar_label:"Create a form to input data",id:"forms",keywords:["getting started","quick start","next level","forms"],tags:["getting started","quick start","next level","forms"]},sidebar:"learningSidebar",previous:{title:"Data Grid",permalink:"/next/getting-started/go-to-the-next-level/data-grid"},next:{title:"Calculated data using derived fields",permalink:"/next/getting-started/go-to-the-next-level/calculated-data"}},m={},p=[{value:"Section objectives",id:"section-objectives",level:2},{value:"Interacting with the Event Handler",id:"interacting-with-the-event-handler",level:2},{value:"Adding customisation",id:"adding-customisation",level:2},{value:"Adding selection options",id:"adding-selection-options",level:2},{value:"Enabling the user to insert",id:"enabling-the-user-to-insert",level:2}],c={toc:p};function u(e){var t=e.components,r=(0,o.Z)(e,i);return(0,l.kt)("wrapper",(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h2",{id:"section-objectives"},"Section objectives"),(0,l.kt)("p",null,"The goal of this section is to add a form that enables us to insert trades into our database."),(0,l.kt)("h2",{id:"interacting-with-the-event-handler"},"Interacting with the Event Handler"),(0,l.kt)("p",null,"To interact with the Event Handler that you created ",(0,l.kt)("a",{parentName:"p",href:"/getting-started/go-to-the-next-level/events#event-handler"},"previously"),", you will now create a form that will collect the data from the user."),(0,l.kt)("p",null,"Start with the Form component, which will generate all the inputs based on the API:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-html",metastring:"title='home.template.ts'",title:"'home.template.ts'"},'<zero-form\n  resourceName="EVENT_TRADE_INSERT"\n></zero-form>\n')),(0,l.kt)("p",null,"To respond to the user clicking on the ",(0,l.kt)("strong",{parentName:"p"},"Submit")," button, you need to call the ",(0,l.kt)("inlineCode",{parentName:"p"},"EVENT_TRADE_INSERT")," event:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-html",metastring:"{3} title='home.template.ts'","{3}":!0,title:"'home.template.ts'"},'<zero-form\n  resourceName="EVENT_TRADE_INSERT"\n  @submit=${(x, c) => x.insertTrade(c.event as CustomEvent)}\n></zero-form>\n')),(0,l.kt)("p",null,"Define the ",(0,l.kt)("inlineCode",{parentName:"p"},"insertTrade")," function in the file ",(0,l.kt)("strong",{parentName:"p"},"home.ts"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-typescript",metastring:"title='home.ts'",title:"'home.ts'"},"  import {Connect} from '@genesislcap/foundation-comms';\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-typescript",metastring:"title='home.ts'",title:"'home.ts'"},"  @Connect connect: Connect;\n\n  public async insertTrade(event) {\n    const formData = event.detail.payload;\n    const insertTradeEvent = await this.connect.commitEvent('EVENT_TRADE_INSERT', {\n      DETAILS: {\n        COUNTERPARTY_ID: 'GENESIS',\n        INSTRUMENT_ID: formData.INSTRUMENT_ID,\n        QUANTITY: formData.QUANTITY,\n        PRICE: formData.PRICE,\n        SIDE: formData.SIDE,\n        TRADE_DATETIME: Date.now(),\n      },\n    });\n  }\n")),(0,l.kt)("p",null,"After refreshing your application, a form should be displayed. The form might sit on top of the grid or by itself, depending on whether you appended to or replaced the already existing xml in ",(0,l.kt)("strong",{parentName:"p"},"home.template.ts"),"."),(0,l.kt)("p",null,(0,l.kt)("img",{src:n(76538).Z,width:"1901",height:"957"})),(0,l.kt)("h2",{id:"adding-customisation"},"Adding customisation"),(0,l.kt)("p",null,"What we have done so far is good for simple forms or prototyping, but what if we need much more customisation?\nLet's replace the form and code elements above with a more configurable solution."),(0,l.kt)("p",null,"To do this, you must create each form element manually and take care of storing the data input by the user."),(0,l.kt)("p",null,"Start by adding the elements to the template. Instead of the ",(0,l.kt)("inlineCode",{parentName:"p"},"<zero-form>")," above, replace it with the following:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-html",metastring:"title='home.template.ts'",title:"'home.template.ts'"},'<zero-text-field>Quantity</zero-text-field>\n<zero-text-field type="number">Price</zero-text-field>\n<span>Instrument</span>\n<zero-select></zero-select>\n<span>Side</span>\n<zero-select></zero-select>\n')),(0,l.kt)("p",null,"Then, define the variables that will hold the values that the user enters:"),(0,l.kt)("p",null,"In the file ",(0,l.kt)("strong",{parentName:"p"},"home.ts"),", add the following properties to the class: ",(0,l.kt)("inlineCode",{parentName:"p"},"Home"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title='home.ts'",title:"'home.ts'"},"@observable public quantity: string;\n@observable public price: string;\n@observable public instrument: string;\n@observable public side: string = 'BUY';\n")),(0,l.kt)("p",null,"Now we need to interact with the Event Handlers that respond to user changes and also store the inputted data:"),(0,l.kt)("p",null,"We can do it in the traditional way by adding ",(0,l.kt)("inlineCode",{parentName:"p"},"@change")," ",(0,l.kt)("a",{parentName:"p",href:"https://www.fast.design/docs/fast-element/declaring-templates#events"},"Event Handler")," - but we can also use the ",(0,l.kt)("inlineCode",{parentName:"p"},"sync")," directive, which does that for us automaticallly."),(0,l.kt)("p",null,"Let's add it to each form element:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title='home.template.ts'",title:"'home.template.ts'"},"import {sync} from '@genesislcap/foundation-utils';\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-html",metastring:"{2,7,13,18} title='home.template.ts'","{2,7,13,18}":!0,title:"'home.template.ts'"},"<zero-text-field \n  :value=${sync(x=> x.quantity)}\n>\n  Quantity\n</zero-text-field>\n<zero-text-field \n  :value=${sync(x=> x.price)}\n>\n  Price\n</zero-text-field>\n<span>Instrument</span>\n<zero-select \n  :value=${sync(x=> x.instrument)}\n>\n</zero-select>\n<span>Side</span>\n<zero-select \n  :value=${sync(x=> x.side)}\n>\n</zero-select>\n")),(0,l.kt)("p",null,"You can now refresh your application; it should look something like this:"),(0,l.kt)("p",null,(0,l.kt)("img",{src:n(82858).Z,width:"1913",height:"961"})),(0,l.kt)("admonition",{type:"note"},(0,l.kt)("p",{parentName:"admonition"},"The data in your grids may vary from the data in the example. You may also only see one grid or none at all, depending on whether you replaced or appended the xml before this.")),(0,l.kt)("h2",{id:"adding-selection-options"},"Adding selection options"),(0,l.kt)("p",null,"You probably realise that we don't have any options in our select components, so let's fix that now."),(0,l.kt)("p",null,"To enter a new trade, we want the user to be able to select:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"side (buy or sell)"),(0,l.kt)("li",{parentName:"ul"},"the instrument to be traded")),(0,l.kt)("p",null,"We will start with side, as it only has two static options: BUY and SELL. We just need to add those two options inside the select tag:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-html",metastring:"title='home.template.ts'",title:"'home.template.ts'"},"<zero-select :value=${sync(x=> x.side)}>\n    <zero-option>BUY</zero-option>\n    <zero-option>SELL</zero-option>\n</zero-select>\n")),(0,l.kt)("p",null,"To enable the user to select the instrument, it's more complicated, because a list of options needs to be fetched from the API."),(0,l.kt)("p",null,"We will do that in ",(0,l.kt)("a",{parentName:"p",href:"https://www.fast.design/docs/fast-element/defining-elements#the-element-lifecycle"},"connectedCallback"),", which happens when an element is inserted into the DOM.\nFirst, declare ",(0,l.kt)("inlineCode",{parentName:"p"},"tradeInstruments"),". This will be used in the template later."),(0,l.kt)("p",null,"To get the data from the API, inject:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-typescript",metastring:"title='home.ts'",title:"'home.ts'"},"@observable tradeInstruments: Array<{value: string, label: string}>;\n@Connect connect: Connect;\npublic async connectedCallback() {\n    super.connectedCallback();\n    \n    const tradeInstrumentsRequest = await this.connect.request('INSTRUMENT');\n    this.tradeInstruments = tradeInstrumentsRequest.REPLY?.map(instrument => ({value: instrument.INSTRUMENT_ID, label: instrument.INSTRUMENT_ID}));\n    this.instrument = this.tradeInstruments[0].value;\n}\n")),(0,l.kt)("p",null,"Once we have the data with the list of instruments, we can make use of it in the template file.\nTo dynamically include a list of instruments, use the ",(0,l.kt)("a",{parentName:"p",href:"https://www.fast.design/docs/fast-element/using-directives#the-repeat-directive"},"repeat")," directive and iterate through the items."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-typescript",metastring:"title='home.template.ts'",title:"'home.template.ts'"},"<zero-select :value=${sync(x=> x.instrument)}>\n  ${repeat(x => x.tradeInstruments, html`\n    <zero-option value=${x => x.value}>${x => x.label}</zero-option>\n  `)}\n</zero-select>\n")),(0,l.kt)("h2",{id:"enabling-the-user-to-insert"},"Enabling the user to insert"),(0,l.kt)("p",null,"Now we have the data that can be selected, we need the user to be able to submit the trade:"),(0,l.kt)("p",null,"Create a simple button with a click event handler:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-html",metastring:"title='home.template.ts'",title:"'home.template.ts'"},"<zero-button @click=${x=> x.insertTrade()}>Add Trade</zero-button>\n")),(0,l.kt)("p",null,"Then create a new API call to insert the trade:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-typescript",metastring:"title='home.ts'",title:"'home.ts'"},"public async insertTrade() {\n  const insertTradeRequest = await this.connect.commitEvent('EVENT_TRADE_INSERT', {\n    DETAILS: {\n      COUNTERPARTY_ID: 'GENESIS',\n      INSTRUMENT_ID: this.instrument,\n      QUANTITY: this.quantity,\n      PRICE: this.price,\n      SIDE: this.side,\n      TRADE_DATETIME: Date.now(),\n    },\n    IGNORE_WARNINGS: true,\n    VALIDATE: false,\n  });\n}\n")),(0,l.kt)("p",null," Let's add another data grid at the bottom of the page to show the trade view ",(0,l.kt)("inlineCode",{parentName:"p"},"ALL_TRADES"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-html",metastring:"title='home.template.ts'",title:"'home.template.ts'"},'  <zero-grid-pro>\n      <grid-pro-genesis-datasource\n          resourceName="ALL_TRADES"\n          orderBy="INSTRUMENT_ID">\n      </grid-pro-genesis-datasource>\n  </zero-grid-pro>\n')),(0,l.kt)("p",null,"Now if everything has worked, you can go to your browser, insert the data for a new trade, and then click the button. The new trade displays in the data grid of the trade view ",(0,l.kt)("inlineCode",{parentName:"p"},"ALL_TRADES")," at the bottom of the page."))}u.isMDXComponent=!0},82858:function(e,t,n){t.Z=n.p+"assets/images/position-form-6de8841d186b71e58a2592b7739cf99c.png"},76538:function(e,t,n){t.Z=n.p+"assets/images/trade-insert-form-8d8218e88f051f4883d83e6eebab0a94.png"}}]);