const { createProxyMiddleware } = require('http-proxy-middleware')

const proxy = {
    target: 'http://localhost:10000',
    changeOrigin: true,
    pathRewrite: {'^/api':''},
    headers: {"Authorization": "Token 03890cc287b450784ec49ac7254eeef2f102a99f"},
    logLevel: 'debug',
}

module.exports = (app) => {
    app.use('/api',
        createProxyMiddleware(proxy)
    );
}