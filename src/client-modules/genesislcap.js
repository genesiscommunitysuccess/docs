import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

(async () => {
  if (ExecutionEnvironment.canUseDOM) {
    const { provideDesignSystem, baseComponents } = await import('./docs.iife.min.js'); // testing, want to include documentation-components AND foundation-zero.min.js in this
    provideDesignSystem().register(baseComponents);
  }
})();
