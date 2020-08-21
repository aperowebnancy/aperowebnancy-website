const withMDX = require('@next/mdx')();

module.exports = withMDX({
    webpack: (config, { dev, isServer }) => {
        if (!dev && isServer) {
            const originalEntry = config.entry;

            config.entry = async () => {
                const entries = { ...(await originalEntry()) };
                entries['./scripts/build-rss.js'] = './scripts/build-rss.js';
                return entries;
            };
        }

        return config;
    },
});
