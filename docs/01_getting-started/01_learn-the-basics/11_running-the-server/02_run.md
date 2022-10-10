---
title: 'Run'
sidebar_label: 'Run'
id: run
---

There are some simple commands that enable you to start and stop your server.

`startServer` starts the server.

After running this, run mon. 

![](/img/using-mon.png)

This shows you ths status of your server, with all the individual services listed:

![](/img/mon.png)

To stop your server, run `killServer --all`.

It is important to note that you can start and stop the individual processes; for example, if you want to stop the Genesis Router: `killProcess GENESIS_ROUTER` gets the job done. 
