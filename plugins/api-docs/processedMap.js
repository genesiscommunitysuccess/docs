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
	"@genesislcap/foundation-comms": "14.155.0",
	"@genesislcap/foundation-entity-management": "14.155.0",
	"@genesislcap/foundation-filters": "14.155.0",
	"@genesislcap/foundation-forms": "14.155.0",
	"@genesislcap/foundation-header": "14.155.0",
	"@genesislcap/foundation-layout": "14.155.0",
	"@genesislcap/foundation-login": "14.155.0",
	"@genesislcap/foundation-reporting": "14.155.0",
	"@genesislcap/foundation-testing": "14.155.0",
	"@genesislcap/foundation-criteria": "14.155.0",
	"@genesislcap/foundation-errors": "14.155.0",
	"@genesislcap/foundation-events": "14.155.0",
	"@genesislcap/foundation-i18n": "14.155.0",
	"@genesislcap/foundation-logger": "14.155.0",
	"@genesislcap/foundation-marketplace": "14.155.0",
	"@genesislcap/foundation-notifications": "14.155.0",
	"@genesislcap/foundation-shell": "14.155.0",
	"@genesislcap/foundation-state-machine": "14.155.0",
	"@genesislcap/foundation-store": "14.155.0",
	"@genesislcap/foundation-user": "14.155.0",
	"@genesislcap/foundation-utils": "14.155.0",
};
