/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/rally-detail/:id',
        destination: '/rally-detail/[id]',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
