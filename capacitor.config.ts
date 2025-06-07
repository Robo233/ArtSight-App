import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.artsight.android',
  appName: 'ArtSight',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  }
};

export default config;
