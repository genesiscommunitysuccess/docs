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
This document describes the recommended uses of config management with Genesis frameworks. Readers must have some Linux system administration experience.

## Config management vs continuous deployment

In environments where servers are managed to a greater or lesser degree by config-management systems, such as Chef, Puppet or Ansible, you need to decide which aspects of the system are config-managed, and which are subject to operator actions.

When deciding about the division of responsibilities, it is worth considering development systems and production systems separately.

During application development, it is likely that there will be frequent code releases to a development host. Using config-management systems to enact such upgrades is likely to be more complicated than allowing a CI/CD system to issue releases. 

Development-phase versioning is less rigorous than the phase when an application approaches readiness; ill-behaved versions are possible; releases may be frequent. These conditions are a poor fit for the automation and consistency that is the mainstay of a config-management system.

## Suitable elements for CM

On a host prepared for Genesis applications, the following key elements are suitable for config management:

* Dependency packages
* Nginx reverse-proxy configuration
* Environmental override configuration (which requires changes to [processes.xml](../../../server/configuring-runtime/processes))

### Dependencies

The packages that are needed to run a Genesis application are covered in more detail in [host preparation](../../../operations/server-setup/host-preparation).
These are all off-the-shelf packages found either in OS core package repos or extended repos such as EPEL.

### Nginx configuration

Nginx is used as a reverse proxy as the Genesis applications' entry point. A comparatively simple config file achieves this. This file must specify:

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
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:host-gateway genesisglobal-docker-internal.jfrog.io/genesis-console-proxy
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

The IP and port shown are for the application's Router process. The example above also shows configuration for TLS, and listening on both port 443 for HTTPS and port 80 for plain-text traffic.

### Context path of your app
Changing the context path creates a different url for your application. If you want to do this, add a location directive to your nginx configuration file. The location directive specifies the URL path that will be matched to the context root. 

For example, to set up a context root for the URL path **/myapp**, add the following location directive to your nginx configuration file:

```
location /myapp {
    root /usr/share/nginx/html;
}
```

This directive tells nginx to serve all requests that match the URL path **/myapp** from the directory **/usr/share/nginx/html**.

You can also use the alias directive to set up a context root. The alias directive tells nginx to redirect all requests that match the specified URL path to a different URL path. For example, to set up a context root for the URL path **/myapp** that redirects to the URL path **/yourapp**, add the following alias directive to your nginx configuration file:

```
alias /myapp /yourapp;
```

:::note
Once you have added the location or alias directive to your nginx configuration file, you need to restart nginx for the changes to take effect.
:::

Here are some additional things to keep in mind when setting up a context root or alias directive:

- The context root must be a valid directory on your web server.
- The context root must not contain any spaces or special characters.
- If you are using the alias directive, the target URL path must be accessible from your web server.

### Environment overrides

Each process within the application can be instructed to read another file to override the main configuration file, [system-definitions](../../../server/configuring-runtime/system-definitions/).

The override files can be placed anywhere that is readable to the Genesis application's run user. Override files can be 1-to-1 with processes or re-used. Their location is specified on a per-process basis in the [processes.xml](../../../server/configuring-runtime/processes/) config file (which is part of the site-specific directory contents).

They take the form of a [Java properties file](https://www.w3schools.io/file/properties-extension-introduction/):

```properties
# override DB details
DbUser = genesisFdbUser
DbHost = fdb01.my.domain
```

Note, override files are not able to perform environment substitutions in the way that system-definitions can. The override file must be a .kts file (Kotlin script), so it is _executed_, whereas the properties file is only read. See [clusters/Environment variables](../../../operations/clustering/genesis#Environment-variables).




