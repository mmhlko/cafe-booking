/** @type {import('next').NextConfig} */
const API_PORT = process.env.API_PORT;

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        search: ''
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: API_PORT ? `http://api:${API_PORT}/:path*` : `http://localhost:3001/:path*`,
        basePath: false,
      },
    ];
  },
}

module.exports = nextConfig