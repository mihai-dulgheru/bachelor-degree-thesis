const jsscompress = require('js-string-compression')

function compress(rawText) {
  const compressed = hm.compress(rawText)
  return compressed
}

function decompress(compressed) {
  const decompressed = hm.decompress(compressed)
  return decompressed
}

module.exports = { compress, decompress }
