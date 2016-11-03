// @flow

declare module d3 {
  declare module.exports: {
    max(xs:number[]):number;
    extent(xs:number[]):number[];
    scale:Object;
    time:Object;
  }
}
