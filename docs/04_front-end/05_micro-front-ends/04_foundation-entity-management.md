---
title: 'Entity Management'
sidebar_label: 'Entity management'
Id: front-end-foundation-entity-management
tags:
  - entity
  - management
  - frontend
  - ui
  - mf
  - web
  - micro frontends
---

  @attr resourceName: string;
  @attr updateEvent: string;
  @attr deleteEvent: string;
  @attr createEvent: string;
  @attr title: string;
  @attr entityLabel: string = '';
  @attr({ attribute: 'persist-column-state-key' }) persistColumnStateKey: string;

	Entity management contains an entity list and a modal
	Has a list of events passed as attributes, these are send off to the back end to control what goes on
	There is a list of pre-defined events, but the clients can create their own in the back end too
