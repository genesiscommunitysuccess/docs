---
title: 'Release notes - Version 2023.1'
sidebar_label: 'Version 2023.1'
sidebar_position: 2
id: version-2023-1
keywords: [operations, release notes, v-2023.1]
tags:
    - operations
    - release notes
    - v-2023.1
---

## Release notes
This is version v2023.1 of the documentation for the Genesis low-code platform.

The basis of this version is:

| part of stack | version | 
|---------------|---------|
| server        | 6.5.1   |  
| web           | 6.0.0   |   

Release date: February 28, 2023. 

## Feature highlights
* **Revamped pending approval workflow** - The pending approval workflow has been revamped to support GPAL configuration and other improvements. More information [here](../../../server/event-handler/advanced/#pending-approvals).
* **Self-service password reset functionality** - The platform now supports self-service password reset capabilities. Please see this [page](../../../server/access-control/password-authentication/#selfservicereset) for more information.
* **JSON Schema validation** - Event Handlers now validate each incoming message based on the implicit JSON schema definition. See more information in [schema validation](../../../server/event-handler/advanced/#disabling-schema-validation) and [inter-process messages](../../../server/inter-process-messages/metadata-annotations/).
* **Case-insensitive user login** - The user name field is now case-insensitive when attempting login operations.
* **Custom permissions support** - A new function called `customPermissions` is available within the `permissioning` block to improve integration with third-party entitlement systems. More information in this [page](../../../server/access-control/authorisation-overview/#custom-permissions-function).
* **OpenID Connect improvements** - It is now possible to set up a new logout workflow within Genesis that also logs out the user from the underlying SSO identity provider.

## Genesis Server Framework (GSF)

:::info

GSF and its modules are compiled using Kotlin 1.7.10 and Gradle 7.5.0.

:::

## GSF

### Breaking changes
- Make username available in scope within a permissioning 'where' clause (see [sample code](../../../server/access-control/authorisation/#where-clauses))
- MS SQL fields now use the appropriate "max length" parameter when the `maxSize` value goes beyond the MS SQL limit. 
- The 'USER' table has been updated to include a unique index for the 'REFRESH_TOKEN' field.
- The minimal safe TLS version is now set to 1.2.
- The pending approval mechanism has had a [major revamp](../../../server/event-handler/advanced/#pending-approvals)).
- JSON [schema validation](../../../server/event-handler/advanced/#disabling-schema-validation) and [inter-process messages](../../../server/inter-process-messages/metadata-annotations/) have been enabled for Event Handlers in GSF.

### Features

- There is now a simple "toValue" extension function to transform/project POJO-like classes between each other.
- We have added '--dumpSQL' feature to remap to allow export of DDL statements.
- DumpIt: Added support to query data based on the TIMESTAMP field.
- There is now a "customPermission" block in GPAL "permissioning" to support integration with third-party entitlement systems.
- We have enabled access to injector property and inject() method in the Data Server GPAL script definition.
- We now allow running containers as non-root users.
- There is now access to self-service password reset without logging in.
- We have enabled case-insensitive support for username as part of the login workflow in GENESIS_ROUTER.
- Auth map is now optional in permissioning GPAL (see this [example](../../../server/access-control/authorisation-overview/#auth-sub-block)).
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

- We have added "customLoginAck" block to auth-preferences, so we can [further customise the login ack message](../../../server/access-control/password-authentication/#customloginack).
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
- `foundation-login`. Use the exported configure function to customise login with the available [config](https://github.com/genesislcap/foundation-ui/blob/v2023.1/packages/foundation/foundation-mf/foundation-login/docs/api/foundation-login.loginconfig.md) settings. Note you need to be running 6.5.0 of `auth` and `genesis` on the back end.
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
- (foundation-entity-management): lifecycle mixin for entitites.ts and users.ts 
- (foundation-testing): add insertRule mock 
- (foundation-ui): adjusting storybook versions 
- (foundation-login): ensure autoConnect is non-blocking 
- (foundation-ui): label made optional and fixed grid filtering issue 
- (foundation-ui): file upload url was missing /gwf prefix. 
- (foundation-login): add hostPath config 
- (foundation-login): update README, logout to '/' 

### Chore
- Improve genx error/help messages  
- Fixing linting error 
- Update orderBy param handling with extra logger.warn
- (grid-pro): included onSortChanged in list of events the save columnState.
- Fixing stylelint error in zero slider
- Address bootstrap warning on serve lib version (forms pkg) 
- Update storybook to V7+ (@next for now)
- Automated releases
- Updated automated commit message format 
- Added design-system-configurator app/package 
- Enable CI to push version commits to protected branches 
- (foundation-comms): delete router logic from comms 
- ensuring PR titles are valid conventional commits 
- (grid-pro): enableCellFlashing option and - autoCellRendererByType improvement. 
- Separate Slack channel for Web releases
- Update CODEOWNERS file 
- (foundation-header): added part names to logo elements. 
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









