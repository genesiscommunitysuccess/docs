import {PageMetadata} from '@docusaurus/theme-common';
import {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import React from 'react';
export default function NotFound() {
  return (
    <>
      <PageMetadata
        title={translate({
          id: 'theme.NotFound.title',
          message: 'Page Not Found',
        })}
      />
      <Layout>
        <main className=" margin-vert--xl wrapper-404">
          <h1 className="heading-404">Sorry, the page is not available.</h1>
          <img src="https://new.genesis.global/wp-content/uploads/2022/04/error-404.svg" alt=""></img>
          <a className="back-404" href="/" target="_self">← Go back</a>
        </main>
      </Layout>
    </>
  );
}
