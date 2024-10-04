/**  @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.lidl.es',
                port: '',
                pathname: '/media/**'
            },
            {
                protocol: 'https',
                hostname: 'cdn-consum.aktiosdigitalservices.com',
                port: '',
                pathname: '/tol/consum/media/**'
            }
        ]
    }
};

export default nextConfig;
