import { 
  provideDesignSystem, 
  alphaCard, 
  alphaButton,
  alphaTextField
} from '@genesislcap/alpha-design-system';

provideDesignSystem()
    .register(
        alphaCard(),
        alphaButton(),
        alphaTextField()
    );