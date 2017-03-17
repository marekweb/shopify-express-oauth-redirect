'use strict';

const checkOptions = require('check-options');
const createRedirectUrlFactory = require('./create-redirect-url');
const createRedirectBody = require('./create-redirect-body');

module.exports = {
    attachToExpressApp: function(app, options) {
    options = checkOptions(options, ['callbackUrl', 'shopifyApiKey', 'scopes']);

    const createRedirectUrl = createRedirectUrlFactory(options);

    app.response.redirectToShopifyOAuth = function (shopHostname) {
      const redirectUrl = createRedirectUrl(shopHostname);

      const redirectBody = createRedirectBody(redirectUrl, shopHostname);

      this.send(redirectBody);
    };
  }
};
