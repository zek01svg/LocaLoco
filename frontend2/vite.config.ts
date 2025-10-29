import path from 'path'

export default {
    resolve: {
        alias: {
            '@utils': path.resolve(__dirname, 'utils'),
        },
    },
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
                login: path.resolve(__dirname, "login.html"),
                404: path.resolve(__dirname, "404.html"),
            },
        },
    }
}