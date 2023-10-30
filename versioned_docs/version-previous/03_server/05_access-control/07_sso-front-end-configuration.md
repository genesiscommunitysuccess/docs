---
title: 'SSO - front-end configuration'
sidebar_label: 'SSO - front-end configuration'
id: sso-front-end-config
keywords: [OIDC, server, access control, SSO, authentication]
tags:
  - server
  - access control
  - SSO
  - authentication
---


import CodeBlock from '@theme/CodeBlock';


In the front end of your application, there are two files that need to be checked and amended to ensure that the SSO workflow works correctly.

## config.ts
Add the `sso` configuration block to your **config.ts** file. Note particularly that `ssoToggle` is set to true. This ensures that the **Enable SSO** checkbox is displayed on the application's login page. The user can then check **Enable SSO** manually in the UI. You can use the code below:

```typescript
configure(this.container, {
.....
	authAuth:true,
	sso: {
		toggled: true,
		identityProvidersPath: 'gwf/sso/list'
	}
......
});
```
Alternatively, you can set `ssoEnable` to true in the **config.ts** file. This eliminates the need for the user to set it manually.

## main.ts
Update the **main.ts** file so that it fetches the `SSO_TOKEN` from the query parameter and adds it to the session storage:

```typescript
async connectedCallback(){
	.....
	this.checkForSSOToken();
	.....
}

checkForSSOToken(){
	const queryParams = new  URLSearchParams(window.location.search);
    const ssoToken = queryParams.get('SSO_TOKEN');
    if(ssoToken) {
      if (window.opener){
        window.opener.sessionStorage.setItem('ssoToken', ssoToken);
        window.opener.location.reload();
        window.close();
      } else {
        sessionStorage.setItem('ssoToken', ssoToken);
      }
    }
}
```
