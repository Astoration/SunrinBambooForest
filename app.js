'use strict';
const http = require('http')
const Bot = require('messenger-bot')
const process = require('process')
var Rx = require("rx")
var RxNode = require("rx-node")

var userStreamDict = {}
var userEndStreamDict = {}
var userPostStreamDict = {}
var count = 1;

let bot = new Bot({
  token: 'EAALsYZB66QHsBAOwyDN2qeZAWA9nRY8WmJZBGRIZBz1YhtAZAwYYogERApZAxh23hXNvcngtSXSOlsCfiMAZCZAvZAaInRI1GQUTarNTAyy6IyZCpzROTbqyoqUdX35PcVEHm3E0hD3CSRtzCDOanZBEdZBsnZBRdr2FqcEizx9sdNRQDGQZDZD',
  verify: 'helloworld',
  app_secret: 'dac3c94ac910290780808f732281daa5'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let message = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    let userId = payload.sender.id.toString()
    if(!(userId in userStreamDict)){
    	userStreamDict[userId] = new Rx.Subject();
	userEndStreamDict[userId] = new Rx.Subject();
	userPostStreamDict[userId] = userEndStreamDict[userId].buffer(userStreamDict[userid])
	userPostStreamDict[userId].subscribe(x => reply({text:x},(err) => { if(err) throw err } ))
    }
    if(message == "안내"){
	reply({text:"제보할 내용을 말해주세요, 제보가 끝나면 \'이상입니다\'라고 대답해주시면 됩니다"},(err)=>{if(err) throw err})
    }else if(message == "이상입니다"){
    	userEndStreamDict[userId].next('end')
    }else{
	userStreamDict[userId].next(message)
    }
  })
})

http.createServer(bot.middleware()).listen(process.env.PORT)
