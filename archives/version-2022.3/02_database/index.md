---
title: 'Database reference'
sidebar_label: 'Overview'
id: 'database-landing'
---

import QuickCard from '@site/src/components/Card';
import { Grid } from '@mui/material'

Welcome to our database documentation. Here, we shall look in detail at the model and structure of the Genesis database, and the different ways you can interact with it.


## Basics
Before you start doing anything clever, there are some useful basics that will give you an understanding of the way the Genesis database works.

<Grid container>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Data Model" link="../database/fields-tables-views/fields-tables-views/" text="Start by looking at how you can define your data model, which is built on fields, tables and views.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Database Concepts" link="../database/database-concepts/database-concepts/" text="Find out about read, write and subscribe operations and how each operation works.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={4} sx={{padding: '1%'}}>
        <QuickCard heading="Data Types" link="../database/data-types/data-types/" text="Finally, have a look at the different entities used in the Genesis low-code platform.">
        </QuickCard>
    </Grid>
</Grid>

## Interacting with the database

Once you know the basics, you can explore the details of how you can interact with the database.

<Grid container>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Database Interface" link="../database/database-interface/database-interface/" text="Look at the database interface for the standard methods of interacting with the database.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Helper Classes" link="../database/helper-classes/helper-classes/" text="View the helper classes for details of classes such as Subscription, Write Result and Modify Details.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Async and RxJava APIs" link="../database/types-of-api/types-of-api/" text="The Async API is the preferred API for accessing the database in Kotlin. The RxJava API is also available. ">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Specific APIs" link="../database/api-reference/overview/" text="Explore specific APIs, such as the Event Handler API or the Authorisation API.">
        </QuickCard>
    </Grid>
</Grid>






