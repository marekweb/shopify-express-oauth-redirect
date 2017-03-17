module.exports = function createRedirectBody(url, shopHostname) {
  const quotedUrl = JSON.stringify(url);
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <base target="_top">
        <title>Redirecting...</title>
        <script type="text/javascript">
          // If the current window is the 'parent', change the URL by setting location.href
          if (window.top == window.self) {
            window.top.location.href = ${quotedUrl};
          // If the current window is the 'child', change the parent's URL with postMessage
          } else {
            normalizedLink = document.createElement('a');
            normalizedLink.href = ${quotedUrl};
            data = JSON.stringify({
              message: 'Shopify.API.remoteRedirect',
              data: { location: normalizedLink.href }
            });
            window.parent.postMessage(data, "https://${shopHostname}");
          }
        </script>
      </head>
      <body>
      </body>
    </html>`;
};
