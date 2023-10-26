---
title: 'Server modules'
sidebar_label: 'Overview'
sidebar_position: 1
id: 'server-modules'
---

import QuickCard from '@site/src/components/Card';
import { Grid } from '@mui/material'

Welcome to our reference documentation on the server. Here you can find information on all aspects of defining your server.

## Basics
Before you start doing anything clever, there are some useful basics that will give you an understanding of the way the Genesis database works.

<Grid container>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Configuring your application" link="../server/configuring-runtime/introduction/" text="There is a group of essential files that control the characteristics of each module in the application. ">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Changing the database technology" link="../server/configuring-runtime/setting-the-database-technology" text="If you are using a different database technology than the default, then it is vital that is set up correctly.">
        </QuickCard>
    </Grid>
</Grid>

## Modules 
A lot of your focus will be on the modules that you define for your application. You can find reference information on all these. Here are some highlights.

<Grid container>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Request Server" link="../server/request-server/introduction/" text="Expose resources to the front end for supplying static data.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Data Server" link="../server/data-server/introduction/" text="Expose resources to the front end for supplying streaming data.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Event Handler" link="../server/event-handler/introduction/" text="Define business logic For every event on the application.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Access control" link="../server/access-control/introduction/" text="Control access to the system and authorisation to view information and use features. ">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="State Machine" link="../server/state-machine/introduction/" text="Define the possible states of a trade or order, and how they can move from one state to another. ">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Consolidator" link="../server/consolidator/introduction/" text="Aggregate data, such as trades to date for an order, and perform other calculations.">
        </QuickCard>
    </Grid>
</Grid>

## Integration

Look at all the different ways of getting information into and out of the system so you can integrate with other systems. Here are just two.

<Grid container>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Data Pipeline" link="../server/integration/data-pipeline/introduction/" text="Look at the module for ingesting data from external systems.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Apache Camel" link="../server/integration/apache-camel/introduction/" text="Integrate using Apache Camel, which has a wide range of components that make it easy to set up.">
        </QuickCard>
    </Grid>    
</Grid>

## Tools


<Grid container>
    <Grid item xs={12} md={12} sx={{padding: '1%'}}>
        <QuickCard heading="Code snippets" link="../server/tooling/code-snippets/" text="There are useful code snippets for a number of requirements. Just copy and amend. ">
        </QuickCard>
    </Grid>   
</Grid>

