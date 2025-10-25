import path from 'path'

export default {
    server: {
        proxy: {
            '/api': {
            target: 'http://localhost:3000', // your Express server
            changeOrigin: true,
            },
        }
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          404: path.resolve(__dirname, "404.html"),
        },
      },
    }
}