import React from "react";
import useBaseUrl from '@docusaurus/useBaseUrl';
import './Card.css'

export default function Card (props) {
  const { link, heading, text, children, imageUrl, imageAlt, imageLink, footer, className } = props;
  const relativeLink = useBaseUrl(link);
  const relativeImageSrc = useBaseUrl(imageUrl);

  const imageElement = 
    <img
      className="card-main-image"
      src={relativeImageSrc}
      alt={imageAlt || heading}
    />;

  const imageWithWrapper = imageLink ? (
    <a href={imageLink} title={heading} target="_blank" className="card-main-image-wrapper">
      {imageElement}
    </a>
  ) : (
    <div className="card-main-image-wrapper">
      {imageElement}
    </div>
  );

  // Stops the link working when interacting with the live examples
  const handleChildClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const content = (
    <div className="card-inner" style={{ overflow: 'hidden' }}>
      { imageUrl ? imageWithWrapper : null }
      { children && (
        <div className="card-main-children-wrapper" onClick={handleChildClick}>
          {children}
        </div> )
      }
      { (heading || text) && (
      <div className="card-main-content">
        { heading && <h3>{heading}</h3> }
        { text && <p>{text}</p> } 
      </div>
      )}
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
