import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useState } from 'react';

export default function CronSchedulerDemo({ inIndex=false }) {

  const isBrowser = useIsBrowser();

	if (isBrowser) {
		const RapidImports = require('../../rapidImports');
		RapidImports.registerComponents();
	}
	const [cron, setCron] = useState('0 30 10 ? * 2,4');
	const styles = inIndex ? { color: 'var(--neutral-foreground-rest)', width: '100%', height: '200px', overflow: 'hidden'} : { color: 'var(--neutral-foreground-rest)', width: '100%', height: '350px'}

	return (
		<CodeSection>
			<div style={styles}>
				<rapid-scheduler-cron-builder cron="0 30 10 ? * 2,4" onChange={(e) => setCron(e.target.value)} >
				</rapid-scheduler-cron-builder>
				<p style={{ color: 'var(--neutral-foreground-rest)', fontSize: 'var(--type-ramp-base-font-size)', padding: 'calc(var(--design-unit) * 4px)'}}>Cron: {cron}</p>
			</div>
		</CodeSection>)
}
