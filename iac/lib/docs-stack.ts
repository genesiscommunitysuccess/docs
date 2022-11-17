import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { CfnOutput, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

/**
 * This is our PoC site infrastructure, which deploys the site content to a PoC S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
const StaticSiteProps = {
  domainName: 'learn.genesis.global'
}

export class DocsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {zoneName : StaticSiteProps.domainName, hostedZoneId: 'Z00892613KX1P98M08IKK'});
    const BUCKET_ID = 'test-bucket-1';
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'cloudfront-OAI');

    new CfnOutput(this, 'Site', { value: 'https://learn.genesis.global'});

    const docsTestBucket = new s3.Bucket(this, BUCKET_ID, {
      versioned: true,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    //Cloudfront access
    docsTestBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [docsTestBucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));

    new CfnOutput(this, 'Bucket', { value: docsTestBucket.bucketName });

    // TLS certificate
    const certificate = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
      region: 'us-east-1', // Cloudfront only checks this region for certificates.
      hostedZone: zone,
      domainName: StaticSiteProps.domainName
    });
    new CfnOutput(this, 'Certificate', { value: certificate.certificateArn });


    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      certificate: certificate,
      domainNames: [...StaticSiteProps.domainName],
      defaultRootObject: "index.html",
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses:[
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: '/error.html',
          ttl: Duration.minutes(30),
        }
      ],
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(docsTestBucket, {originAccessIdentity: cloudfrontOAI}),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }
    })

    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: StaticSiteProps.domainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('./build')],
      destinationBucket: docsTestBucket,
      distribution,
      distributionPaths: ['/*'],
    });

  }
}