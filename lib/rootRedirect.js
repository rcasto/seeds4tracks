const hostHeader = 'host';
const permanentRedirectStatusCode = 301;
const rootIndexPathRegex = /^\/index\.html$/;

function rootRedirect(req, res, next) {
    const hostValue = req.get(hostHeader) || req.hostname;
    if (rootIndexPathRegex.test(req.path)) {
        const newUrl = req.originalUrl.replace(rootIndexPathRegex, '/');
        res.redirect(permanentRedirectStatusCode, `${req.protocol}://${hostValue}${newUrl}`);
    } else {
        next();
    }
}

module.exports = rootRedirect;