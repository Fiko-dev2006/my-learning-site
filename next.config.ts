import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false, // hides hydration mismatch
  webpack: (config) => {
    // hides MetaMask warning
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
}

export default nextConfig