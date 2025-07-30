/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908

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
          "https://api.farcaster.xyz/miniapps/hosted-manifest/0197e10f-3285-efeb-4f24-2bf73f1d6adf",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
