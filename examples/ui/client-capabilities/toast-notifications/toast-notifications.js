import { CodeSection } from '../../documentationBase';
import React, { useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

function setup() {
  const isBrowser = useIsBrowser();

  if (isBrowser) {
    const RapidImports = require('../../rapidImports');
    RapidImports.registerComponents();
  }

}

export default function ToastNotificationDemo({ children, color }) {
  let NotificationsModule = null;

  setup();
  const showDialog = () => {
    NotificationsModule = require('@genesislcap/foundation-notifications');
    NotificationsModule.showNotificationDialog(
      {
        title: 'Important message',
        body: 'Lorem ipsum',
        dialog: {
          confirmingActions: [{ label: 'Confirm', action: () => console.log('Lorem ipsum') }],
          dismissingAction: {
            label: 'Dismiss',
            action: () => console.log('Lorem ipsum'),
          },
        },
      },
      'rapid',
    );
  }
  return (
    <CodeSection>
      <div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
          <rapid-button onClick={showDialog}>Show Dialog</rapid-button>
        </div>
      </div>
    </CodeSection>
  )
}

export function SnackbarDemo({children, color}) {
  let NotificationsModule = null;

  setup();

  const showSnackbar = () => {
    NotificationsModule = require('@genesislcap/foundation-notifications');
    NotificationsModule.showNotificationSnackbar(
      {
        body: 'Lorem ipsum',
        snackbar: {
          confirmingActions: [{ label: 'Confirm', action: () => console.log('Lorem ipsum') }],
          type: 'error',
        },
      },
      'rapid',
    );
  }
  return (
    <CodeSection>
      <div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
          <rapid-button onClick={showSnackbar}>Show Snackbar</rapid-button>
        </div>
      </div>
    </CodeSection>
  )
}

export function AlertDemo({children, color}) {
  let NotificationsModule = null;
  setup();
  const showAlert = () =>{
    NotificationsModule = require('@genesislcap/foundation-notifications');
    NotificationsModule.showNotificationAlert({ title: 'Important message', body: 'Lorem ipsum' });
  }

  return (
    <CodeSection>
      <div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
          <rapid-button onClick={showAlert}>Show Alert</rapid-button>
        </div>
      </div>
    </CodeSection>
  )
}

export function BannerDemo({children, color}) {
  let NotificationsModule = null;

  setup();
  const showBanner = () => {
    NotificationsModule = require('@genesislcap/foundation-notifications');
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Optional: Adds smooth scrolling
    });
    NotificationsModule.showNotificationBanner(
      {
        body: 'Lorem ipsum',
        banner: {
          confirmingActions: [{ label: 'Confirm', action: () => console.log('Lorem ipsum') }],
          dismissingAction: {
            label: 'Dismiss',
            action: () => console.log('Lorem ipsum'),
          },
        },
      },
      'rapid',
    );
  }
  return (
    <CodeSection>
      <div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
          <rapid-button onClick={showBanner}>Show Banner</rapid-button>
        </div>
      </div>
    </CodeSection>
  )
}

export function ToastDemo({children, color}) {
  let NotificationsModule = null;

  setup();
  const showToast = () => {
    NotificationsModule = require('@genesislcap/foundation-notifications');
    NotificationsModule.showNotificationToast(
      {
        title: 'Important message',
        body: 'Lorem ipsum',
        toast: {

          type: 'success',
        },
      },
      'rapid',
    );
  }
  return (
    <CodeSection>
      <div style={{ color: 'var(--neutral-foreground-rest)', width: '-webkit-fill-available'}}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: 'column', }}>
          <rapid-button onClick={showToast}>Show Toast</rapid-button>
        </div>
      </div>
    </CodeSection>
  )
}
