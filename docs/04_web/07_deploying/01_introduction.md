---
title: 'Web Deployment - Introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [web, deployment, introduction]
tags:
  - web
  - deployment
  - introduction
---

## Default web server setup

For Genesis application servers, the web server of choice is [nginx](https://www.nginx.com/).

There is a _product user_ on each server named after the product.

The web root (where the production build needs to end up) is `/data/${productUser}/web` by convention.

You can confirm that by looking at the nginx configuration file found at `/etc/nginx/conf.d/localhost.conf`

Here is what a default configuration file looks like:

```
server {

    listen 80;
    listen 8080;
    listen 443 ssl http2;
    server_name _;

    root /data/client-x/web;

    index index.html index.htm;

    error_page 404 =200 /index.html;


    location /symphonyapp/ {
        rewrite                 ^/symphonyapp(.*)/$ $1 last;
        proxy_set_header       Host $host:$server_port;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_set_header        HOSTNAME $remote_addr;
        proxy_pass_request_headers      on;
        proxy_pass              https://127.0.0.1:10443/;
    }

     location /bdk/ {
        rewrite                 ^/bdk(.*)/$ $1 last;
        proxy_set_header       Host $host:$server_port;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_set_header        HOSTNAME $remote_addr;
        proxy_pass_request_headers      on;
        proxy_pass              https://127.0.0.1:10443/bdk/;
    }


    location ~ ^/(sm|gwf)(.*)$ {
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
    location /ws/ {
      rewrite                 ^/ws(.*)/$ /$1 break;
      proxy_set_header        Host 127.0.0.1:9064;
      proxy_pass              http://localhost:9064;
      proxy_http_version      1.1;
      proxy_set_header        Upgrade $http_upgrade;
      proxy_set_header        Connection "Upgrade";
    }
    location = /console/ {
      proxy_set_header        X-Real-IP $remote_addr;
      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header        X-Forwarded-Proto $scheme;
      proxy_pass              https://genesis-portal.s3.eu-west-2.amazonaws.com/console/proxy/index.html;
    }
    location /console/ {
      proxy_set_header        X-Real-IP $remote_addr;
      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header        X-Forwarded-Proto $scheme;
      proxy_pass              https://genesis-portal.s3.eu-west-2.amazonaws.com/console/proxy/;
    }
    location /console-next/ {
      return 307 https://genesis.global/console/console-next/?host=$host&force;
    }
    ssl_certificate     /etc/ssl/certs/certs.pem;
    ssl_certificate_key /etc/ssl/certs/certs.key;
    ssl_protocols       TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;

}
```

In this example, by looking at the 5th line we can tell that:
- the _web root_ is `/data/client-x/web`
- _product user_ is `client-x`

You will need this information if you want to [manually deploy](/web/deploying/manual-deployment/) the front Eend from your machine to the web server.

Ideally, the deployment process should be [automated](/web/deploying/automated-deployment/).

:::note
For apps hosted across multiple nodes or production/UAT (client facing) apps, they would access it via a loadbalancer (also nginx), which performs round robin load balancing. In that case, the nginx config mentioned above would be bypassed.
:::
