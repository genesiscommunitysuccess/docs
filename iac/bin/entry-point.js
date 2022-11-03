#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var cdk = require("aws-cdk-lib");
require("source-map-support/register");
var docs_stack_1 = require("../lib/docs-stack");
var ACCOUNT_ID = '785277322110';
var STACK_ID = 'GenesisDocsStack';
var app = new cdk.App();
new docs_stack_1.DocsStack(app, STACK_ID, {
    env: { account: ACCOUNT_ID, region: 'us-east-1' }
});
