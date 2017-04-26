// @flow

type MapFn<A, B> = A => B;

declare module d3 {
  declare module.exports: {
    max(xs: number[]): number,
    extent<A, B>(xs: A[], accessor?: MapFn<A, B>): B[],
    scale: Object,
    time: Object
  };
}
