//authenticating the bot 
    const express = require('express')
    const bodyParser = require('body-parser')
    const request = require('request')
    const app = express()

    app.set('port', (process.env.PORT || 5000))

    // Process application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: false}))

    // Process application/json
    app.use(bodyParser.json())

    // Index route
    app.get('/', function (req, res) {
    	res.send('Hello world, I am a chat bot')
    })

    // for Facebook verification
    app.get('/webhook/', function (req, res) {
    	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    		res.send(req.query['hub.challenge'])
    	}
    	res.send('Error, wrong token')
    })

    // Spin up the server
    app.listen(app.get('port'), function() {
    	console.log('running on port', app.get('port'))
    })


    //setting up the bot
    app.post('/webhook/', function (req, res) {
	    let messaging_events = req.body.entry[0].messaging

	    for (let i = 0; i < messaging_events.length; i++) {
		    let event = req.body.entry[0].messaging[i]
		    let sender = event.sender.id
	    if (event.message && event.message.text) {
			    let text = event.message.text
			    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		    }
	    }
	    res.sendStatus(200)
    })

    const token = "EAALqTXVZCdYMBAA87S4ymVgC1SXKE6MrMP1buaWoDnHyOFAKZBc3UZAJZAUWpanfRkZBfAt9sK6UpHMD7f4Xj4ZBnY4EajBZBQkmuARIpXmujr4EVgI4BckNdk9Nm74DiOB0PiW8qVbI0HBl87e6Nv4da2ho6J5jYMZBPJZCZCS2uDy7BHKXPUST4t"

    //after installing the dependencies highlighted in notes
    //and the bot works 
    //update the webhook api to look for special messages to trigger
    //the cards with the commented code below

    //  app.post('/webhook/', function (req, res) {
	   //  let messaging_events = req.body.entry[0].messaging
	   //  for (let i = 0; i < messaging_events.length; i++) {
		  //   let event = req.body.entry[0].messaging[i]
		  //   let sender = event.sender.id
		  //   if (event.message && event.message.text) {
			 //    let text = event.message.text
			 //    if (text === 'Generic') {
				//     sendGenericMessage(sender)
			 //    	continue
			 //    }
			 //    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		  //   }
	   //  }
	   //  res.sendStatus(200)
    // })


    //after updating the webhook api to trigger the cards as in code
    //above , update the webhook api again to send back as postback 
    //function when user messages using the code below.

  //    app.post('/webhook/', function (req, res) {
  //   let messaging_events = req.body.entry[0].messaging
  //   for (let i = 0; i < messaging_events.length; i++) {
  //     let event = req.body.entry[0].messaging[i]
  //     let sender = event.sender.id
  //     if (event.message && event.message.text) {
  // 	    let text = event.message.text
  // 	    if (text === 'Generic') {
  // 		    sendGenericMessage(sender)
  // 		    continue
  // 	    }
  // 	    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
  //     }
  //     if (event.postback) {
  // 	    let text = JSON.stringify(event.postback)
  // 	    sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
  // 	    continue
  //     }
  //   }
  //   res.sendStatus(200)
  // }) 


//adding functions to echo back messages
  function sendTextMessage(sender, text) {
	    let messageData = { text:text }
	    request({
		    url: 'https://graph.facebook.com/v2.6/me/messages',
		    qs: {access_token:token},
		    method: 'POST',
    		json: {
			    recipient: {id:sender},
    			message: messageData,
    		}
    	}, function(error, response, body) {
    		if (error) {
			    console.log('Error sending messages: ', error)
    		} else if (response.body.error) {
			    console.log('Error: ', response.body.error)
		    }
	    })
    }

    //this code sends a test message back as two cards 
     function sendGenericMessage(sender) {
	    let messageData = {
		    "attachment": {
			    "type": "template",
			    "payload": {
    				"template_type": "generic",
				    "elements": [{
    					"title": "First card",
					    "subtitle": "Element #1 of an hscroll",
					    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					    "buttons": [{
						    "type": "web_url",
						    "url": "https://www.messenger.com",
						    "title": "web url"
					    }, {
						    "type": "postback",
						    "title": "Postback",
						    "payload": "Payload for first element in a generic bubble",
					    }],
				    }, {
					    "title": "Second card",
					    "subtitle": "Element #2 of an hscroll",
					    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					    "buttons": [{
						    "type": "postback",
						    "title": "Postback",
						    "payload": "Payload for second element in a generic bubble",
					    }],
				    }]
			    }
		    }
	    }
	    request({
		    url: 'https://graph.facebook.com/v2.6/me/messages',
		    qs: {access_token:token},
		    method: 'POST',
		    json: {
			    recipient: {id:sender},
			    message: messageData,
		    }
	    }, function(error, response, body) {
		    if (error) {
			    console.log('Error sending messages: ', error)
		    } else if (response.body.error) {
			    console.log('Error: ', response.body.error)
		    }
	    })
    }