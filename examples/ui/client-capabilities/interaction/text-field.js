import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function TextFieldDemo({ children, color }) {

	const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}

	return (
		<CodeSection>


			<div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>

					<rapid-text-field placeholder="Sample text" type={"text"}>Text Field</rapid-text-field>

					<rapid-text-field placeholder="Format: .+@example\.com" type={"email"} pattern=".+@example\.com">Email Text Field</rapid-text-field>

					<rapid-text-field placeholder="Format: https://.*" type={"password"} pattern="https://.*">Password Text Field</rapid-text-field>

					<rapid-text-field placeholder="Format: 123-456-7890" type={"tel"} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
						Telephone Text Field
					</rapid-text-field>

					<rapid-text-field placeholder="min='10' max='100'" type={"number"} min="10" max="100">Number Text Field</rapid-text-field>

					<rapid-text-field placeholder="Format: https://.*" type={"url"} pattern="https://.*" size="30">URL Text Field</rapid-text-field>

					<rapid-text-field placeholder="Numeric amount using $ symbol in start slot" type={"text"} inputmode="numeric" pattern="\d*">
						<div slot={"start"}>
							$
						</div>
					</rapid-text-field>

					<rapid-text-field placeholder="Numeric amount using % symbol in end slot" type={"text"} inputmode="numeric" pattern="\d*">
						<div slot={"end"}>
							%
						</div>
					</rapid-text-field>

				</div>
			</div>
		</CodeSection>
	)
}

