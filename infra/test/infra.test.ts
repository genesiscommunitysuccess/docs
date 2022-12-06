import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { AmplifyDocsStack } from '../lib/amplify-docs-stack'

describe('Documentation Stack', () => {
    let template: Template
    beforeEach(() => {
        const app = new cdk.App();
        const stack = new AmplifyDocsStack(app, 'TestStack', {
            stackOptions: {
                stackPrefix: 'Test',
                subdomain: 'test',
                zone: 'genesistest.com',
                gtmId: 'GTM-1234'
            }
        })
        template = Template.fromStack(stack);
    })
    test('points at the correct source repository', () => {
        template.hasResourceProperties('AWS::Amplify::App', {
            Repository: 'https://github.com/genesislcap/docs'
        })
    })

    test('generates the correct domain name from the provided options', () => {
        template.hasResourceProperties('AWS::Amplify::Domain', {
            DomainName: 'test.genesistest.com'
        })
    })

    test('configures two branches', () => {
        template.resourceCountIs('AWS::Amplify::Branch', 2)
    })
})