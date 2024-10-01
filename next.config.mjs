/**  @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.lidl.es',
                port: '',
                pathname: '/media/**'
            }
        ]
    }
};

export default nextConfig;
