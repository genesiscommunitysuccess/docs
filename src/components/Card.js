import React from "react";
import {Card} from '@mui/material'
import {ArrowForward} from '@mui/icons-material'

export default function QuickCard({heading, link, text}){
  return (
    <Card sx={{backgroundColor: 'var(--warm-gray-4)', padding: '2%', display: 'flexbox', flexGrow: '1', flexDirection: 'row', margin: '1%'}} style={{height: '100%'}}>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <h4 style={{display: 'flexbox', fontSize: '16px', fontWeight: 'bolder'}}>{heading}</h4>
        <p style={{display: 'flexbox', fontSize: '16px', flexGrow: '1'}}>{text}</p>
        <a href={link} style={{display: 'flexbox', fontSize: '14px', fontWeight: 'bold'}}>
          Read more
          <ArrowForward sx={{height: '10px', width: 'auto', paddingLeft: '1%'}}/>
        </a>
      </div>
    </Card>
  )
}
