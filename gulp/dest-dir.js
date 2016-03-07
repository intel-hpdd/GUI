module.exports = process.argv
  .filter(function getDestOption (x) {
    return x.indexOf('--dest-dir=') === 0;
  })
  .map(function getDestDir (x) {
    return x.split('=')[1];
  })
  .pop() || '../chroma/chroma-manager/chroma_ui';
