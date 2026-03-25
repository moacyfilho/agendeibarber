import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/:slug/painel/:path*',
        destination: '/dashboard/:path*',
      },
      // Permite também /:slug/dashboard para flexibilidade
      {
        source: '/:slug/dashboard/:path*',
        destination: '/dashboard/:path*',
      },
    ]
  },
};

export default nextConfig;
