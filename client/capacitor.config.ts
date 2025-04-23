import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foodee.admin',
  appName: 'ComNha Admin',
  webDir: 'build',
  server: {
    url: 'https://perceptive-bravery-production.up.railway.app/admin',
    cleartext: true
  },
  android: {
    buildOptions: {
      // các tùy chọn build khác nếu cần
    }
  }
};

export default config;