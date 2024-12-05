// @todo: Remove after updating the documentation where this component is used as QuickCard.
import React from "react";
import { Card as CardMaterial } from '@mui/material'
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Card({ heading, link, text }) {
  const relativeLink = useBaseUrl(link);

  return (
    <a href={relativeLink} title={heading} className="card">
      <CardMaterial 
        sx={{ backgroundColor: 'var(--white)', position: 'relative', padding: '32px', display: 'flexbox', flexGrow: '1', flexDirection: 'row', margin: '1%', borderRadius: "8px" }}
        style={{ height: '100%', boxShadow: 'none' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h4 style={{ display: 'flexbox', fontSize: '26px', fontWeight: '400', fontFamily: "Aeonik" }}>{heading}</h4>
          <p style={{ display: 'flexbox', fontSize: '16px', flexGrow: '1', fontWeight: "400", color: "5B5B5E", fontFamily: "Aeonik" }}>{text}</p>
        </div>
      </CardMaterial>
    </a>
  )
}