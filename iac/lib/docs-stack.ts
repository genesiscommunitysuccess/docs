import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';

const BUCKET_ID = 'test-bucket-1';

export class DocsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, BUCKET_ID, {
      versioned: true
    });
  }
}