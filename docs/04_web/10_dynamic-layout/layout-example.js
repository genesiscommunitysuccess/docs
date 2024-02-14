import React from "react";

function loadFuiFallback() {
	return import(
		/* webpackMode: "lazy" */
		"@genesislcap/foundation-ui"
	);
}

function loadFoundationLayoutFallback() {
	return import(
		/* webpackMode: "lazy" */
		"@genesislcap/foundation-layout"
	);
}

async function loadRemotes(options) {
	const { registerFoundationDesignSystem } = await loadFuiFallback();

	const { foundationLayoutComponents } = await loadFoundationLayoutFallback();

	return {
		FoundationDesignSystem: registerFoundationDesignSystem().register(
			foundationLayoutComponents,
		),
	};
}

loadRemotes({});

/**
 * Ensure tree shaking doesn't remove these
 * Perhaps we keep these MFs style free, ie. they need to get wrapped to have style applied. Keeping it simple for now.
 */
export { LoadRemotesOptions, loadRemotes };

export default function FoundationLayoutDemo({ children, color }) {
	return (
		<div style={{ width: "600px", height: "500px" }}>
			<foundation-layout>
				<foundation-layout-region>
					<foundation-layout-region type="vertical">
						<foundation-layout-item title="Button">
							<button>Click me!</button>
						</foundation-layout-item>
						<foundation-layout-item title="Checkbox">
							<input type="checkbox" />
						</foundation-layout-item>
					</foundation-layout-region>
					<foundation-layout-item title="Test P">
						<p>Test p tag</p>
					</foundation-layout-item>
				</foundation-layout-region>
			</foundation-layout>
		</div>
	);
}
