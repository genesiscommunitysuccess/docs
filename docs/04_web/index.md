---
title: 'Web'
sidebar_label: 'Overview'
sidebar_position: 1
id: front-end
---

import QuickCard from '@site/src/components/Card';
import { Grid } from '@mui/material'

Welcome to our reference documentation on the web (front end) of your application. Here, you can find all the information you need to build a front end for your Genesis application.

## Test links to be deleted
Here's a reference to the [remap script](../operations/commands/server-commands/#remap-script) as well.

If you get a blank page without any response, then this is probably because you don't have [NGINX configured](../operations/server-setup/config-management/#nginx-configuration).

It is made up of [subtables](../database/fields-tables-views/tables/tables-advanced/#subtables).

The fields, tables and views you define must be turned into [DAO](../getting-started/glossary/glossary/#dao)s (Database Access Objects).

Further information can be found [here](https://www.jetbrains.com/help/idea/content-roots.html#configure-folders).

Here's [profile management](../web/micro-front-ends/foundation-entity-management/#profile-management)

## Basics
<Grid container>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Basics" link="../web/basics/prerequisites/" text="We have a useful checklist of technologies you need to know about to become a front-end developer, along with links.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Web Components" link="../web/web-components/overview/" text="Explore and examine in detail all the components you can use and extend to create vivid front ends for great usability.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Design systems" link="../web/design-systems/introduction/" text="Use a design system to specify things like typography, colour and sizing. There is a great Preview page where you can actively change different settings and see the effect on screen - and change them immediately.">
        </QuickCard>
    </Grid>
</Grid>

## User and Profile Management

<Grid container>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="User Management" link="../web/micro-front-ends/foundation-entity-management/#user-management" text="Examine the core components for managing users on the front end.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Profile Management" link="../web/micro-front-ends/foundation-entity-management/#profile-management" text="Manage profiles on the front end using grids and forms.">
        </QuickCard>
    </Grid>
</Grid>

## Integrating
Use FoundationUI alongside your existing or preferred stack.

<Grid container>
    <Grid item xs={12} md={12} sx={{padding: '1%'}}>
        <QuickCard heading="Integrating" link="../web/integrations/introduction/" text="Find details about how to integrate with Angular, React, Vue and Webpack.">
        </QuickCard>
    </Grid>
</Grid>

## Testing, deployment and more

<Grid container>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Testing" link="../web/testing/foundation-testing/" text="Find out about testing using UVU and Playwright. Check out or testing API.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Deployment" link="../web/deploying/introduction/" text="Learn about the default web-server set-up, and manual and automated deployment options.">
        </QuickCard>
    </Grid>
    <Grid item xs={12} md={6} sx={{padding: '1%'}}>
        <QuickCard heading="Layout" link="../web/dynamic-layout/foundation-layout/" text="Registering elements, APIs and more">
        </QuickCard>
    </Grid>
</Grid>
