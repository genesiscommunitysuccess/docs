---
title: 'Foundation Testing'
sidebar_label: 'Foundation Testing'
id: foundation-testing
keywords: [genesis, foundation, ui, testing]
tags:
  - test
  - testing
  - frontend
  - ui
  - unit
  - end-to-end
  - e2e
  - uvu
  - playwright
---

# Genesis Foundation testing

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

`foundation-testing` provides shared unit and e2e testing functionality.

### [API Docs](./docs/api/index.md)

## Unit testing with UVU

Unit testing is provided by [UVU](https://github.com/lukeed/uvu)

### UVU Features

* Super [lightweight](https://npm.anvaka.com/#/view/2d/uvu)
* Extremely [performant](https://github.com/lukeed/uvu/tree/master#benchmarks)
* Individually executable test files
* Supports `async`/`await` tests
* Supports native ES Modules
* Browser-compatible
* Familiar API

## E2E Testing with Playwright

E2E testing is provided by [Playwright](https://playwright.dev/docs/intro)

### Playwright Features

* Run tests across all browsers.
* Execute tests in parallel.
* Enjoy context isolation out of the box.
* Capture videos, screenshots and other artifacts on failure.
* Integrate your POMs as extensible fixtures.

## Test Organisation

You can unit-test specific logic by adding a test file alongside the source file.

```
logic.ts
logic.test.ts
```

If your test spans more than one file or is more of an end-to-end test, you may wish to add your test to your package's **/test** directory instead. An example structure might be:

```
├── src 
│   └── logic.ts
│   └── logic.test.ts
│   └── component.ts
│   └── component.test.ts
├── test 
│   └── e2e
│       └── baseline.e2e.ts
│   └── unit
│       └── baseline.test.ts
├── package.json
└── playwright.config.ts
```

The contents of your package's **playwright.config.ts** may include:

```ts
export { configDefaults as default } from '@genesislcap/foundation-testing/e2e';
```

If you need to customise configuration, you can do it as follows:

```ts
import { configDefaults } from '@genesislcap/foundation-testing/e2e';

export default {
  ...configDefaults,
  // Any custom configuration here e.g. disabling the web server:
  webServer: undefined,
};
```

If you need to customise JSDOM, you can create a **jsdom.setup.ts** file in your package directory:

```ts
// custom code
export * from '@genesislcap/foundation-testing/jsdom';
```

## Test scripts

The test-related scripts to add to your package's **package.json** file may include:

```
"test": "genx test",
"test:coverage": "genx test --coverage",
"test:coverage:browser": "genx test --coverage --browser",
"test:e2e": "genx test --e2e",
"test:e2e:debug": "genx test --e2e --debug",
"test:e2e:ui": "genx test --e2e --interactive",
"test:unit:browser": "genx test --browser",
"test:unit:browser:watch": "genx test --browser --watch",
"test:unit:watch": "genx test --watch",
"test:debug": "genx test --debug"
```

## Testing logic

The **logic.test.ts** usually uses `createLogicSuite`, which is used to test function output given certain input
arguments. Based on user feedback, these arguments are now passed as an array by convention:

```ts
// logic.test.ts
import { createLogicSuite } from '@genesislcap/foundation-testing';
import { myFunction } from './logic';

const Suite = createLogicSuite('myFunction');
Suite('myFunction should provide expected results', ({ runCases }) => {
  runCases(myFunction, [
    [['1'], true],
    [[123], true],
    [['60%'], true],
    [['$60'], false],
    [['1.1'], false],
    [[''], false],
    [[true], false],
    [[null], false],
    [[undefined], false],
  ]);
});

Suite.run();
```

## Testing components

The **component.test.ts** or any test that directly or indirectly makes use of the DI uses `createComponentSuite`. Apart from setting up and tearing down your element fixture with a wrapping design system and DI container, this util also allows you to provide DI container mocks, which are required for certain testing flows.

```ts
// component.test.ts
import { Connect } from '@genesislcap/foundation-comms';
import { ConnectMock } from '@genesislcap/foundation-comms/testing';
import { assert, createComponentSuite, Registration } from '@genesislcap/foundation-testing';
import { MyComponent } from './component';

/**
 * As we're using tag name in the Suite, we hold a reference to avoid tree shaking.
 */
MyComponent;

/**
 * Create mock
 */
const connectMock = new ConnectMock();
connectMock.nextMetadata = {
  FIELD: [
    {
      NAME: 'foo',
      TYPE: 'bar',
    },
  ],
};

/**
 * Resister mock instance
 */
const mocks = [Registration.instance(Connect, connectMock)];

const Suite = createComponentSuite<MyComponent>(
  'MyComponent',
  'my-component', // < or () => myComponent() if your component is composeable
  null,
  mocks,
);

Suite('Can be created in the DOM', async ({ element }) => {
  assert.ok(element);
});

Suite('Connect is mocked in the container', async ({ container }) => {
  const serviceMock = container.get(Connect);
  assert.instance(serviceMock, ConnectMock);
});

Suite('Attr changes update internals as expected', async ({ element }) => {
  element.setAttribute('resource-name', 'ALL_USERS');
  assert.match(element.optionsHash, /ALL_USERS/);
  element.setAttribute('order-by', 'USERNAME');
  assert.match(element.optionsHash, /USERNAME/);
});

Suite('Connect.getMetadata returns expected nextMetadata', async ({ container }) => {
  const serviceMock = container.get(Connect) as ConnectMock;
  /**
   * Assert base case
   */
  let serviceMeta = await serviceMock.getMetadata('someResource');
  assert.is(serviceMeta.FIELD[0].NAME, 'foo');
  /**
   * Apply next and assert
   */
  const metadata = {
    FIELD: [
      {
        NAME: 'hello',
        TYPE: 'world',
      },
    ],
  };
  serviceMock.nextMetadata = {
    ...metadata,
  };
  serviceMeta = await serviceMock.getMetadata('someResource');
  assert.equal(serviceMeta, {
    ...metadata,
  });
  // TODO: Trigger and cross check component reactions to underlying data changes
});

Suite.run();
```

## Testing E2E

The **baseline.e2e.ts** uses `playwright`; test cases have access to the fixtures provided during set-up.

```ts
import { test, expect } from '@genesislcap/foundation-testing/e2e';

test('baseline test', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    const name = await page.innerText('.navbar__title');
    expect(name).toBe('Playwright');
});
```

_We will be adding more details on E2E in future updates._

## License

Note: this project provides front-end dependencies and uses licensed components listed in the next section; thus, licenses for those components are required during development. Contact [Genesis Global](https://genesis.global/contact-us/) for more details.

### Licensed components
Genesis low-code platform
