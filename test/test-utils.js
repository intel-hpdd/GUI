import angular from 'angular';

export const extendWithConstructor = (constructor, obj) => {
  const scope = Object.create({}, {});
  angular.extend(scope, obj);
  Object.getPrototypeOf(scope).constructor = constructor;

  return scope;
};
