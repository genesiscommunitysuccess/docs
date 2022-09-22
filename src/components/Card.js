import React from "react";
import {Card, CardContent, CardMedia, Typography, CardActionArea} from '@mui/material'
import {ArrowForward} from '@mui/icons-material'

export default function QuickCard({heading, link, text}){
    return (
        
            <Card sx={{backgroundColor: 'var(--warm-gray-4)', padding: '1%', display: 'flex', flexGrow: '1',flexDirection: 'row', margin: '1%'}}>
                <h4>{heading}</h4>
                <t>{text}</t>
                <br></br>
                <a href={link}>Read more<ArrowForward sx={{height: '10px', width: 'auto'}}/></a>

            </Card>
        
    )
}
