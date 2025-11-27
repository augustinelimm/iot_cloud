const config = {
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'https://api.iotwasher.com',
  pollingInterval: 30000,
};

export default config;
