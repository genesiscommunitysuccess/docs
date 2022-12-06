import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as codebuild from '@aws-cdk/aws-codebuild';
import { SecretValue } from 'aws-cdk-lib';
import StackProperties from './stack-properties';

export class AmplifyDocsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, stackProps: StackProperties) {
    const { cdkProps, stackOptions } = stackProps
    super(scope, id, cdkProps);

    const targetDomain = `${stackOptions.subdomain}.${stackOptions.zone}`

    const amplifyApp = new amplify.App(this, stackOptions.stackPrefix + 'DocsAmplifyApp', {
      // Connect Amplify directly with a source repository on GitHub. This allows it
      // to clone and build the repository for us
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'genesislcap',
        repository: 'docs',
        // We have to use a Personal Access Token to authenticate with GitHub. Currently
        // the token used here is generated from Nick Payne's (@makeusabrew on GitHub) account
        // The account needs admin privileges on the repository to set up a one-time read-only
        // deploy key (to clone the repo) and webhook (for PR previews). Due to this association
        // it will stop working if the user's privileges are revoked
        // @see https://github.com/aws-amplify/amplify-hosting/issues/2160 for more discussion
        oauthToken: SecretValue.secretsManager('genesislcap-docs-prod')
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
                'npm config set @genesislcap:registry https://npm.pkg.github.com',
                // this isn't ideal, but the only rights this token has are packages:read. No amount of
                // indirection gymnastics gets us away from the fact Amplify doesn't have the concept of
                // environmental secrets, so however we pass this token value in, it will ultimately be visible
                // in plaintext in the AWS Amplify console. We accept that because:
                // 1. it's a *lot* better than leaking the token in code
                // 2. it's a token we will rotate frequently
                // 3. it's a token which only grants read-only access to our private npm packages (@genesislcap stuff)
                // 4. it's only visible in the AWS console to authenticated users, just as normal secrets are
                'npm config set //npm.pkg.github.com/:_authToken ' + SecretValue.secretsManager('genesislcap-package-token').unsafeUnwrap(),
                'npm install',
              ],
            },
            build: {
              commands: [
                'BASE_URL=/docs/ GTM_ID=$GTM_ID npm run build',
                'mkdir output',
                'mv build output/docs',
              ],
            },
          },
          artifacts: {
            baseDirectory: 'output',
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

    const mainBranch = amplifyApp.addBranch('master', {
      // we need to explicitly tag this branch as the prod branch to iron out some visual kinks in
      // the AWS console (@see https://github.com/aws/aws-cdk/issues/18863)
      stage: 'PRODUCTION',
      environmentVariables: {
        // make sure that only the main branch gets the live Google Analytics tracking code
        GTM_ID: stackOptions.gtmId
      },
      pullRequestPreview: stackOptions.enablePullRequestPreviews
    })
    const archiveBranch = amplifyApp.addBranch('archive', {
      pullRequestPreview: stackOptions.enablePullRequestPreviews
    })

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
    // This is just a convenience redirect: bump requests for the root home page onto the /docs sub path
    amplifyApp.addCustomRule({
      source: '/',
      target: '/docs',
      status: amplify.RedirectStatus.TEMPORARY_REDIRECT
    })
    // rewrites/redirects are processed in order, so if we got here it means the route wasn't valid
    // and so we should fall back to serving the 404 page
    amplifyApp.addCustomRule({
      source: '/<*>',
      target: '/docs/404.html',
      status: amplify.RedirectStatus.NOT_FOUND_REWRITE
    })
  }
}
