import { useRef } from 'react';
import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function DialogDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	const dialogRef = useRef(null);

	return (
		<CodeSection>
			<rapid-button onClick={() => {
				dialogRef.current?.removeAttribute('hidden');
				dialogRef.current?.show();
			}}>
				Open Dialog
			</rapid-button>

			<rapid-dialog
				ref={dialogRef}
				id="example1"
				class="example-dialog"
				aria-label="Simple modal dialog"
				modal="true"
				style={{zIndex: 50}}
				hidden
			>
				<h2>Dialog</h2>
				<p>This is an example dialog.</p>
			</rapid-dialog>
		</CodeSection >
	)
}
