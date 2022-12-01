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
    },
    'PROD': {
        stackPrefix: 'Prod',
        subdomain: 'learn',
        zone: 'genesis.global',
        gtmId: 'GTM-56ZW86Q',
    }
}