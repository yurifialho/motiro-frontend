const { createProxyMiddleware } = require('http-proxy-middleware')

const proxy = {
    target: 'http://localhost:10000',
    changeOrigin: true,
    pathRewrite: {'^/api':''},
    headers: {"Authorization": "Token ed44af7b0f774e978a1af36e614431edc35e6f80"},
    logLevel: 'debug',
}

module.exports = (app) => {
    app.use('/api',
        createProxyMiddleware(proxy)
    );
}