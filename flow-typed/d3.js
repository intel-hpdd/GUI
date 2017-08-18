// @flow

type MapFn<A, B> = A => B;

declare module d3 {
  declare module.exports: {
    max<A, B: number>(xs: A[], keyFn?: (A) => B): B,
    extent<A, B>(xs: A[], accessor?: MapFn<A, B>): B[],
    scale: Object,
    time: Object,
    svg: Object,
    select: Function,
    dispatch: Function
  };
}
