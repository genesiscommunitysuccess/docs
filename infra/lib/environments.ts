import { StackOptions }  from "./stack-properties";

type EnvironmentOptions = {
    [key: string]: StackOptions
}

export const Environments: EnvironmentOptions = {
    'TEST': {
        stackPrefix: 'Test',
        subdomain: 'learn',
        zone: 'genesislab.global',
        gtmId: 'GTM-5GTR43J',
        // Without this, PR preview comments double up if we have both TEST and PROD running - gets confusing
        enablePullRequestPreviews: false,
        oldDomain: 'docs.learn.genesislab.global',
    },
    'PROD': {
        stackPrefix: 'Prod',
        subdomain: 'learn',
        zone: 'genesis.gptlobal',
        gtmId: 'GTM-56ZW86Q',
        enablePullRequestPreviews: true,
        oldDomain: 'docs.genesis.global',
    }
}