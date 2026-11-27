import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)', '../docs/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  // The built-in onboarding checklist is not part of the design system.
  features: { sidebarOnboardingChecklist: false } as StorybookConfig['features'],
  core: { disableWhatsNewNotifications: true },
};
export default config;
