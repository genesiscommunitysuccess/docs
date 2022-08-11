---
title: 'gpl-schema CHANGELOG'
sidebar_label: 'gpl-schema CHANGELOG'
id: gpl-schema-changelog
---

# JSON Schema for DSL IR (Intermediate Representation)

## 0.0.1-alpha.17

22 Jul 2022

* Added datasource configuration ([eda63db](https://github.com/genesislcap/gpl-schema/commit/eda63db))
* Added id for EntityManager | Heading | GenericElement; ([eda63db](https://github.com/genesislcap/gpl-schema/commit/eda63db))

## 0.0.1-alpha.16

21 Jul 2022

* Moved server?: ServerConfiguration from Data to top lvl of IR ([cbd30902](https://github.com/genesislcap/gpl-schema/commit/cbd30902dc73f4c389397f995c3b568e2eb0206a))

## 0.0.1-alpha.15

20 Jul 2022

* Fix issue with entity-manager attribute validation ([94e9052](https://github.com/genesislcap/gpl-schema/commit/94e9052))
* Add a sample JSON file for testing ([94e9052](https://github.com/genesislcap/gpl-schema/commit/94e9052))
* Validate sample JSON file as part of CI build ([94e9052](https://github.com/genesislcap/gpl-schema/commit/94e9052))

## 0.0.1-alpha.14

13 Jul 2022

* Allowing arbitrary attribute string key-value pairs  ([1ee2960](https://github.com/genesislcap/gpl-schema/commit/1ee2960))
* Allowing arbitrary element types  ([1ee2960](https://github.com/genesislcap/gpl-schema/commit/1ee2960))

## 0.0.1-alpha.13

6 Jul 2022

### Features

* In elements change children element type to DSLElement[]  ([da77b88e](https://github.com/genesislcap/gpl-schema/commit/da77b88e))

## 0.0.1-alpha.12

1 Jul 2022

### Features

* Added file creation metadata field for change detection ([8e57787](https://github.com/genesislcap/gpl-schema/commit/8e57787))
* Added optional server URL config to override default ([8e57787](https://github.com/genesislcap/gpl-schema/commit/8e57787))
* Page element made optional for better development experience ([8e57787](https://github.com/genesislcap/gpl-schema/commit/8e57787))

## 0.0.1-alpha.11

22 Jun 2022

### Patches

* Published module renamed to gpl-schema ([c1f2b00](https://github.com/genesislcap/gpl-schema/commit/c1f2b00))

## 0.0.1-alpha.10

21 Jun 2022

### Patches

* Pin orientation moved to column level ([19833e5](https://github.com/genesislcap/gpl-test/commit/19833e5b0e69da0d92a6c92e55643a5b91f2c0fe))

## 0.0.1-alpha.9

17 Jun 2022

### Features

* Make renderers optional and rename to FieldColumnDefinition ([56d8ad5](https://github.com/genesislcap/gpl-test/commit/56d8ad5b94fcb5600f1ef1ebc0a40494f34dede7))

## 0.0.1-alpha.8

17 Jun 2022

### Features

* add optional icon, iconVariant & title string fields ([8589eed](https://github.com/genesislcap/gpl-test/commit/8589eed6bf063b3e12671d24674f164eed725e04))


## 0.0.1-alpha.7

15 Jun 2022

### Features

* add pinOrientation type ([466be1a](https://github.com/genesislcap/gpl-test/commit/466be1af297e4e26692768dbe0fb55adcfe23f55))

## 0.0.1-alpha.6

24 May 2022

### Features

* add cell renderer and action column types ([4e49b05](https://github.com/genesislcap/gpl-test/commit/4e49b05cec134621f945b0ee5ad08472547ab9b1))

### Patches

* fix pipeline ([4e49b05](https://github.com/genesislcap/gpl-test/commit/4e49b05cec134621f945b0ee5ad08472547ab9b1))

## 0.0.1-alpha.5

24 May 2022

### Features

* Add title and createEvent types ([93f0906](https://github.com/genesislcap/gpl-test/commit/93f09067ab01541ffc2971c995242d0868e85d83))

## 0.0.1-alpha.4

20 May 2022

### Changes

* remove CLI from exports ([86622fb](https://github.com/genesislcap/gpl-test/commit/86622fb05f3401e8abe8a0acd9bea01b6e13b05b))

## 0.0.1-alpha.3

18 May 2022

### Features

* validating scripts for DSL JSON files ([b977a35](https://github.com/genesislcap/gpl-test/commit/b977a35b991009cc24b30fd1afe53f1ff4613e53))

### Changes

* rename ir.ts to types.ts ([b977a35](https://github.com/genesislcap/gpl-test/commit/b977a35b991009cc24b30fd1afe53f1ff4613e53))
* exports for all enums/interfaces/types from types.ts ([b977a35](https://github.com/genesislcap/gpl-test/commit/b977a35b991009cc24b30fd1afe53f1ff4613e53))

## 0.0.1-alpha.2

18 May 2022

### Features

* publishing pipeline ([b977a35](https://github.com/genesislcap/gpl-test/commit/b977a35b991009cc24b30fd1afe53f1ff4613e53))

## 0.0.1.alpha

17 May 2022

### Features

* adding initial JSON schema ([f9ce8bc](https://github.com/genesislcap/gpl-test/commit/f9ce8bc96faf679a4e2a080854b9317c7bcc657f))


