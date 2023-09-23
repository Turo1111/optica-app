/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        TEXT_COLOR: '#716A6A',
        BLUE_COLOR: '#8294C4',
        URL_BD: 'http://localhost:3001',
        RED_ALERT: '#F7A4A4',
        GREEN_ALERT: '#B6E2A1',
        YELLOW_ALERT: '#EA906C'
    },
    images: {
        domains: [process.env.NEXT_PUBLIC_DB_DOMAIN],
    },
    compiler: {
        styledComponents: true
    },
    webpack: (config) => {
      config.resolve.alias['@emotion/core'] = '@emotion/react';
      return config;
    }
}

module.exports = nextConfig
