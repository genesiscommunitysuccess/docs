---
id: sdlc
title: Software Development Lifecycle
sidebar_label: Software Development Lifecycle
sidebar_position: 3

---
This area looks at the software development lifecycle of a Genesis project, and the approach to Continuous Improvement/Continuous Development.

## Source Control management – Git Workflow

At Genesis we use a hybrid of the Gitflow workflow based on Github Enterprise. The only difference is that genesis uses release branches to encapsulate the changes for each Jira Epic -  i.e. each parallel stream of work on a given product.

![](/img/sdlcpic1.png)

The **master** branch is sacred and (almost) always aligned with production. Direct code commits and pushes are prohibited to the master branch, which is protected by the standard Genesis Git repo set-up.

The **develop** branch is close to production and should only be used for adhoc changes e.g. bug fixes, emergency change requests etc. Direct code commits and pushes are prohibited to the develop branch which is protected by the standard Genesis Git repo setup.

The **develop-X** branch is for Epic X, where X is a short name identifying the epic, e.g. _develop-pershing-interface_. A single project could have a number of develop-X branches. Direct code commits and pushes are prohibited to the develop-X branch, which is protected by the standard Genesis Git repo setup.

The develop and develop-X branches are where all feature branches are merged and where all QA and UAT tests are performed. Only once the develop and develop-X branches have been thoroughly tested and are ready to be deployed to production are they merged into the master branch.

Developers use feature branches to make changes. Feature branches are typically short-lived and relate to a Jira Subtask or Story. When the developer has completed a feature and tested it in a DEV environment, they must submit a Merge Request to merge the change into the develop or develop-X branch.

Merge Requests are subject to manual two-eye code reviews by Senior Developers before approval by the Technical Owner, to be merged onto the develop or master branches. Reviews on the assigned repo Technical Owners is conducted on a quarterly basis by VP of Engineering and VP of Product Development.

Releases are tagged with an explicit version increment, which is then automatically picked up in Jenkins for a full CI/CD build with artifacts deployed to Artifactory.

## Protection of source code 

Source code information and associated items include designs, specifications, verification plans, and validation plans by implementing the following requirements: 

**Program Source Libraries and Code**. Program source libraries and source code are held on internal, centralized genesis repositories in the genesis cloud. Source code is never held on any Dev, Test, UAT or Production systems.

The centralised repositories are replicated and backed up daily across multiple instances to achieve no single point of failure.

**Support Personnel**. Genesis Global production personnel do not have access to program source libraries unless specifically approved.

**Authorisation**. All updates to program source libraries and the issuing of program sources to programmers are only be performed after the authorisation has been approved by the assigned information owner.

## Secure software deployment (CI/CD)

Security is key in every aspect at Genesis and our strategy is to ensure security by automation where feasible. 

Manual operations and interventions on QA, UAT and Production environments are prohibited and only allowed by approval from the VP of Engineering and/or VP of Product Development at Genesis. Approval will only be given if a small urgent/critical patch needs to be applied and there is no time to wait for the full Continuous Integration/Continuous Deployment (CI/CD) cycle to complete. All manual changes are documented and shared with the client representatives.

The distributables generated from the fully automated CD/CI pipelines are autonomous Virtual Machine Images. These images are built from scratch with the latest OS patches:  the latest OS Hardening rules and Genesis products applied through Ansible scripts, resulting in a new machine Image with a specific Genesis product and version.

All product pipelines are triggered by a new tag on the specific master branch, which is protected from direct submissions. The new tag indicates the build’s version number for which Jenkins will build a binary with the version number and automatically publish it to Artifactory.

The Genesis build scripts are not held in the projects’ repos, but in a centralised location that is only accessible by VP of Product Development and VP of Engineering. This ensures consistency and security between the builds and across the projects.

![](/img/sdlcpic2.png)

The Genesis product Machine Images are propagated through the different stages, QA, UAT, Staging and finally Production in a complete tamper-proof operation.

An instance upgrade process is triggered and orchestrated by Genesis Environment Manager (GEM) – see later section on GEM. The new image is instantiated in parallel with the instance targeted for the upgrade. GEM is in charge to copy over the stateful components from running instance to the newly instantiated Instance. The Genesis platform and product are then started on the new instance, and sanity checks are conducted. If if all are passed, the secondary IP is moved from the instance targeted for replacement to the new instance. Upgrades are conducted during pre-approved time slots and are frictionless for end users. The whole process is executed with NPA described in a previous section.

## SAST and vulnerability testing

As an integral part of all our CI/CD pipelines, security sanity checks are carried out. OWASP is used to check that the external libraries used in the Genesis platform and products are protected against security threats. SonarQube in turn performs SAST through static code analysis. 

Critical issues are addressed immediately with a hot patch, issues rated on high severity are addressed in the next minor release and medium to low are addressed in the next major release.

## Secure design principals

At Genesis, we follow industry best practices and well-known patterns when designing our solutions. Any major change to the system design, either through new development or refactoring, is passed through an approval process with the technical stakeholder at genesis, Head of Core Engineering, Head of Web Engineering, Head of Infrastructure, VP of Engineering and VP of Product Development.  The pros and cons of the different design options are brought forward, discussed and when a consensus is reached, the approved design change can be incorporated into the Genesis platform and solutions.

## Segregation of environments

At Genesis Development, QA, UAT and Production environments are completely segregated and by default there are no means of communicating between the environments. If there is an explicit need for inter environment communication, it will need approval from the client and operational actions on the firewalls needs to be executed to allow the connection.

UAT is an exact mirrored set-up of Production, but with its own separated database and with no redundancy.

## Protection of System test Data

Personal information or any other sensitive information is never stored in test databases unless specific authorisation has been given. All sensitive details and content will be removed or modified beyond recognition before use in testing environments.

Production data will never be copied to development computers or stored on development computers.

Any time information is copied from the production environment to the testing environment a log will provide an audit trail of all information transfer.

## Issue tracking

Genesis uses Jira for tracking internal and external user stories, tasks and issues. Genesis’ Jira is fully integrated with the Genesis workflows and other tools, (github, Zendesk etc.) to provide full traceability of a ticket’s life cycle.