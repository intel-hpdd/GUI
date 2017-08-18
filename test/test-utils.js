import * as fp from '@iml/fp';
import Inferno from 'inferno';

export const extendWithConstructor = (constructor, obj) => {
  const scope = Object.create({}, {});
  Object.assign(scope, obj);
  Object.getPrototypeOf(scope).constructor = constructor;

  return scope;
};

export const flushD3Transitions = d3 => {
  const now = Date.now;

  Date.now = function() {
    return Infinity;
  };

  d3.timer.flush();

  Date.now = now;
};

export const convertNvDates = s =>
  s.tap(
    fp.map(item => {
      item.values.forEach(value => {
        value.x = value.x.toJSON();
      });
    })
  );

export const renderToSnapshot = child => {
  const root = document.createElement('div');
  Inferno.render(child, root);
  return root;
};
