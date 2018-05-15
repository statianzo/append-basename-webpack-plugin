# append-basename-webpack-plugin

[![Build Status](https://travis-ci.org/statianzo/append-basename-webpack-plugin.svg?branch=master)](https://travis-ci.org/statianzo/append-basename-webpack-plugin)

Append to basenames before resolution in webpack

`style.css` becomes `style.dark.css`

## Installation

Install the package

```sh
npm install --save-dev append-basename-webpack-plugin
```

Add the plugin to your webpack config `resolve.plugins`

```js
// webpack.config.js

const AppendBasenameWebpackPlugin = require('append-basename-webpack-plugin');

module.exports = {
  resolve: {
    plugins: [
      new AppendBasenameWebpackPlugin({
        append: '.dark'
      })
    ]
  }
}
```

## Options

- `include` - (Default: null) String or Array of patterns to include appending
- `exclude` - (Default: null) String or Array of patterns to exclude appending. *Takes priority over include*
- `append` - (Default: '') String to append to the basename of matched files
- `source` - (Default 'described-relative') Source hook to tap in enhanced-resolve's resolution
- `target` - (Default 'raw-file') Target hook to emit in enhanced-resolve's resolution

## Why?

Push conditionals to the configuration level by overwriting imports. For
example, theming with CSS modules.
