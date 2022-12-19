import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { AmplifyDocsStack } from '../lib/amplify-docs-stack'
import StackProperties from '../lib/stack-properties'

const standardOptions = {
    stackPrefix: 'Test',
    subdomain: 'test',
    zone: 'genesistest.com',
    gtmId: 'GTM-1234',
    enablePullRequestPreviews: false,
    oldDomain: 'olddomain.com'
}

const createStack = (overrides: any = {}) => {
    const stackOptions = Object.assign({}, standardOptions, overrides)
    const app = new cdk.App();
    const stack = new AmplifyDocsStack(app, 'TestStack', {
        stackOptions
    })
    return Template.fromStack(stack);
}

describe('Documentation Stack', () => {
    let template: Template
    beforeEach(() => {
        template = createStack()
    })
    test('points at the correct source repository', () => {
        template.hasResourceProperties('AWS::Amplify::App', {
            Repository: 'https://github.com/genesislcap/docs'
        })
    })

    test('configures two domains', () => {
        template.resourceCountIs('AWS::Amplify::Domain', 2)
    })

    test('generates the correct domain name from the provided options', () => {
        template.hasResourceProperties('AWS::Amplify::Domain', {
            DomainName: 'test.genesistest.com'
        })
    })

    test('generates the correct old domain', () => {
        template.hasResourceProperties('AWS::Amplify::Domain', {
            DomainName: 'olddomain.com'
        })
    })

    test('configures two branches', () => {
        template.resourceCountIs('AWS::Amplify::Branch', 2)
    })

    test('disables pull request previews on both branches', () => {
        template.resourcePropertiesCountIs('AWS::Amplify::Branch', {
            EnablePullRequestPreview: false
        }, 2)
    })

    describe('When PR previews are enabled', () => {
        beforeEach(() => {
            template = createStack({ enablePullRequestPreviews: true })
        })

        test('enables pull request previews on both branches', () => {
            template.resourcePropertiesCountIs('AWS::Amplify::Branch', {
                EnablePullRequestPreview: true
            }, 2)
        })
    })
})