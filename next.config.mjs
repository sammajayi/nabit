/** @type {import('next').NextConfig} */
const nextConfig = {


  turbopack: {
    rules: {

    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        // pathname: "/**", // optional, allows all paths
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        // pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  async redirects() {
    return [
      {
        source: "/.well-known/farcaster.json",
        destination:
          "https://api.farcaster.xyz/miniapps/hosted-manifest/01990ab2-25cc-0ac7-43b5-56092d2073f8",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
