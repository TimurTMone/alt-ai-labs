import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.altailabs.app',
  appName: 'Alt AI Labs',
  webDir: 'out',
  server: {
    url: 'https://alt-ai-labs.vercel.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'Alt AI Labs',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
