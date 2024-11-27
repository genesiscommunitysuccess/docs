import React from "react";
import './NewCard.css'

export default function NewCard({ heading, text, link, imageUrl = '/svg/categories-icons/document-svgrepo-com.svg' }) {
  return (
     <a href={link} title={heading} className="new-card-outer">
        <div className="new-card-inner">
          <div className="new-card-main-image-wrapper">
            { imageUrl && (
            <img
              className="new-card-main-image"
              src={imageUrl}
              alt={heading}
            />
            )}
          </div>
          <div className="new-card-main-content">
            <h3>{ heading }</h3>
            <p>
              { text }
            </p>
          </div>
        </div>
      </a>
  )
}