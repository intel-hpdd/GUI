// @flow

type QuerySelector<T: HTMLElement> = (HTMLElement | Document, string) => T;

export const querySelector: QuerySelector<*> = (
  elm: HTMLElement | Document,
  sel: string
) => {
  const selected = elm.querySelector(sel);

  if (!selected)
    throw new Error(
      `Could not find selector ${sel} for element ${elm.nodeName}`
    );

  return selected;
};
