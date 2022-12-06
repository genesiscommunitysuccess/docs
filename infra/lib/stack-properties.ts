import * as cdk from 'aws-cdk-lib';

export interface StackOptions {
  stackPrefix: string,
  subdomain: string,
  zone: string,
  gtmId: string,
  enablePullRequestPreviews: boolean,
}

export default interface StackProperties {
    cdkProps?: cdk.StackProps,
    stackOptions: StackOptions
}