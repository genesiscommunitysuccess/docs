import React from 'react';
import './ScribeFrame.css';
import SvgIcon from '@site/static/svg/learn.svg';

export default function ScribeFrame({ src, title, scroll = false }) {
  if(scroll) {
    src+="&as=scrollable"
  }
  return (
    <div className="iframeContainer">
      <div class="learn-title">
        <SvgIcon class='learn-icon'/>
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