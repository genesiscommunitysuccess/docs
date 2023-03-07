/**
 * Maintains a processed map instance as a hot reload workaround to avoid re-processing and entering an infinite loop.
 * TODO: Ideally the plugin should run just once in both dev and prod mode, or be skipped during hot reloads.
 */
module.exports = {
    /**
     * I've processed this package already, and tailored the readme output, so including it statically here will stop it
     * from reprocessing during re-builds and retain my changes as final. You can also toggle "enabled": true/false in
     * the manifest.json files itself. Removing this static package ref will always re-process enabled packages.
     */
    "@genesislcap/foundation-entity-management": "10.4.1",
    "@genesislcap/foundation-filters": "10.4.1",
    "@genesislcap/foundation-header": "10.4.1",
    "@genesislcap/foundation-layout": "10.4.1",
    "@genesislcap/foundation-login": "10.4.1",
    "@genesislcap/foundation-reporting": "10.4.1",
    "@genesislcap/foundation-testing": "10.4.1",
    "@genesislcap/foundation-zero": "10.4.1",
}
