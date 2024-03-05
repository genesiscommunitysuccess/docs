import { 
  provideDesignSystem, 
  alphaFlyout,
  alphaIcon,
} from '@genesislcap/alpha-design-system';

provideDesignSystem()
    .register(
      alphaFlyout(),
      alphaIcon(),
    );
