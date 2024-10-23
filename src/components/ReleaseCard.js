import React from "react";
import {Card} from '@mui/material'
import {ArrowForward} from '@mui/icons-material'

export default function ReleaseCard({heading, blog_link, rn_link, img_url, alt_text}){
  return (
    <Card sx={{backgroundColor: 'var(--warm-gray-4)', padding: '2%', display: 'flexbox', flexGrow: '1', flexDirection: 'row', margin: '1%'}} style={{height: '100%'}}>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <h4 style={{display: 'flexbox', fontSize: '32px', fontWeight: 'bolder'}}>{heading}</h4>
        <img src={img_url} alt={alt_text}/>
        <p/>
        <a href={blog_link} target="_blank" style={{display: 'flexbox', fontSize: '14px', fontWeight: 'bold'}}>
          Read the blog
          <ArrowForward sx={{height: '10px', width: 'auto', paddingLeft: '1%'}}/>
        </a>
        <p/>
        <a href={rn_link} style={{display: 'flexbox', fontSize: '14px', fontWeight: 'bold'}}>
          View release notes
          <ArrowForward sx={{height: '10px', width: 'auto', paddingLeft: '1%'}}/>
        </a>
      </div>
    </Card>
  )
}
