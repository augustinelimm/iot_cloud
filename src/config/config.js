const config = {
    apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'https://iot-washer.duckdns.org',
    pollingInterval: 30000,
};

export default config;
