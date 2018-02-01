# Shopify OAuth Redirect

![npm](https://img.shields.io/npm/v/shopify-express-oauth-redirect.svg?maxAge=259200) ![travis](https://travis-ci.org/marekweb/shopify-express-oauth-redirect.svg?branch=master) ![node](https://img.shields.io/badge/node-%3E=8.1-blue.svg)

Create a redirect response to Shopify OAuth.

```js
const shopifyOauthRedirect = require('shopify-express-oauth-redirect';

app.get('/auth/shopify', (req, res, next) => {
  if (!req.query.shop) {
    return res.send('Provide "shop" query parameter.');
  }

  const redirectResponse = shopifyOauthRedirect({
    shopHostname: req.query.shop,
    shopifyApiKey: SHOPIFY_API_KEY,
    scopes: ['write_products', 'read_orders'],
    callbackUrl: 'https://example.com/auth/shopify/callback'
  });

  res.send(redirectResponse);
});
```

## Why not `res.redirect`?

`res.redirect` sends a HTTP 302 redirect. This is not enough because when the app is in the Shopify EASDK iframe, the 302 won't escape out of the iframe.

Instead, this technique sends a full response containing javascript which redirects the browser's top frame, or sends a message to the EASDK to trigger the top frame reload.

## Reference

```js
shopifyOauthRedirect(options);
```

- `options`: an object of options as follows:
  - `callbackUrl`: (string) the OAuth callback redirect URL. Must be an allowed OAuth redirect, which means it must be whitelisted in your Shopify app settings.
  - `shopifyApiKey`: (string) the Shopify API key for OAuth (also known as the Client ID).
  - `scopes`: (string | array) an array of strings or a comma-delimited string which describes the OAuth permission scopes.
  - `shopHostname` (string) The `myshopify.com` hostname of the shop, such as `my-store.myshopify.com`.
