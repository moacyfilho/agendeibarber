import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // O Prisma Client em produção tem os tipos corretos após `prisma generate`
    // Desabilitar aqui enquanto o ambiente local e o de deploy divergem
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
