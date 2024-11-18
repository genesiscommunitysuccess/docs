import React from "react";
import { Card } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'

export default function QuickCard({ heading, link, text}) {
  return (
    <a href={link}>
      <Card sx={{ backgroundColor: 'var(--white)', position: 'relative', padding: '32px', display: 'flexbox', flexGrow: '1', flexDirection: 'row', margin: '1%', borderRadius: "8px" }} style={{ height: '100%', boxShadow: "0 0 1px 0 rgba(0,0,0,.35),0 20px 40px 0 rgba(10,0,74,.07)" }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h4 style={{ display: 'flexbox', fontSize: '26px', fontWeight: '400', fontFamily: "Aeonik" }}>{heading}</h4>
          <p style={{ display: 'flexbox', fontSize: '16px', flexGrow: '1', fontWeight: "400", color: "5B5B5E", fontFamily: "Aeonik" }}>{text}</p>
          {/*<a href={link} style={{display: 'flexbox', fontSize: '14px', fontWeight: 'bold'}}>
          Read more
          <ArrowForward sx={{height: '10px', width: 'auto', paddingLeft: '1%'}}/>
        </a>*/}
        </div>
      </Card>
    </a>
  )
}
