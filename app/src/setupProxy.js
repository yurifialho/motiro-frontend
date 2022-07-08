const { createProxyMiddleware } = require('http-proxy-middleware')

const proxy = {
    target: 'http://localhost:10000',
    changeOrigin: true,
    pathRewrite: {'^/api':''},
    headers: {"Authorization": "Token 4d7605ae950d69a79ee00afe970d9941b73ac651"},
    logLevel: 'debug',
}

module.exports = (app) => {
    app.use('/api',
        createProxyMiddleware(proxy)
    );
}