/**
 * Channel room for generator
 */
var GENERATORS_CHANNEL_NAME = 'generator'

/**
 * Channel for incomming generator's messages
 */
var MESSAGES_CHANNEL_NAME = 'messages'

/**
 * Delay for message sending
 */
var MESSAGE_DELAY = 500

/**
 * Database config
 */
var DB_CONFIG = {
  host: 'localhost',
  port: '6379'
}

/**
 * Redis log set names
 */
var SET_NAMES = {
  recievedMessagesSet: 'recievedmessages',
  erroredMessagesSet: 'errors'
}

module.exports = {
  GENERATORS_CHANNEL_NAME: GENERATORS_CHANNEL_NAME,
  MESSAGES_CHANNEL_NAME: MESSAGES_CHANNEL_NAME,
  MESSAGE_DELAY: MESSAGE_DELAY,
  DB_CONFIG: DB_CONFIG,
  SET_NAMES: SET_NAMES
}
