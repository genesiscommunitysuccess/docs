import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';

const BUCKET_ID = 'test-bucket-1';
const STACK_ID = 'GenesisDocsStack';
const ACCOUNT_ID = '785277322110';

export class DocsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, BUCKET_ID, {
      versioned: true
    });
  }
}

const app = new cdk.App();

new DocsStack(app, STACK_ID, {
  /**
   * This is required for our use of hosted-zone lookup.
   *
   * Lookups do not work at all without an explicit environment
   * specified; to use them, you must specify env.
   * @see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
   */
  env: {
      account: ACCOUNT_ID,
      /**
       * Stack must be in us-east-1, because the ACM certificate for a
       * global CloudFront distribution must be requested in us-east-1.
       */
      region: 'us-east-1',
  }
});

app.synth();