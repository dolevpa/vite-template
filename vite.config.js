import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  {
    name: 'iframe-hmr',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Allow iframe embedding
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Security-Policy', "frame-ancestors *;");
        next();
      });
    }
  }
  ],
  server: {
    host: '0.0.0.0', // Bind to all interfaces for container access
    port: 5173,
    strictPort: true,
    // Allow all hosts - essential for Modal tunnel URLs
    allowedHosts: true,
    watch: {
      // Enable polling for better file change detection in containers
      usePolling: true,
      interval: 100, // Check every 100ms for responsive HMR
    },
    hmr: {
      // Ensure HMR works in container environment
      port: 5173
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})