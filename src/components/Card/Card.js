import React from "react";
import useBaseUrl from '@docusaurus/useBaseUrl';
import './Card.css'

export default function Card({ heading, text, link, imageUrl = '/svg/categories-icons/document-svgrepo-com.svg', children }) {
  const relativeLink = useBaseUrl(link);
  const relativeImageSrc = useBaseUrl(imageUrl);
  const wrapperStyle = !children ? {} : {
		display: 'contents',
	};

	// Stops the link working when interacting with the live examples
  const handleChildClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <a href={relativeLink} title={heading} className="card-outer">
      <div className="card-inner" style={{overflow: 'hidden'}}>
        <div
          className="card-main-image-wrapper"
          style={wrapperStyle}
          onClick={children ? handleChildClick : undefined}
        >
          {children ? (
						<div style={{overflow: 'hidden'}}>
						{children}
						</div>
          ) : (
            imageUrl && (
              <img
                className="card-main-image"
                src={relativeImageSrc}
                alt={heading}
              />
            )
          )}
        </div>
        <div className="card-main-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-top' }}>
          <h3>{heading}</h3>
          <p>{text}</p>
        </div>
      </div>
    </a>
  )
}
