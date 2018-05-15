const {ResolverFactory} = require('enhanced-resolve');
const Plugin = require('./');
const fs = require('fs');
const path = require('path');

it('resolves normally with no options set', async () => {
  const plugin = new Plugin({});

  const result = await resolveAsync('./__mocks__/cake.js', plugin);
  expect(result).toEqual(path.resolve(__dirname, '__mocks__/cake.js'));
});

it('resolves with appended basename', async () => {
  const plugin = new Plugin({append: '.chocolate'});

  const result = await resolveAsync('./__mocks__/cake.js', plugin);
  expect(result).toEqual(
    path.resolve(__dirname, '__mocks__/cake.chocolate.js')
  );
});

it('falls back to non-appended', async () => {
  const plugin = new Plugin({append: '.chocolate'});

  const result = await resolveAsync('./__mocks__/muffin.js', plugin);
  expect(result).toEqual(path.resolve(__dirname, '__mocks__/muffin.js'));
});

const resolveAsync = (request, plugin) =>
  new Promise((resolve, reject) => {
    const resolver = ResolverFactory.createResolver({
      fileSystem: fs,
      plugins: [plugin],
    });

    resolver.resolve({}, __dirname, request, {}, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
