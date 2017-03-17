'use strict';

const test = require('tape');
const express = require('express');
const got = require('got');
const getPort = require('get-port');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const expressOAuthRedirect = require('.');

// This is a helper to test express middleware
function withListeningApp(app, f) {
  getPort().then(port => {
    const server = app.listen(port, () => {
      const url = 'http://localhost:' + port;
      const result = f(url);
      Promise.resolve(result).then(() => {
        server.close();
      });
    });
  });
}

test(t => {
  const app = express();

  t.throws(() => {
    expressOAuthRedirect.attachToExpressApp(app, {
      callbackUrl: 'https://example.com/oauth/callback',
      scopes: ['write_products', 'read_orders']
    });
  }, /Missing field/);

  t.throws(() => {
    expressOAuthRedirect.attachToExpressApp(app, {
      callbackUrl: 'https://example.com/oauth/callback',
      shopifyApiKey: 'abcdef'
    });
  }, /Missing field/);

  t.throws(() => {
    expressOAuthRedirect.attachToExpressApp(app, {
      scopes: ['write_products', 'read_orders'],
      shopifyApiKey: 'abcdef'
    });
  }, /Missing field/);

  t.throws(() => {
    expressOAuthRedirect.attachToExpressApp(app);
  }, /Missing fields/);

  t.end();
});

test(t => {
  const app = express();

  expressOAuthRedirect.attachToExpressApp(app, {
    callbackUrl: 'https://example.com/oauth/callback',
    scopes: ['write_products', 'read_orders'],
    shopifyApiKey: 'abcdef'
  });

  app.use((req, res) => {
    res.redirectToShopifyOAuth('custom-pins.myshopify.com');
  });

  withListeningApp(app, url => {
    return fs.readFileAsync('./output-snapshot-1.txt', 'utf-8').then(outputSnapshot => {
      return got(url).then(response => {
        t.equals(response.statusCode, 200);
        t.equals(response.body, outputSnapshot);
        t.end();
      });
    }).catch(err => console.error(err))
  });
});

test(t => {
  const app = express();

  expressOAuthRedirect.attachToExpressApp(app, {
    callbackUrl: 'https://example.com/oauth/callback',
    scopes: 'write_products,read_orders',
    shopifyApiKey: 'abcdef'
  });

  app.use((req, res) => {
    res.redirectToShopifyOAuth('custom-pins.myshopify.com');
  });

  withListeningApp(app, url => {
    return fs.readFileAsync('./output-snapshot-2.txt', 'utf-8').then(outputSnapshot => {
      return got(url).then(response => {
        const expectedBody = '<script>window.top.location = "https://custom-pins.myshopify.com/admin/oauth/authorize?client_id=abcdef&scope=write_products%2Cread_orders&redirect_uri=https%3A%2F%2Fexample.com%2Foauth%2Fcallback";</script>';
        t.equals(response.statusCode, 200);
        t.equals(response.body, outputSnapshot);
        t.end();
      });
    });
  });
});

test(t => {
  const app = express();

  expressOAuthRedirect.attachToExpressApp(app, {
    callbackUrl: 'https://example.com/oauth/callback',
    scopes: ['write_products', 'read_orders'],
    shopifyApiKey: 'abcdef'
  });

  app.use((req, res) => {
    t.throws(() => {
      // Call method with omitted required param
      res.redirectToShopifyOAuth();
    });
    res.send();
  });

  withListeningApp(app, url => {
    return got(url).then(() => t.end());
  });
});
