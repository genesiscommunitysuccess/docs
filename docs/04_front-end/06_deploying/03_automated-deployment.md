---
title: 'Automated Deployment'
sidebar_label: 'Automated Deployment'
id: automated-deployment
---

Ideally an automated pipeline such as a github workflow should be put in place to *build, test and deploy* the Front End every time the master or develop branches are updated.

It can be configured to run automatically when something is merged into certain branches or even triggered manually.

<!-- TODO: add an example that's more suitable for external clients, this one is likely only useful to our internal client app devs -->

Here is an example of a github workflow which can trigger a deployment by the click of a button (running the action on github):

```yml
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: GHpages

# Manually triggered
on:
  workflow_dispatch:

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - uses: actions/checkout@v2

      - name: Configure Node ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}
          registry-url: https://npm.pkg.github.com/
          scope: '@genesislcap'
          
      - name: Bootstrap
        working-directory: ./client
        run: npm run bootstrap
        env:
          NODE_AUTH_TOKEN: ${{secrets.GPR_READ_TOKEN}}

      - name: Build
        working-directory: ./client/web
        run: npm run build
        env:
          NODE_AUTH_TOKEN: ${{secrets.GPR_READ_TOKEN}}

      - name: GitHub Pages action
          # You may pin to the exact commit or the version.
          # uses: peaceiris/actions-gh-pages@bbdfb200618d235585ad98e965f4aafc39b4c501
        uses: peaceiris/actions-gh-pages@v3.7.3
        with:
          publish_dir: ../client/web/dist
          github_token: ${{secrets.GITHUB_TOKEN}}
```


Another example, this time of a Jenkins pipeline to automatically build commits that are tagged with a version and upload them to jfrog / artifactory. 

It will also run [SonarQube](https://www.sonarqube.org/) analysis and send notifications using office 365 webhooks. It will likely have to be adjusted based on project setup and external infrastructure.

![](/img/jenkins-pipeline.png)

```
pipeline {
    agent { label 'centos_7_clean_core' }



   tools {
        nodejs '16.13.2'
    }
    environment {
        REPO_NAME = sh (
                script: 'git config --get remote.origin.url | cut -d"." -f2 | cut -d"/" -f2 | xargs',
                returnStdout: true
            ).trim()
        PRODUCT_NAME = sh (
                script: 'git config --get remote.origin.url | cut -d"." -f2 | cut -d"/" -f2 | cut -d"-" -f1 | xargs',
                returnStdout: true
            ).trim()
        PRODUCT_BASE = sh (
                script: 'pwd',
                returnStdout: true
            ).trim()
        PACKAGE_NAME = sh (
                script: 'grep outputPath $(find . -name angular.json) | cut -d"/" -f2 | rev | cut -c3- | rev',
                returnStdout: true
            ).trim()
        VERSION = sh (
                script: 'git describe --tags',
                returnStdout: true
            ).trim()
        WEBHOOKURL = env.getProperty("${PRODUCT_NAME}-webhookURL")



   }
    stages {
        stage('InstallBuildDependencies') {
            environment {
                ARTIFACTORY_CREDENTIALS = credentials('NPM_Artifactory')
            }
            steps {
                echo 'Installing build dependencies...'    
                sh '''
                    echo "sonar.projectKey="$REPO_NAME > sonar-project.properties
                    echo "sonar.sources="$PRODUCT_BASE"/src" >> sonar-project.properties



                   cp ${ARTIFACTORY_CREDENTIALS} ~/.npmrc
                    chmod 664 ~/.npmrc
                    npm config set @genesisglobal:registry https://genesisglobal.jfrog.io/artifactory/api/npm/npm-local/
                    npm install
                '''
                
            }
        }
        stage('Build prod') {
            steps {
                echo 'Building prod...'
                sh '''
                    export NODE_OPTIONS=--max_old_space_size=12288
                    npm run build
                '''
            }
        }
        stage('Package') {
            steps {
                echo 'Creating a deploy package...'
                sh '''
                    sudo yum -y install zip            
                    output=$PRODUCT_NAME-web-$VERSION.zip
                    cd www
                    zip -r $PRODUCT_BASE/$output *
                '''
            }
        }        
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                
                script{    
                    output = "${PRODUCT_NAME}-web-${VERSION}.zip"
                
                    def server = Artifactory.server 'genesisartifactory'
                    def uploadSpec = """{
                        "files": [
                        {
                            "pattern": "${PRODUCT_BASE}/${output}",
                            "target": "product/${PRODUCT_NAME}/web/${output}"
                        }
                        ]
                    }"""
                    def buildInfo = server.upload uploadSpec
                    server.publishBuildInfo buildInfo



                   if (env.WEBHOOKURL != "") {
                        office365ConnectorSend message: "Deployed", webhookUrl: "${WEBHOOKURL}"
                    }
                }
            }
        }
        stage('SonarQube analysis') {
            environment {
                SCANNER_HOME = tool 'SonarQube_4.5.0'



           }
            steps {
                withSonarQubeEnv('SonarQube1') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.login="admin" \
                    -Dsonar.password="************"'''
                }
            }
        }
        stage("Dependency Check") {
            steps {
                dependencycheck additionalArguments: '--out dependency-check-repo_namert.xml --format XML', odcInstallation: '6.0.2'
                dependencyCheckPublisher pattern: 'dependency-check-repo_namert.xml'
                catchError {
                    echo 'Dependecy check failed'
                }
            }
        }
    }
    post {
        always {
            echo 'One way or another, I have finished'
            deleteDir() /* clean up our workspace */
        }
        failure {
            script{
            if (env.WEBHOOKURL != "") {
                    office365ConnectorSend status: "Failure", webhookUrl: "${WEBHOOKURL}", color: "d00000"
                }
            }
        }
        success {
            script{
            if (env.WEBHOOKURL != "") {
                    office365ConnectorSend status: "Success", webhookUrl: "${WEBHOOKURL}"
                }
            }
        }
    }
}
```

The generated builds can then be fetched and moved to the correct location on the webserver with another script or [manually](/front-end/deploying/manual-deployment/).

## What the full pipeline might look like:

![](/img/build-pipeline.png)

<!-- Taken from here https://www.notion.so/genesisglobal/Current-Build-Pipeline-9c9fa95467a24e678ce7f56dbd2bfc87 but not sure if we want to show this diagram to external clients as it's mostly internal stuff including gem -->