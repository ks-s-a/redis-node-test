var async = require('async')
var debug = require('debug')

var config = require('../config')
var utils = require('../external-utils')

var info = debug('generator:info')
var error = debug('generator:error')

var GENERATORS_CHANNEL_NAME = config.GENERATORS_CHANNEL_NAME
var MESSAGES_CHANNEL_NAME = config.MESSAGES_CHANNEL_NAME

/**
 * Generator class
 * @params {Object} connects     - redis publisher and subscriber connects
 * @params {Object} connects.pub - publisher connect
 * @params {Object} connects.sub - subscriber connect
 */
function Generator(connects) {
  this.pubConnect = connects.pub
  this.subConnect = connects.sub
  this.isActive = false
  this.delay = config.MESSAGE_DELAY
}

Generator.prototype = {
  /**
   * Initialization
   */
  init: function () {
    var self = this

    if (this.isActive) {
      this.publish()
    } else {
      this.checkGeneratorExistingAndSubscribe()
    }

    setTimeout(this.init.bind(self), this.delay)
  },

  /**
   * Publish message
   */
  publish: function () {
    var message = utils.getMessage()

    info('Try to publish new message')
    this.pubConnect.publish(MESSAGES_CHANNEL_NAME, message, function (err) {
      if (err)
        error('Error during message sending: ' + err)

      info('Message has been sent')
    })
  },

  /**
   * Check generator existing and become it, if necessary
   */
  checkGeneratorExistingAndSubscribe: function () {
    var self = this

    async.waterfall([
      function (cb) {
        return self.pubConnect.pubsub('numsub', GENERATORS_CHANNEL_NAME, cb)
      },

      function (results, cb) {
        var subsNum = results[1]

        if (subsNum) {
          info('We already have at least one generator')
          return null
        }

        info('New generator will start!')
        return self.subConnect.subscribe(GENERATORS_CHANNEL_NAME, cb)
      },

      function (results, cb) {
        return self.pubConnect.pubsub('numsub', GENERATORS_CHANNEL_NAME, cb)
      },

      function (results, cb) {
        var subsNum = results[1]

        if (subsNum > 1) {
          info('So many generators connected at the same time')
          self.pubConnect.unsubscribe(GENERATORS_CHANNEL_NAME, cb)
        }

        info('New generator has been started!')
        self.isActive = true
      }
    ], function (err) {
      if (err)
        error(err)
    })
  }
}

module.exports = Generator
