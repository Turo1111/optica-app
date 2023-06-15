/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        TEXT_COLOR: '#716A6A',
        BLUE_COLOR: '#8294C4',
        URL_BD: 'http://localhost:3001/',
        RED_ALERT: '#F7A4A4',
        GREEN_ALERT: '#B6E2A1',
        YELLOW_ALERT: '#FFFBC1'
    },
    images: {
        domains: ['localhost'],
    },
    compiler: {
        styledComponents: true
    }
}

module.exports = nextConfig
