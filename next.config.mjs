/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
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
            },
            {
                protocol: 'https',
                hostname: 'fahsai.bomboonsan.com',
                port: '',
                pathname: '/**',
            }
        ],
    },
};



export default nextConfig;
