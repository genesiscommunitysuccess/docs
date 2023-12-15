---
title: 'Release notes - 2023.1'
sidebar_label: 'Previous (2023.1)'
sidebar_position: 4
id: previous
keywords: [operations, release notes, v-2023.1]
tags:
    - operations
    - release notes
    - v-2023.1
---

## Release notes
This is version v2023.1 of the documentation for the Genesis low-code platform.

The basis of this version is:

| part of stack | version | final version |
|---------------|---------|--------------|
| server  (GSF)  | 6.5.1 | 6.7.9 |
| web  (FUI)       | 10.5.0 | 14.92.5 |

Release date: 28 February, 2023. 

**The original release notes are provided below.**

## Feature highlights 
Every few months, * **Revamped pending approval workflow** - The pending approval workflow has been revamped to support GPAL configuration and other improvements. 
* **Self-service password reset functionality** - The platform now supports self-service password reset capabilities.
* **JSON Schema validation** - Event Handlers now validate each incoming message based on the implicit JSON schema definition.
* **Case-insensitive user login** - The user name field is now case-insensitive when attempting login operations.
* **Custom permissions support** - A new function called `customPermissions` is available within the `permissioning` block to improve integration with third-party entitlement systems. 
* **OpenID Connect improvements** - It is now possible to set up a new logout workflow within Genesis that also logs out the user from the underlying SSO identity provider.

## Foundation UI

