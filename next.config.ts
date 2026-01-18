const nextConfig = {
  serverActions: {
    bodySizeLimit: '50mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mxdsuoqygpmoicltkqlj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
};

export default nextConfig;
