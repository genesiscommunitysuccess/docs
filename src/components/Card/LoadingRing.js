// Used to show loading ring when bootstraping
// our live examples because the design system provider
// takes a second to load. This also means we can't use
// our own progress ring
const LoadingRing = () => {
  const ringStyles = {
    display: 'flex',
    position: 'relative',
    width: '80px',
    height: '80px',
		margin: '0 auto',
  };

  const ringChildStyles = {
    boxSizing: 'border-box',
    display: 'block',
    position: 'absolute',
    width: '64px',
    height: '64px',
    margin: '8px',
    border: '8px solid #fff',
    borderRadius: '50%',
    animation: 'ring-animation 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
    borderColor: '#3498db transparent transparent transparent',
  };

  const child2Styles = {
    ...ringChildStyles,
    animationDelay: '-0.45s',
  };

  const child3Styles = {
    ...ringChildStyles,
    animationDelay: '-0.3s',
  };

  const child4Styles = {
    ...ringChildStyles,
    animationDelay: '-0.15s',
  };

  return (
    <div style={ringStyles}>
      <style>
        {`
          @keyframes ring-animation {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div style={ringChildStyles}></div>
      <div style={child2Styles}></div>
      <div style={child3Styles}></div>
      <div style={child4Styles}></div>
    </div>
  );
};

export default LoadingRing;
