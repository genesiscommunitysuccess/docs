---
id: config-management
title: 'Config Management'
sidebar_label: 'Config Management'
sidebar_position: 3

---
This document describes the recommended uses of config management with Genesis frameworks.  It is written for a reader with some
Linux system administration experience.

## Config Management vs Continuous Deployment

In environments where servers are managed to a greater or lesser degree by config management systems, like Chef,
Pupper or Ansible, there is a decision to be made about which aspects of a system are config managed, and which are
subject to operator actions.

When deciding about the division of responsibilities, it is worth considering development systems and production
systems somewhat separately.

During application development, it is likely that there will be frequent code releases to a development host, and
using config management systems to enact such an upgrade is likely to be more complicated than allowing a CI/CD
system to issue releases.  Development-phase versioning is less rigorous than when an application approaches
readiness.  Ill-behaved versions are possible.  Releases may be frequent.  These conditions are a poor fit for the
automation and consistency that is the mainstay of a config management system.

## Suitable elements for CM

Key aspects of a host prepared for Genesis applications are suitable for config management:
* Dependency packages
* Nginx reverse-proxy configuration
* Environmental override configuration (needs alteration to [processes.xml](/server-modules/configuring-runtime/processes) )

### Dependencies

Packages needed to run a Genesis application are covered in more detail in
[host preparation](/operations/server-setup/host-preparation).
All of them are off-the-shelf packages found either in OS core package repos or extended repos such as EPEL.

### Nginx Configuration

Nginx is used as a reverse proxy as the Genesis applications' entry point.  A comparatively simple config file achieves
this.  This file must specify the port to listen on, hostname to respond to, and if TLS is configured, the details of
certificates to use.

These are not matters specific to Genesis applications.  The Genesis-specific part is relative constant (unless the
Router application is running on non-standard ports).

This is a sample server block for Nginx config.

```text
server {

    listen 443 ssl;
    listen 80;
    server_name _;

    root /data/positions/web;

    location ~ ^/(gwf)(.*)$ {
        proxy_set_header        Host $host:$server_port;
        proxy_pass              http://127.0.0.1:9064$2$is_args$args;
        proxy_http_version      1.1;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        HOSTNAME $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_pass_request_headers      on;
        proxy_set_header        Upgrade $http_upgrade;
        proxy_set_header        Connection $connection_upgrade;
    }
    
    ssl_certificate             /etc/ssl/certs/certs.crt;
    ssl_certificate             /etc/ssl/certs/certs.key;
    ssl_protocols               TLSv1.2;
    ssl_ciphers                 HIGH:!aNULL:!MD5;
}
```

The IP and port shown are for the application's Router process.  This example also shows configuration for TLS and
listening on both port 443 for HTTPS and port 80 for plaintext traffic.

### Environment Overrides

Each process within the application can be instructed to read another file to override the main configuration file,
systems-definitions.

The overrides files can be placed anywhere that is readable to the Genesis application's run user.  Overrides files
can be 1-to-1 with processes or re-used.  Their location is specified on a per-process basis in the processes.xml
config file (which is part of the site-specific directory contents).

They take the form of a [Java properties file](https://www.w3schools.io/file/properties-extension-introduction/):

```properties
# override DB details
DbUser = genesisFdbUser
DbHost = fdb01.my.domain
```

Note, overrides files are not able to perform environment substitutions the way system-definitions can - it is a .kts
file (Kotlin script) and thus effectively _executed_ whereas the properties file is only read.  See
[clusters/Environment variables](/operations/clustering/clusters#Environment-variables).




