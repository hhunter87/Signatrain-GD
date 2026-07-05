/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/website",
        destination: "/website.html"
      },
      {
        source: "/gd-website",
        destination: "/gd-website.html"
      }
    ];
  }
};

export default nextConfig;
