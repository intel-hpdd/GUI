import angular from 'angular';

export const extendWithConstructor = (constructor, obj) => {
  const scope = Object.create({}, {});
  angular.extend(scope, obj);
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
