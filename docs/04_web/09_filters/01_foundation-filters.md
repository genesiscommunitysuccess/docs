---
title: 'Foundation Filters'
sidebar_label: 'Foundation Filters'
id: foundation-filters
keywords: [genesis, foundation, ui, filters]
tags:
  - filter
  - feature
  - flags
  - conditions
---

# Genesis Foundation Filters

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

`foundation-filters` provides a collection of client side filters, including:

* [nodeEnv](./docs/api/foundation-filters.nodeenvfilter.md)
* [percentage](./docs/api/foundation-filters.percentagefilter.md)
* [timeWindow](./docs/api/foundation-filters.timewindowfilter.md)
* [urlTargeting](./docs/api/foundation-filters.urltargetingfilter.md)
* [userAgent](./docs/api/foundation-filters.useragentfilter.md)
* [userTargeting](./docs/api/foundation-filters.usertargetingfilter.md)

These can be run in isolation or as part of a chain using the [runner](./docs/api/foundation-filters.runner.md) function.

### [API Docs](./docs/api/index.md)

Client side filters generally take primitive input parameters, and will return `true` or `false` based these
values. They may also access runtime data or state to provide an outcome. They can be used for simple tasks like array
or input filtering, to for more advanced use-cases such as driving feature flags, behaviors, directives etc.

Filters can be chained using the utilities provided in this package to handle more complex scenarios. When a filter is
used without all the input parameters needed, we log a warning and return `true` by convention so the chain can continue.
This is currently controlled at an individual filter level, and may change in time.

:::important
It's important to highlight that filters are purposefully decoupled from any `effect`, like pairing with a `when()`
directive or custom effect logic. This flexibility allows these filters to be reused for numerous purposes.
:::

## Usage

Each filter is provided in two flavours:

1. *Function*

```ts
import { timeWindowFilter } from '@genesislcap/foundation-filters';
...
const outcome = timeWindowFilter('Sun Sep 25 2022 16:51:55 GMT+0000', 'Fri Nov 25 2022 17:51:55 GMT+0000');
```

2. *DI Injected*

```ts
import { TimeWindow } from '@genesislcap/foundation-filters';
...
@TimeWindow timeWindow: TimeWindow;
...
const outcome = this.timeWindow.filter({
  start: 'Sun Sep 25 2022 16:51:55 GMT+0000',
  end: 'Fri Nov 25 2022 17:51:55 GMT+0000',
});
```

The function version is pretty self-explanatory, and you may be thinking why would you use the DI injected version. The
reason is at the point of calling a filter, either directly or indirectly as say part of a chain, you may not know what
data or state from the application it needs to provide its outcome. The DI versions encapsulate this complexity, which
aids later refactoring, and leaves callers free to pass only primitive input parameters where possible.

### DI use cases

```ts
import { UserTargeting } from '@genesislcap/foundation-filters';
...
@UserTargeting userTargeting: UserTargeting;
...
const outcome = this.userTargeting.filter({
  profiles: ['ADMIN']
});
```

Here we've leveraged the `UserTargeting` filter without the need to provide the current user or other data points to
the underlying function directly. If where we source the current user from changes over time, the author of the filter
can refactor centrally.

All DI based filters implement the [ClientFilter](./docs/api/foundation-filters.clientfilter.md) interface, however they
may provide other APIs for convenience to abstract underlying implementation details. For example, `UserTargeting`
provides a `hasAdminProfile` API, so the previous example can be re-written as:

```ts
import { UserTargeting } from '@genesislcap/foundation-filters';
...
@UserTargeting userTargeting: UserTargeting;
...
const outcome = this.userTargeting.hasAdminProfile();
```

This is quite a simplistic example, but hopefully helps to highlight that common parameters can be predefined in the
filters themselves where needed. It is also worth mentioning that DI based filters are registered as transient, meaning
you will get a new instance for every dependency request or container.get(). The ClientFilterRunner used to run chained
filters is also transient.

### Client Filter Runner

A [ClientFilterRunner](./docs/api/foundation-filters.clientfilterrunner.md) will return true when all the filters in the array pass.

```ts
import { ClientFilterRunner } from '@genesislcap/foundation-filters';
...
@customElement({
  name: 'runner-example',
  template: html`
    <template>
      ${when(
        (x) => x.seasonsGreetings,
        html`
          <happy-christmas-chome-users></happy-christmas-chome-users>
        `
      )}
      ${when(
        (x) => x.santasShift,
        html`
          <working-hard-or-hardly-working>Santa!</working-hard-or-hardly-working>
        `
      )}
    </template>
  `,
})
class RunnerExample extends FASTElement {
  @ClientFilterRunner runner: ClientFilterRunner;
  /**
   * This getter will remain reactive to any observable state each filter may use. Filters can be defined with strong
   * typings as shown, or they can be simply loaded in from json files etc. Here we've defined the chain in the element,
   * but you could inject a ClientFilterRunner into a store fragment to centralise and share such logic. Here we're
   * targeting non-admin users on chrome between Christmas and New Year.
   */
  get seasonsGreetings() {
    return this.runner.run([
      {
        name: 'userTargeting',
        parameters: {
          profiles: ['USER'],
        },
      },
      {
        name: 'userAgent',
        parameters: {
          browsers: ['Chrome']
        },
      },
      {
        name: 'timeWindow',
        parameters: {
          start: '2022-12-25',
          end: '2022-12-31',
        },
      }]);
  }

  get santasShift() {
    return this.runner.run([
      {
        name: 'userTargeting',
        parameters: {
          username: ['santa'],
        },
      },
      {
        name: 'timeWindow',
        parameters: {
          start: '2022-12-24',
          end: '2022-12-25',
        },
      }]);
  }
}
```
