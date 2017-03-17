# Shopify Express OAuth Redirect

Plugin for Express which adds a conventient `redirectToShopifyOAuth` method.

Usage in a request handler:

```js
app.get('/oauth', function(req, res, next) {
  res.redirectToShopifyOAuth('my-store.myshopify.com');
});
```

Requirements:

- Express 4.x
- A valid Shopify API key

## Installation

Add the module to your `package.json`:

```sh
npm install --save shopify-express-oauth-redirect
```

In your Express code, after you instantiate your Express app, attach the plugin with `shopifyExpressOAuthRedirect.attachToExpressApp`

```js
var shopifyExpressOAuthRedirect = require('shopify-express-oauth-redirect');

var app = express();

// Attach the plugin to your Express app
shopifyExpressOAuthRedirect.attachToExpressApp(app, {
  callbackUrl: 'https://example.com/oauth/callback',
  shopifyApiKey: 'provide_your_shopify_api_key_here',
  scopes: ['write_products', 'read_orders']
});

// Once attached, you can use it in request handlers (or in middleware).
app.get('/', function(req, res, next) => {
  var hostname = req.query.shop;
  res.redirectToShopifyOAuth(hostname);
});
```

## Function reference

```ts
expressOAuthRedirect.attachToExpressApp(app, options)
```
- `app`: an Express app instance (created by `express()`);
- `options`: an object of options as follows:
  - `callbackUrl`: the OAuth callback redirect URL. Must be an allowed OAuth redirect, which means it must be whitelisted in your Shopify app settings.
  - `shopifyApiKey`: the Shopify API key for OAuth (also known as the Client ID).
  - `scopes`: an array of strings or a comma-delimited string which describes the OAuth permission scopes.

```ts
res.redirectToShopifyOAuth(shopHostname)
```

- `shopHostname` (string) The hostname of the shop for which to request authentication, on the `myshopify.com` domain. For example, `my-store.myshopify.com`.
