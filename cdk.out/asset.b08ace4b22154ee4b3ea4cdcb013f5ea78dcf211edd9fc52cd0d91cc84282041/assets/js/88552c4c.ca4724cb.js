"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[48953],{96359:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return c},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return m}});var a=n(87462),r=n(63366),i=(n(67294),n(3905)),o=(n(61839),["components"]),s={title:"Web Developer Training - Day 2",sidebar_label:"Day two",sidebar_position:4,id:"web-training-day2",keywords:["getting started","developer training","web training","day two"],tags:["getting started","developer training","server training","day two"]},l="Day 2 agenda",d={unversionedId:"getting-started/web-training/web-training-day2",id:"getting-started/web-training/web-training-day2",title:"Web Developer Training - Day 2",description:"Complex forms, data entry components, introduction to Genesis Foundation Comms lib.",source:"@site/docs/01_getting-started/10_web-training/02_web-training-day2.md",sourceDirName:"01_getting-started/10_web-training",slug:"/getting-started/web-training/web-training-day2",permalink:"/next/getting-started/web-training/web-training-day2",draft:!1,tags:[{label:"getting started",permalink:"/next/tags/getting-started"},{label:"developer training",permalink:"/next/tags/developer-training"},{label:"server training",permalink:"/next/tags/server-training"},{label:"day two",permalink:"/next/tags/day-two"}],version:"current",sidebarPosition:4,frontMatter:{title:"Web Developer Training - Day 2",sidebar_label:"Day two",sidebar_position:4,id:"web-training-day2",keywords:["getting started","developer training","web training","day two"],tags:["getting started","developer training","server training","day two"]},sidebar:"learningSidebar",previous:{title:"Day one",permalink:"/next/getting-started/web-training/web-training-day1"},next:{title:"Day three",permalink:"/next/getting-started/web-training/web-training-day3"}},p={},m=[{value:"Orders screen",id:"orders-screen",level:2},{value:"Requirements",id:"requirements",level:3},{value:"Fields",id:"fields",level:4},{value:"Actions",id:"actions",level:4},{value:"Adding the new Order modal",id:"adding-the-new-order-modal",level:3},{value:"Introducing Genesis Foundation Comms lib",id:"introducing-genesis-foundation-comms-lib",level:3},{value:"Creating a custom form",id:"creating-a-custom-form",level:3},{value:"Loading data from the server into the select fields",id:"loading-data-from-the-server-into-the-select-fields",level:4},{value:"Loading Market Data",id:"loading-market-data",level:4},{value:"Exercise 2.1: using Foundation Comms",id:"exercise-21-using-foundation-comms",level:3},{value:"Sending the data",id:"sending-the-data",level:3},{value:"Adding a simple Orders data grid",id:"adding-a-simple-orders-data-grid",level:3},{value:"Exercise 2.2: customizing order entry further",id:"exercise-22-customizing-order-entry-further",level:3},{value:"Exercise 2.3: revamp the Trade screen",id:"exercise-23-revamp-the-trade-screen",level:3}],u={toc:m};function c(e){var t=e.components,n=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"day-2-agenda"},"Day 2 agenda"),(0,i.kt)("p",null,"Complex forms, data entry components, introduction to Genesis Foundation Comms lib."),(0,i.kt)("h2",{id:"orders-screen"},"Orders screen"),(0,i.kt)("p",null,"Let's continue the development of our web app creating an order screen. We're going to work on these files:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},(0,i.kt)("em",{parentName:"strong"},"order.template.ts"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},(0,i.kt)("em",{parentName:"strong"},"order.ts"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},(0,i.kt)("em",{parentName:"strong"},"order.styles.ts")))),(0,i.kt)("p",null,"You should have created these files in the last exercise of the previous day of the training with the navigation bar pointing to them as well."),(0,i.kt)("p",null,"Now, let's replace the dummy content of these files with the actual implementation we want."),(0,i.kt)("h3",{id:"requirements"},"Requirements"),(0,i.kt)("p",null,"The goal of our app is to list all the orders with some filters and actions to insert a new order, edit an existing order and cancel an order."),(0,i.kt)("h4",{id:"fields"},"Fields"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Field"),(0,i.kt)("th",{parentName:"tr",align:null},"Type"),(0,i.kt)("th",{parentName:"tr",align:null},"Editable"),(0,i.kt)("th",{parentName:"tr",align:null},"Notes"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"Instrument"),(0,i.kt)("td",{parentName:"tr",align:null},"Select or Search (autocomplete field)"),(0,i.kt)("td",{parentName:"tr",align:null},"Yes"),(0,i.kt)("td",{parentName:"tr",align:null},"Load data from ALL_INTRUMENTS Data Server")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"Market data"),(0,i.kt)("td",{parentName:"tr",align:null},"Display price of the selected symbol"),(0,i.kt)("td",{parentName:"tr",align:null},"No"),(0,i.kt)("td",{parentName:"tr",align:null},"Load data from INSTRUMENT_MARKET_DATA ReqRep")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"Quantity"),(0,i.kt)("td",{parentName:"tr",align:null},"Integer"),(0,i.kt)("td",{parentName:"tr",align:null},"Yes"),(0,i.kt)("td",{parentName:"tr",align:null},"Must be positive")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"Price"),(0,i.kt)("td",{parentName:"tr",align:null},"Double"),(0,i.kt)("td",{parentName:"tr",align:null},"Yes"),(0,i.kt)("td",{parentName:"tr",align:null},"Must be positive")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"Total"),(0,i.kt)("td",{parentName:"tr",align:null},"Double"),(0,i.kt)("td",{parentName:"tr",align:null},"No"),(0,i.kt)("td",{parentName:"tr",align:null},"Display Quantity * Price")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"Side"),(0,i.kt)("td",{parentName:"tr",align:null},"Dropdown"),(0,i.kt)("td",{parentName:"tr",align:null},"Yes"),(0,i.kt)("td",{parentName:"tr",align:null},"Display types from ENUM SIDE")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"Notes"),(0,i.kt)("td",{parentName:"tr",align:null},"String"),(0,i.kt)("td",{parentName:"tr",align:null},"Yes"),(0,i.kt)("td",{parentName:"tr",align:null},"Free text up to 50 chars")))),(0,i.kt)("h4",{id:"actions"},"Actions"),(0,i.kt)("p",null,"Insert, edit and cancel."),(0,i.kt)("h3",{id:"adding-the-new-order-modal"},"Adding the new Order modal"),(0,i.kt)("p",null,"Let's start with the simplest way to create a form, using the ",(0,i.kt)("inlineCode",{parentName:"p"},"zero-form")," component:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6} title='order.template.ts'","{6}":!0,title:"'order.template.ts'"},'import type {Order} from \'./order\';\n\nexport const OrderTemplate = html<Order>`\n<div class="split-layout">\n    <div class="top-layout">\n      <zero-form class="order-entry-form" resourceName="EVENT_ORDER_INSERT"></zero-form>\n    </div> \n</div>\n`;\n')),(0,i.kt)("p",null,"This component is able to retrieve the meta-data from the ",(0,i.kt)("inlineCode",{parentName:"p"},"EVENT_INSERT_ORDER")," backend resource (an Event Handler) and automatically builds a simple form for you. In simple scenarios, it can be good enough."),(0,i.kt)("p",null,"Try to run it now and you'll notice that, even though the form is displayed, nothing happens when you click on Submit. We have to bind the submit button to a function, like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html",metastring:"{3} title='order.template.ts'","{3}":!0,title:"'order.template.ts'"},'<zero-form\n  resourceName="EVENT_INSERT_ORDER"\n  @submit=${(x, c) => x.insertOrder(c.event as CustomEvent)}\n></zero-form>\n')),(0,i.kt)("admonition",{title:"what is the @submit=${(x, c)} ?",type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"This is related to binding as we briefly explained in the previous day. If it's still unclear, make sure to check ",(0,i.kt)("a",{parentName:"p",href:"https://www.fast.design/docs/fast-element/declaring-templates#understanding-bindings"},"Understanding bindings")," and ",(0,i.kt)("a",{parentName:"p",href:"https://www.fast.design/docs/fast-element/declaring-templates#events"},"Events"))),(0,i.kt)("p",null,"We define ",(0,i.kt)("inlineCode",{parentName:"p"},"insertOrder")," function in order.ts"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:"{1,3,7} title='order.ts'","{1,3,7}":!0,title:"'order.ts'"},"  import {Connect} from '@genesislcap/foundation-comms';\n  \n  @Connect connect: Connect;\n\n  public async insertOrder(event) {\n    const formData = event.detail;\n    const insertOrderEvent = await this.connect.commitEvent('EVENT_ORDER_INSERT', {\n      DETAILS: {\n        INSTRUMENT_ID: formData.INSTRUMENT_ID,\n        QUANTITY: formData.QUANTITY,\n        PRICE: formData.PRICE,\n        SIDE: formData.SIDE,\n        NOTES: formData.NOTES,\n      },\n    });\n  }\n")),(0,i.kt)("h3",{id:"introducing-genesis-foundation-comms-lib"},"Introducing Genesis Foundation Comms lib"),(0,i.kt)("p",null,"As you can see in the ",(0,i.kt)("inlineCode",{parentName:"p"},"insertOrder")," code, we are importing ",(0,i.kt)("inlineCode",{parentName:"p"},"Connect")," from ",(0,i.kt)("inlineCode",{parentName:"p"},"@genesislcap/foundation-comms"),", which is Genesis core communication system with the server."),(0,i.kt)("admonition",{title:"full flexibility",type:"info"},(0,i.kt)("p",{parentName:"admonition"},"You can use the foundation-comms in any modern web app, based on FAST or not. This gives you full flexibility on how to interact with the server without, necessarily, relying on the UI components provided."),(0,i.kt)("p",{parentName:"admonition"},"Alternatively, you could use any HTTP client to access the server resources as they are exposed as HTTP endpoints as well. However, we strongly encourage the use of Foundation Comms as it handles things like the web socket connection, authentication and authorization, data subscription and so on.")),(0,i.kt)("p",null,"One of the key objects provided by the Foundation Comms is the ",(0,i.kt)("inlineCode",{parentName:"p"},"Connect")," object whose main methods are:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"p"},"connect"),":\nconnects to the server through a web socket (when WS is available or http as fallback). You must pass the server host URL. In most apps, such as the one we're building in this training, the connection is already handled by the MainApplication component on initilization relying on the ",(0,i.kt)("a",{parentName:"p",href:"/getting-started/web-training/web-training-day1/#config"},"config")," provided by the app.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"p"},"commitEvent"),":\nuse it to call event handlers on the server. You must pass the name of the event and an object with the input data required by the event. This data must be in JSON format with key ",(0,i.kt)("strong",{parentName:"p"},"DETAILS"),". See the example above of the ",(0,i.kt)("inlineCode",{parentName:"p"},"insertOrder")," function.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"p"},"getMetadata"),": it retrieves the metadata of a resource, that can be an event handler, data server query or a request server. When we used the ",(0,i.kt)("strong",{parentName:"p"},"zero-form")," component previously, for example, it used internally getMetadata passing the event handler name to get all the input fields of the event.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"p"},"request"),": use it to call a ",(0,i.kt)("a",{parentName:"p",href:"/server/request-server/introduction/"},"request server")," resource. You must pass the request server resource name.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"p"},"snapshot")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"stream"),": use them to get a snapshot of data or to stream data in real time from a resource (usually, a data server query)."))),(0,i.kt)("p",null,"Those are the most common features from Foundation Comms you will use. We're going to use most of them and give more practical examples througout the training. However, please note that there are more components provided by Foundation Comms such as Auth, Session, User, Analytics. Feel free to import these components and explore their methods to get a sense of what's provided."),(0,i.kt)("h3",{id:"creating-a-custom-form"},"Creating a custom form"),(0,i.kt)("p",null,"Using ",(0,i.kt)("inlineCode",{parentName:"p"},"zero-form")," is good for simple forms or prototyping, but we might realise that it is not enough for our use case, and we require much more customisation."),(0,i.kt)("p",null,"To enable that you will create each form element manually and take care of storing user inputted data."),(0,i.kt)("p",null,"You start by adding elements to the template:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title='order.template.ts'",title:"'order.template.ts'"},'export const OrderTemplate = html<Order>`\n<zero-select>Instrument</zero-select>\n<label>Last price</label>\n<zero-text-field type="number">Quantity</zero-text-field>\n<zero-text-field type="number">Price</zero-text-field>\n<label>Total</label>\n<zero-select>Side</zero-select>\n<zero-text-area>Notes</zero-text-area>\n`;\n')),(0,i.kt)("admonition",{title:"form style",type:"info"},(0,i.kt)("p",{parentName:"admonition"},"We're just showing the relevant code for the functionality we're building. Feel free to surround the elements with ",(0,i.kt)("inlineCode",{parentName:"p"},"div")," or use any other resource to make your form look good.")),(0,i.kt)("p",null,"Then, define the variables that will hold the values that are entered."),(0,i.kt)("p",null,"In the file ",(0,i.kt)("strong",{parentName:"p"},"order.ts"),", add the following properties to the class: ",(0,i.kt)("inlineCode",{parentName:"p"},"Order"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title='order.ts'",title:"'order.ts'"},"@observable public instrument: string;\n@observable public lastPrice: number;\n@observable public quantity: number;\n@observable public price: number;\n@observable public side: string;\n@observable public notes: string;\n")),(0,i.kt)("p",null,"Now we need to add event handlers that would respond to user changes and store the inputted data."),(0,i.kt)("p",null,"We can do it in the traditional way by adding ",(0,i.kt)("inlineCode",{parentName:"p"},"@change")," ",(0,i.kt)("a",{parentName:"p",href:"https://www.fast.design/docs/fast-element/declaring-templates#events"},"event handler")," or we can use the ",(0,i.kt)("inlineCode",{parentName:"p"},"sync")," directive from Genesis Foundation Utls that would do that for us."),(0,i.kt)("p",null,"Let's add it to each form element:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title='order.template.ts'",title:"'order.template.ts'"},"import { sync } from '@genesislcap/foundation-utils';\n\nexport const OrderTemplate = html<Order>`\n<span>Instrument</span>\n<zero-select :value=${sync(x=> x.instrument)}></zero-select>\n\n<span>Last price: ${x => x.lastPrice}</span>\n<zero-text-field :value=${sync(x=> x.quantity)}>Quantity</zero-text-field>\n<zero-text-field :value=${sync(x=> x.price)}>Price</zero-text-field>\n<span>Total: ${x => x.quantity * x.price}</span>\n<span>Side</span>\n<zero-select :value=${sync(x=> x.side)}>Side</zero-select>\n<zero-text-area :value=${sync(x=> x.notes)}>Notes</zero-text-area>\n`;\n")),(0,i.kt)("p",null,"Note that we have also added the calculation of the ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"total"))," field that doesn't require a property in the Order class. It's just an information on the screen that should not be sent to the server."),(0,i.kt)("p",null,"You probably realized we don't have any options in our select components, so let's fix that now."),(0,i.kt)("h4",{id:"loading-data-from-the-server-into-the-select-fields"},"Loading data from the server into the select fields"),(0,i.kt)("p",null,"Let's start with ",(0,i.kt)("strong",{parentName:"p"},"instrument")," field. We want to load the data once Order the component is initialized so, then, the ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"select"))," field can just iterate through the list of instruments loaded from the server. "),(0,i.kt)("p",null,"Order is a Web Component and, as such, it supports a series of ",(0,i.kt)("a",{parentName:"p",href:"https://www.fast.design/docs/fast-element/defining-elements/#the-element-lifecycle"},"lifecycle events")," that you can tap into to execute custom code at specific points in time. To make the Order component load data on initilization, we can override one of the lifecycle events called ",(0,i.kt)("inlineCode",{parentName:"p"},"connectedCallback")," that runs when the element is inserted into the DOM."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:"{6} title='order.ts'","{6}":!0,title:"'order.ts'"},"@observable public allInstruments: Array<{value: string, label: string}>; //add this property\n\npublic async connectedCallback() { //add this method to Order class\n    super.connectedCallback(); //FASTElement implementation\n\n    const msg = await this.connect.snapshot('ALL_INSTRUMENTS'); //get a snapshot of data from ALL_INTRUMENTS data server\n    console.log(msg); //add this to look into the data returned and understand its structure\n    this.allInstruments = msg.ROW?.map(instrument => ({\n      value: instrument.INSTRUMENT_ID, label: instrument.NAME}));\n  }\n")),(0,i.kt)("admonition",{title:"async and await",type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"If you're not entirely familiar with ",(0,i.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"},"async function"),", it is a modern JavaScript function to enable asynchronous behavior and the await keyword is permitted within it. They enable asynchronous, promise-based behavior to be written in a cleaner style, avoiding the need to explicitly configure promise chains."),(0,i.kt)("p",{parentName:"admonition"},"Also, check this pratical resource on ",(0,i.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/pt/play#example/async-await"},"Async Await"),".")),(0,i.kt)("p",null,"As you can see, we used ",(0,i.kt)("inlineCode",{parentName:"p"},"connect.snapshot")," to retrieve the data from a data server resource called ",(0,i.kt)("inlineCode",{parentName:"p"},"ALL_INSTRUMENTS"),". If you wanted to stream data in real time, you could use the ",(0,i.kt)("inlineCode",{parentName:"p"},"connect.stream")," method instead. Remember to always use these methods to get data from data server resources."),(0,i.kt)("p",null,"Once we have the list of instruments from the server we can make use of it in the template file."),(0,i.kt)("p",null,"To dynamically include list of options we use ",(0,i.kt)("a",{parentName:"p",href:"https://www.fast.design/docs/fast-element/using-directives#the-repeat-directive"},"repeat")," directive and iterate through the items."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title='order.template.ts'",title:"'order.template.ts'"},"<zero-select :value=${sync(x=> x.instrument)}>\n  ${repeat(x => x.allInstruments, html`\n    <zero-option value=${x => x.value}>${x => x.label}</zero-option>\n  `)}\n</zero-select>\n")),(0,i.kt)("p",null,"You should see the instrument field populated now with the instruments from the server."),(0,i.kt)("p",null,"Now let's get the ",(0,i.kt)("strong",{parentName:"p"},"side")," field sorted. We could just add two static options BUY and SELL like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html",metastring:"title='order.template.ts'",title:"'order.template.ts'"},"<zero-select :value=${sync(x=> x.side)}>\n    <zero-option>BUY</zero-option>\n    <zero-option>SELL</zero-option>\n</zero-select>\n")),(0,i.kt)("p",null,"However, any changes on the backend would require a change in the options. Wouldn't it be much better if we could just retrieve all ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"side"))," options from the server? We already know how to get data from a data server resource, now let's use the ",(0,i.kt)("inlineCode",{parentName:"p"},"getMetadata")," method from ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"Connect"))," to get some metadata of a field, ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"side field"))," in our case."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{10,11,12,13} title='order.ts'","{10,11,12,13}":!0,title:"'order.ts'"},"public async connectedCallback() {\n    super.connectedCallback(); //FASTElement implementation\n\n    const msg = await this.connect.snapshot('ALL_INSTRUMENTS');\n    console.log(msg);\n    this.allInstruments = msg.ROW?.map(instrument => ({\n      value: instrument.INSTRUMENT_ID, label: instrument.NAME}));\n    console.log(this.allInstruments);\n\n    const metadata = await this.connect.getMetadata('ALL_ORDERS');\n    console.log(metadata);\n    const sideField = metadata.FIELD?.find(field => field.NAME == 'SIDE');\n    this.sideOptions = Array.from(sideField.VALID_VALUES).map(v => ({value: v, label: v}));\n  }\n\n")),(0,i.kt)("p",null,"Next, let's just use the ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"repeat"))," directive again to iterate through the ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"sideOptions")),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:"title='order.template.ts'",title:"'order.template.ts'"},"<zero-select :value=${sync(x=> x.side)}>\n  ${repeat(x => x.sideOptions, html`\n    <zero-option value=${x => x.value}>${x => x.label}</zero-option>\n  `)}\n</zero-select>\n")),(0,i.kt)("p",null,"Reload your screen and should see the select fields being populated now!"),(0,i.kt)("admonition",{title:"ERROR HANDLING",type:"caution"},(0,i.kt)("p",{parentName:"admonition"},"For learning purposes, we are not doing proper error handling in our code."),(0,i.kt)("p",{parentName:"admonition"},"Things like checking null or empty data from the server, arrays out of bounds etc."),(0,i.kt)("p",{parentName:"admonition"},"When working on production code, make sure to add those validations.")),(0,i.kt)("h4",{id:"loading-market-data"},"Loading Market Data"),(0,i.kt)("p",null,"We're still missing the ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"lastPrice"))," field that, based on the instrument selected, must display the corresponding ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"lastPrice")),"."),(0,i.kt)("p",null,"We have a request server resource (a.k.a reqRep) available on the server called ",(0,i.kt)("inlineCode",{parentName:"p"},"INSTRUMENT_MARKET_DATA"),". It takes the INSTRUMENT_ID as input and returns the last price of the given instrument."),(0,i.kt)("p",null,"We already know how to get data from data servers, now let's see how to get data from a reqRep. "),(0,i.kt)("p",null,"Add this method to the Order class:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{2} title='order.ts'","{2}":!0,title:"'order.ts'"},"public async getMarketData() {\n    const msg = await this.connect.request('INSTRUMENT_MARKET_DATA', {\n      REQUEST: {\n        INSTRUMENT_ID: this.instrument,\n      }});\n    console.log(msg);\n\n    this.lastPrice = msg.REPLY[0].LAST_PRICE;\n  }\n")),(0,i.kt)("p",null,"And change the template to make the ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"instrument field"))," like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{2} title='order.template.ts'","{2}":!0,title:"'order.template.ts'"},"<span>Instrument</span>\n<zero-select :value=${sync(x=> x.instrument)} @change=${x => x.getMarketData()}>\n  <zero-option :selected=${sync(x => x.instrument==undefined)}>-- Select --</zero-option>\n  ${repeat(x => x.allInstruments, html`\n    <zero-option value=${x => x.value}>${x => x.label}</zero-option>\n  `)}\n</zero-select>\n")),(0,i.kt)("p",null,"Note that we used the ",(0,i.kt)("inlineCode",{parentName:"p"},"@change")," binding to call ",(0,i.kt)("inlineCode",{parentName:"p"},"getMarketData()")," when the value selected changed."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"We've used console.log to display the data returned from the server so we can get a better understanding of the data structure returned by each kind of resource (data servers, request replies, metadata etc)."),(0,i.kt)("p",{parentName:"admonition"},"Remember that you can also use POSTMAN or any HTTP client to retrieve and analyze the data as we saw in the Developer Training.")),(0,i.kt)("h3",{id:"exercise-21-using-foundation-comms"},"Exercise 2.1: using Foundation Comms"),(0,i.kt)("admonition",{title:"estimated time",type:"info"},(0,i.kt)("p",{parentName:"admonition"},"30min")),(0,i.kt)("p",null,"Let's revisit our Marketdata component. Make it retrieve all instruments from the server and display all instrument names and their corresponding last prices."),(0,i.kt)("p",null,"Server resources to be used: ALL_INSTRUMENTS and INSTRUMENT_MARKET_DATA."),(0,i.kt)("h3",{id:"sending-the-data"},"Sending the data"),(0,i.kt)("p",null,"Now when we gathered all the data we're ready to send it over the wire:"),(0,i.kt)("p",null,"Let's add a simple button with click event handler:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html",metastring:"title='order.template.ts'",title:"'order.template.ts'"},"<zero-button @click=${x=> x.insertOrder()}>Add Order</zero-button>\n")),(0,i.kt)("p",null,"Then let's amend our insertOrder function to work with the custom form now:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:"title='order.ts'",title:"'order.ts'"},"public async insertOrder() {\n      const insertOrderEvent = await this.connect.commitEvent('EVENT_ORDER_INSERT', {\n        DETAILS: {\n          INSTRUMENT_ID: this.instrument,\n          QUANTITY: this.quantity,\n          PRICE: this.price,\n          SIDE: this.side,\n          NOTES: this.notes,\n        },\n      });\n      console.log(insertOrderEvent);\n    }\n")),(0,i.kt)("p",null,"Reload your screen and try to insert a new order. For now, just check your browser console and see if you find the result of the ",(0,i.kt)("inlineCode",{parentName:"p"},"insertOrder()")," call."),(0,i.kt)("p",null,"Let's improve our screen a little bit and add a simple success or error message based on the result from the ",(0,i.kt)("inlineCode",{parentName:"p"},"EVENT_ORDER_INSERT")," event to showcase how to handle the response from the server."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{14,15,16,17,18,19} title='order.ts'","{14,15,16,17,18,19}":!0,title:"'order.ts'"},"public async insertOrder() {\n      const insertOrderEvent = await this.connect.commitEvent('EVENT_ORDER_INSERT', {\n        DETAILS: {\n          INSTRUMENT_ID: this.instrument,\n          QUANTITY: this.quantity,\n          PRICE: this.price,\n          SIDE: this.side,\n          NOTES: this.notes,\n        },\n      });\n      console.log(insertOrderEvent);\n\n      if (insertOrderEvent.MESSAGE_TYPE == 'EVENT_NACK') {\n        const errorMsg = insertOrderEvent.ERROR[0].TEXT;\n        alert(errorMsg);\n      } else {\n        alert(\"Order inserted successfully.\")\n      }\n    }\n")),(0,i.kt)("h3",{id:"adding-a-simple-orders-data-grid"},"Adding a simple Orders data grid"),(0,i.kt)("p",null,"In the template file, let's add the Genesis ",(0,i.kt)("a",{parentName:"p",href:"/web/web-components/grids/grid-pro/grid-pro-genesis-datasource/"},"data source")," pointing to the ",(0,i.kt)("inlineCode",{parentName:"p"},"ALL_ORDERS")," resource and wrap it in ",(0,i.kt)("a",{parentName:"p",href:"/web/web-components/grids/grid-pro/grid-pro-intro/"},"grid-pro"),"."),(0,i.kt)("p",null,"Add this code to the end of html template code:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html",metastring:'title="order.template.ts"',title:'"order.template.ts"'},'<zero-grid-pro>\n    <grid-pro-genesis-datasource\n        resourceName="ALL_ORDERS"\n        orderBy="ORDER_ID">\n    </grid-pro-genesis-datasource>\n</zero-grid-pro>\n')),(0,i.kt)("p",null,"This will result in a grid displaying all the columns available in the for the ",(0,i.kt)("inlineCode",{parentName:"p"},"ALL_ORDERS")," resource."),(0,i.kt)("p",null,"Take a moment to play around, insert new orders and see the orders in the grid."),(0,i.kt)("h3",{id:"exercise-22-customizing-order-entry-further"},"Exercise 2.2: customizing order entry further"),(0,i.kt)("admonition",{title:"estimated time",type:"info"},(0,i.kt)("p",{parentName:"admonition"},"30min")),(0,i.kt)("p",null,"Implement these changes in the order entry form:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"there's a field ORDER_ID in the ORDER table which is generated automatically by the server. However, if a value is given, it will use the given value instead. Generate a random value on the frontend and pass the value to the EVENT_ORDER_INSERT event."),(0,i.kt)("li",{parentName:"ul"},"Fields instrument, quantity and price are mandatory on the server. Whenever a null or empty value is passed, make sure to capture the error response from the server and paint the missing field label in red.")),(0,i.kt)("h3",{id:"exercise-23-revamp-the-trade-screen"},"Exercise 2.3: revamp the Trade screen"),(0,i.kt)("admonition",{title:"estimated time",type:"info"},(0,i.kt)("p",{parentName:"admonition"},"60min")),(0,i.kt)("p",null,"Remember the Trade screen from the Developer Training? Rebuilt it now using a custom form like we did with the Order screen instead of using the entity-management micro frontend. Make sure to populate the dropdown fields and handle the server response as well."))}c.isMDXComponent=!0}}]);