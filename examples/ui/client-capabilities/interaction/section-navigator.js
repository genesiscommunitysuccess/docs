import { CodeSection } from '../../documentationBase';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useState, useRef, useLayoutEffect, useMemo } from 'react';

const INITIAL_SECTIONS = [
  { name: 'section1', label: 'Getting Started', states: ['active'] },
  { name: 'section2', label: 'Configuration', states: ['pending'] },
  { name: 'section3', label: 'Implementation', states: [] },
  { name: 'section4', label: 'Testing', states: ['completed'] },
];

export default function SectionNavigatorDemo({ children, color }) {
  const isBrowser = useIsBrowser();
  const sectionNavigatorRef = useRef(null);
  const sections = useMemo(() => INITIAL_SECTIONS, []);
  const [isReady, setIsReady] = useState(false);

  if (isBrowser) {
    const RapidImports = require('../../rapidImports');
    RapidImports.registerComponents();
  }

  useLayoutEffect(() => {
    // Wait for the component to be fully mounted and slots to be assigned
    // Use requestAnimationFrame to ensure DOM is ready after layout
    let rafId;
    const checkReady = () => {
      if (sectionNavigatorRef.current) {
        setIsReady(true);
      } else {
        rafId = requestAnimationFrame(checkReady);
      }
    };
    
    rafId = requestAnimationFrame(checkReady);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const emitEvent = (eventName, detail) => {
    if (sectionNavigatorRef.current) {
      const event = new CustomEvent(eventName, { detail });
      sectionNavigatorRef.current.dispatchEvent(event);
    }
  };

  const handleSetState = (sectionName, stateName) => {
    emitEvent('section-navigator-set-state', { sectionName, stateName });
  };

  const handleClearState = (sectionName, stateName) => {
    emitEvent('section-navigator-clear-state', { sectionName, stateName });
  };

  const handleClearAllStates = (sectionName) => {
    emitEvent('section-navigator-clear-all-states', { sectionName });
  };

  return (
    <CodeSection>
      <div style={{ height: '500px', width: '100%', position: 'relative' }}>
        <rapid-section-navigator
          ref={sectionNavigatorRef}
          sections={isReady ? sections : []}
          scroll-behavior="top"
          disable-auto-scroll-detection={false}
          style={{ height: '100%', width: '100%', opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}
        >
          <div slot="section1" id="section1" style={{ padding: '20px' }}>
            <h2 style={{ color: 'var(--neutral-foreground-rest)' }}>Getting Started</h2>
            <p style={{ color: 'var(--neutral-foreground-rest)' }}>Welcome to the Section Navigator component! This section demonstrates the basic functionality.</p>
            <p style={{ color: 'var(--neutral-foreground-rest)' }}>The Section Navigator provides navigation between different sections with support for state management.</p>
            
            <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <h4 style={{ marginTop: 0, color: '#495057' }}>State Controls</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleSetState('section1', 'active')}
                  style={{ padding: '6px 10px', background: '#007acc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Active
                </button>
                <button
                  onClick={() => handleSetState('section1', 'pending')}
                  style={{ padding: '6px 10px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Pending
                </button>
                <button
                  onClick={() => handleSetState('section1', 'completed')}
                  style={{ padding: '6px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Completed
                </button>
                <button
                  onClick={() => handleClearAllStates('section1')}
                  style={{ padding: '6px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <div slot="section2" id="section2" style={{ padding: '20px' }}>
            <h2 style={{ color: 'var(--neutral-foreground-rest)' }}>Configuration</h2>
            <p style={{ color: 'var(--neutral-foreground-rest)' }}>This section shows how to configure the Section Navigator component.</p>
            <p style={{ color: 'var(--neutral-foreground-rest)' }}>You can customize scroll behavior, state icons, tooltips, and more.</p>
            
            <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <h4 style={{ marginTop: 0, color: '#495057' }}>Configuration Options</h4>
              <ul>
                <li><strong>scroll-behavior:</strong> Controls how sections are scrolled into view</li>
                <li><strong>state-tooltips:</strong> Custom tooltips for state icons</li>
                <li><strong>state-icons:</strong> Custom icons for different states</li>
                <li><strong>disable-auto-scroll-detection:</strong> Disable automatic active section detection</li>
              </ul>
            </div>

            <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <h4 style={{ marginTop: 0, color: '#495057' }}>State Controls</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleSetState('section2', 'active')}
                  style={{ padding: '6px 10px', background: '#007acc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Active
                </button>
                <button
                  onClick={() => handleSetState('section2', 'pending')}
                  style={{ padding: '6px 10px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Pending
                </button>
                <button
                  onClick={() => handleSetState('section2', 'error')}
                  style={{ padding: '6px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Error
                </button>
                <button
                  onClick={() => handleClearAllStates('section2')}
                  style={{ padding: '6px 10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <div slot="section3" id="section3" style={{ padding: '20px' }}>
            <h2 style={{ color: 'var(--neutral-foreground-rest)' }}>Implementation</h2>
            <p style={{ color: 'var(--neutral-foreground-rest)' }}>This section covers the implementation details of the Section Navigator.</p>
            <p style={{ color: 'var(--neutral-foreground-rest)' }}>Learn about the component's API, events, and advanced usage patterns.</p>
            
            <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <h4 style={{ marginTop: 0, color: '#495057' }}>Key Features</h4>
              <ul>
                <li><strong>State Management:</strong> Dynamic state management through custom events</li>
                <li><strong>Auto-scroll Detection:</strong> Automatically updates active section based on scroll position</li>
                <li><strong>Custom Icons:</strong> Support for custom state icons and tooltips</li>
                <li><strong>Responsive Design:</strong> Adapts to different screen sizes</li>
              </ul>
            </div>

            <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <h4 style={{ marginTop: 0, color: '#495057' }}>State Controls</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleSetState('section3', 'active')}
                  style={{ padding: '6px 10px', background: '#007acc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Active
                </button>
                <button
                  onClick={() => handleSetState('section3', 'pending')}
                  style={{ padding: '6px 10px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Pending
                </button>
                <button
                  onClick={() => handleSetState('section3', 'disabled')}
                  style={{ padding: '6px 10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Disabled
                </button>
                <button
                  onClick={() => handleClearAllStates('section3')}
                  style={{ padding: '6px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <div slot="section4" id="section4" style={{ padding: '20px' }}>
            <h2 style={{ color: 'var(--neutral-foreground-rest)' }}>Testing</h2>
            <p style={{ color: 'var(--neutral-foreground-rest)' }}>This section demonstrates the testing capabilities and best practices.</p>
            <p style={{ color: 'var(--neutral-foreground-rest)' }}>The Section Navigator has been thoroughly tested across different scenarios.</p>
            
            <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <h4 style={{ marginTop: 0, color: '#495057' }}>Testing Scenarios</h4>
              <ul>
                <li><strong>State Management:</strong> Testing state transitions and persistence</li>
                <li><strong>Scroll Behavior:</strong> Testing different scroll behaviors</li>
                <li><strong>Event Handling:</strong> Testing custom event dispatching</li>
                <li><strong>Responsive Design:</strong> Testing across different screen sizes</li>
              </ul>
            </div>

            <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <h4 style={{ marginTop: 0, color: '#495057' }}>State Controls</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleSetState('section4', 'active')}
                  style={{ padding: '6px 10px', background: '#007acc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Active
                </button>
                <button
                  onClick={() => handleSetState('section4', 'completed')}
                  style={{ padding: '6px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Completed
                </button>
                <button
                  onClick={() => handleSetState('section4', 'error')}
                  style={{ padding: '6px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Set Error
                </button>
                <button
                  onClick={() => handleClearAllStates('section4')}
                  style={{ padding: '6px 10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </rapid-section-navigator>
      </div>
    </CodeSection>
  );
}
