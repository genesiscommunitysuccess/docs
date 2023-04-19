import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

(async () => {
  if (ExecutionEnvironment.canUseDOM) {
    // await import('./docs.iife.min.js'); // FIXME: figure out how to get this working without having to throw it into node_modules
    await import('iife');
  }
})();
