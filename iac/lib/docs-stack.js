"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.DocsStack = void 0;
var cdk = require("aws-cdk-lib");
var aws_cdk_lib_1 = require("aws-cdk-lib");
var iam = require("aws-cdk-lib/aws-iam");
var cloudfront = require("aws-cdk-lib/aws-cloudfront");
var aws_cdk_lib_2 = require("aws-cdk-lib");
var route53 = require("aws-cdk-lib/aws-route53");
var s3deploy = require("aws-cdk-lib/aws-s3-deployment");
var acm = require("aws-cdk-lib/aws-certificatemanager");
var cloudfront_origins = require("aws-cdk-lib/aws-cloudfront-origins");
var targets = require("aws-cdk-lib/aws-route53-targets");
/**
 * This is our PoC site infrastructure, which deploys the site content to a PoC S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
var StaticSiteProps = {
    domainName: 'learn.genesis.global'
};
var DocsStack = /** @class */ (function (_super) {
    __extends(DocsStack, _super);
    function DocsStack(scope, id, props) {
        var _this = _super.call(this, scope, id, props) || this;
        var zone = route53.HostedZone.fromHostedZoneAttributes(_this, 'Zone', { zoneName: StaticSiteProps.domainName, hostedZoneId: 'Z00892613KX1P98M08IKK' });
        var BUCKET_ID = 'test-bucket-1';
        var cloudfrontOAI = new cloudfront.OriginAccessIdentity(_this, 'cloudfront-OAI');
        new aws_cdk_lib_2.CfnOutput(_this, 'Site', { value: 'https://learn.genesis.global' });
        var docsTestBucket = new aws_cdk_lib_1.aws_s3.Bucket(_this, BUCKET_ID, {
            versioned: true,
            publicReadAccess: false,
            blockPublicAccess: aws_cdk_lib_1.aws_s3.BlockPublicAccess.BLOCK_ALL
        });
        //Cloudfront access
        docsTestBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [docsTestBucket.arnForObjects('*')],
            principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));
        new aws_cdk_lib_2.CfnOutput(_this, 'Bucket', { value: docsTestBucket.bucketName });
        // TLS certificate
        var certificate = new acm.DnsValidatedCertificate(_this, 'SiteCertificate', {
            region: 'us-east-1',
            hostedZone: zone,
            domainName: StaticSiteProps.domainName
        });
        new aws_cdk_lib_2.CfnOutput(_this, 'Certificate', { value: certificate.certificateArn });
        // CloudFront distribution
        var distribution = new cloudfront.Distribution(_this, 'SiteDistribution', {
            certificate: certificate,
            domainNames: __spreadArray([], StaticSiteProps.domainName, true),
            defaultRootObject: "index.html",
            minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 403,
                    responsePagePath: '/error.html',
                    ttl: aws_cdk_lib_2.Duration.minutes(30)
                }
            ],
            defaultBehavior: {
                origin: new cloudfront_origins.S3Origin(docsTestBucket, { originAccessIdentity: cloudfrontOAI }),
                compress: true,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            }
        });
        new aws_cdk_lib_2.CfnOutput(_this, 'DistributionId', { value: distribution.distributionId });
        // Route53 alias record for the CloudFront distribution
        new route53.ARecord(_this, 'SiteAliasRecord', {
            recordName: StaticSiteProps.domainName,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone: zone
        });
        // Deploy site contents to S3 bucket
        new s3deploy.BucketDeployment(_this, 'DeployWithInvalidation', {
            sources: [s3deploy.Source.asset('./build')],
            destinationBucket: docsTestBucket,
            distribution: distribution,
            distributionPaths: ['/*']
        });
        return _this;
    }
    return DocsStack;
}(cdk.Stack));
exports.DocsStack = DocsStack;
