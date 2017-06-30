//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from '@iml/lodash-mixins';

export default $cacheFactory => {
  'ngInject';
  const cache = $cacheFactory('pathMaxLength', { number: 1024 });

  function splitUp(path) {
    const components = { leadingSlash: '' };

    if (path.charAt(0) === '/') {
      components.leadingSlash = '/';
      path = path.slice(1);
    }

    components.parts = path.split('/');
    components.filename = components.parts.splice(-1, 1);

    return components;
  }

  function reducePath(pathComponents, maxLength) {
    let path;
    const parts = pathComponents.parts;
    let pointer =
      Math.ceil(parts.length / 2) - (parts.length % 2 === 1 ? 1 : 0);

    parts[pointer] = '...';

    while (1) {
      path = `${pathComponents.leadingSlash}${parts.join(
        '/'
      )}/${pathComponents.filename}`;

      if (path.length <= maxLength || parts.length === 1) break;

      // pointer is also the # of elements BEFORE the pointer
      const rightCount = parts.length - pointer - 1;
      if (pointer > rightCount) {
        pointer -= 1;
        parts.splice(pointer, 1);
      } else {
        parts.splice(pointer + 1, 1);
      }
    }

    return path;
  }

  return function filteredItems(path, maxLength) {
    if (!_.isString(path) || path.length <= maxLength) return path;

    const cacheKey = maxLength + path;
    const cachedPath = cache.get(cacheKey);
    if (!_.isUndefined(cachedPath)) return cachedPath;

    const pathComponents = splitUp(path);

    if (pathComponents.parts.length > 0)
      path = reducePath(pathComponents, maxLength);

    // catchall if the filename alone puts us over the length limit
    if (path.length > maxLength) path = '...';

    return cache.put(cacheKey, path);
  };
};
