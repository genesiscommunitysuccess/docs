---
title: 'Foundation testing'
sidebar_label: 'Foundation testing'
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

`foundation-testing` provides shared unit and e2e testing functionality.

### [API Docs](./docs/api/index.md)

## Unit Testing with UVU

Unit testing is provided by [UVU](https://github.com/lukeed/uvu).

### UVU features

* super [lightweight](https://npm.anvaka.com/#/view/2d/uvu)
* extremely [performant](https://github.com/lukeed/uvu/tree/master#benchmarks)
* individually executable test files
* supports `async`/`await` tests
* supports native ES modules
* browser-compatible
* familiar API

## E2E testing with Playwright

E2E testing is provided by [Playwright](https://playwright.dev/docs/intro)

### Playwright features
Playwright enables you to perform a number of very useful functions.

* Run tests across all browsers.
* Execute tests in parallel.
* Enjoy context isolation out of the box.
* Capture videos, screenshots and other artifacts on failure.
* Integrate your POMs as extensible fixtures.

## Test organisation

Unit testing specific logic can be done by adding a test file alongside the source file.

```
logic.ts
logic.test.ts
```

If your test spans more than one file or is more of an end-to-end test, you could wish to add your test to your package's
**/test** directory instead. An example structure might be:

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
├── jsdom.setup.ts 
├── package.json
└── playwright.config.ts
```

The contents of the **jsdom.setup.ts** file for your package could simply be:

```typescript
export * from '@genesislcap/foundation-testing/jsdom';
```

The contents of the **playwright.config.ts** file for your package could include:

```typescript
import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  testMatch: '**/*.e2e.ts',
  globalSetup: '@genesislcap/foundation-testing/playwright', // returns teardown
  projects: [
    {
      name: 'Chrome Stable',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
      },
    },
  ],
};
export default config;
```

## Test scripts

You could add the following test-related scripts to the **package.json** file for your package:

```
"test": "npm run test:unit && npm run test:e2e",
"test:coverage": "c8 --include=src npm run test:unit",
"test:coverage:report": "npm run test:coverage && c8 report --reporter=text-lcov > coverage.lcov",
"test:coverage:report:nyc": "npm run test:unit:browser -- --cov && npx nyc report --reporter=html",
"test:e2e": "npx playwright test --config=./playwright.config.ts",
"test:e2e:debug": "cross-env PWDEBUG=1 npm run test:e2e",
"test:unit": "npm run test:unit:node",
"test:unit:browser": "playwright-test \"./**/*.test.ts\" --runner uvu",
"test:unit:browser:watch": "npm run test:unit:browser -- -w -d",
"test:unit:node": "npm run test:unit:node:src && npm run test:unit:node:test",
"test:unit:node:src": "uvu -r tsm -r esm -r ./jsdom.setup.ts ./src \".*.test.ts\"",
"test:unit:node:test": "uvu -r tsm -r esm -r ./jsdom.setup.ts ./test/unit \".*.test.ts\"",
"test:unit:watch": "watchlist src test -- npm run test:unit"
```

To provide the dev dependencies for these test scripts, you need to install: 

```
@playwright/test playwright-test c8 esm jsdom tsm uvu watchlist
```

_We are working on enhancing the `genx` cli to abstract test running, so you can offload this setup and tasks._

## Testing logic

The **logic.test.ts** will probably use `createLogicSuite`, which is used to test function output given certain input
arguments. Based on user feedback, these arguments are now passed as an array by convention:

```typescript
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

The **component.test.ts** file or any test that directly or indirectly uses the DI will also use
`createComponentSuite`. Apart from setting up and tearing down your element fixture with a wrapping design system and DI
container, this util also allows you to provide DI container mocks, which will be required for certain testing flows.

```typescript
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

The **baseline.e2e.ts** file uses `playwright`, and test cases will have access to the fixtures provided during set-up.

```typescript
import { expect } from '@playwright/test';
import { test } from '@genesislcap/foundation-testing/e2e';

test('baseline test', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    const name = await page.innerText('.navbar__title');
    expect(name).toBe('Playwright');
});
```

_We will be adding more details on E2E in future updates._
