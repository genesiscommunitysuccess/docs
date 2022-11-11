import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

(async () => {
  if (ExecutionEnvironment.canUseDOM) {
    await import('@genesislcap/documentation-components/dist/docs.iife.min.js');
    const { provideDesignSystem, baseComponents } = await import('@genesislcap/foundation-zero/dist/foundation-zero.min.js');
    provideDesignSystem().register(baseComponents);
  }
})();
