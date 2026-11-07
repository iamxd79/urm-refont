/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // docs are Markdown read at render time; ship them with the serverless function
  experimental: { outputFileTracingIncludes: { '/docs/[[...slug]]': ['./content/docs/**/*'], '/docs': ['./content/docs/**/*'] } },
  async redirects() {
    return [
      { source: '/circle', destination: '/ultraround', permanent: true },
      { source: '/circle/:path*', destination: '/ultraround/:path*', permanent: true },
    ];
  },
  images: { formats: ['image/avif', 'image/webp'] },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    // Server-side payment SDK pulled in by the Base Account connector, which this site doesn't use.
    config.resolve.alias = { ...config.resolve.alias, '@coinbase/cdp-sdk': false, '@react-native-async-storage/async-storage': false };
    return config;
  },
};
export default nextConfig;
