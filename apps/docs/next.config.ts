import path from 'path';
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const config: NextConfig = {
  devIndicators: false,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  transpilePackages: ['@unisane/ui', '@unisane/tokens'],
  turbopack: {
    root: path.join(process.cwd(), '..', '..', '..'),
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

export default withMDX(config);
