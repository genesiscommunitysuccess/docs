---
id: manual-installation
sidebar_label: 'Manual installation'
sidebar_position: 4
title: 'Manual installation'
---

The main steps in a manual installation are:
1.	Create a local application user account.
2.	Set the environment variables.
3.	Create the directory structure.
4.	Unzip and install the Genesis platform.


## 1. Creating a local application user account
Genesis processes run in the context of an unprivileged user account. The choice of name for the account is entirely yours – there is no hard reference to it in the Genesis platform. The account you create does not need to have privileges.
After creating the account, you need to add security limits to the account. To do this, append the following to the file **/etc/security/limits.conf**. In this case, we have assumed that the user name you have chosen is **genesis**:

```
genesis   soft   nproc   16384
genesis   hard   nproc   16384
genesis   soft   nofile  65536
genesis   hard   nofile  65536
```

## 2. Setting the environment variables
The following environment variables need to be available to the application user. Add them in the **.bashrc** 

```bash
# User specific aliases and functions
export GENESIS_HOME=$HOME/run/
[ -f $GENESIS_HOME/genesis/util/setup.sh ] && source $GENESIS_HOME/genesis/util/setup.sh
```

For groovy, the following environment variables need to be available to the application user:

```bash
export GROOVYHOME="/opt/groovy"
PATH=$PATH:$GROOVYHOME/bin
```

## 3. Creating the directory structure
This can be done using a link from the application user account. The recommended file structure is:

```bash
/data/<app-user>/server/<version>/run/
```

Add a symbolic link to the above directory from the `/home/<app-user>` directory:

```bash
cd ~
ln -s /data/<app-user>/server/<version>/run/ run
```

    
## 4. Unzip and install the Genesis files
Unzip the following two files in the directory structure:
```bash
auth-distribution<version>-bin.zip
genesis-distribution<version>-bin.zip
```


## Connecting to the front end
### Web server – reverse proxy
On the Genesis low-code platform, the front end connects to the back end through HTTPS or secure Websockets via a reverse proxy. This must run on the same instance as the back end.

The reverse proxy rule should be set for the specific path  **/gwf/**. The `GENESIS_ROUTER` service on the server acts as the endpoint for all API calls and listens to port `9064`. The following configuration snippet for nginx shows the proxy rule:

```
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
```

Your web application, once developed, will consist of static files. It is recommended that you serve it from the same server.
    
### Firewall
Use only port 443 for incoming traffic to the Genesis server, regardless of any custom or non-custom ports used to connect and monitor the server.
