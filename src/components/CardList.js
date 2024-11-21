import React from "react";
import { Grid } from '@mui/material';
import Card from './Card';

const generateClassNameFromHref = (href) => {
  return href.replace(/^\/+|\/+$/g, '').toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9-]/g, ''); 
};

export default function CardList({ inRow = 1, xs = 12, sm = 6, md = 4, items }) {
  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid 
          item 
          xs={xs !== 12 ? xs : 12 / inRow} 
          sm={sm !== 6 ? sm : 12 / inRow} 
          md={md !== 4 ? md : 12 / inRow} 
          key={index} 
          sx={{ padding: '1%' }}
          className={generateClassNameFromHref(item.link)}
        >
          <Card
            heading={item.heading}
            link={item.link}
            text={item.text}
            icon={item.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
}