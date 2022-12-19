:::caution Local issuer certificate errors

These may be caused by running `genx` in a proxy network that uses self-signed or missing certificates.
`genx --insecure` can be used to instruct genx to be lenient on SSL handshakes. Please
ensure you are using the latest version by reinstalling it if the message persists:

`npm un -g @genesislcap/foundation-cli && npm i -g @genesislcap/foundation-cli`

:::