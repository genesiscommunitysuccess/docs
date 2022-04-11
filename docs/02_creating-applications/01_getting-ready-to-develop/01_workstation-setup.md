---
id: workstation-setup
sidebar_label: 'Workstation setup'
sidebar_position: 1
title: 'Workstation setup'
---

Genesis Application Developers need to access on-premise workstations through remote technologies like Citrix, VMware etc.

## Recommended hardware and operating system

* Operating system : Windows 10 Pro
* RAM : 16GB minimum, 32GB preferred (if running full applications locally)
* CPU : 8 Core
* SSD : 250GB

## Recommended software packages

| Package	| Minimum Version| 
|--------------|:-----:|
| IntelliJ	| 2021.1.3|
|Visual Studio Code	| 1.52.1|
|Java SDK| 11|
| Putty	| 0.74|
| Chrome | 88.0|
| Maven	| 3.6.3|
| Postman	| 8|
| Gradle  | 6.8|
| NodeJS  |16 LTS+|

Note that you can use a range of IDEs (for example, Eclipse) with the Genesis low-code platform, but only IntelliJ enables you to make full use of the GPAL prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Genesis strongly recommends using IntelliJ.

## Requirements

* NodeJS (16 LTS+) - https://nodejs.org/en/
* npm 8 (installed with NodeJS)

## .npmrc setup

Access to the Genesis packages requires you to configure the `@genesislcap` scope of `npm` to use our jfrog registry.
You will be provided access details during your on-boarding.

1. Create a `.npmrc` file in or above your intended project directory, likely your user home directory.


 2. Using your credentials, login to the [Genesis repository website](http://genesisglobal.jfrog.io).
 3. Click on the `Welcome <username>` on the top right corner.
 4. From the menu, select `Set Me Up`. This opens a window with `Package Type` and `Repository` dropdowns. 
 5. Select `npm` for package type, and the appropriate repository.
 6. Next type the same password you used to login into the `Type password to insert your credentials to the code snippets` input and hit enter. 
 7. Scroll down to the bottom of the page and copy and paste the .npmrc sample into the file you created in the previous step. This should look something like this:

```shell
@<SCOPE>:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:_password=AAAbbbCCCdddEEEfffGGGhhhIIIjjj111222333444555666777=
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:username=john.doe
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:email=john.doe@company.com
//genesisglobal.jfrog.io/artifactory/api/npm/npm/:always-auth=true
```

8. Replace `<SCOPE>` with `genesislcap`, so that the line reads:
`@genesislcap:registry=http://genesisglobal.jfrog.io/artifactory/api/npm/npm/`

9. Save the file and open a terminal under the directory path of this `.npmrc` file and type:
`npm info @genesislcap/foundation-ui`. If setup was successful, you should see a response like:

```shell
@genesislcap/foundation-ui@0.0.26 | UNLICENSED | deps: 23 | versions: 111
Genesis Foundation UI
```

Please  [reach out to us](mailto:support@genesis.global?subject=.npmrc%20Setup) if you run into any problems.

