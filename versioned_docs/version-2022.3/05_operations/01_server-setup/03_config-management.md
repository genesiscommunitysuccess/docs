---
title: 'Server set-up - config management'
sidebar_label: 'Config management'
sidebar_position: 3
id: config-management
keywords: [operations, server, setup, config, management]
tags:
    - database
    - server
    - setup
    - config
    - management
---
This document describes the recommended uses of config management with Genesis frameworks.  It is written for a reader with some
Linux system administration experience.

## Config management vs continuous deployment

In environments where servers are managed to a greater or lesser degree by config-management systems, like Chef, Pupper or Ansible, there is a decision to be made about which aspects of a system are config-managed, and which are subject to operator actions.

When deciding about the division of responsibilities, it is worth considering development systems and production systems separately.

During application development, it is likely that there will be frequent code releases to a development host. Using config-management systems to enact such an upgrade is likely to be more complicated than allowing a CI/CD system to issue releases. Development-phase versioning is less rigorous than when an application approaches readiness. Ill-behaved versions are possible. Releases may be frequent. These conditions are a poor fit for the automation and consistency that is the mainstay of a config-management system.

## Suitable elements for CM

On a host prepared for Genesis applications, the following key elements are suitable for config management:

* Dependency packages
* Nginx reverse-proxy configuration

* Environmental override configuration (which requires changes to [processes.xml](../../../server/configuring-runtime/processes))

### Dependencies

The packages that are needed to run a Genesis application are covered in more detail in [host preparation](../../../operations/server-setup/host-preparation).
These are all off-the-shelf packages found either in OS core package repos or extended repos such as EPEL.


### Nginx configuration


Nginx is used as a reverse proxy as the entry point to your application.  A comparatively simple config file achieves this. This file must specify:

- the port to listen to
- the hostname to respond to
- if TLS is configured, the details of the certificates to use

These are not matters specific to Genesis applications. The Genesis-specific part is relatively constant (unless the Router application is running on non-standard ports).

### Using a Docker image (recommended)

To configure nginx using a Docker image, make sure you have your artifactory credentials to hand. Then, in your CentOS terminal, enter the following commands:


1. Enter your artifactory credentials.
```shell
docker login genesisglobal-docker-internal.jfrog.io
```

2. Download the latest Genesis software:

```shell
docker pull genesisglobal-docker-internal.jfrog.io/genesis-console-proxy:latest
```

3. Run the following command:
```shell
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(hostname -I) genesisglobal-docker-internal.jfrog.io/genesis-console-proxy
```

### Manual configuration

For a manual set-up of nginx, use this nginx.conf file:

```text
map $http_upgrade $connection_upgrade {
      default upgrade;
      ''      close;
    }

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

In the example above:

- The IP and port shown are for the application's Router process. 
- You can see the configuration for TLS, and listening on both port 443 for HTTPS and port 80 for plain-text traffic.

### Environment overrides

Each process within the application can be instructed to read another file to override the main configuration file, [system-definitions](/server-modules/configuring-runtime/system-definitions/).

The override files can be placed anywhere that is readable to the Genesis application's run user. Override files can be 1-to-1 with processes or re-used. Their location is specified on a per-process basis in the [processes.xml](/server-modules/configuring-runtime/processes/) config file (which is part of the site-specific directory contents).

They take the form of a [Java properties file](https://www.w3schools.io/file/properties-extension-introduction/):

```properties
# override DB details
DbUser = genesisFdbUser
DbHost = fdb01.my.domain
```


Note, overrides files are not able to perform environment substitutions in the way that system-definitions can. The override file must be a .kts file (Kotlin script), so it is _executed_, whereas the properties file is only read.  See
[clusters/Environment variables](../../../operations/clustering/clusters#Environment-variables).