Foundation UI has a programme of regular continual releases. These are documented along with their source code on [github](https://github.com/genesislcap/foundation-ui/releases). 

## Genesis Server Framework (GSF)

:::info

GSF and its modules are compiled using Kotlin 1.7.10 and Gradle 7.5.0.

:::

## GSF

### Breaking changes
- Make username available in scope within a permissioning 'where' clause. 
- MS SQL fields now use the appropriate "max length" parameter when the `maxSize` value goes beyond the MS SQL limit. 
- The 'USER' table has been updated to include a unique index for the 'REFRESH_TOKEN' field.
- The minimal safe TLS version is now set to 1.2.
- The pending approval mechanism has had a major revamp.
- JSON schema validation and inter-process messages have been enabled for Event Handlers in GSF.

### Features

- There is now a simple "toValue" extension function to transform/project POJO-like classes between each other.
- We have added '--dumpSQL' feature to remap to allow export of DDL statements.
- DumpIt: Added support to query data based on the TIMESTAMP field.
- There is now a "customPermission" block in GPAL "permissioning" to support integration with third-party entitlement systems.
- We have enabled access to injector property and inject() method in the Data Server GPAL script definition.
- We now allow running containers as non-root users.
- There is now access to self-service password reset without logging in.
- We have enabled case-insensitive support for username as part of the login workflow in GENESIS_ROUTER.
- Auth map is now optional in permissioning GPAL.
- Mon process statuses now include a new HEALTHY state when a process has passed its health checks.
- Auto-increment ids can be shared between more than one table definition to have their own sequence value.

### Bugfixes

- ClearCodeGenCache: Add args to main method so compiler recognises it as a valid main method.
- "toDbRecord" method in generated GPAL view entities now sets all view fields.
- Issues around H2 compatibility have been fixed. 
- Check alias store type is SQL to ensure compatibility when using FILE store.
- Various fixes for SQL operations within custom database schemas.
- Correctly resolve dictionary when using a custom database schema in SQL.
- Aliased fields can now be used as part of criteria expressions definitions for dataserver and request reply. 
- Sequences are not deleted and recreated during Oracle remap. 
- Ensure sequences on autoincrement fields are deleted when the relevant tables are deleted (as part of a remap).
- The issue where the main docker image and the debug docker image would both be named "debug" has been fixed.
- An issue where codegen would fail when using a formatter in the GPAL fields definition has been fixed.
- Resource maps handling for Consul cluster mode has been fixed.
- get/set AutoIncrement values now works as expected for Oracle and MSSQL layers.
- RT command will now wait for log file generation before tailing, up to 20 seconds.
- Remap: we now avoid check remap lock flag, rewriting AliasStore and rewriting DictionaryStore if there are no changes to be made.
- Remap should not attempt to create a backup of tables that have been added to the schema when using Oracle.
- We have removed the hard requirement to provide a REQUIRES_APPROVAL field as part of the json schema definition.
- We have removed sequences from backed up tables to avoid exception on creation of new table.
- Checking existing constraints before trying to rename them.
- Cleaning the data after test execution.
- In case of process unavailability the user authentication state is now rolled back correctly.
- Initialise SysDef object during process bootstrap.
- Issues with `killProcessRestarter` implementation have been fixed.
- Fixed race condition happening very rarely as part of dataserver query priming for views.
- Only concat database schema name with table name when using DbNamespace option to ensure table match can be found (SQL databases).

### Other changes
- The `Env` helper for Sysdef files has been deprecated.
- We have renamed `backwardsJoins` to `backwardsJoin` in Data Server GPAL API and deprecate `backwardsJoins`.
- camel-bom dependency has been upgraded to version 3.18.4 and symphony-bom dependency to version 2.11.1 to avoid critical vulnerabilities.
- Excessive logging in dataservers has been deprecated.
- GenesisResourceDaemon script endpoint is now disabled by default to avoid security vulnerabilities.

## Auth

### Features

- We have added "customLoginAck" block to auth-preferences, so we can further customise the login ack message.
- New fields have been added to ALL_APPROVAL_ALERTS and add new query for ALL_APPROVAL_ALERTS_AUDITS as part of the pending approval workflow revamp.
- We have added allowedClockSkewSeconds property to the OIDC verification configuration.
- There is now logout functionality for OIDC.
- We now allow configuration of the default user state for the user after creation.
- There is now support for multiple LDAP connections.
- There is now a workflow for self-service password reset.
- We have enabled system definition implicit receiver in SAML script.
- User login is now case-insensitive.
- Returning OIDC logout URL on Logout.

### Bugfixes
- Issues with "loginAuthAck" implementation have been fixed.
- We have fixed an issue where updates triggered by updateOn would throw an exception
- ENTITY_VISIBILITY implementation has been fixed to work as expected in terms of generated permissions.
- The index reference in auth-consolidator.xml has been fixed to match the index name in APPROVAL table.
- `id_token` is now the only mandatory field as part of OIDC response.
- OIDC Configuration that uses ALWAYS_ALLOW user strategy now works when used in combination with generic entity permissioning.

#### Other changes
- RECORD_NOT_FOUND is not logged at error level when cleaning up expired sessions.
- We have added username to incoming messages for non-SSO login requests when a refresh token is present.
- The auth dataserver and consolidator configuration have been updated to match the pending approval logic in GSF.
- Remove permissioning block from ALL_APPROVAL_ALERTS and ALL_APPROVAL_ALERTS_AUDITS.

## Foundation UI changes
This is a high-level overview of the changes.

### Features
- The implementation of the `foundation-layout` package has now been completed, providing application- and route-based layout functionality similar to Golden Layout. This includes functionality to autosave layouts. The package has a declarative HTML API, a JavaScript API for dynamic interaction, custom styling, and more.
- A `File Upload` component has been added. This provides the ability to upload single or multiple files. It also includes a grid to display the list of uploaded files.
- `menu` and `menu-item` components have been added.
- A `dropdown-menu` component has been added.
- Stock and donut chart types have been added.
- It is now possible to set the storage key prefix in session.
- There is now a consistent way of handling errors using error structure builders and an error component launcher.
- New error components such as Dialog, Snack-bar and Banner have been added.
- `foundation-login` has been refactored to address tech debt, expose new config hooks, and use the Credential Management API. Workflow for Forgotten Password and conditional organisation (CompID) logic has been added.
- `foundation-login` now has "easy configuration" of backgrounds. 
- `action-renderer` now has `data-test-id` attributes to help with E2E testing on `grid-pro` instances using actions
- `foundation-utils`
    - `@renderOnChange` decorator has been added to remove some repetitive internal observation boilerplate.
    - `ServerRowDTOMapper` and base `DTOMapper` utils have been added to help map DTOs to UI entities to keep the UI resilient to changes.
    - Design system resource typing and an `assureDesignSystem` utility function have been added to check dynamically loaded modules.
- `chart-datasource` has a new `series` field for multi-line and stacked configurations. Examples are:

```
<chart-datasource 
   resourceName="ALL_POSITIONS" 
   server-fields="INSTRUMENT_NAME QUANTITY"> <!-- equals to groupBy and value -->
</chart-datasource>
```

```
<chart-datasource 
   resourceName="ALL_POSITIONS" 
   server-fields="INSTRUMENT_NAME QUANTITY DATE_TIME"> <!-- equals to groupBy, value and series -->
</chart-datasource>
```

```
 <chart-datasource 
   resourceName="ALL_POSITIONS" 
   chart-fields="customGroupBy customValue customSeries"
   server-fields="INSTRUMENT_NAME QUANTITY DATE_TIME"> <!-- equals to customGroupBy , customValue and customSeries-->
</chart-datasource>
```

### Maintenance
- Improvements have been made to the lifecycles of components such as charts and grids, so they behave correctly as part of a `foundation-layout` region.
- G2Plot-chart styling has been improved.
- We have enabled deep linking and we now ensure that `session.captureReturnUrl()` captures search and hash from location.
- An issue with the internal dependency mapping of named releases has been fixed.
- Local development https is now possible.
- Initial bundling optimisations ensure that certain third-party modules are excluded.
- The colour-scheme of `text-field` using `date type` now works properly on dark/light modes.
- We have fixed the issue of bootstrap warnings when using multiple versions of the same package.
- We have fixed `grid-pro` internal `.css` imports and overall styling (matching v29 changes).
- We have fixed `orderBy` flow when using `grid-pro-genesis-datasource`. This now correctly displays warnings when the field is invalid, and suggests possible valid fields.
- `grid-pro-datasource-next` to get it working properly after v29 upgrades. This is still in the experimental phase, and is only missing "rich filtering`.
- `storybook`-related `bootstrap` warnings have been fixed. We have cleaned internal node_module committed/pushed by the CI.


### Mapping
This release maps to 10.5.0 of `foundation ui` packages.

### Migration guide

- The deprecated `getPermissions()` and `getProfiles()` have been removed from the session. Use `auth.currentUser.profiles` and `auth.currentUser.permissions` instead.
- For the `grid-pro-genesis-datasource`, the attributes have been made kebab-case rather than camelCase for consistency. The functionality from the `withGridInit` flag has been removed and replaced with `deferredGridOptions`.
- `foundation-login`. Use the exported configure function to customise login with the available config settings. Note you need to be running 6.5.0 of `auth` and `genesis` on the back end.
```
 {
    path: 'login',
    name: 'login',
    title: 'Login',
    layout: loginLayout,
    element: async () => {
       const { configure, Login } = await import('@genesislcap/foundation-login');
          configure(this.container, {
             showConnectionIndicator: true,
             hostPath: 'auth',
             defaultRedirectUrl: 'protected',
             background: loginBG,
       });
       return Login;
    },
    settings: { public: true },
    childRouters: true,
 },
```

`Roboto` fonts. The Roboto `font-family` has been updated. In order to have everything working, you need to update the naming. It's just `Roboto` now, so old variants like `Roboto-Medium`, `Roboto-Light` or `Roboto-Bold` won't work anymore. In order to get the same effect, we suggest you use the available `mixinRobotoFont` function:

```
import { FontStyle, FontWeight } from '@genesislcap/foundation-utils';
import { mixinRobotoFont, bodyFont, robotoFontFamily, loadRobotoFontFaces } from '@genesislcap/foundation-zero';
import { cssPartial } from '@microsoft/fast-element';

/**
 * Ensure Roboto fonts are loaded in the document head.
 */
loadRobotoFontFaces();

/**
 * Explicitly set the bodyFont to Roboto for overall consistency.
 */
bodyFont.withDefault(robotoFontFamily);

/**
 * Create some roboto tokens to share across components.
 */
export const robotoRegular = cssPartial`${mixinRobotoFont(FontStyle.Normal, FontWeight.Regular)}`;
export const robotoMedium = cssPartial`${mixinRobotoFont(FontStyle.Normal, FontWeight.Medium)}`;
export const robotoBold = cssPartial`${mixinRobotoFont(FontStyle.Normal, FontWeight.Bold)}`;
```
Here area the available `FontStyle` and `FontWeight` values:
```
enum FontStyle {
  Italic = 'italic',
  Normal = 'normal',
}
enum FontWeight {
  Thin = 100,
  Light = 300,
  Regular = 400,
  Medium = 500,
  Bold = 700,
  Black = 900,
}
```

`foundation-login`.To customise login with the available config settings, use the exported configure function. Note: you must be running 6.5.0 of auth and genesis on the back end.

`FontAwesome` icons. The Genesis icon component has received some updates to keep in sync with the latest `FontAwesome` packages. We're now using the same approach as their official [icons library](https://fontawesome.com/docs/apis/javascript/icon-library), allowing the following attributes:
   - `name` this is the same as before. It must be a valid "icon name" from `FontAwesome`. Note that some of these names have been changed.
   - `variant` defaults to `FontAwesome`'s `solid` (fas), so you don't need to always specify it (if solid is what you want!). `regular (far) and `brand` (fab) are also available. **Note: `outline` is not valid anymore; for the same style, use the `regular` variant.**
   - `size` defaults to `FontAwesome`'s `sm` (small, 0.875em/14px). Check [the fontAwesome documentation](https://fontawesome.com/v6/docs/web/style/size) for more size values that can be used in Genesis applications. Here are some examples:

```
 <zero-icon name="glasses" size="1x"></zero-icon>
 <zero-icon name="amazon" size="2x" variant="brand"></zero-icon>
 <zero-icon name="amazon-pay" size="3x" variant="brand"></zero-icon>
 <zero-icon name="apple" size="4x" variant="brand"></zero-icon>
 <zero-icon name="chrome" size="5x" variant="brand"></zero-icon>
 <zero-icon name="ambulance" size="xs"></zero-icon>
 <zero-icon name="angry" size="1x"></zero-icon>
 <zero-icon variant="regular" name="angry" size="sm"></zero-icon>
 <zero-icon name="address-book" size="lg"></zero-icon>
 <zero-icon variant="regular" name="address-book" size="xl"></zero-icon>
 <zero-icon name="bookmark" size="2xl;"></zero-icon>
 <zero-icon variant="regular" name="bookmark" size="2xs"></zero-icon>
 
```

### Commit details
These are the complete changes.

### New features
- (foundation-comms): ability to set the storage key prefix 
- (foundation-layout): add layout preview to gh pages 
- (foundation-ui): add grid-pro preview to gh pages 
- Add `seriesField` for multi-line and stacked charts 
- (foundation-ui): websocket connection status visual indicator
- Add `data-test-id` attr to action-renderer components
- (foundation-ui): banner component 
- (foundation-ui): error banner component 
- Update to JS-SVG FontAwesome + Roboto upgrades + AG css
- (foundation-errors): create foundation errors package
- Add cloneNode implementation for charts and chart-datasource
- (foundation-errors): using error builder in entity manager 
- (foundation-errors): creating snackbar component 
- (foundation-login)!: add CredentialContainer in login-form & use sessionStorage as default and remove deprecated keys 
- feat! Smart forms 
- Add a layout item from a previous registration 
- (g2plot-chart): match charts styling to zeroDS + add donut/stock types 
- (PTC-618): Improved styling for foundation-layout 
- (foundation-comms): exponential backoff retry PTC-765 
- (foundation-layout): add open, close, and init events 
- (foundation-ui): file upload component 
- (foundation-layout): update api to make it easier to load existing layouts
- (foundation-error): error dailog structure
- (foundation-utils): add decorator, dto mappers and remote ds check
- (g2plot-chart): charts do not reset hidden fields on reconnect 
- (foundation-forms): read only mode for smart forms 
- (foundation-entity-management): enriching edited/read entity with remote data (readEvent, read function)
- (foundation-layout): multiple copies of registered item are separate instances
- Allow values along labels in combobox when using datasource 
- (foundation-ui): error dialog component
- (foundation-layout): change tiles of windows existing in the layout
- (foundation-ui): add menu/menu-item components 
- Allow easy foundation-login background configs
- (foundation-errors): error handling 
- (foundation-ui): add dropdown-menu component 
- (foundation-ui): File upload functionality 
- (foundation-forms): custom error mapper + client-side validation (AJV) 
- (foundation-login)!: add forgot password workflow and organisation field 
- (foundation-ui): data-grid styles 
- (grid-pro): added gridProColumns 
- (foundation-forms): invisible fields that carry a payload 
- (foundation-entity-management): using the new hidden field logic 
- (foundation-layout): optional autosave layout functionality 

### Fixes
- Layout Lifecycle Fix for Grids and Charts  
- (foundation-layout): fix error when adding item to empty layout 
- Stop closed items being restored when adding new item to layout
- (foundation-layout): fix layout being altered when adding item
- Address existing warn logs (bootstrap/GH delivery)
- Update [require] usages to be imports in date-picker utils 
- Address breaking use cases of [declare var] globals in comms/zero 
- Address missing color-scheme for text-fields with date type 
- Re-sync alpha DS with latest changes on FUI + CLI fixes
- Address bootstrap warning on serve lib version 
- (foundation-ui): fix tab and charts in client app by 
- (foundation-layout): fix missing build step for dist package 
- Address bootstrap warning on serve lib version 
- (foundation-comms): redirect to login page if we don't have tokens in storage
- Update grid-pro .css imports + extras around AG theming/upgrade 
- (foundation-ui): file upload storybook file adapted to v7
- (foundation-layout): fix layout styles to contain content 
- Address invalid logic for orderBy warning 
- (foundation-header): fixed error in navigation from merge
- (foundation-layout): add item after dragging a lone item 
- (foundation-comms): socket retry exceed max limit 
- Address genesis-datasource issues when inside a layout 
- Update breaking behavior in genesis-datasource-next 
- (grid-pro): grid config cache regression 
- Address missing default export breaking foundation-zero storybook build 
- Smart forms correct schema payload  address 
- Showcases/micro-front ends not running locally 
- Allow to pass column config to file-upload-grid 
- column config without overriding it by metadata 
- (foundation-entity-management): lifecycle mixin for entities.ts and users.ts 
- (foundation-testing): add insertRule mock 
- (foundation-ui): adjusting storybook versions 
- (foundation-login): ensure autoConnect is non-blocking 
- (foundation-ui): label made optional and fixed grid filtering issue 
- (foundation-ui): file upload url was missing /gwf prefix 
- (foundation-login): add hostPath config 
- (foundation-login): update README, logout to '/' 

### Chore
- Improve genx error/help messages  
- Fixing linting error 
- Update orderBy param handling with extra logger.warn
- (grid-pro): included onSortChanged in list of events the save columnState
- Fixing stylelint error in zero slider
- Address bootstrap warning on serve lib version (forms pkg) 
- Update storybook to V7+ (@next for now)
- Automated releases
- Updated automated commit message format 
- Added design-system-configurator app/package 
- Enable CI to push version commits to protected branches 
- (foundation-comms): delete router logic from comms 
- ensuring PR titles are valid conventional commits 
- (grid-pro): enableCellFlashing option and - autoCellRendererByType improvement 
- Separate Slack channel for Web releases
- Update CODEOWNERS file 
- (foundation-header): added part names to logo elements
- Added design-system-export component 
- Remove username from requests payload 
- Publishing to public NPM registry 
- Added designSystemConfigurator helper  
- Temporarily disabling publishing to NPM 
- Address versions for storybook packages + delete node_modules
- api extractor to error when links are unresolved 

### Build
 Fix pre release step 
- Update PR template for 2x6
- Enable deep linking in foundation 
- Update local development https certs
- Only trigger NPM publishing during release 
- Temporarily disabling release string replacement verification 
- Exclude ag-grid packages 

### Test
- (foundation-login): E2E testing setup + extras 
- (foundation-layout): Create testHarness decorator in foundation-testing  

### Documentation
- Remove Forgot Password and Request Account from foundation-login docs
- (foundation-layout): add api docs 
- (foundation-layout): finalised docs 
- (foundation-layout): mark api as public ready for production use 

## Foundation UI updates during this release
Foundation UI release between 10.5.0 and 14.92.5 are documented along with their source code on [github](https://github.com/genesislcap/foundation-ui/releases). 

## GSF updates during this release

## Genesis 6.6.23(genesis-server)

### Features
- Add trace logging to rightSummaryCache

### Fixes
- (pal-streamerclient): Ensure recovery timestamps get set as COMPLETE and not ACKED
- (pal-streamerclient): Prevent duplicate DS_LOGON messages when streamer goes down
- Fix handling in GetNextSequenceNumbers script
- Fixed XML purger business day calculation
- Ignore derived fields when building view indices

## Genesis 6.7.9(genesis-server)

### Features
- Add trace logging to rightSummaryCache

### Fixes
- (pal-streamerclient): Ensure recovery timestamps get set as COMPLETE and not ACKED
- (pal-streamerclient): Prevent duplicate DS_LOGON messages when streamer goes down
- Fix handling in GetNextSequenceNumbers script
- Fixed XML purger business day calculation
- ignore derived fields when building view indices

## Genesis 6.7.8(genesis-server)

### Fixes
- Ensure exception in streamer callbacks does not terminate the stream

## Genesis 6.6.22(genesis-server)

### Fixes
- Ensure exception in streamer callbacks does not terminate the stream

## Genesis 6.6.21(genesis-server)

### Fixes
- (pal-dataserver): revert coroutine based LMDB stream operation usage inside NextRowsStrategy as it leads to deadlocks
- don't attempt to change ENUM fields on tables which aren't yet created

## Genesis 6.7.7(genesis-server)

### Fixes
- (pal-dataserver): revert coroutine based LMDB stream operation usage inside NextRowsStrategy as it leads to deadlocks
- don't create field change statements for newly added tables

## Genesis 6.6.1(genesis-notify)

### Dependency changes

- build(deps): Recompile against GSF 6.6.20

## Genesis 6.6.20(genesis-server)

### Fixes
- Fix potential deadlock in static initialistion of dao classes

## Genesis 6.7.6(genesis-server)

### Fixes
- Fix potential deadlock in static initialistion of dao classes

## Genesis 6.7.5(genesis-server)

### Fixes
- (pal-dataserver): ensure calls to "nextRows" in NextRowsStrategy only run a single LMDB transaction in a single Dispatchers.IO thread
- (pal-streamerclient): Fixed race condition where message is marked as complete before it is marked as sent
- (pal-streamerclient): Prevent shutdown deadlock and performance degradation due to metric accumulation

### Features
- (router): add flag to enable websocket compression

## Genesis 6.6.19(genesis-server)

### Features
- (router): add flag to enable websocket compression

### Fixes
- (pal-dataserver): ensure calls to "nextRows" in NextRowsStrategy only run a single LMDB transaction in a single Dispatchers.IO thread
- (pal-streamerclient): Fixed race condition where message is marked as complete before it is marked as sent
- (pal-streamerclient): Prevent shutdown deadlock and performance degredation due to metric accumulation

## Genesis 6.7.1(genesis-notify)

### Dependency changes
- build(deps): Recompile against GSF 6.7.4

## Genesis 6.7.4(genesis-server)

### Features
- Add support for optimistic concurrency

### Fixes
- genesisInstall has to be run twice to install sysdef changes from site-specific
- Reduce data server memory usage

## Genesis 6.6.4(fix-server)

### Fixes
- Ensure database sessions use correct message store

## Genesis 6.7.1(auth-server)

### Breaking changes
- Added REFRESH_AUTH_TOKEN to loginAuthNack in case of 2nd factor auth failure

### Dependency changes
- build(deps): Recompile against GSF 6.7.3

## Genesis 6.6.3(fix-server)

### Fixes
- Remove deadlock in fix outbound flow when using Database message store and make updates sequential

## Genesis 6.6.6(auth-server)

### Dependency Changes
- build(deps): Recompile against GSF 6.6.18

## Genesis 6.7.3(genesis-server)

### Fixes

- Make logging async by default
- Prevent deadlock in DbLayer by not using RxJava computation thread to publish updates from the queue
- Improve dataserver priming performance and memory profile

### Features
- Allow encoding of refresh token on EVENT_LOGIN_AUTH nack for MFA workflows
- add sync db interface

## Genesis 6.6.18(genesis-server)

### Breaking changes
:::
Please note the previous version required some emergency changes to interfaces using bytecode inlining, therefore if you upgrade to this version from < 6.6.17, you MUST use version 6.6.6 of AUTH as well.
:::

### Features
- Add sync db interface

### Fixes
- Make logging async by default
- genesisInstall has to be run twice to install sysdef changes from site-specific

## Genesis 6.6.17(genesis-server)

### Breaking changes

- (dataserver): backwardsjoin memory and throughput improvements, and deadlock fix

:::
Please note the above change required some emergency changes to interfaces using bytecode inlining, therefore if you upgrade to this version you MUST use version 6.6.6 of AUTH as well.
:::

### Fixes
- Prevent deadlock in DbLayer by not using RxJava computation thread to publish updates from the queue
- Improve dataserver priming performance and memory profile
- killProcessRestarter is not killing processRestarter process

## Genesis 6.7.2(genesis-server)

### Fixes
- (dataserver): backwardsjoin memory and throughput improvements, and deadlock fix
- ConsulServiceDiscovery localhost() method now returns value for sysdef item "ServiceAddress"
- killProcessRestarter is not killing processRestarter process

## Genesis 6.7.1(genesis-server)

### Fixes

- Change entityId concatenation in AuthKeyBuilder and SimpleGenericAuthEvaluator

## Genesis 6.6.5(auth-server)

### Fixes
- Handle out of sync updates on auth-perms

# Genesis 6.7.0(elektron-server)

No functional changes.

## Genesis 6.7.0(market-data-server)

No functional changes.

## Genesis 6.7.0(market-data-server)

No functional changes.

## Genesis 6.7.0(fix-server)

### Features
- Add fix-test module and move TestFixClient and TestFixServer so clients can use them in tests

### Fixes
- Ensure cache entries setting from streamer client is respected in fix xlator plugin
- Ensure exception does not crash process when transaction is terminated
- Fixed issue where password salt would default to null resulting in corrupted SHA512 hash
- Fixed the concurrent logon prevention mechanism causing a process crash
- Gateway process is no longer marked as in warning state when individual session is outside schedule
- Extend field size to prevent unit tests from failing
- Fix wrong dependency version in fix-shared
- Make fix data in column wider

### Dependency changes

- build(deps): bump EnricoMi/publish-unit-test-result-action from 1 to 2
- build(deps): bump actions/checkout from 2 to 3
- build(deps): bump actions/setup-java from 2 to 3
- build(deps): bump artifactory-maven-plugin from 3.2.3 to 3.6.1
- build(deps): bump commons-codec from 1.15 to 1.16.0
- build(deps): bump junit from 4.13 to 4.13.2
- build(deps): bump maven-assembly-plugin from 2.6 to 3.6.0
- build(deps): bump maven-compiler-plugin from 3.8.0 to 3.11.0
- build(deps): bump maven-deploy-plugin from 2.8.2 to 3.1.1
- build(deps): bump maven-jar-plugin from 3.1.1 to 3.3.0
- build(deps): bump maven-plugin-annotations from 3.4 to 3.9.0
- build(deps): bump maven-plugin-api.version from 3.0 to 3.9.2
- build(deps): bump maven-plugin-api.version from 3.9.2 to 3.9.3
- build(deps): bump maven-plugin-api.version from 3.9.3 to 3.9.4
- build(deps): bump maven-plugin-plugin from 3.6.0 to 3.9.0 by
- build(deps): bump maven-release-plugin from 3.0.0 to 3.0.1
- build(deps): bump maven-release-plugin from 3.0.0-M5 to 3.0.0
- build(deps): bump maven-surefire-plugin from 3.0.0-M3 to 3.1.0
- build(deps): bump maven-surefire-plugin from 3.1.0 to 3.1.2
- build(deps): bump objenesis from 2.6 to 3.3
- build(deps): bump quickfix.version from 2.3.0 to 2.3.1
- build(deps): bump versions-maven-plugin from 2.13.0 to 2.15.0
- build(deps): bump versions-maven-plugin from 2.15.0 to 2.16.0

## Genesis 6.7.0(genesis-symphony)

### Breaking changes

- Add Symphony files from genesis-notify and add symphony extension function for use in notify gpal
- Migrated legacy endpoints to GPAL

### Features
- Add Symphony specific tables and views

### Fixes
- Ensure symphony manager jar is included in distribution

## Genesis 6.7.0(auth-server)

### Breaking changes
- Simplified auth internal structure and added GPAL syntax for registering custom authentications
- Nack messages need to implement new interface called GenesisNackReply

### Features
- Add EVENT_LOGIN_DETAILS endpoint to provide login information at any time - Add STATUS_CODE to nack messages
- Add support for "updateOnEntityFields" configuration in auth perms
- Add support for "updateOnUserFields" for GPAL auth perms
- Added ability to configurably have OIDC IDPs treat usernames as case insensitive
- Implement token expiration mechanism by moving REFRESH_TOKEN to USER_SESSION and changing auth flow
- Implemented Notify-based multifactor authenticator
- feat: Move login max tries logic to database table
- Remove usage of SetProblem and adapt to new error format
- Added USER_SESSION table listener

### Fixes
- Add install hook to call DropTable -t USER_SESSION, so the upgrade to 6.7.0 doesn't break remap
- Added USER_NAME to EVENT_CHANGE_USER_PASSWORD to ensure backwards compatibility
- Change http status code for some failures
- PUBLIC_KEY_URL max size is too small for real life examples
- Perform user name lookup based on session id value if user name is unavailable when processing a logout event
- Refresh token authentication should allow for header values and have less priority than username/password
- Remove useless info log statement in UserSessionTableListener
- USER_PROFILES is now optional on EVENT_AMEND_USER and EVENT_INSERT_USER
- Add permissions entry to job instead of step
- Give write-all permission to publish job
- Make SessionManager non-blocking
- Replace wrong attribute "tableName" for "table" in relevant auth-perms xml definitions

### Dependency changes
- build(deps): bump com.auth0:java-jwt from 3.19.2 to 4.4.0
- build(deps): bump com.auth0:jwks-rsa from 0.21.1 to 0.22.0
- build(deps): bump com.jfrog.artifactory from 4.24.21 to 4.32.0
- build(deps): bump com.onelogin:java-saml from 2.6.0 to 2.9.0
- build(deps): bump com.unboundid:unboundid-ldapsdk from 6.0.8 to 6.0.9
- build(deps): bump com.warrenstrange:googleauth from 1.4.0 to 1.5.0
- build(deps): bump commons-codec:commons-codec from 1.10 to 1.15
- build(deps): bump commons-codec:commons-codec from 1.15 to 1.16.0
- build(deps): bump commons-configuration:commons-configuration from 1.9 to 1.10
- build(deps): bump dev.samstevens.totp:totp from 1.7 to 1.7.1
- build(deps): bump org.apache.commons:commons-lang3 from 3.12.0 to 3.13.0
- build(deps): bump org.apache.httpcomponents:httpclient from 4.5.12 to 4.5.14
- build(deps): bump org.awaitility:awaitility-kotlin from 4.1.0 to 4.2.0
- build(deps): bump org.mock-server:mockserver-client-java from 5.13.2 to 5.15.0
- build(deps): bump org.mock-server:mockserver-netty from 5.13.2 to 5.15.0
- build(deps): bump org.mockito.kotlin:mockito-kotlin from 3.2.0 to 4.1.0
- build(deps): bump org.mockito.kotlin:mockito-kotlin from 4.1.0 to 5.0.0
- build(deps): bump org.passay:passay from 1.6.1 to 1.6.3
- build(deps): bump org.sonarqube from 3.3 to 4.0.0.2929
- build(deps): bump org.sonarqube from 4.0.0.2929 to 4.2.0.3129

## Genesis 6.7.0(genesis-notify)

### Breaking changes

- Added severity, header and created_at to screen alert and dynamic rules system, removed embedded JSON
- Added topic and entityId to Screen Alerts, allow exclusion of sender from recipients

### Features
- Integrated Notify routes with permission codes and auth cache

## Genesis 6.7.0(reporting-server)

No functional changes.

## Genesis 6.7.0(genesis-file-server)

## Features
- Initial version of genesis-file-server

## Genesis 6.6.16(genesis-server)

### Breaking changes

- Rename DisplaySensitiveField system property

### Features
- Improves genesis install error message

### Fixes

- Added handling clause for java.sql.Blob in database layer
- Add missing fieldName() in postgres statements so columns are named consistently
- Ensure fixEnumValues works with quoted identifiers

## Genesis 6.7.0(genesis-server)

### Breaking changes

- Remove REFRESH_TOKEN from auth table and move to USER_SESSION table, add REFRESH_TOKEN_TIMEOUT field
- Correct typo in DatabaseCountKeySpreadsystem definition setting
- LogLevel should stop the user from passing -r with incompatible options
- Rename DisplaySensitiveField system property
- Create consistent default arg for --file option in genesis commands: - NextSequenceNumbers.csv
- Resolve thread starvation in sql layer by improving efficiency in backward joins lookup

### Features
- (genesis-cluster): Add ZeroMQProxyUnicastRelayIntervalMs system definition configuration option
- (pal-streamerclient): Expose "cacheEntries" setting in streamerclient definition for backing ChronicleMap
- Adapt BestEffort strategy and add StopOnFirstFailure
- Add "updateOnEntityFields" configuration to auth-perms configuration in XML and GPAL definitions
- Add ExperimentalApi annotation
- Add STATUS_CODE property to error format
- Add context to Data Pipelines onCompletion with additional details
- Add data pipeline context to sink function
- Add updateOnUserFields setting to GPAL auth perms definition
- Added OracleSchemaOwner sysdef item to allow case where db schema is owned by a different user
- Adding additional date format for DbMon so that the displayed format can be used as criteria
- Allow setting of MFA_CODE in LoginAuthAck as Cookie
- Can choose whether to set the data pipelines process state to error per source
- Enable http status code support functionality at the router level
- Exposing additional system property configuration settings for our Database connection pool
- Fix CPU and memory usage on Windows, use Oshi for all OSs
- Implement AllOrNothing strategy
- Implemented schema prefixing for Oracle
- Improve the naming on ranged queries when where clause is used
- Investigate on whether we can deprecate usage of SetProblem
- Make GENESIS_HOME available in data pipelines file sources DSL
- Modified AuthCache interface to allow retrieval of all users permissioned for an entity
- Provide cookie authentication support in router
- Update fixEnumValues to use fieldName over databaseName
- Updates for context in data pipelines onCompletion block
- Add ignoreWeekends parameter to daysPurger, defaults to true
- Adds CPU and Memory usage to process health responses
- Allow SLF4J metrics reporter default log level to be configurable via SysDef
- Allow sources to be declared as variables
- Clear list of rows after every file processing
- Create new options to filter processes by status in mon
- Deploy plugin now creates individual copyJar and copy-script-name tasks for relevant modules
- Improves genesis install error message
- Refactor Install class to use picocli

### Fixes
- (SendTable): Ensure non-nullable fields are inserted as blank strings as part of SendIt to guarantee consistency between DumpTable and SendTable
- (pal-dataserver): Ensure send blocking operations are run in a separate dispatcher to avoid deadlocks
- (pal-dataserver): don't print error statement if DATA_LOGOFF is received during an LMDB query
- (pal-dataserver): fix lookup and message publication metrics
- (remap): --dumpSQL flag now outputs runnable SQL for Oracle dictionary inserts
- (remap): ensure remap respects SCRIPT_JVM_OPTIONS sysdef value
- (remap): ensure system definition properties are taken into account as part of database initialisation
- (router): check db if session auth token not found in cache
- (router): fix fileupload stream handling
- Adapt UserSessionCache implementation and router authentication flows to take into account SESSION_TIMEOUT_MINS instead of non-existence of USER_SESSION records
- Add EVENT_LOGIN_DETAILS to Auth routable messages from GENESIS_ROUTER
- Add SOURCE_REF to messages sent from Quartz Rules Engine
- Add proper validation for non-nullable fields as part of database API validation
- Added handling clause for java.sql.Blob in database layer
- Avoid NoSuchElementException when processing backward join updates and the key mapping can't be found
- Change of Http status code for NOT_AUTHORISED and REQUIRES_APPROVAL
- Change service healthcheck implementation to ensure we also provide access to "warning" processes
- Close camel and coroutine contexts as part of data pipeline destroy, and dataserver's coroutine context in dataserver destroy
- Correct script typo to ensure maven plugins are copied
- DbRecords not being correctly built from view entities on entityDb view operations
- Do not overwrite schema in HikariConfig
- DynamicRulesEngine: Ensure TABLE_OPERATION field changes are taken into account and enable backward joins for view subscriptions
- Ensure all current and future non-sensitive USER fields are included in USER view
- Ensure operations performing FDB key-value deserialization into records work as expected by using direct array equality rather than String conversion
- Exclude Netty dependencies from debezium-connector-oracle as it brings old Netty dependencies transitively
- Fix DumpAuthTable by adding our own implementation and sort user names when serializing
- Fix cookie authentication handler so it doesn't modify the URI for all requests
- Fix deadlock between SubscriberWorker and RxDbImpl due to reuse of Schedulers.computation()
- Fix index comparator used as part of range subscribe operations
- Fix regular expression for criteria replacement logic
- Fixed an issue where Index and constraint rename statements were missing in the Oracle SQL remap output
- Fixed an issue where deletion statements would be missing from --dumpSQL output for Oracle
- Fixed an issue where remap would throw an exception when migrating a string to an enum
- Fixed an issue where the dictionary could not be resolved when DbNamespace has upper case chars
- Fixed an issue whereby a dataserver could deadlock if processing a large number of concurrent logoff messages
- Fixed issue where dictionary deserialisation would fail after upgrade to 6.6
- Fixing modifyAll/upsertAll using SQL layer when setting null values
- Install compact processes arg
- MetaRequest or JsonSchemaRequest doesn't contain the properties of GenesisError as it is interface
- Nack message not sent over the channel for DS_LOGON message type in StreamerServer
- Prevent compilation errors in other platform modules defining fixed config streams
- Register health check note for ProcessState.UP changes
- Remap now respects table fields marked as non-null in SQL DDL
- Remove noisy "println" statement in JoinedRepository class
- Remove usages of python 2 syntax from python3 scripts that cause syntax errors
- Use JodaTime consistently when handling date/datetime parsing and comparisons
- Use correct service address from consul health check
- Add GENESIS_PROCESS entries for processes set not to start
- Add ServiceAddress sysdef option to configure the consul serviceaddress (not consul agent address)
- Add duplicate handling strategy to generated view tasks
- Add full details of child rows on bulk join operations that include backjoins
- Add help message to AppGen
- Add missing fieldName() in statements so columns are named consistently
- Disable daemon analytics
- Ensure fixEnumValues works with quoted identifiers
- Fix code generation for EntityDescription to ensure fieldToPropertyMap field order is the same as row mapper order
- Fix directory tests.
- Fix multiple column handling in SetSequence and SetAutoIncrement
- Fixes on performance improvements
- Handle enum values in data server index
- Handle enums as strings in the db layer
- Handling of download in gpal endpoints
- Illegal argument exception in backwards join processing
- Imports in views script are not replicated in generated code
- Improve error handling if router file is not found
- Improve handling in sys def for platform types which might return null values
- Include error message in failedRow message
- Increase performance for multi row operations on postgres and mssql layers
- pal-dataserver: Ensure Authorisation updates always use the most up-to-date version of the LMDB record
- pal-dataserver: avoid data race condition in LMDB "streamRange" operations and remove false positive ERROR messages
- Present view enums in toDbRecord, as string as per tables
- Set default loglevel.
- Set default timezone to UTC
- Try to handle out off sync dataserver updates in MemoryTableSubscriber
- Update DumpTable to return a non-zero exit code if it fails
- Update FixEnumValues help text
- Upsert operation validation
- Use databaseDetails instead of system.getProperty
- Use databaseDetails when checking for quoted identifiers
- Various endpoint improvements

### Dependency changes
- build(deps): bump actions/cache from 1 to 3
- build(deps): bump actions/checkout from 2 to 3
- build(deps): bump actions/setup-java from 2 to 3
- build(deps): bump aeronVersion from 1.39.0 to 1.41.2 in /genesis-conventions/genesis-dependencies
- build(deps): bump aeronVersion from 1.41.2 to 1.41.3 in /genesis-conventions/genesis-dependencies
- build(deps): bump aeronVersion from 1.41.3 to 1.41.4 in /genesis-conventions/genesis-dependencies
- build(deps): bump akkaVersion from 2.6.19 to 2.8.3 in /genesis-conventions/genesis-dependencies
- build(deps): bump archetype-packaging from 3.0.1 to 3.2.1 in /genesis-parent/genesis-maven-submodules
- build(deps): bump artifactory-maven-plugin from 3.5.1 to 3.6.1 in /genesis-parent/genesis-maven-submodules
- build(deps): bump byteBuddyVersion from 1.14.4 to 1.14.5 in /genesis-conventions/genesis-dependencies
- build(deps): bump byteBuddyVersion from 1.14.5 to 1.14.6 in /genesis-conventions/genesis-dependencies
- build(deps): bump camelVersion from 3.20.3 to 3.20.4 in /genesis-conventions/genesis-dependencies
- build(deps): bump camelVersion from 3.20.4 to 3.20.5 in /genesis-conventions/genesis-dependencies
- build(deps): bump camelVersion from 3.20.5 to 3.20.6 in /genesis-conventions/genesis-dependencies
- build(deps): bump camelVersion from 3.20.6 to 3.21.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump codahaleVersion from 4.2.18 to 4.2.19 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.github.oshi:oshi-core from 6.4.1 to 6.4.2 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.github.oshi:oshi-core from 6.4.2 to 6.4.3 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.github.oshi:oshi-core from 6.4.3 to 6.4.4 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.github.oshi:oshi-core from 6.4.4 to 6.4.5 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.errorprone:error_prone_annotations from 2.11.0 to 2.19.1 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.errorprone:error_prone_annotations from 2.19.1 to 2.20.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.errorprone:error_prone_annotations from 2.20.0 to 2.21.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.errorprone:error_prone_annotations from 2.21.0 to 2.21.1 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.guava:guava from 31.1-jre to 32.0.0-jre in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.guava:guava from 32.0.0-jre to 32.1.1-jre in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.guava:guava from 32.1.1-jre to 32.1.2-jre in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.protobuf:protobuf-java from 3.22.3 to 3.23.3 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.protobuf:protobuf-java from 3.23.3 to 3.23.4 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.protobuf:protobuf-java from 3.23.4 to 3.24.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.google.protobuf:protobuf-java from 3.24.0 to 3.24.1 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.h2database:h2 from 2.1.214 to 2.2.220 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.microsoft.sqlserver:mssql-jdbc from 10.2.0.jre11 to 12.3.1.jre11-preview in /genesis-conventions/genesis-dependencies
- build(deps): bump com.microsoft.sqlserver:mssql-jdbc from 12.3.1.jre11-preview to 12.4.0.jre11-preview in /genesis-conventions/genesis-dependencies
- build(deps): bump com.netflix.governator:governator from 1.17.12 to 1.17.13 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.opencsv:opencsv from 5.7.1 to 5.8 in /genesis-conventions/genesis-dependencies
- build(deps): bump com.squareup.okhttp3:okhttp from 4.10.0 to 4.11.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump commons-configuration:commons-configuration from 1.9 to 1.10 in /genesis-conventions/genesis-dependencies
- build(deps): bump commons-io:commons-io from 2.11.0 to 2.13.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump foundationdb-rs/foundationdb-actions-install from 2.0.0 to 2.1.0
- build(deps): bump groovyVersion from 3.0.17 to 3.0.18 in /genesis-conventions/genesis-dependencies
- build(deps): bump groovyVersion from 3.0.18 to 3.0.19 in /genesis-conventions/genesis-dependencies
- build(deps): bump info.picocli:picocli from 4.6.3 to 4.7.4 in /genesis-conventions/genesis-dependencies
- build(deps): bump io.github.classgraph:classgraph from 4.8.157 to 4.8.160 in /genesis-conventions/genesis-dependencies
- build(deps): bump io.github.classgraph:classgraph from 4.8.160 to 4.8.161 in /genesis-conventions/genesis-dependencies
- build(deps): bump io.github.classgraph:classgraph from 4.8.161 to 4.8.162 in /genesis-conventions/genesis-dependencies
- build(deps): bump io.netty:netty-all from 4.1.91.Final to 4.1.93.Final in /genesis-conventions/genesis-dependencies
- build(deps): bump io.netty:netty-all from 4.1.93.Final to 4.1.94.Final in /genesis-conventions/genesis-dependencies by
- build(deps): bump io.netty:netty-all from 4.1.94.Final to 4.1.96.Final in /genesis-conventions/genesis-dependencies
- build(deps): bump io.reactivex.rxjava3:rxjava from 3.1.5 to 3.1.6 in /genesis-conventions/genesis-dependencies
- build(deps): bump joda-time:joda-time from 2.12.2 to 2.12.5 in /genesis-conventions/genesis-dependencies
- build(deps): bump ktorVersion from 2.3.0 to 2.3.1 in /genesis-conventions/genesis-dependencies
- build(deps): bump ktorVersion from 2.3.1 to 2.3.2 in /genesis-conventions/genesis-dependencies
- build(deps): bump ktorVersion from 2.3.2 to 2.3.3 in /genesis-conventions/genesis-dependencies
- build(deps): bump log4jVersion from 2.19.0 to 2.20.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump maven-archetype-plugin from 3.0.1 to 3.2.1 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-clean-plugin from 3.1.0 to 3.2.0 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-clean-plugin from 3.2.0 to 3.3.1 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-compiler-plugin from 3.8.0 to 3.11.0 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-dependency-plugin from 3.1.1 to 3.6.0 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-deploy-plugin from 3.0.0-M1 to 3.1.1 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-enforcer-plugin from 3.0.0-M2 to 3.3.0 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-install-plugin from 3.1.0 to 3.1.1 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-model from 2.2.1 to 3.9.2 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-model from 3.9.2 to 3.9.3 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-plugin-annotations from 3.7.0 to 3.9.0 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-plugin-api.version from 2.2.1 to 3.9.4 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-plugin-plugin from 3.6.0 to 3.9.0 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-release-plugin from 2.5.3 to 3.0.0 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-release-plugin from 3.0.0 to 3.0.1 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-resources-plugin from 3.2.0 to 3.3.1 in /genesis-parent/genesis-maven-submodules
- build(deps): bump maven-site-plugin from 3.9.1 to 3.12.1 in /genesis-parent/genesis-maven-submodules
- build(deps): bump org.agrona:agrona from 1.17.1 to 1.18.1 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.agrona:agrona from 1.18.1 to 1.18.2 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.agrona:agrona from 1.18.2 to 1.19.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.agrona:agrona from 1.19.0 to 1.19.1 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.apache.commons:commons-compress from 1.21 to 1.23.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.apache.commons:commons-lang3 from 3.12.0 to 3.13.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.apache.ivy:ivy from 2.5.1 to 2.5.2 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.apache.maven.plugins:maven-enforcer-plugin from 3.3.0 to 3.4.0 in /genesis-parent/genesis-maven-submodules
- build(deps): bump org.apache.maven:maven-model from 3.9.3 to 3.9.4 in /genesis-parent/genesis-maven-submodules
- build(deps): bump org.apache.shiro:shiro-core from 1.10.0 to 1.11.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.apache.shiro:shiro-core from 1.11.0 to 1.12.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.checkerframework:checker-qual from 3.33.0 to 3.35.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.checkerframework:checker-qual from 3.35.0 to 3.36.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.checkerframework:checker-qual from 3.36.0 to 3.37.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.freemarker:freemarker from 2.3.31 to 2.3.32 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.hsqldb:hsqldb from 2.7.1 to 2.7.2 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.java-websocket:Java-WebSocket from 1.5.3 to 1.5.4 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.javassist:javassist from 3.29.0-GA to 3.29.2-GA in /genesis-conventions/genesis-dependencies
- build(deps): bump org.lmdbjava:lmdbjava from 0.8.2 to 0.8.3 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.mockito.kotlin:mockito-kotlin from 3.2.0 to 4.1.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.mockito.kotlin:mockito-kotlin from 4.1.0 to 5.0.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.mockito.kotlin:mockito-kotlin from 5.0.0 to 5.1.0 in /genesis-conventions/genesis-dependencies
- build(deps): bump org.zeromq:jeromq from 0.5.2 to 0.5.3 in /genesis-conventions/genesis-dependencies
- build(deps): bump testcontainersVersion from 1.18.0 to 1.18.1 in /genesis-conventions/genesis-dependencies
- build(deps): bump testcontainersVersion from 1.18.1 to 1.18.3 in /genesis-conventions/genesis-dependencies
- build(deps): bump wagon-http from 3.5.2 to 3.5.3 in /genesis-parent/genesis-maven-submodules
- build(deps): downgrade akkaVersion from 2.8.3 to 2.6.19 in /genesis-conventions/genesis-dependencies
- build(deps): remove direct kotlin-poet dependency from /genesis-parent/genesis-maven-submodules

### Performance improvements
- Change SubscriberWorker to perform stripe based concurrent processing

## Genesis 6.6.15(genesis-server)

### Breaking changes
- Resolve thread starvation in sql layer by improving efficiency in backward joins lookup

### Fixes
- (remap): ensure remap respects SCRIPT_JVM_OPTIONS sysdef value
- (remap): ensure system definition properties are taken into account as part of database initialisation
- DbRecords not being correctly built from view entities on entityDb view operations
- Disable daemon analytics
- Exception handling h2 layer
- Fix insert all exception handling and big decimal handling in test
- Handle enums as strings in the db layer

## Genesis 6.6.15(genesis-server)

### Breaking changes
- Resolve thread starvation in sql layer by improving efficiency in backward joins lookup

### Fixes
- (remap): ensure remap respects SCRIPT_JVM_OPTIONS sysdef value
- (remap): ensure system definition properties are taken into account as part of database initialisation
- DbRecords not being correctly built from view entities on entityDb view operations
- Disable daemon analytics
- Exception handling h2 layer
- Fix insert all exception handling and big decimal handling in test
- Handle enums as strings in the db layer

## Genesis 6.6.13(genesis-server)

### Fixes
- Avoid NoSuchElementException when processing backward join updates and the key mapping can't be found
- DynamicRulesEngine: Ensure TABLE_OPERATION field changes are taken into account and enable backward joins for view subscriptions

## Genesis 6.6.2(genesis-symphony)

### Fixes
- Fixed an issue where NotifyRoute records created in EVENT_GATEWAY_CREATE_CHANNEL had wrong gatewayId

## Genesis 6.6.12(genesis-server)

### Features

- Backport changes related to genesis intellij plugin to 6.6
- Show cpu and memory usage

### Fixes
- Fix index comparator used as part of range subscribe operations
- pal-dataserver: Ensure Authorisation updates always use the most up-to-date version of the LMDB record

## Genesis 6.5.16(genesis-server)

### Features

- Backport changes related to genesis intellij plugin to 6.5
- Show cpu and memory usage

### Fixes
- Fix index comparator used as part of range subscribe operations
- pal-dataserver: Ensure Authorisation updates always use the most up-to-date version of the LMDB record

## Genesis 6.6.1(genesis-symphony)

### Fixes
- Ensure symphony manager jar is included in distribution

## Genesis 6.6.2(fix-server)

### Fixes
- Fixed the concurrent logon prevention mechanism causing a process crash
- Gateway process is no longer marked as in warning state when individual session is outside schedule

## Genesis 6.5.15(genesis-server)

### Fixes
- Remove usages of python 2 syntax from python3 scripts that cause syntax errors

## Genesis 6.6.11(genesis-server)

### Fixes
- Change service healthcheck implementation to ensure we also provide access to "warning" processes 
- Fixing modifyAll/upsertAll using SQL layer when setting null values

## Genesis 6.6.10(genesis-server)

### Fixes
- Fix deadlock between SubscriberWorker and RxDbImpl due to reuse of Schedulers.computation()
- Fixed an issue whereby a dataserver could deadlock if processing a large number of concurrent logoff messages
- fix: Remove usages of python 2 syntax from python3 scripts that cause syntax errors

## Genesis 6.6.9(genesis-server)

### Fixes
- Fix DumpAuthTable by adding our own implementation and sort usernames when serializing
- Register health check not for ProcessState.UP changes
- Fix code generation for EntityDescription to ensure fieldToPropertyMap field order is the same as row mapper order

## Genesis 6.6.1(reporting-server)

No functional changes.

## Genesis 6.6.8(genesis-server)

### Features
- Add ExperimentalApi annotation
- Modified AuthCache interface to allow retrieval of all users permissioned for an entity

### Fixes
- Fixed an issue where Index and constraint rename statements were missing in the Oracle SQL remap output

## Genesis 6.6.7(genesis-server)

### Fixes
- Handling of download in gpal endpoints

## Genesis 6.6.4(auth-server)

### Fixes
- Replace wrong attribute "tableName" for "table" in relevant auth-perms xml definitions

## Genesis 6.5.9(auth-server)

### Fixes
- Replace wrong attribute "tableName" for "table" in relevant auth-perms xml definitions

## Genesis 6.6.6(genesis-server)

### Fixes
- Fix regular expression for criteria replacement logic
- Increase performance for multi row operations on postgres and mssql layers

## Genesis 6.6.5(genesis-server)

### Fixes
- Handle enum values in data server index

## Genesis 6.6.3(auth-server)

### Fixes
- Make SessionManager non-blocking

## Genesis 6.5.14(genesis-server)

### Fixes
- Fixed issue where projects with no internal repo access could not build with maven

## Genesis 6.6.4(genesis-server)

### Fixes
- Fixed issue where projects with no internal repo access could not build with maven

## Genesis 6.5.13(genesis-server)

### Fixes
- (SendTable): Ensure non-nullable fields are inserted as blank strings as part of SendIt to guarantee consistency between DumpTable and SendTable
- Prevent warning when running startProcess on python 3.9

## Genesis 6.6.2(auth-server)

### Fixes

- Added USER_NAME to EVENT_CHANGE_USER_PASSWORD to ensure backwards compatibility
- PUBLIC_KEY_URL max size is too small for real life examples

## Genesis 6.5.8(auth-server)

### Fixes
- Added USER_NAME to EVENT_CHANGE_USER_PASSWORD to ensure backwards compatibility
- PUBLIC_KEY_URL max size is too small for real life examples

## Genesis 6.6.3(genesis-server)

### Features
- (genesis-cluster): Add ZeroMQProxyUnicastRelayIntervalMs system definition configuration option

### Fixes
- (SendTable): Ensure non-nullable fields are inserted as blank strings as part of SendIt to guarantee consistency between DumpTable and SendTable

## Genesis 6.5.12(genesis-server)

### Fixes
- Ensure operations performing FDB key-value deserialization into records work as expected by using direct array equality rather than String conversion

## Genesis 6.6.2(genesis-server)

### Features
- Implement AllOrNothing strategy

### Fixes
- (pal-dataserver): Ensure send blocking operations are run in a separate dispatcher to avoid deadlocks
- Ensure operations performing FDB key-value deserialization into records work as expected by using direct array equality rather than String conversion
- Fixed an issue where remap would throw an exception when migrating a string to an enum
- fix: illegal argument exception in backwards join processing

## Genesis 6.6.1(genesis-server)

### Features
- Added OracleSchemaOwner sysdef item to allow case where db schema is owned by a different user 

### Fixes
- (remap): --dumpSQL flag now outputs runnable SQL for Oracle dictionary inserts

## Genesis 6.6.1(auth-server)

### Fixes
- USER_PROFILES is now optional on EVENT_AMEND_USER and EVENT_INSERT_USER

## Genesis 6.5.7(auth-server)

### Fixes
- USER_PROFILES is now optional on EVENT_AMEND_USER and EVENT_INSERT_USER

## Genesis 6.5.3(fix-server)

### Fixes
- Ensure cache entries setting is respected in fix xlator plugin

## Genesis 6.6.1(fix-server)

### Fixes
- Ensure cache entries setting is respected in fix xlator plugin

## Genesis 6.5.11(genesis-server)

### Fixes
- Add SOURCE_REF to messages sent from Quartz Rules Engine
- Prevent compilation errors in other platform modules defining fixed streams

## Genesis 6.6.0(genesis-symphony)


### Features
- Add Symphony files from genesis-notify and add symphony extension function for use in notify gpal
- Add Symphony specific tables and views

## Genesis 6.6.0(auth-server)

### Features
- Add notify messages jar to distribution lib folder
- Added onFirstLogin callback
- Added onLoginSuccess callback
- Returning OIDC logout URL on Logout
- Add expiry field to entity config fields dictionary
- Remove use of expiry field on notify record

### Fixes
- OIDC Configuration that uses ALWAYS_ALLOW user strategy in combination with enabled multi entity permissioning are ignored
- Remove usage of removed classes from notify-messages
- Avoid printing error statements as part of exception handling if the "errorCode" is not INTERNAL_ERROR
- ensure modified fields contains a valid list as part of user update processing logic
- Log last_login on sso login
- Remove blocking operation in InternalAuthorisationChecker
- Users with null passwords in the database are refused authentication

## Genesis 6.6.0(fix-server)

### Features
- Configuration of a FIX gateway can now be done through a GPAL script
- Prevent concurrent distributed sessions when using dynamic configuration

### Fixes
- Convert remaining java files to kotlin to ensure inclusion in the jar
- Ensure exception does not crash process when transaction is terminated
- Ensure session providers are not overwritten when more than one template is specified

## Genesis 6.6.0(elektron-server)

No functional changes.

## Genesis 6.6.0(genesis-notify)

### Features
- Notify route extension tables
- Removed Gateway table and gateway factory classes, made gateways configurable via GPAL
- Remove Symphony and allow notify gpal extension functions
- Remove symphony specific tables and views
- Add dictionaries and event classes from GSF
- Add event handler to delete notify alert
- Added new entityID types SELF and one based one the entity admin fields in sysdef
- Added permission codes to all notify route/rule APIs
- Unit testing added for ScreenAlertExpiry Manager
- Adding time to live to genesisScreenGateway
- Initial add of notify code

### Fixes
- Removed rule type and rule id from dynamic notify event

## Genesis 6.6.0(reporting-server)

No functional changes.

## Genesis 6.6.0(ref_data_app-server)

No functional changes.

## Genesis 6.6.0(market-data-server)

No functional changes.

## Genesis 6.6.0(genesis-file-server)

### Features
- Initial version of genesis-file-server

## Genesis 6.6.0(genesis-server)

### Features
- Remove notify module and related config
- smtpProtocol property in Notify GPAL as enum
- Update notify to use type safe Genesis APIs
- (dynamic-rules): Add view support to the dynamic rule engine
- (pal-streamerclient): Expose "cacheEntries" setting in streamerclient definition for backing ChronicleMap
- Add optional gradle helper tasks to accelerate intellij plugin experience
- AbstractEntityBulkTableSubscriber primary constructor takes RxDb
- Add ServiceDiscovery to Data Pipelines script
- Add an installHook / script to convert non-matching ENUMs to SNAKE_CASE before remap
- Add context to Data Pipelines onCompletion with additional details, plus added StopOnFirstFailure error strategy
- Add data pipeline context to sink function
- Add new functionality to make error handling consistent
- Add onCompletion to Data Pipelines CSV source
- Add overload to EventNack and nack() so users can pass custom error codes
- Add rollback dump for remap
- Add system definition setting to configure cluster chronicle queue timeout
- Added custom exception handler for custom req rep
- Added single place for the GPAL dependencies
- Can choose whether to set the data pipelines process state to error per source
- Enhanced remap dump mode to output to .sql file, and allow commit and dump modes in the same run
- Expose DataServerTest to be used in training Unit Testing
- Improve consistency of Remap error messages and logging
- Remap does not hang indefinitely when it can not connect to the database
- Remap now lists all duplicate values when they are found in a unique index
- ServiceDiscovery is now available in Genesis scripts (*-script.kts)
- Support onCompletion for JSON and XML files
- Updates for context in data pipelines onCompletion block
- Allow maps to be declared on a source
- Convert remap to proper command line utility, including help command and preventing unknown options from being passed
- Framework changes related to router end point scripts
- Generate deprecated annotation on generated repositories
- New web endpoint scripts
- One notify alert record per user
- Revert MESSAGE field size change
- Table derived fields support NullableCalculationContext
- Update default notify config with smtpProtocol enum

### Fixes
- Fixed schema validation errors on events triggered by evaluator rules
- Improve pal-dataserver serialization/deserialization for better performance
- (router): check db if session auth token not found in cache
- (router): fix fileupload stream handling
- Made 'FileUploadFileData' an InputStream
- Add SOURCE_REF to messages sent from Quartz Rules Engine
- Add USER_NAME to outbound GenesisSet sent to event handlers from streamer client
- Do not prepend sequence name with schema when using namespaces in MSSQL
- Ensure all current and future non-sensitive USER fields are included in USER view
- Ensure only relevant EventHandlerClient processes reply messages
- Ensure remap always takes a successful backup of modified tables, including removed tables
- Field change not reflected in the remap summary
- Fix automatic message class imports in GPAL scripts
- Fix codegen when field names are not null and whose name is a kotlin keyword
- Fix deadlock happening as part of failover/reconnect logic
- Fix recoverability issue in certain scenario for streamer/streamerclient interaction and add extra debug logs for easier debuggability
- Fix source ref property on dynamic rules message
- Fix system user name in notify email config builder
- Fixed issue where dictionary deserialisation would fail after upgrade to 6.6
- Only concat schemaname with tablename when using namespaces to ensure table match can be found
- Prevent compilation errors in other platform modules defining fixed streams
- Prevent warning when running startProcess on python 3.9
- Properly close DB connections in RemapTest to avoid Oracle and Postgres timing out
- Remove application table from router cache so GSF can be run without auth
- Remove duplicates from classpath environment variable
- Respect schema validation flag set in context event handlers
- Use RxDb instead of EntityDb in FixDatabaseHookKeys to ensure it can run when no generated code is available
- Use same approach for install hooks execution state management when using HookStateStore=DB
- Add full details of child rows on bulk join operations that include backjoins
- Address JFrog XRAY report vulnerabilities before next minor release
- fix: Allow fields to be defined before joins in view dictionaries
- Better handle fields parameters in type safe database operations
- Catch exceptions thrown during script evaluation for GenesisRun
- Correct deadlock issue in eventhandlers
- Correct error handling that breaks tests
- Ensure RemapTest works for all DBs
- Fix broken email distribution handling in notify
- Fix consolidator index scan
- Fix flaky tests
- Fix ordering in dataserver updates
- Fix race condition between startProcess and processRestarter and prevent multiple instances of processRestarter to run concurrently
- Make jmhimplementation dependency optional using DisablePalTestModules flag
- Make paltest-dictionary-cache optional
- Re-disable non-applicable test case for sqlServer
- Reinstate os.system(startCmd)
- Remove redundant updateDictionary call from FixEnumValuesTest
- Remove usage of sharedFlow in SingleCardinalityJoinRepo
- Support local classes in custom req reps
- Upgrade hsqldb to version 2.7.1
- Using already initialized sys def reader
- Various endpoint improvements

## Genesis 6.5.10(genesis-server)

### Features
- (pal-streamerclient): Expose "cacheEntries" setting in streamerclient definition for backing ChronicleMap

### Fixes
- (router): check db if session auth token not found in cache
- Add USER_NAME to outbound GenesisSet sent to event handlers from streamer client
- Respect schema validation flag set in context event handlers

## Genesis 6.5.9(genesislcap/genesis-server)

### Fixes
- (router): check db if session auth token not found in cache

## Genesis 6.5.6(auth-server)

### Fixes
- Ensure modified fields contains a valid list as part of user update processing logic
- Make SessionManager non-blocking

## Genesis 6.5.8(genesis-server)

### Features
- Add system definition setting to configure cluster chronicle queue timeout

### Fixes
- Fix ordering in dataserver updates
- Reinstate os.system(startCmd)

## Genesis 6.5.7(genesis-server)

### Fixes
- Fix deadlock happening as part of failover/reconnect logic
- Fix recoverability issue in certain scenario for streamer/streamerclient interaction and add extra debug logs for easier debuggability

## Genesis 6.5.6(genesis-server)

### Features
- Add rollback dump for remap

### Fixes
- Fixed schema validation errors on events triggered by evaluator rules
- Fix race conditions on the update queue.
- Correct deadlock issue in eventhandlers
- Fix race condition between startProcess and processRestarter and prevent multiple instances of processRestarter to run concurrently
- Handle local classes in custom req reps

## Genesis 6.5.5(auth-server)

### Fixes
- Remove blocking operation in InternalAuthorisationChecker

## Genesis 6.5.4(auth-server)

### Fixes
- Users with null passwords in the database are refused authentication

## Genesis 6.5.2(auth-server)

### Fixes
- Avoid printing error statements as part of exception handling if the "errorCode" is not INTERNAL_ERROR

## Genesis 6.5.4(genesis-server)

### Fixes
- Use RxDb instead of EntityDb in FixDatabaseHookKeys to ensure it can run when no generated code is available

## Genesis 6.5.3(genesis-server)

### Fixes
- Adding back param authCacheOverride to keep DevTraining compatibility

## Genesis 6.5.2(genesis-server)

### Features
- Add optional gradle helper tasks to accelerate intellij plugin experience
- Enhanced remap dump mode to output to .sql file, and allow commit and dump modes in the same run

### Fixes
- Ensure only relevant EventHandlerClient processes reply messages
- Use same approach for install hooks execution state management when using HookStateStore=DB
- Fix broken email distribution handling in notify

## Genesis 6.5.1 (Auth)

### Features
- Returning OIDC logout URL on Logout

### Fixes
- OIDC Configuration that uses ALWAYS_ALLOW user strategy in combination with enabled multi entity permissioning are ignored

## Genesis 6.5.1 (GSF)
### Fixes
- Only concat schema name with table name when using namespaces to ensure table match can be found































