const { createProxyMiddleware } = require('http-proxy-middleware')

const proxy = {
    target: 'http://localhost:10000',
    changeOrigin: true,
    pathRewrite: {'^/api':''},
    headers: {"Authorization": "Token e9e9a386d2e053ac1ba3ef45c2efe09a97183133"},
    logLevel: 'debug',
}

module.exports = (app) => {
    app.use('/api',
        createProxyMiddleware(proxy)
    );
}