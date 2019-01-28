const highland = require("highland");

let s = highland();
s.write([1]);
s.write([2]);
s.write([3]);
s.end();

s.flatMap(xs => {
  const streams = [xs].map(x => highland([x]));
  return highland(streams);
})
  .sequence()
  .collect()
  .each(x => console.log("x", x));
