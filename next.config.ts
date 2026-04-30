import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    // https://images.igdb.com/igdb/image/...
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'images.igdb.com',
            port: '',
            pathname: '**',
        }]
    },
};

export default nextConfig;
