/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'dist',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
