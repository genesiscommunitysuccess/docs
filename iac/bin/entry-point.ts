#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import {DocsStack} from '../lib/docs-stack';

const ACCOUNT_ID = '785277322110';
const STACK_ID = 'GenesisDocsStack';

const app = new cdk.App();
new DocsStack(app, STACK_ID, {
  env: { account: ACCOUNT_ID, region: 'us-east-1' },
});