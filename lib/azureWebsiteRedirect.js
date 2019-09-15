const hostHeader = 'host';
const permanentRedirectStatusCode = 301;
const azureWebsitePathRegex = /^.*\.azurewebsites\.net\/?$/;

const customDomain = 'seeds4tracks.com';

function azureWebsiteRedirect(req, res, next) {
    let hostValue = req.get(hostHeader) || req.hostname;
    if (azureWebsitePathRegex.test(req.path)) {
        hostValue = hostValue.replace(azureWebsitePathRegex, customDomain);
        res.redirect(permanentRedirectStatusCode, `${req.protocol}://${hostValue}${newUrl}`);
    } else {
        next();
    }
}

module.exports = azureWebsiteRedirect;