---
sidebar_label: 'Set up authentication and authorisation'
---

# Set up authentication and authorisation

## Authentication

You need to be sure that only permitted individuals are able to gain access to your application.

:::danger WIP
more on authentication needed here.
:::


## Authorisation
:::danger WIP
(add the text on three levels.)
:::

In many cases, you want different people to have access to different functions and different information, based on their roles.  In Genesis, users are not permissioned individually for these purposes. Instead, permissioining is based on roles. You define what information and functions are available to a role, and then you allocate users to these roles. We refer to this as dynamic authorisation. There is nothing to stop you creating a role that has only one user, of course.

## General approach

On startup, the GENESIS_AUTH_PERMS process performs an initial scan of all entities. For each entity found, it performs authorisation against every user in the system. This builds a full map of permissioned users.

By default, any updates to the entity and the user table will be automatically processed to permission new entities as they are entered into the database.

Entries are stored in a memory-mapped file located in $GENESIS_HOME/runtime/authCache.

If you need to clear out the entries by hand, simply delete everything in that directory and restart GENESIS_AUTH_PERMS.

More than one permission map per table may be created.