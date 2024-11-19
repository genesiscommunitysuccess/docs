export function CodeSection({ children, color }) {
	return (
		<div
			style={{
				backgroundColor: '#292d3e',
				borderRadius: '6px',
				padding: '10px',
				alignItems: 'center',
				display: 'flex'
			}}
		>
			{children}
		</div>
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
