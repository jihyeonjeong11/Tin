import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@tin/shared'],
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
}

export default nextConfig
