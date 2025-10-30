/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // for Google avatars if any
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.fakercloud.com', // optional other sources
        port: '',
        pathname: '**',
      },
      {
        protocol: "https",
        hostname: "iad.microlink.io",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
    ],
  },
};

export default nextConfig;
