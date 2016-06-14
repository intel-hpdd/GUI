import * as obj from 'intel-obj';

const origDeps = {};

export function mock (name, mocks) {
  const objReducer = obj.reduce(() => ({}));

  mocks = objReducer((val, key, out) => {
    out[normalizeName(key)] = val;

    return out;
  }, mocks);

  const promises = obj.reduce([], (val, key, out) => {
    if (origDeps[key])
      throw new Error(`${key} needs to be reset before mocking`);

    out.push(
        getOrImport(key)
        .then(m => origDeps[key] = m)
        .then(() => System.delete(key))
        .then(() => System.set(key, System.newModule(val)))
    );

    return out;
  }, mocks);

  const normalizedName = normalizeName(name);
  return Promise.all(promises)
    .then(() => getOrImport(normalizedName))
    .then(m => origDeps[normalizedName] = m)
    .then(() => System.delete(normalizedName))
    .then(() => System.import(normalizedName));
}

function getOrImport (name) {
  const existingModule = System.get(name);

  return existingModule ? Promise.resolve(existingModule) : System.import(name);
}

function normalizeName (name) {
  name = System.map[name] || name;
  return System.normalizeSync(name);
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
