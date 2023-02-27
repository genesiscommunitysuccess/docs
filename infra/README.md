# Team Learn documentation site CDK code

This CDK stack builds the AWS infrastructure, which powers the live docs website:

https://learn.genesis.global/docs

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `cdk deploy`      deploy this stack to your default AWS account / region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
* `npm test`        tests your infrastructure chagnes

## Pre-requisites

Ensure you have the CDK toolkit available:

* `npm install -g aws-cdk`

## Environment variables

Note that you'll need to set three mandatory environment variables in order to run any of the above commands. Those environment variables are:

* AWS_ACCOUNT_ID - the AWS Account ID you're targeting
* AWS_REGION - the AWS region you want to deploy into (which must contain the secrets the CDK relies upon)
* ENVIRONMENT - this must be 'TEST' or 'PROD'

How you set these environment variables is largely up to you and may depend on your Operating System. The easiest and most explicit thing to do is to provide them when running any of the above commands. For example:

`AWS_ACCOUNT_ID=12345 AWS_REGION=eu-west-2 ENVIRONMENT=TEST cdk deploy`

## Valid environments

This is a userland concept rather than a CDK one; please see `lib/environments.ts` for a list of
currently supported environments and associated values. At present this mainly boils down to
which domain the site will be deployed to:

* TEST: learn.genesislab.global
* PROD: learn.genesis.global

Both will use the same source repository (genesislcap/docs). TEST should be used for testing
*infrastructure* changes only - it should *not* be used for testing documentation content changes.
Use the standard PR / preview process for that.

## When to run this code

We will not need to run this code very often at all; it simply bootstraps the required AWS
infrastructure needed to power an instance of the docs site and associated docs archive.
As such, we haven't integrated this into any other CI pipelines (like GitHub Actions or Jenkins),
and probably don't need to any time soon.

## Testing infrastructure changes

A skeleton test suite exists under `lib/test` - feel free to add to it when making CDK changes.
