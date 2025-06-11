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
	"@genesislcap/foundation-openfin": "14.275.1",
	"@genesislcap/foundation-login": "14.275.1",
	"@genesislcap/foundation-layout": "14.275.1",
	"@genesislcap/foundation-fdc3": "14.275.1",
	"@genesislcap/foundation-comms": "14.275.1",
	"@genesislcap/foundation-entity-management": "14.275.1",
	"@genesislcap/foundation-forms": "14.275.1",
	"@genesislcap/foundation-header": "14.275.1",
	"@genesislcap/foundation-i18n": "14.275.1",
	"@genesislcap/g2plot-chart": "14.275.1",
	"@genesislcap/grid-pro": "14.275.1",
	"@genesislcap/grid-tabulator": "14.275.1",
	"@genesislcap/foundation-notifications": "14.275.1",
	"@genesislcap/foundation-testing": "14.275.1",
	"@genesislcap/foundation-utils": "14.275.1",
	"@genesislcap/foundation-store": "14.275.1",
	"@genesislcap/foundation-criteria": "14.275.1",
};
