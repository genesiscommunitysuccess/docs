---
id: foundation-UI-4.0.0
title: 'Foundation-UI-4.0.0'
sidebar_label: 'Foundation-UI-4.0.0'
sidebar_position: 2

---

# High level overview

## Features:

- New `flex-layout` component added for easy-to-use [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) layouts (there’s also an upcoming `app-layout` component with UI persistence features).
- **IMPORTANT** `select` / `combobox` / `multiselect` now have their own `datasource` adapters, allowing quick and easy integration with backend data (same as in our grids, but for list elements!)
- New `error-boundary` component added, allowing improved error management for UI elements.
- [Grid column persistence](https://docs.genesis.global/secure/getting-started/go-to-the-next-level/data-grid/#saving-user-preferences) to restore a user’s column preferences between app reloads.
- **IMPORTANT** `charts` component wrapper for `[@ant-design/charts](https://github.com/ant-design/ant-design-charts/)` added, allowing the following types: Line, Area, Bar, Column, Pie, Dual Axes, Rose.
- Added SSO login support for Symphony
- WebSocket connection addresses now fully configurable (auto assignment of `ws:` or `wss:`, and allowing other extensions - default still `/gwf/`)
- New CLI tasks to help end user analyze their component usage and switch design system prefixes. These generate sample code for users to copy from the terminal to their projects.
- `@Auth` / `@Session` bug fixes involving user roles and session storage.
- Added reconnect streams logic for more fault tolerant connection handling.
- A number of Micro Frontend (`foundation-header`, `foundation-reporting`) styling improvements.
- Made the `foundation-header` Micro Frontend more configurable.
- Created How-To and API documentation for several of our Micro Frontends:
    - [Header](https://docs.genesis.global/secure/front-end/micro-front-ends/foundation-header/)
    - [Entity Management](https://docs.genesis.global/secure/front-end/micro-front-ends/foundation-entity-management/)
    - [User Management](https://docs.genesis.global/secure/front-end/micro-front-ends/foundation-user-management/)
    - [Profile Management](https://docs.genesis.global/secure/front-end/micro-front-ends/foundation-profile-management/)
    - [Login](https://docs.genesis.global/secure/front-end/micro-front-ends/foundation-login/)
    - [Reporting](https://docs.genesis.global/secure/front-end/micro-front-ends/front-end-reporting/)
- Productionised foundation-testing for wider consumption, and created [How-To and API documentation](https://internal-web/secure/web/testing/foundation-testing/).
- Added multiple parameter support for Testing Suite in `foundation-testing`
- Add more code examples in our Showcase Client App, including selecting values and labels in our `combobox` programmatically
- Add [slotted-styles](https://docs.genesis.global/secure/getting-started/go-to-the-next-level/customize-look-and-feel/#styling-ag-grid) component to allow overriding component styles.
- Added foundation [contributing](https://github.com/genesislcap/foundation-ui/blob/master/CONTRIBUTING.md), [upgrade](https://github.com/genesislcap/foundation-ui/blob/master/UPGRADE_GUIDE.md) and [release](https://github.com/genesislcap/foundation-ui/blob/master/RELEASE_GUIDE.md) guides.

## Maintenance:

- Various CLI tweaks to support ongoing DSL work.
- Created named release process to support ad-hoc release requests from App Dev.
- `[commitlint](https://commitlint.js.org/#/)` improvements.
- Added prettier to provide unified code formatting automatically.
- Defined a pattern for providing E2E selector hooks for our Micro Frontends, which we’ll continue to rollout.
- CLI will now offer the user a choice between downloading tarballs or using git to clone seeds.
- **IMPORTANT** `http.connect` GSF is now using [HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) with hyphens to match with [nginx](https://www.nginx.com/) default settings, this release (4.0.0) will only be compatible if you’re also with GSF 6.1.4+

## Notes:

Much of our time recently has been focused on improving documentation and the onboarding in general.

This release is 4.0.0 of `[foundation-ui` packages](https://github.com/orgs/genesislcap/packages?repo_name=foundation-ui). We've have chosen to stick to a fixed version across all our foundation-ui packages on this occasion once again. We will likely move back to independent versioning in Q4. As such, this means not all packages will contain breaking changes even though they may move to 4.0.0. Breaking changes will be detailed here, please review for more information.

# Commit Detail

## What's Changed

- PLAT-288 User management amend profile api changes by @skawian in [https://github.com/genesislcap/foundation-ui/pull/380](https://github.com/genesislcap/foundation-ui/pull/380)
- FUI-770 Import types directly to avoid circular dependency by @skawian in [https://github.com/genesislcap/foundation-ui/pull/382](https://github.com/genesislcap/foundation-ui/pull/382)
- PLAT-345 Persisting grid setup in local storage by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/384](https://github.com/genesislcap/foundation-ui/pull/384)
- FUI-781 Ignore storybook output file from eslint. by @skawian in [https://github.com/genesislcap/foundation-ui/pull/388](https://github.com/genesislcap/foundation-ui/pull/388)
- FUI-693 Set up prettier.js by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/387](https://github.com/genesislcap/foundation-ui/pull/387)
- chore: FUI-693 Ignore prettier formatting for md files by @skawian in [https://github.com/genesislcap/foundation-ui/pull/392](https://github.com/genesislcap/foundation-ui/pull/392)
- FUI-693 Format api report with the latest eslint config by @skawian in [https://github.com/genesislcap/foundation-ui/pull/393](https://github.com/genesislcap/foundation-ui/pull/393)
- PLAT-364 chore(foundation-cli): add more readable missing module error by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/390](https://github.com/genesislcap/foundation-ui/pull/390)
- PLAT-352 chore(foundation-cli): adds condition/prompt for cloning or downloading by @gentaDemnushaj in [https://github.com/genesislcap/foundation-ui/pull/386](https://github.com/genesislcap/foundation-ui/pull/386)
- FUI-780 chore(foundation-ui): bump root package.json version to 2.0.0 by @MrBrunoWolff in [https://github.com/genesislcap/foundation-ui/pull/385](https://github.com/genesislcap/foundation-ui/pull/385)
- chore: fixing CLI prompt typo (PLAT-382) by @cistov in [https://github.com/genesislcap/foundation-ui/pull/395](https://github.com/genesislcap/foundation-ui/pull/395)
- FUI-782 chore(error-boundary): Add optional notification type by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/391](https://github.com/genesislcap/foundation-ui/pull/391)
- docs: add contributing, upgrade and release guides ahead of App Dev contributions. FUI-783 by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/394](https://github.com/genesislcap/foundation-ui/pull/394)
- docs: remove misinformation by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/396](https://github.com/genesislcap/foundation-ui/pull/396)
- FUI-784 Simplify workflow for assigning profiles using the latest api by @skawian in [https://github.com/genesislcap/foundation-ui/pull/399](https://github.com/genesislcap/foundation-ui/pull/399)
- PLAT-423 feat(entity-management): adds datasource configuration by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/400](https://github.com/genesislcap/foundation-ui/pull/400)
- PLAT-424 feat(entity-management): add support for row selection by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/402](https://github.com/genesislcap/foundation-ui/pull/402)
- feat PLAT-419 Run SAML SSO via popup when application is running in an iframe by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/403](https://github.com/genesislcap/foundation-ui/pull/403)
- PLAT-424 chore(entity-management): change rowSelected event to rowClicked by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/406](https://github.com/genesislcap/foundation-ui/pull/406)
- feat(foundation-cli): add 'switch design system' task FUI-792 by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/410](https://github.com/genesislcap/foundation-ui/pull/410)
- feat Export styles and add slots to customise foundation-header by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/413](https://github.com/genesislcap/foundation-ui/pull/413)
- PS-33 fix(session): set the remaining fields after refresh by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/415](https://github.com/genesislcap/foundation-ui/pull/415)
- chore FUI-0 Example of programmatically selecting values and labels in combobox by @skawian in [https://github.com/genesislcap/foundation-ui/pull/414](https://github.com/genesislcap/foundation-ui/pull/414)
- FUI-786 feat(toast): add functionality for auto-close by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/412](https://github.com/genesislcap/foundation-ui/pull/412)
- feat(PTC-93)!: Update header template slots by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/418](https://github.com/genesislcap/foundation-ui/pull/418)
- feat(foundation-comms): add reconnectStreams config flag which defaults to true FUI-795 by @monobyte in [https://github.com/genesislcap/foundation-ui/pull/411](https://github.com/genesislcap/foundation-ui/pull/411)
- FUI-797 - chore(foundation-ui): update CODEOWNERS file by @MrBrunoWolff in [https://github.com/genesislcap/foundation-ui/pull/422](https://github.com/genesislcap/foundation-ui/pull/422)
- PTC-93 feat(foundation-header)!: Improve foundation-header API by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/423](https://github.com/genesislcap/foundation-ui/pull/423)
- FUI-549 Layout component by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/350](https://github.com/genesislcap/foundation-ui/pull/350)
- build: enable named releases (client / app specific) FUI-798 by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/425](https://github.com/genesislcap/foundation-ui/pull/425)
- PTF-8 feat(foundation-cli): add dedicated low-code generator flow by @gentaDemnushaj in [https://github.com/genesislcap/foundation-ui/pull/421](https://github.com/genesislcap/foundation-ui/pull/421)
- FUI-799 chore(foundation-ui): add extra commitlint.config issue prefixes by @MrBrunoWolff in [https://github.com/genesislcap/foundation-ui/pull/426](https://github.com/genesislcap/foundation-ui/pull/426)
- PTF-83 refactor(foundation-cli): add condition to overwrite prompt by @gentaDemnushaj in [https://github.com/genesislcap/foundation-ui/pull/428](https://github.com/genesislcap/foundation-ui/pull/428)
- feat FUI-188 allow to pass styles to the element from the template by @skawian in [https://github.com/genesislcap/foundation-ui/pull/427](https://github.com/genesislcap/foundation-ui/pull/427)
- PTF-105 chore(foundation-cli): renamed low-code to flow by @gentaDemnushaj in [https://github.com/genesislcap/foundation-ui/pull/429](https://github.com/genesislcap/foundation-ui/pull/429)
- PTC-136: feat(foundation-header) Add API docs for foundation-header by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/430](https://github.com/genesislcap/foundation-ui/pull/430)
- FUI-808 chore(foundation-header): update Genesis logo by @MrBrunoWolff in [https://github.com/genesislcap/foundation-ui/pull/432](https://github.com/genesislcap/foundation-ui/pull/432)
- chore(foundation-header): Clean up docs and properties by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/433](https://github.com/genesislcap/foundation-ui/pull/433)
- FUI-794 chore(comms): cleanup for auth and session by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/419](https://github.com/genesislcap/foundation-ui/pull/419)
- FUI-808 chore(foundation-header): update logo margin-right value by @MrBrunoWolff in [https://github.com/genesislcap/foundation-ui/pull/437](https://github.com/genesislcap/foundation-ui/pull/437)
- build!: bump to 3.0.0 and release FUI-813 by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/439](https://github.com/genesislcap/foundation-ui/pull/439)
- PTC-91: docs(entity-management)!: Add API docs by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/438](https://github.com/genesislcap/foundation-ui/pull/438)
- FUI-814 fix(foundation-entity-management): revert EntityManagementRoutes removal by @MrBrunoWolff in [https://github.com/genesislcap/foundation-ui/pull/440](https://github.com/genesislcap/foundation-ui/pull/440)
- Fix Commitlint by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/442](https://github.com/genesislcap/foundation-ui/pull/442)
- FUI-814 chore(entity-management): Correct updated API docs by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/443](https://github.com/genesislcap/foundation-ui/pull/443)
- PTC-116 docs(user-management): Added API docs by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/441](https://github.com/genesislcap/foundation-ui/pull/441)
- PTC-117 docs(profile-management): Add API docs by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/445](https://github.com/genesislcap/foundation-ui/pull/445)
- PTC-117 chore(entity-management): Correct failing build from outdated… by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/449](https://github.com/genesislcap/foundation-ui/pull/449)
- FUI-0 chore(foundation-ui): Fail a build with a dirty working tree by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/450](https://github.com/genesislcap/foundation-ui/pull/450)
- feat(foundation-cli): add 'analyze component usage' task and chain to switch design system FUI-790 / FUI-791 by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/434](https://github.com/genesislcap/foundation-ui/pull/434)
- chore(foundation-ui): Run linting pre commit rather than push by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/446](https://github.com/genesislcap/foundation-ui/pull/446)
- PA-152 chore(reporting): styling improvements by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/448](https://github.com/genesislcap/foundation-ui/pull/448)
- PTF-122 fix(flow): block users from naming app using reserved Java wo… by @gentaDemnushaj in [https://github.com/genesislcap/foundation-ui/pull/451](https://github.com/genesislcap/foundation-ui/pull/451)
- PTC-94 docs(foundation-login)!: Added API docs by @matteematt in [https://github.com/genesislcap/foundation-ui/pull/447](https://github.com/genesislcap/foundation-ui/pull/447)
- fix: commitlint FUI-829 by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/454](https://github.com/genesislcap/foundation-ui/pull/454)
- chore(foundation-cli): adds selection option for DSL seed PTF-166 by @gentaDemnushaj in [https://github.com/genesislcap/foundation-ui/pull/456](https://github.com/genesislcap/foundation-ui/pull/456)
- feat added socket extension variable to hostEnv and changed websocket… by @ngWilliams123 in [https://github.com/genesislcap/foundation-ui/pull/455](https://github.com/genesislcap/foundation-ui/pull/455)
- feat: script to generate a list of all third-party npm dependencies PA-157 by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/458](https://github.com/genesislcap/foundation-ui/pull/458)
- PTF-163 rename flow to fuse by @gentaDemnushaj in [https://github.com/genesislcap/foundation-ui/pull/459](https://github.com/genesislcap/foundation-ui/pull/459)
- chore(foundation-entity-management): adjust the permissions after changes on server PA-163 by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/460](https://github.com/genesislcap/foundation-ui/pull/460)
- chore(foundation-cli): added terminal-link dep PTF-163 by @gentaDemnushaj in [https://github.com/genesislcap/foundation-ui/pull/461](https://github.com/genesislcap/foundation-ui/pull/461)
- feat(foundation-testing)!: Adding multiple parameter support to unit testing suite FUI-826 by @Ijaaz-G in [https://github.com/genesislcap/foundation-ui/pull/452](https://github.com/genesislcap/foundation-ui/pull/452)
- Fix(foundation-comms): Changed http header format from underscores to dashes PA-131 by @ChrisPupo22 in [https://github.com/genesislcap/foundation-ui/pull/444](https://github.com/genesislcap/foundation-ui/pull/444)
- feat(foundation-ui): add datasource component for select/multi-select/combobox PA-162 by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/463](https://github.com/genesislcap/foundation-ui/pull/463)
- feat(foundation-ui): use datasource snapshot in reporting PTC-383 by @skawian in [https://github.com/genesislcap/foundation-ui/pull/464](https://github.com/genesislcap/foundation-ui/pull/464)
- refactor: productionise foundation-testing FUI-833 by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/465](https://github.com/genesislcap/foundation-ui/pull/465)
- feat(foundation-ui): add charts component PA-184 by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/466](https://github.com/genesislcap/foundation-ui/pull/466)
- docs: update readme files for testing and store ahead of docs inclusion PTC-419 by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/468](https://github.com/genesislcap/foundation-ui/pull/468)
- feat(foundation-ui): sso in symphony desktop app PA-212 by @SzymonZur in [https://github.com/genesislcap/foundation-ui/pull/470](https://github.com/genesislcap/foundation-ui/pull/470)
- fix(foundation-login): add `data-test-id` attributes to markup FUI-835 by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/469](https://github.com/genesislcap/foundation-ui/pull/469)
- build: bump to 4.0.0 FUI-836 by @derekdon in [https://github.com/genesislcap/foundation-ui/pull/471](https://github.com/genesislcap/foundation-ui/pull/471)

## New Contributors

- @monobyte made their first contribution in [https://github.com/genesislcap/foundation-ui/pull/411](https://github.com/genesislcap/foundation-ui/pull/411)
- @ngWilliams123 made their first contribution in [https://github.com/genesislcap/foundation-ui/pull/455](https://github.com/genesislcap/foundation-ui/pull/455)
- @Ijaaz-G made their first contribution in [https://github.com/genesislcap/foundation-ui/pull/452](https://github.com/genesislcap/foundation-ui/pull/452)
- @ChrisPupo22 made their first contribution in [https://github.com/genesislcap/foundation-ui/pull/444](https://github.com/genesislcap/foundation-ui/pull/444)

**Full Changelog**: [https://github.com/genesislcap/foundation-ui/compare/v2022.2...v4.0.0](https://github.com/genesislcap/foundation-ui/compare/v2022.2...v4.0.0)