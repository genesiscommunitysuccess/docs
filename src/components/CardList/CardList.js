import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CardListStyles.css';
import { ArrowForward } from '@mui/icons-material';

const CardList = ({ items }) => {
  const [images, setImages] = useState({});

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = {};
      for (const item of items) {
        try {
          const image = await import(`@site/static/img/${item.image}`);
          loadedImages[item.image] = image.default;
        } catch (err) {
          console.error(`Error loading image: ${err}`);
        }
      }
      setImages(loadedImages);
    };

    loadImages();
  }, [items]);

  return (
    <section className="card-list-wrapper">
      <div className="card-list">
        {items.map((item, index) => (
          <div className="card-list-item">
            <div className="card-list-item-content">
              {images[item.image] && 
                <a href={item.link} key={index} className="card-list-image-wrapper">
                  <img src={images[item.image]} alt={item.title} className="card-list-image" />
                </a>
              }
              <div className="card-list-content">
                <a href={item.link} target="_blank" className="card-list-title">
                  <span>{item.title}</span>
                  <ArrowForward sx={{ height: '10px', width: 'auto', paddingLeft: '1%' }} />
                </a>
                {item.tag && 
                  <div className="card-list-tag-wreapper">
                    <a href={item.tag.link} target="_blank" className="card-list-tag">
                      {item.tag.label}
                    </a>
                  </div>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

CardList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
};

export default CardList;