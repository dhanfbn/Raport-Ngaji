import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose nothing sensitive to the client bundle
  // All Google Sheets keys stay server-side only
};

export default nextConfig;
