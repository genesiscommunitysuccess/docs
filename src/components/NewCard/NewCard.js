import React from "react";
import './NewCard.css'

export default function NewCard({ heading, text, linkDocs, linkStorybook, imageUrl }) {
  return (
     <div className="new-card-outer">
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
          <div className="new-card-footer">
            {linkStorybook && (
              <a
                className="new-card-button new-card-button-storybook"
                href={linkStorybook}
                title="Test it"
              >
                test it
              </a>
            )}
            {linkDocs && (
              <a
                className="new-card-button new-card-button-read-docs"
                href={linkDocs}
                title="Read docs"
              >
                read docs
              </a>
            )}
          </div>
        </div>
      </div>
  )
}