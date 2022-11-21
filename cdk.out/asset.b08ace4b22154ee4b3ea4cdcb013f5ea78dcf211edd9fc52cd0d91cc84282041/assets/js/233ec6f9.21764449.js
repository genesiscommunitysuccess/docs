"use strict";(self.webpackChunk_genesislcap_docs=self.webpackChunk_genesislcap_docs||[]).push([[78839],{91326:function(e,t,n){n.r(t),n.d(t,{assets:function(){return l},contentTitle:function(){return i},default:function(){return u},frontMatter:function(){return d},metadata:function(){return p},toc:function(){return _}});var o=n(87462),r=n(63366),a=(n(67294),n(3905)),s=(n(61839),["components"]),d={title:"Web Deployment - Introduction",sidebar_label:"Introduction",id:"introduction",keywords:["web","deployment","introduction"],tags:["web","deployment","introduction"]},i=void 0,p={unversionedId:"web/deploying/introduction",id:"web/deploying/introduction",title:"Web Deployment - Introduction",description:"Default web server setup:",source:"@site/docs/04_web/07_deploying/01_introduction.md",sourceDirName:"04_web/07_deploying",slug:"/web/deploying/introduction",permalink:"/next/web/deploying/introduction",draft:!1,tags:[{label:"web",permalink:"/next/tags/web"},{label:"deployment",permalink:"/next/tags/deployment"},{label:"introduction",permalink:"/next/tags/introduction"}],version:"current",sidebarPosition:1,frontMatter:{title:"Web Deployment - Introduction",sidebar_label:"Introduction",id:"introduction",keywords:["web","deployment","introduction"],tags:["web","deployment","introduction"]},sidebar:"frontendSidebar",previous:{title:"Foundation testing",permalink:"/next/web/testing/foundation-testing"},next:{title:"Manual deployment",permalink:"/next/web/deploying/manual-deployment"}},l={},_=[{value:"Default web server setup:",id:"default-web-server-setup",level:2}],c={toc:_};function u(e){var t=e.components,n=(0,r.Z)(e,s);return(0,a.kt)("wrapper",(0,o.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"default-web-server-setup"},"Default web server setup:"),(0,a.kt)("p",null,"For Genesis application servers, the web server of choice is ",(0,a.kt)("a",{parentName:"p",href:"https://www.nginx.com/"},"nginx"),"."),(0,a.kt)("p",null,"There is a ",(0,a.kt)("em",{parentName:"p"},"product user")," on each server named after the product."),(0,a.kt)("p",null,"The web root (where the production build needs to end up) is ",(0,a.kt)("inlineCode",{parentName:"p"},"/data/${productUser}/web")," by convention."),(0,a.kt)("p",null,"You can confirm that by looking at the nginx configuration file found at ",(0,a.kt)("inlineCode",{parentName:"p"},"/etc/nginx/conf.d/localhost.conf")),(0,a.kt)("p",null,"Here is what a default configuration file looks like:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'server {\n\n    listen 80;\n    listen 8080;\n    listen 443 ssl http2;\n    server_name _;\n\n    root /data/client-x/web;\n\n    index index.html index.htm;\n\n    error_page 404 =200 /index.html;\n\n\n    location /symphonyapp/ {\n        rewrite                 ^/symphonyapp(.*)/$ $1 last;\n        proxy_set_header       Host $host:$server_port;\n        proxy_set_header        X-Real-IP $remote_addr;\n        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header        X-Forwarded-Proto $scheme;\n        proxy_set_header        HOSTNAME $remote_addr;\n        proxy_pass_request_headers      on;\n        proxy_pass              https://127.0.0.1:10443/;\n    }\n\n     location /bdk/ {\n        rewrite                 ^/bdk(.*)/$ $1 last;\n        proxy_set_header       Host $host:$server_port;\n        proxy_set_header        X-Real-IP $remote_addr;\n        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header        X-Forwarded-Proto $scheme;\n        proxy_set_header        HOSTNAME $remote_addr;\n        proxy_pass_request_headers      on;\n        proxy_pass              https://127.0.0.1:10443/bdk/;\n    }\n\n\n    location ~ ^/(sm|gwf)(.*)$ {\n      proxy_set_header        Host $host:$server_port;\n      proxy_pass              http://127.0.0.1:9064$2$is_args$args;\n      proxy_http_version      1.1;\n      proxy_set_header        X-Real-IP $remote_addr;\n      proxy_set_header        HOSTNAME $remote_addr;\n      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_set_header        X-Forwarded-Proto $scheme;\n      proxy_pass_request_headers      on;\n      proxy_set_header        Upgrade $http_upgrade;\n      proxy_set_header        Connection $connection_upgrade;\n    }\n    location /ws/ {\n      rewrite                 ^/ws(.*)/$ /$1 break;\n      proxy_set_header        Host 127.0.0.1:9064;\n      proxy_pass              http://localhost:9064;\n      proxy_http_version      1.1;\n      proxy_set_header        Upgrade $http_upgrade;\n      proxy_set_header        Connection "Upgrade";\n    }\n    location = /console/ {\n      proxy_set_header        X-Real-IP $remote_addr;\n      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_set_header        X-Forwarded-Proto $scheme;\n      proxy_pass              https://genesis-portal.s3.eu-west-2.amazonaws.com/console/proxy/index.html;\n    }\n    location /console/ {\n      proxy_set_header        X-Real-IP $remote_addr;\n      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_set_header        X-Forwarded-Proto $scheme;\n      proxy_pass              https://genesis-portal.s3.eu-west-2.amazonaws.com/console/proxy/;\n    }\n    location /console-next/ {\n      return 307 https://genesis.global/console/console-next/?host=$host&force;\n    }\n    ssl_certificate     /etc/ssl/certs/certs.pem;\n    ssl_certificate_key /etc/ssl/certs/certs.key;\n    ssl_protocols       TLSv1.2;\n    ssl_ciphers         HIGH:!aNULL:!MD5;\n\n}\n')),(0,a.kt)("p",null,"In this example, by looking at the 5th line we can tell that:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"the ",(0,a.kt)("em",{parentName:"li"},"web root")," is ",(0,a.kt)("inlineCode",{parentName:"li"},"/data/client-x/web")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("em",{parentName:"li"},"product user")," is ",(0,a.kt)("inlineCode",{parentName:"li"},"client-x"))),(0,a.kt)("p",null,"You will need this information if you want to ",(0,a.kt)("a",{parentName:"p",href:"/web/deploying/manual-deployment/"},"manually deploy")," the front Eend from your machine to the web server."),(0,a.kt)("p",null,"Ideally, the deployment process should be ",(0,a.kt)("a",{parentName:"p",href:"/web/deploying/automated-deployment/"},"automated"),"."),(0,a.kt)("admonition",{type:"note"},(0,a.kt)("p",{parentName:"admonition"},"For apps hosted across multiple nodes or production/UAT (client facing) apps, they would access it via a loadbalancer (also nginx), which performs round robin load balancing. In that case, the nginx config mentioned above would be bypassed.")))}u.isMDXComponent=!0}}]);