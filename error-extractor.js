var debug = require('debug')

var db = require('./db')
var config = require('./config')

var error = debug('extractor:error')
var setName = config.SET_NAMES.erroredMessagesSet

/**
 * Log out all error messages and clean error log
 */
function out() {
  db.connect.pub.multi()
    .smembers(setName)
    .del(setName)
    .exec(function (err, results) {
      if (err)
        return error(err)

      results[0].forEach(function (row) {
        console.log(row)
      })

      db.connect.pub.quit()
      db.connect.sub.quit()
    })
}

module.exports = out
