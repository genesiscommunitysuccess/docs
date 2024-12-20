import React from 'react';
import './ScribeFrame.css';

export default function ScribeFrame({ src, title }) {
  return (
    <div className="iframeContainer">
      <iframe
        src={src}
        title={title}
        allowFullScreen
        className="iframe"
      ></iframe>
    </div>
  );
}
