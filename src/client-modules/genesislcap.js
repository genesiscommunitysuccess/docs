import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  // IIFE bundle is not needed - interactive examples use their own component registration
  // via rapidImports.ts which imports components directly from npm packages
  console.log('Genesis IIFE loading disabled - interactive examples use rapidImports.ts instead');
}
