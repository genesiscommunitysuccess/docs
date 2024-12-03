import React from "react";
import useBaseUrl from '@docusaurus/useBaseUrl';
import './Card.css'

export default function Card ({ link, heading, children, imageUrl, imageAlt, footer, className }) {
  const relativeLink = useBaseUrl(link);
  const relativeImageSrc = useBaseUrl(imageUrl);

  // Stops the link working when interacting with the live examples
  const handleChildClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const content = (
    <div className="card-inner" style={{ overflow: 'hidden' }}>
      { imageUrl && (
        <div className="card-main-image-wrapper">
          <img
            className="card-main-image"
            src={relativeImageSrc}
            alt={imageAlt || heading}
          />
          </div>
        )
      }
      { children && (
        <div className="card-main-children-wrapper" onClick={handleChildClick}>
          {children}
        </div> )
      }
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );

  return relativeLink ? (
    <a href={relativeLink} title={heading} className={`card-outer ${className}`}>
      {content}
    </a>
  ) : (
    <div className={`card-outer ${className}`}>
      {content}
    </div>
  );
};
