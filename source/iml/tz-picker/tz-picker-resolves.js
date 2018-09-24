// @flow

import type { HighlandStreamT } from "highland";

import getStore from "../store/get-store.js";
import broadcaster from "../broadcaster.js";
import { resolveStream } from "../promise-transforms.js";

export const tzPickerB = (): Promise<() => HighlandStreamT<mixed>> => {
  return resolveStream(getStore.select("tzPicker")).then(broadcaster);
};
