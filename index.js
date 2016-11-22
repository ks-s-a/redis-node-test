var args = require('minimist')(process.argv.slice(2))

var errorExtractor = require('./error-extractor')
var Generator = require('./entities/generator')
var Client = require('./entities/client')
var connect = require('./db').connect

// Run extractor, if necessary
if (args.getErrors) {
  return errorExtractor()
}

var g = new Generator(connect)
g.init()

var c = new Client(connect)
c.init()
