'use strict';
const http = require('http')
const Bot = require('messenger-bot')
const process = require('process')
var Rx = require("rxjs/Rx")
var RxNode = require("rx-node")
var request = require("request")

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
	userPostStreamDict[userId] = userStreamDict[userId].buffer(userEndStreamDict[userId])
	userPostStreamDict[userId].subscribe((x) => {
	  request('https://graph.facebook.com/v2.8/292635721138139?fields=access_token&access_token=EAACEdEose0cBAHdz6KNlC5IZBC8gxqYQtaO9wWPKcdRFRI3kh0oS7waFM9cT2TNgbqcCSGGXjAAL2lu5tgyqayP0IsFm9FEoLZCOZCnRlTkIrKHfe9yCk190fRLyCPhNQGP9ianlfRKerWSlFRHGtgQOO2QaWFHcBeQEarfuQZDZD',function(err,res,body){
	  if(err) throw err
	  if(res.statusCode!=200) throw err
	  var data = JSON.parse(body)

	  var headers = {
	      'User-Agent':       'Super Agent/0.0.1',
	      'Content-Type':     'application/x-www-form-urlencoded'
	  }
          var options = {
               url: 'https://graph.facebook.com/292635721138139/feed',
	       method:'POST',
	       headers: headers,
	       form: {'message': "#"+count+++"번째_제보\n"+(x.toString().replace(/,/g,"\n").replace(/#ef14/g,",")), 'access_token': data.access_token}
	  }
	  request(options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      console.log(body)
	    }
	  })
	  reply({text:"제보 되었습니다 감사합니다."},(err) => {if(err) throw err})
	  })
	})
	
    }
    if(message == "안내"){
	reply({text:"제보할 내용을 말해주세요, 제보가 끝나면 \'이상입니다\'라고 대답해주시면 됩니다"},(err)=>{if(err) throw err})
    }else if(message == "이상입니다"){
    	userEndStreamDict[userId].next('end')
    }else{
	userStreamDict[userId].next(message.toString().replace(/,/g,"#ef14"))
    }

  })
})

http.createServer(bot.middleware()).listen(process.env.PORT)
