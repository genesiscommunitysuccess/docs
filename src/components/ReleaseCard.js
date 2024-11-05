import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

export default function ReleaseCard({ blog_link, rn_link, img_url, alt_text }) {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const image = await import(`@site/static/img/release-notes/${img_url}`);
        setImageSrc(image.default);
      } catch (err) {
        console.error(`Error loading image: ${err}`);
      }
    };

    loadImage();
  }, [img_url]);

  return (
    <Card sx={{ backgroundColor: 'var(--warm-gray-4)', padding: '2%', flexGrow: '1', flexDirection: 'row', margin: '1%' }} className='release-card' >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {imageSrc && <img src={imageSrc} alt={alt_text} className="release-card-image"/>}
        <p />
        <a href={blog_link} target="_blank" style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Blog
          <ArrowForward sx={{ height: '10px', width: 'auto', paddingLeft: '1%' }} />
        </a>
        <a href={rn_link} style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Release notes
          <ArrowForward sx={{ height: '10px', width: 'auto', paddingLeft: '1%' }} />
        </a>
      </div>
    </Card>
  );
}

ReleaseCard.propTypes = {
  blog_link: PropTypes.string,
  rn_link: PropTypes.string,
  img_url: PropTypes.string,
  alt_text: PropTypes.string,
};