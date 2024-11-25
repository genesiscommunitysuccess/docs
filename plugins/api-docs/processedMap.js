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
	"@genesislcap/foundation-comms": "14.217.6",
	"@genesislcap/foundation-entity-management": "14.217.6",
	"@genesislcap/foundation-forms": "14.217.6",
	"@genesislcap/foundation-i18n": "14.217.6",
	"@genesislcap/g2plot-chart": "14.217.6",
	"@genesislcap/grid-pro": "14.217.6",
	"@genesislcap/grid-tabulator": "14.217.6",
	"@genesislcap/foundation-notifications": "14.217.6",
};
