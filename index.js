'use strict';

const path = require('path');
const forEachBail = require('enhanced-resolve/lib/forEachBail');

const asArray = x => (Array.isArray(x) ? x : [x]);

const appendToBasename = (source, append) => {
  const pathObj = path.parse(source);

  return path.format({
    dir: pathObj.dir,
    ext: pathObj.ext,
    name: pathObj.name + append,
  });
}

const appendToRequest = request => append =>
  Object.assign({}, request, {
    path: appendToBasename(request.path, append),
    relativePath: appendToBasename(request.relativePath, append),
  });

class BasenameAppendResolverPlugin {
  constructor(options) {
    this.source = options.source || 'described-relative';
    this.target = options.target || 'raw-file';
    this.include = options.include ? asArray(options.include) : null;
    this.exclude = options.exclude ? asArray(options.exclude) : null;
    this.append = options.append ? asArray(options.append) : [];
  }

  onTap(target, resolver, request, resolveContext, callback) {
    const {include, exclude} = this;
    const requestPath = request.path;

    // return if path matches with excludes
    if (exclude && exclude.some(pattern => requestPath.search(pattern) >= 0)) {
      return callback();
    }

    // return if path doesn't match with includes
    if (include && !include.some(pattern => requestPath.search(pattern) >= 0)) {
      return callback();
    }

    const attempts = this.append.map(appendToRequest(request));

    forEachBail(
      attempts,
      (attempt, innerCallback) => {
        resolver.doResolve(
          target,
          attempt,
          `append basename`,
          resolveContext,
          innerCallback
        );
      },
      callback
    );
  }

  apply(resolver) {
    const target = resolver.ensureHook(this.target);
    resolver
      .getHook(this.source)
      .tapAsync(
        'BasenameAppendResolverPlugin',
        this.onTap.bind(this, target, resolver)
      );
  }
}

module.exports = BasenameAppendResolverPlugin;
