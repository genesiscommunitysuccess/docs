:::caution Local issuer certificate errors

These may be caused by running GenX CLI in a proxy network that uses self-signed or missing certificates.
`--insecure` flag can be used to skip SSL certificate verification:

`npx @genesislcap/genx@latest --insecure`

:::