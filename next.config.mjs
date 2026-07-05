/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/website",
        destination: "/website.html"
      }
    ];
  }
};

export default nextConfig;
