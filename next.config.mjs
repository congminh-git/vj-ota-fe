/** @type {import('next').NextConfig} */
const nextConfig = {
    // Removed output: 'export' to support API routes (POST requests from payment gateway)
    distDir: '.next',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
