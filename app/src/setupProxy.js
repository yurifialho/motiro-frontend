const { createProxyMiddleware } = require('http-proxy-middleware')

const proxy = {
    target: 'http://localhost:10000',
    changeOrigin: true,
    pathRewrite: {'^/api':''},
    headers: {"Authorization": "Token f3b029b2ca93a3c8dd1d9286755fe8c83b2b0f6d"},
    logLevel: 'debug',
}

module.exports = (app) => {
    app.use('/api',
        createProxyMiddleware(proxy)
    );
}