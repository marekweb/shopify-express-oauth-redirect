const querystring = require('querystring');
const checkOptions = require('check-options');

module.exports = function createRedirectUrl(options) {
  options = checkOptions(
    options,
    ['shopHostname', 'callbackUrl', 'shopifyApiKey'],
    { scopes: [] }
  );

  // Allow scopes option to be a string or an array to be joined
  let scopes = options.scopes;
  if (Array.isArray(scopes)) {
    scopes = scopes.join(',');
  }

  const query = querystring.stringify({
    client_id: options.shopifyApiKey,
    scope: scopes,
    redirect_uri: options.callbackUrl
  });

  const url = `https://${options.shopHostname}/admin/oauth/authorize?${query}`;

  return url;
};
