"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[8413],{88313:function(e,n,t){t.r(n),t.d(n,{assets:function(){return p},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return u}});var o=t(87462),a=t(63366),i=(t(67294),t(3905)),r=(t(61839),["components"]),s={title:"Web Deployment - Automated",sidebar_label:"Automated Deployment",id:"automated-deployment",keywords:["web","automated deployment","deployment","introduction"],tags:["web","deployment","automated deployment","introduction"]},l=void 0,d={unversionedId:"web/deploying/automated-deployment",id:"version-2022.3/web/deploying/automated-deployment",title:"Web Deployment - Automated",description:"Ideally, an automated pipeline such as a github workflow should be put in place to build, test and deploy the front end every time the master or develop branches are updated.",source:"@site/versioned_docs/version-2022.3/04_web/07_deploying/03_automated-deployment.md",sourceDirName:"04_web/07_deploying",slug:"/web/deploying/automated-deployment",permalink:"/web/deploying/automated-deployment",draft:!1,tags:[{label:"web",permalink:"/tags/web"},{label:"deployment",permalink:"/tags/deployment"},{label:"automated deployment",permalink:"/tags/automated-deployment"},{label:"introduction",permalink:"/tags/introduction"}],version:"2022.3",sidebarPosition:3,frontMatter:{title:"Web Deployment - Automated",sidebar_label:"Automated Deployment",id:"automated-deployment",keywords:["web","automated deployment","deployment","introduction"],tags:["web","deployment","automated deployment","introduction"]},sidebar:"frontendSidebar",previous:{title:"Manual deployment",permalink:"/web/deploying/manual-deployment"},next:{title:"Http Polling Mode",permalink:"/web/http-mode/http-mode"}},p={},u=[{value:"github",id:"github",level:2},{value:"Jenkins",id:"jenkins",level:2},{value:"What the full pipeline might look like",id:"what-the-full-pipeline-might-look-like",level:2}],c={toc:u};function m(e){var n=e.components,s=(0,a.Z)(e,r);return(0,i.kt)("wrapper",(0,o.Z)({},c,s,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Ideally, an automated pipeline such as a github workflow should be put in place to ",(0,i.kt)("em",{parentName:"p"},"build, test and deploy")," the front end every time the master or develop branches are updated."),(0,i.kt)("p",null,"It can be configured to run automatically when something is merged into certain branches or even triggered manually."),(0,i.kt)("h2",{id:"github"},"github"),(0,i.kt)("p",null,"Here is an example of a github workflow, which can trigger a deployment by the click of a button (running the action on github).:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yml"},"# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions\n\nname: GHpages\n\n# Manually triggered\non:\n  workflow_dispatch:\n\njobs:\n  build:\n\n    runs-on: ubuntu-latest\n\n    strategy:\n      matrix:\n        node-version: [16.x]\n        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/\n\n    steps:\n      - uses: actions/checkout@v2\n\n      - name: Configure Node ${{ matrix.node-version }}\n        uses: actions/setup-node@v2\n        with:\n          node-version: ${{ matrix.node-version }}\n          registry-url: https://npm.pkg.github.com/\n          scope: '@genesislcap'\n          \n      - name: Bootstrap\n        working-directory: ./client\n        run: npm run bootstrap\n        env:\n          NODE_AUTH_TOKEN: ${{secrets.GPR_READ_TOKEN}}\n\n      - name: Build\n        working-directory: ./client/web\n        run: npm run build\n        env:\n          NODE_AUTH_TOKEN: ${{secrets.GPR_READ_TOKEN}}\n\n      - name: GitHub Pages action\n          # You may pin to the exact commit or the version.\n          # uses: peaceiris/actions-gh-pages@bbdfb200618d235585ad98e965f4aafc39b4c501\n        uses: peaceiris/actions-gh-pages@v3.7.3\n        with:\n          publish_dir: ../client/web/dist\n          github_token: ${{secrets.GITHUB_TOKEN}}\n")),(0,i.kt)("h2",{id:"jenkins"},"Jenkins"),(0,i.kt)("p",null,"Here is an example, this time of a Jenkins pipeline, to build commits that are tagged with a version and upload them to jfrog / artifactory. "),(0,i.kt)("p",null,"It will also run ",(0,i.kt)("a",{parentName:"p",href:"https://www.sonarqube.org/"},"SonarQube")," analysis and send notifications using Office 365 webhooks. It will likely have to be adjusted based on project setup and external infrastructure."),(0,i.kt)("p",null,(0,i.kt)("img",{src:t(22392).Z,width:"1424",height:"706"})),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"pipeline {\n\xa0\xa0\xa0\xa0agent { label 'centos_7_clean_core' }\n\n\n\n\xa0\xa0\xa0tools {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0nodejs '16.13.2'\n\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0environment {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0REPO_NAME = sh (\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0script: 'git config --get remote.origin.url | cut -d\".\" -f2 | cut -d\"/\" -f2 | xargs',\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0returnStdout: true\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0).trim()\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0PRODUCT_NAME = sh (\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0script: 'git config --get remote.origin.url | cut -d\".\" -f2 | cut -d\"/\" -f2 | cut -d\"-\" -f1 | xargs',\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0returnStdout: true\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0).trim()\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0PRODUCT_BASE = sh (\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0script: 'pwd',\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0returnStdout: true\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0).trim()\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0PACKAGE_NAME = sh (\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0script: 'grep outputPath $(find . -name angular.json) | cut -d\"/\" -f2 | rev | cut -c3- | rev',\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0returnStdout: true\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0).trim()\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0VERSION = sh (\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0script: 'git describe --tags',\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0returnStdout: true\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0).trim()\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0WEBHOOKURL = env.getProperty(\"${PRODUCT_NAME}-webhookURL\")\n\n\n\n\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0stages {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0stage('InstallBuildDependencies') {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0environment {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0ARTIFACTORY_CREDENTIALS = credentials('NPM_Artifactory')\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0steps {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0echo 'Installing build dependencies...'\xa0\xa0\xa0\xa0\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0sh '''\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0echo \"sonar.projectKey=\"$REPO_NAME > sonar-project.properties\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0echo \"sonar.sources=\"$PRODUCT_BASE\"/src\" >> sonar-project.properties\n\n\n\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0cp ${ARTIFACTORY_CREDENTIALS} ~/.npmrc\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0chmod 664 ~/.npmrc\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0npm config set @genesisglobal:registry https://genesisglobal.jfrog.io/artifactory/api/npm/npm-local/\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0npm install\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'''\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0stage('Build prod') {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0steps {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0echo 'Building prod...'\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0sh '''\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0export NODE_OPTIONS=--max_old_space_size=12288\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0npm run build\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'''\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0stage('Package') {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0steps {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0echo 'Creating a deploy package...'\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0sh '''\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0sudo yum -y install zip\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0output=$PRODUCT_NAME-web-$VERSION.zip\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0cd www\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0zip -r $PRODUCT_BASE/$output *\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'''\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0stage('Deploy') {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0steps {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0echo 'Deploying...'\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0script{\xa0\xa0\xa0\xa0\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0output = \"${PRODUCT_NAME}-web-${VERSION}.zip\"\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0def server = Artifactory.server 'genesisartifactory'\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0def uploadSpec = \"\"\"{\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\"files\": [\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0{\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\"pattern\": \"${PRODUCT_BASE}/${output}\",\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\"target\": \"product/${PRODUCT_NAME}/web/${output}\"\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0]\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\"\"\"\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0def buildInfo = server.upload uploadSpec\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0server.publishBuildInfo buildInfo\n\n\n\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0if (env.WEBHOOKURL != \"\") {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0office365ConnectorSend message: \"Deployed\", webhookUrl: \"${WEBHOOKURL}\"\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0stage('SonarQube analysis') {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0environment {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0SCANNER_HOME = tool 'SonarQube_4.5.0'\n\n\n\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0steps {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0withSonarQubeEnv('SonarQube1') {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0sh '''$SCANNER_HOME/bin/sonar-scanner \\\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0-Dsonar.login=\"admin\" \\\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0-Dsonar.password=\"************\"'''\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0stage(\"Dependency Check\") {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0steps {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0dependencycheck additionalArguments: '--out dependency-check-repo_namert.xml --format XML', odcInstallation: '6.0.2'\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0dependencyCheckPublisher pattern: 'dependency-check-repo_namert.xml'\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0catchError {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0echo 'Dependecy check failed'\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0post {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0always {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0echo 'One way or another, I have finished'\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0deleteDir() /* clean up our workspace */\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0failure {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0script{\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0if (env.WEBHOOKURL != \"\") {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0office365ConnectorSend status: \"Failure\", webhookUrl: \"${WEBHOOKURL}\", color: \"d00000\"\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0success {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0script{\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0if (env.WEBHOOKURL != \"\") {\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0office365ConnectorSend status: \"Success\", webhookUrl: \"${WEBHOOKURL}\"\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0}\n\xa0\xa0\xa0\xa0}\n}\n")),(0,i.kt)("p",null,"The generated builds can then be fetched and moved to the correct location on the webserver with another script or ",(0,i.kt)("a",{parentName:"p",href:"/web/deploying/manual-deployment/"},"manually"),"."),(0,i.kt)("h2",{id:"what-the-full-pipeline-might-look-like"},"What the full pipeline might look like"),(0,i.kt)("p",null,(0,i.kt)("img",{src:t(98612).Z,width:"3694",height:"4568"})))}m.isMDXComponent=!0},98612:function(e,n,t){n.Z=t.p+"assets/images/build-pipeline-75969830a10d3906f351e9db5e24ee33.png"},22392:function(e,n,t){n.Z=t.p+"assets/images/jenkins-pipeline-17bbbee8cb29a8e769b3b9fd93285943.png"}}]);