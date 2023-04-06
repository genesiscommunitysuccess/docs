---
title: 'Operations'
sidebar_label: 'Overview'
sidebar_position: 1
id: operations
---

import QuickCard from '@site/src/components/Card';
import { Grid } from '@mui/material'

Welcome to the reference documentation on operating Genesis applications. Here, you will find details of a wide range of operating concerns, including specs of the complete Genesis command set and the use of Genesis Console.

## Basics

<Grid container>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Server set-up" link="../operations/server-setup/host-preparation/" text="All the things you need to consider when you want to set up and install a host server for your applications.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Clustering" link="../operations/clustering/clusters" text="Clustering, the primary node and disaster recovery.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Containerisation" link="../operations/containerisation/introduction/" text="Running in a self-contained Docker container.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Commands" link="../operations/commands/server-commands/" text="Function, parameters and use cases for each command.">
        </QuickCard>
    </Grid>
</Grid>

## Actions

<Grid container>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Testing" link="../operations/testing/component-testing/" text="Simple approaches to component and integration testing.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Metrics" link="../operations/metrics/metrics" text="Genesis and JVM metrics, and the different APIs">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Update queue technology" link="../operations/update-queue/overview/" text="A choice of technology for the update queue.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Change Data Capture" link="../operations/pipeline-setup/" text="If you are using Data Pipeline, ensure your database is correctly configured for Change Data Capture.">
        </QuickCard>
    </Grid>
</Grid>

## Resources

<Grid container>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Artifactory" link="../operations/artifactory/artifact-access/" text="Notes about accessing the Genesis artifacts and packages.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Release notes" link="../operations/release-notes/introduction" text="Release notes for all versions.">
        </QuickCard>
    </Grid>
</Grid>


