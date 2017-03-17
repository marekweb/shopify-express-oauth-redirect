'use strict';

const querystring = require('querystring');
const checkOptions = require('check-options');

module.exports = function (options) {
  options = checkOptions(options, ['callbackUrl', 'shopifyApiKey'], {scopes: []});

  return function createShopifyOauthAuthorizeRedirect(shopHostname) {
    if (!shopHostname) {
      throw new Error('Missing parameter: shopHostname');
    }

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

    const url = 'https://' + shopHostname + '/admin/oauth/authorize?' + query;

    return url;
  };
};

