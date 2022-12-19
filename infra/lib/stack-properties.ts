import * as cdk from 'aws-cdk-lib';

export interface StackOptions {
  stackPrefix: string,
  subdomain: string,
  zone: string,
  gtmId: string,
  enablePullRequestPreviews: boolean,
  oldDomain: string,
}

export default interface StackProperties {
    cdkProps?: cdk.StackProps,
    stackOptions: StackOptions
}