import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

(async () => {
  if (ExecutionEnvironment.canUseDOM) {
    await import('./docs.iife.min.js');
  }
})();
