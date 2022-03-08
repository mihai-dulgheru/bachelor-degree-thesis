const LZString = require('lz-string')

function compress (string) {
  return LZString.compress(string)
}

function decompress (compressed) {
  return LZString.decompress(compressed)
}

module.exports = { compress, decompress }
