import React from "react";
import {Card, CardContent, CardMedia, Typography, CardActionArea} from '@mui/material'
import {ArrowForward} from '@mui/icons-material'

export default function QuickCard({heading, link, text}){
    return (
        
            <Card sx={{backgroundColor: 'var(--warm-gray-4)', padding: '2%', display: 'flexbox', flexGrow: '1', flexDirection: 'row', margin: '1%'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <h4 style={{display: 'flexbox', fontSize: '14px', fontWeight: 'bolder'}}>{heading}</h4>
                    <t style={{display: 'flexbox', fontSize: '14px'}}>{text}</t>
                    <a href={link} style={{display: 'flexbox', fontSize: '12px', fontWeight: 'bold'}}>Read more
                        <ArrowForward sx={{height: '10px', width: 'auto', paddingLeft: '1%'}}/>
                    </a>
                </div>
            </Card>
        
    )
}
