import React, { useState } from "react";

export function CodeSection({ children, style }) {
	return (
		<rapid-design-system-provider>
			<div
				style={{
					backgroundColor: '#292d3e',
					borderRadius: '6px',
					padding: '10px',
					alignItems: 'center',
					display: 'flex',
					...style
				}}
			>
				{children}
			</div>
		</rapid-design-system-provider>
	);
}

export function CodeLabel({ children }) {
  return (
    <label
      style={{
        color: '#bfc7d5',
        paddingRight: '5px',
      }}
    >
      {children}
    </label>
  );
}

export function CollapsibleSlot({ title, description, children }) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => setIsOpen(!isOpen);

	return (
		<div>
			{ description && <p style={{ marginBottom: '10px' }}>{description}</p>}
			<button
				onClick={toggleOpen}
				style={{
					background: "#0078d4",
					color: "#fff",
					border: "none",
					padding: "8px 12px",
					borderRadius: "4px",
					cursor: "pointer",
				}}
			>
				{isOpen ? "Hide" : "Show"} {title}
			</button>
			{isOpen && <div style={{ marginTop: "10px" }}>{children}</div>}
		</div>
	);
}
