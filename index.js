const checkOptions = require('check-options');
const createRedirectUrl = require('./create-redirect-url');
const createRedirectBody = require('./create-redirect-body');

module.exports = function redirectToShopifyOAuth(options) {
  options = checkOptions(
    options,
    ['shopHostname', 'callbackUrl', 'shopifyApiKey'],
    { scopes: [] }
  );

  // Prepare redirect URL and generate a response body
  const redirectUrl = createRedirectUrl(options);
  const redirectBody = createRedirectBody(redirectUrl, options.shopHostname);

  return redirectBody;
};
