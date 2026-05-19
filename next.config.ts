import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standard webpack compiler instead of turbopack for stable dev speed
  // When you run 'pnpm dev', we will remove the --turbopack flag
  reactStrictMode: true,
  
  // Optimize package imports to reduce load time
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', '@supabase/ssr', 'axios']
  }
};

export default nextConfig;
