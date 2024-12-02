import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const Home = () => {
  const redirectUrl = useBaseUrl('/develop/platform-overview/');
  React.useEffect(() => {
    window.location.href = redirectUrl;
  }, []);
  return null;
}

export default Home;
