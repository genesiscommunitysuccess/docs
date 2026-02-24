import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

function setup() {
	// Setup
	const isBrowser = useIsBrowser();
	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}
}

export default function NumberFieldDemo({ children, color }) {
	setup();
	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '100%'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', flexDirection: 'column', }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						<label style={{ fontSize: '14px', fontWeight: '500' }}>Basic Number Field</label>
						<rapid-number-field value="1"></rapid-number-field>
					</div>
					
					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						<label style={{ fontSize: '14px', fontWeight: '500' }}>
							Auto Step Precision - Try entering different decimal values (e.g., 100.5, 100.25, 100.125) and use step buttons
						</label>
						<rapid-number-field 
							value="100" 
							autoStepPrecision 
							withFormatting
							placeholder="Enter a number with decimals">
						</rapid-number-field>
						<p style={{ fontSize: '12px', color: 'var(--neutral-foreground-hint)', margin: '4px 0 0 0' }}>
							Step automatically adjusts: 1 for integers, 0.1 for 1 decimal, 0.01 for 2 decimals, etc.
						</p>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						<label style={{ fontSize: '14px', fontWeight: '500' }}>
							Fixed Step (0.5) - Compare with auto step precision above
						</label>
						<rapid-number-field 
							value="10.5" 
							step="0.5" 
							withFormatting
							placeholder="Fixed step: 0.5">
						</rapid-number-field>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						<label style={{ fontSize: '14px', fontWeight: '500' }}>
							Maximum Input Precision (12 digits)
						</label>
						<rapid-number-field 
							value="123456789.123" 
							maximumInputPrecision="12"
							withFormatting
							placeholder="Max 12 significant digits">
						</rapid-number-field>
						<p style={{ fontSize: '12px', color: 'var(--neutral-foreground-hint)', margin: '4px 0 0 0' }}>
							Values exceeding 12 significant digits will be truncated
						</p>
					</div>
				</div>
			</div>
		</CodeSection>
	)
}
