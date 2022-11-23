import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as codebuild from '@aws-cdk/aws-codebuild';
import { SecretValue } from 'aws-cdk-lib';

const targetDomain = 'npcdktest.learn.genesislab.global'

export class AmplifyDocsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, 'NpTestCdkAmplify', {
      // Connect Amplify directly with a source repository on GitHub. This allows it
      // to clone and build the repository for us
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        // this is a private personal repo for POC purposes; it contains a boilerplate Docusaurus
        // website and an 'archive' branch with minimal visual changes so it can be distinguished
        // from 'main'. Aside from the actual content, this fairly closely approximates genesislcap/docs
        owner: 'makeusabrew',
        repository: 'ptest',
        // We'll need to talk to Helpdesk about granting a Personal Access Token to genesislcap/docs
        // The PAT needs write permissions on the repository which is unfortunate, as it's only
        // to install a webhook needed for PR previews (and to see the private repo in the first place)
        oauthToken: SecretValue.secretsManager('np-gh-pat')
      }),
      // We could replace this with an `amplify.yml` in the root of the project, but it'd amount to
      // the same thing. It tells Amplify how to build the project and where to find the generated
      // artifacts afterwards
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: '1.0',
        frontend: {
          phases: {
            preBuild: {
              commands: [
                'npm install',
              ],
            },
            build: {
              commands: [
                'npm run build',
              ],
            },
          },
          artifacts: {
            baseDirectory: 'build',
            files: ['**/*'],
          },
        },
      })
    });

    // Add our custom domain to the application. As long as the domain resolves to a locally
    // hosted Route53 zone, this will automatically provision an SSL certificate using DNS validation
    // without explicitly constructing an ACM request elsewhere in the code
    const domain = amplifyApp.addDomain(targetDomain, {
      // we don't want to auto-register subdomains for branches; we will manually control which branches
      // get a subdomain (see below)
      enableAutoSubdomain: false
    })

    const mainBranch = amplifyApp.addBranch('main', {
      // we need to explicitly tag this branch as the prod branch to iron out some kinks in
      // the AWS console (@see https://github.com/aws/aws-cdk/issues/18863)
      stage: 'PRODUCTION'
    })
    const archiveBranch = amplifyApp.addBranch('archive')

    // map the main/master branch to the root of targetDomain
    domain.mapRoot(mainBranch)
    // map the archive branch to archive.${targetDomain}
    domain.mapSubDomain(archiveBranch, 'archive')

    // the current site serves the archive a sub path of the main domain, under /archive. We host
    // it on a separate *subdomain* instead. As a convenience, let's redirect requests in the old
    // format to the correct destination
    amplifyApp.addCustomRule({
      source: '/archive/<*>',
      target: `https://archive.${targetDomain}/<*>`,
      status: amplify.RedirectStatus.TEMPORARY_REDIRECT
    })
    // we've configured docusaurus to think it's being served from `/docs` per A/C, but the docroot
    // is actually `/` (if you could inspect the Amplify file system, all the generated HTML would
    // start at `/`, not `/docs`).
    // in order to honour the A/C and serve the docs from a sub path, we need to transparently rewrite
    // any incoming request under `/docs/*` to `/*` so that they go to the right place on the file system
    // The key here is the `status`. This is a REWRITE, not a REDIRECT, so it happens under the hood
    // rather than redirecting the request.
    amplifyApp.addCustomRule({
      source: '/docs/<*>',
      target: '/<*>',
      status: amplify.RedirectStatus.REWRITE
    })
    // convenience redirect: bump requests for the root domain onto the /docs sub path
    amplifyApp.addCustomRule({
      source: '/',
      target: '/docs',
      status: amplify.RedirectStatus.TEMPORARY_REDIRECT
    })
    // rewrites/redirects are processed in order, so if we got here it means the route wasn't valid
    // and so we should fall back to serving the 404 page
    amplifyApp.addCustomRule({
      source: '/<*>',
      target: '/404.html',
      status: amplify.RedirectStatus.NOT_FOUND_REWRITE
    })
  }
}
