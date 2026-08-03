import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function VerificationCodeInputDemo() {
	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>
			<div style={{ color: 'var(--neutral-foreground-rest)', width: '100%' }}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', flexDirection: 'column' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						<label style={{ fontSize: '14px', fontWeight: '500' }}>Basic (6 digits)</label>
						<rapid-verification-code-input>
							Verification code
						</rapid-verification-code-input>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						<label style={{ fontSize: '14px', fontWeight: '500' }}>4 digits</label>
						<rapid-verification-code-input digits="4">
							Short code
						</rapid-verification-code-input>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						<label style={{ fontSize: '14px', fontWeight: '500' }}>Error state</label>
						<rapid-verification-code-input error value="12">
							Invalid code
						</rapid-verification-code-input>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						<label style={{ fontSize: '14px', fontWeight: '500' }}>Disabled</label>
						<rapid-verification-code-input disabled value="123456">
							Disabled
						</rapid-verification-code-input>
					</div>
				</div>
			</div>
		</CodeSection>
	);
}
