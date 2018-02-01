/**
 * @jest-environment node
 */

const redirectToShopifyOauth = require('.');

test('should throw on missing options', () => {
  expect(() => {
    return redirectToShopifyOauth({
      callbackUrl: 'https://example.com/oauth/callback',
      scopes: ['write_products', 'read_orders']
    });
  }).toThrow(/Missing field/);

  expect(() => {
    redirectToShopifyOauth({
      callbackUrl: 'https://example.com/oauth/callback',
      shopifyApiKey: 'abcdef'
    });
  }).toThrow(/Missing field/);

  expect(() => {
    redirectToShopifyOauth({
      scopes: ['write_products', 'read_orders'],
      shopifyApiKey: 'abcdef'
    });
  }).toThrow(/Missing field/);

  expect(() => {
    redirectToShopifyOauth();
  }).toThrow(/Missing fields/);
});

test('with string scopes', () => {
  const output = redirectToShopifyOauth({
    callbackUrl: 'https://example.com/oauth/callback',
    scopes: ['write_products', 'read_orders'],
    shopifyApiKey: 'abcdef',
    shopHostname: 'custom-pins.myshopify.com'
  });

  expect(output).toMatchSnapshot();
});

test('with array of scopes', () => {
  const output = redirectToShopifyOauth({
    callbackUrl: 'https://example.com/oauth/callback',
    scopes: 'write_products,read_orders',
    shopifyApiKey: 'abcdef',
    shopHostname: 'custom-pins.myshopify.com'
  });

  expect(output).toMatchSnapshot();
});

test('with no scopes', () => {
  const output = redirectToShopifyOauth({
    shopHostname: 'shiny-trinkets.myshopify.com',
    callbackUrl: 'https://example.com/oauth/callback',
    shopifyApiKey: 'abcdef'
  });

  expect(output).toMatchSnapshot();
});
