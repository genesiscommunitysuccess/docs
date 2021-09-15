import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Get started quickly</>,
    description: (url) => (
      <p>
        Our platform enables you to build quickly, but you need to get oriented before you can start. <Link to={url}>So start here.</Link>
      </p>
    ),
    url: '/getting-started/platform/'
  },
  {
    title: <>Server reference</>,
    description: (url) => (
      <p>
        The server of a Genesis application can be as simple or complex as your needs. <Link to={url}>Take a look at the modules</Link> and the way they can be configured.
      </p>
    ),
    url: '/server-reference/intro/'
  },
  {
    title: <>Tutorials</>,
    imageUrl: '',
    description: (url) => (
      <p>
        Want to know how to build a Genesis app? <Link to={url}>We'll take you from start to finish.</Link>
      </p>
    ),
    url: '/tutorials/building-an-application/intro/'
  },
];

const Feature = ({imageUrl, title, description, url}) => {
  const imgUrl = useBaseUrl(imageUrl);
  const pageUrl = useBaseUrl(url);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3><Link to={pageUrl}>{title}</Link></h3>
      {description(pageUrl)}
    </div>
  );
}

const Home = () => {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('getting-started/platform/')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
