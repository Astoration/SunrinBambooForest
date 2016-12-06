'use strict';
const http = require('http')
const Bot = require('messenger-bot')
const process = require('process')
var Rx = require("rx")
var RxNode = require("rx-node")

var userStreamDict = {}

let bot = new Bot({
  token: 'EAALsYZB66QHsBAOwyDN2qeZAWA9nRY8WmJZBGRIZBz1YhtAZAwYYogERApZAxh23hXNvcngtSXSOlsCfiMAZCZAvZAaInRI1GQUTarNTAyy6IyZCpzROTbqyoqUdX35PcVEHm3E0hD3CSRtzCDOanZBEdZBsnZBRdr2FqcEizx9sdNRQDGQZDZD',
  verify: 'helloworld',
  app_secret: 'dac3c94ac910290780808f732281daa5'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

http.createServer(bot.middleware()).listen(process.env.PORT)
