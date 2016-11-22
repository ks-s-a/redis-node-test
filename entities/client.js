var async = require('async')
var debug = require('debug')

var config = require('../config')
var utils = require('../external-utils')

var info = debug('client:info')
var error = debug('client:error')

var MESSAGES_CHANNEL_NAME = config.MESSAGES_CHANNEL_NAME
var recievedMessagesSet = config.SET_NAMES.recievedMessagesSet
var erroredMessagesSet = config.SET_NAMES.erroredMessagesSet

/**
 * Client class
 * @params {Object} connects     - redis publisher and subscriber connects
 * @params {Object} connects.pub - publisher connect
 * @params {Object} connects.sub - subscriber connect
 */
function Client(connects) {
  this.pubConnect = connects.pub
  this.subConnect = connects.sub
}

Client.prototype = {
  /**
   * Initialization
   */
  init: function () {
    this.subConnect.subscribe(MESSAGES_CHANNEL_NAME, function(err) {
      if (err)
        error(err)
    })

    this.subConnect.on('message', this.onMessage.bind(this))
  },

  /**
   * Message handler
   * @params {string} channel - redis channel name
   * @params {string} message - handled message
   */
  onMessage: function (channel, message) {
    var self = this

    if (channel !== MESSAGES_CHANNEL_NAME)
      return

    info('Get message: ' + message)

    async.waterfall([
      function (cb) {
        self.pubConnect.sadd(recievedMessagesSet, message, cb)
      },

      function (res, cb) {
        if (!res)
          return null

        return utils.eventHandler(message, cb)
      }
    ], function (err, result) {
      var errMes
      if (err) {
        errMes = 'Error in message processing: ' + message
        self.sendError(errMes)
        return error(errMes)
      }

      return info('Handling result is: ' + result)
    })
  },

  /**
   * Error sending
   * @params {string} message
   */
  sendError: function (message) {
    this.pubConnect.sadd(erroredMessagesSet, message)
  }
}

module.exports = Client
