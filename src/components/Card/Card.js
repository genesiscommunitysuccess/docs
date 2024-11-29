import React from "react";
import './Card.css'

export default function Card({ heading, text, link, imageUrl = '/svg/categories-icons/document-svgrepo-com.svg', children }) {
	const wrapperStyle = !children ? {} : {display: 'contents'};
  return (
    <a href={link} title={heading} className="card-outer">
      <div className="card-inner">
        <div className="card-main-image-wrapper" style={wrapperStyle}>
          {children ? (
            children
          ) : (
            imageUrl && (
              <img
                className="card-main-image"
                src={imageUrl}
                alt={heading}
              />
            )
          )}
        </div>
        <div className="card-main-content">
          <h3>{heading}</h3>
          <p>{text}</p>
        </div>
      </div>
    </a>
  )
}
