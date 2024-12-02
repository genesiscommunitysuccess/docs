import React from "react";
import useBaseUrl from '@docusaurus/useBaseUrl';
import './Card.css'

export default function Card({ heading, text, link, imageUrl = '/svg/categories-icons/document-svgrepo-com.svg'}) {
  const relativeLink = useBaseUrl(link);
  const relativeImageSrc = useBaseUrl(imageUrl);

  return (
     <a href={relativeLink} title={heading} className="card-outer">
        <div className="card-inner">
          <div className="card-main-image-wrapper">
            { imageUrl && (
            <img
              className="card-main-image"
              src={relativeImageSrc}
              alt={heading}
            />
            )}
          </div>
          <div className="card-main-content">
            <h3>{ heading }</h3>
            <p>
              { text }
            </p>
          </div>
        </div>
      </a>
  )
}