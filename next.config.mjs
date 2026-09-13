export default {
  poweredByHeader: false,
  experimental: {
    // Prisma's JS engine loads its WASM compiler dynamically. Next 14's tracer
    // cannot infer these pnpm paths, so include the generated runtime explicitly.
    outputFileTracingIncludes: {
      '/*': ['node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client/**/*'],
    },
  },
  async headers() { return [{source:'/:path*',headers:[{key:'Referrer-Policy',value:'no-referrer'},{key:'X-Content-Type-Options',value:'nosniff'},{key:'X-Frame-Options',value:'DENY'}]}]; }
};
