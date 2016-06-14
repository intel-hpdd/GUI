// @flow

import * as obj from 'intel-obj';

const origDeps = new Set();
const origModules = {};

const objReducer = obj.reduce(() => ({}));

declare class System {
  static delete(key:string):void;
  static set(key:string, mod:Object):void;
  static newModule(val:Object):any;
  static import(key:string):Promise<Object>;
  static normalizeSync(key:string):string;
  static map:{ [key:string]: string };
  static get(key:string):Object;
}

export function mock (name:string, mocks:{ [key: string]: Object }) {
  mocks = objReducer((val, key, out) => {
    out[normalizeName(key)] = val;

    return out;
  }, mocks);

  objReducer((val, key) => {
    if (origDeps.has(key))
      throw new Error(`${key} needs to be reset before mocking`);

    const oldDep = System.get(key);

    if (oldDep)
      origModules[key] = oldDep;

    System.delete(key);
    System.set(key, System.newModule(val));
    origDeps.add(key);
  }, mocks);

  const normalizedName = normalizeName(name);

  const oldDep = System.get(normalizedName);

  if (oldDep)
    origModules[normalizedName] = oldDep;

  System.delete(normalizedName);
  origDeps.add(normalizedName);
  return System.import(normalizedName);
}

function normalizeName (name:string) {
  name = System.map[name] || name;
  return System.normalizeSync(name);
}

export function reset (name:string) {
  const origName = name;
  name = normalizeName(name);

  if (!origDeps.has(name))
    throw new Error(`${origName} is not mocked`);

  System.delete(name);
  origDeps.delete(name);

  if(origModules[name]) {
    System.set(name, origModules[name]);
    delete origModules[name];
  }
}

export function resetAll () {
  Array
  .from(origDeps)
  .map(reset);
}
