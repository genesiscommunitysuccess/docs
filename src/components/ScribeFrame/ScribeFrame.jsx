import React from 'react';
import './ScribeFrame.css';

export default function ScribeFrame({ src, title }) {
  return (
    <div className="iframeContainer">
      <div class="learn-title">
        <img src="./static/svg/learn.svg" alt="learn" class="learn-icon"></img>
        <p class="sbs-title">
          Learn step-by-step
        </p>
      </div>
      <iframe
        src={src}
        title={title}
        allowFullScreen
        className="iframe"
      ></iframe>
    </div>
  );
}
