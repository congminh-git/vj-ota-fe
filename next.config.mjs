/** @type {import('next').NextConfig} */
const nextConfig = {
    // Use the default `.next` output dir so hosting platforms (like Vercel)
    // can find Next's runtime artifacts such as routes-manifest.json.
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
