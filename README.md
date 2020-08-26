# Shopify OAuth Redirect

![npm](https://img.shields.io/npm/v/shopify-express-oauth-redirect.svg?maxAge=259200) ![travis](https://travis-ci.org/marekweb/shopify-express-oauth-redirect.svg?branch=master) ![node](https://img.shields.io/badge/node-%3E=8.1-blue.svg)

Create a redirect response to Shopify OAuth.

```js
const shopifyOauthRedirect = require('shopify-express-oauth-redirect');

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

## Special case using `postMessage` in the EASDK frame

Current versions of Chrome block third-party redirects of the top frame. This means that simply redirecting the location of the top frame no longer works.

This module implements a workaround in the EASDK using a `postMessage` call to the top frame, which then makes the top frame perform the redirect. This solves the problem.

## What does the redirect body look like?

See the body of the response in this file: [create-redirect-body.js](create-redirect-body.js)

## Reference

```js
shopifyOauthRedirect(options);
```

- `options`: an object of options as follows:
  - `callbackUrl`: (string) the OAuth callback redirect URL. Must be an allowed OAuth redirect, which means it must be whitelisted in your Shopify app settings.
  - `shopifyApiKey`: (string) the Shopify API key for OAuth (also known as the Client ID).
  - `scopes`: (string | array) an array of strings or a comma-delimited string which describes the OAuth permission scopes.
  - `shopHostname` (string) The `myshopify.com` hostname of the shop, such as `my-store.myshopify.com`.
  
## To make your APP embeedded within Shopify's UI

To show your APP embdedded within the Shopify UI you need to add Shopify's APP Bridge to your `callbackUrl` page.

``` html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>My shopify APP</title>
		<script src="https://unpkg.com/@shopify/app-bridge@^1"></script>
	</head>
	<body>
		<script type="text/javascript">
			var AppBridge = window["app-bridge"];
			var createApp = AppBridge.default;
			var app = createApp({
				apiKey: "your apiKey",
				shopOrigin: "the shopOrigin",
			});

		</script>
	</body>
</html>
```
