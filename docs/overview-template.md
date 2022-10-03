---
title: 'The Learning area'
sidebar_label: 'Overview'
id: overview-template
---
import QuickCard from '@site/src/components/Card';
import { Grid } from '@mui/material'

Welcome to the Learning area for the Genesis low-code platform.



This area is **aimed at people who already have some development knowledge**. Ideally, you should have experience of Java and/or Javascript, but development experience in any object-oriented language is a good starting point.



You can take the **slow road** or **quick road** through this area.

We recommend you read all the pages here to learn the basics. But if you want to whizz through things, be our guest. Check out our recommended routes below. 

Depending on how fast you want to go, these should give you enough knowledge to take your first steps in developing a real application. You can use our reference documentation to help you go further.

## Fast track
<Grid container>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Very simple introduction" link="../getting-started/learn-the-basics/simple-introduction" text="This introduces you to some terminology and the basic architecture">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Pre-requisites" link="../getting-started/quick-start/hardware-and-software" text="Get the software you need onto your machine; check out our prerequisites">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Get started" link="../getting-started/quick-start" text="Get started straight away. Build the simplest of applications in just a few careful steps.">
        </QuickCard>
    </Grid>
</Grid>

## Take it slowly

<Grid container>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Very simple introduction" link="../getting-started/learn-the-basics/simple-introduction" text="If you want to go more slowly, start right at the beginning and look at the sort of applications that have already been built on the Genesis low-code platform">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Data model" link="../getting-started/learn-the-basics/data-model/inside-a-fields-dictionary" text="From there, just progress through each section so that you build up knowledge of the data model and all the key parts on the platform. There's nothing difficult in these sections">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Pre-requisites" link="../getting-started/quick-start/hardware-and-software" text="After you have been through all those, you'll be ready to check the pre-requisites">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Start building a simple application" link="../getting-started/learn-the-basics/simple-introduction" text="Once you've completed each of those you'll be ready to start building a simple application">
        </QuickCard>
    </Grid>
</Grid>
