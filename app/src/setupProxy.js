const { createProxyMiddleware } = require('http-proxy-middleware')

const proxy = {
    target: 'http://motiro-okara:10000',
    changeOrigin: true,
    pathRewrite: {'^/api':''},
    headers: {"Authorization": "Token eaf70ab4350ca3e14b2761e1e9f0bfe4f524f438"},
    logLevel: 'debug',
}

module.exports = (app) => {
    app.use('/api',
        createProxyMiddleware(proxy)
    );
}