#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AmplifyDocsStack } from '../lib/amplify-docs-stack';
import { StackOptions } from '../lib/stack-properties';
import { Environments } from '../lib/environments';

const app = new cdk.App();

const env = {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION
};

if (!env.account || !env.region) {
  throw new Error('Please specify AWS_ACCOUNT_ID and AWS_REGION')
}

const stackOptions: StackOptions | undefined = Environments[process.env.ENVIRONMENT as string]

if (!stackOptions) {
  throw new Error('Please specify an ENVIRONMENT value of TEST or PROD')
}

new AmplifyDocsStack(app, stackOptions.stackPrefix + 'DocsStack', {
  cdkProps: { env },
  stackOptions
})