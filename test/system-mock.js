import * as obj from 'intel-obj';

const origDeps = {};

export function mock (name, mocks) {
  name = System.map[name] || name;

  const objReducer = obj.reduce(() => ({}));

  mocks = objReducer((val, key, out) => {
    key = System.map[key] || key;
    key = System.normalizeSync(key);

    out[key] = val;

    return out;
  }, mocks);

  objReducer((val, key) => {
    if (origDeps[key])
      throw new Error(`${key} needs to be reset before mocking`);

    origDeps[key] = System.get(key);

    System.delete(key);
    System.set(key, System.newModule(val));
  }, mocks);

  const normalizedName = System.normalizeSync(name);
  origDeps[normalizedName] = System.get(normalizedName);
  System.delete(normalizedName);
  return System.import(name);
}

export function reset (name) {
  const origName = name;
  name = System.map[name] || name;
  name = System.normalizeSync(name);

  if (!origDeps[name])
    throw new Error(`${origName} is not mocked`);

  System.delete(name);
  System.set(name, System.newModule(origDeps[name]));
}

export function resetAll () {
  Object
  .keys(origDeps)
  .map(x => {
    System.delete(x);
    System.set(x, System.newModule(origDeps[x]));
    delete origDeps[x];
  });
}
