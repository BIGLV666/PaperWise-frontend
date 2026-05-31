module.exports = {
    devServer: {
        port: 5173,
        proxy: {
            '/paperwise': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    },
    lintOnSave: false
}