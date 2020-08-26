
module.exports = function createRedirectBody(url, shopHostname, shopifyApiKey) {
  const quotedUrl = JSON.stringify(url);
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <base target="_top">
        <title>Redirecting...</title>
		<script src="https://unpkg.com/@shopify/app-bridge@^1"></script> 
      </head>
      <body>
      <script type="text/javascript">
      		document.addEventListener('DOMContentLoaded', function() {
        if (window.top === window.self) {
          // If the current window is the 'parent', change the URL by setting location.href
          window.location.assign(${quotedUrl});

        } else {
          // If the current window is the 'child', change the parent's URL with postMessage
          var AppBridge = window['app-bridge'];
          var createApp = AppBridge.default;
          var Redirect = AppBridge.actions.Redirect;
          var app = createApp({
            apiKey: '${shopifyApiKey}',
            shopOrigin: "${encodeURI(shopHostname)}",
          });
          var redirect = Redirect.create(app);
          redirect.dispatch(Redirect.Action.REMOTE, '${url}');
        }
      });
    </script>
	
      </body>
    </html>`;
};
