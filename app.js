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
	  var headers = {
	      'User-Agent':       'Super Agent/0.0.1',
	      'Content-Type':     'application/x-www-form-urlencoded'
	  }
          var options = {
               url: 'https://graph.facebook.com/292635721138139/feed',
	       method:'POST',
	       headers: headers,
	       form: {'message': "#"+count+++"번째_제보\n"+(x.toString().replace(",","\n")), 'access_token': 'EAACEdEose0cBAL0i89T8cMRuZBmt3JbJflnss4aOVhrVRJL2M15w9me1queRrZBy2ZBWuAjB7YhZC3WvZCGcVDsSsiQKRFZB6k2ZB7jc0Dr5o7DYU74B2eZCZAhXCbZBQZB6bFtAxdqx4ZBo6zBu4rwZAUV29poAXoaCi1QolXsurXzMrV7tZBQic6oaPZC'}
	  }
	  request(options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      console.log(body)
	    }
	  })
	  reply({text:"제보 되었습니다 감사합니다."},(err) => {if(err) throw err})
	})
    }
    if(message == "안내"){
	reply({text:"제보할 내용을 말해주세요, 제보가 끝나면 \'이상입니다\'라고 대답해주시면 됩니다"},(err)=>{if(err) throw err})
    }else if(message == "이상입니다"){
    	userEndStreamDict[userId].next('end')
    }else{
	userStreamDict[userId].next(message.toString())
    }
  })
})

http.createServer(bot.middleware()).listen(process.env.PORT)
