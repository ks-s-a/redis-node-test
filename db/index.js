var config = require('../config')
var debug = require('debug')
var redis = require('redis')

var info = debug('redis:info')
var error = debug('redis:error')

var pub = redis.createClient(config.DB_CONFIG)
var sub = redis.createClient(config.DB_CONFIG)

pub.on('error', function (err) {
  error('Pub connect error ' + err)
})

sub.on('error', function (err) {
  error('Sub connect error ' + err)
})

sub.on('subscribe', function (channel, count) {
  info('We just were subscribed to "' + channel + '" with ${count} subscribers!')
})

sub.on('message', function (channel, message) {
  info('You recieve message: "' + message + '" from "${channel}" channel.')
})

module.exports = {
  connect: {
    pub: pub,
    sub: sub
  }
}
