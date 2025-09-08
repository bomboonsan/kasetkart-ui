/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'kasetbackend.bomboonsan.com',
                port: '',
                pathname: '/**',
            }
        ],
    },
};



export default nextConfig;
