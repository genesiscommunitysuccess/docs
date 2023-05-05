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

    const amplifyApp = new amplify.App(this, stackOptions.stackPrefix + 'DocsAmplifyAppPublic', {
      // Connect Amplify directly with a source repository on GitHub. This allows it
      // to clone and build the repository for us
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'genesiscommunitysuccess',
        repository: 'docs',
        // We have to use a Personal Access Token to authenticate with GitHub. 
        // The account needs admin privileges on the repository to set up a one-time read-only
        // deploy key (to clone the repo) and webhook (for PR previews). Due to this association
        // it will stop working if the user's privileges are revoked
        // @see https://github.com/aws-amplify/amplify-hosting/issues/2160 for more discussion
        oauthToken: SecretValue.secretsManager('genesiscommunitysuccess-docs-prod')
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
                'BASE_URL=/docs/ GTM_ID=$GTM_ID BRANCH=$AWS_BRANCH npm run build',
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
      }),
      environmentVariables: {
        // With versioning enabled our Docusaurus builds are getting big, slow, and memory-hungry
        'NODE_OPTIONS': '--max_old_space_size=6144'
      }
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

    // we model the concept of an 'old' domain which exists solely to redirect requests onto
    // the 'new' one. Those requests might come from stale search engine results, old links
    // from other websites, or users typing things into their address bar from their browser history
    // Neither of these domains have any special priority over the other as far as Amplify is concerned,
    // they're just aliases of the auto-generated *.amplifyapp.com domain. It's our custom redirect
    // rules added later which promotes the use of one over the other
    const oldDomain = amplifyApp.addDomain(stackOptions.oldDomain, {
      enableAutoSubdomain: false
    })
    // while we never intend to actually serve any content on the old domain, we have to map a branch
    // to it to generate a valid Cloudformation template
    oldDomain.mapRoot(mainBranch)

    // bump requests for the old 'docs' domain onto the new 'learn' domain. Note that we don't specify
    // a path in the rule so Amplify will preserve whatever it was in the redirected URL
    amplifyApp.addCustomRule({
      source: `https://${stackOptions.oldDomain}`,
      target: `https://${targetDomain}`,
      status: amplify.RedirectStatus.PERMANENT_REDIRECT
    })
    // an old-style docs URL will come in on /secure/* which translates to /docs/* on the new site
    amplifyApp.addCustomRule({
      source: '/secure/<*>',
      target: '/docs/<*>',
      status: amplify.RedirectStatus.PERMANENT_REDIRECT
    })
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
