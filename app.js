var Botkit = require("botkit");
var controller = Botkit.slackbot();
var https = require("https");

var meetupKey = process.env.MEETUP_KEY;
var bot = controller.spawn({
	token: process.env.SLACK_TOKEN
}).startRTM()

controller.hears('Hi', ['direct_message', 'direct_mention', 'mention'], function (bot, message) 
{	
	https.get("https://api.meetup.com/self/calendar" + "?key=" + meetupKey + "&page=11&only=name,link", function (res) 
	{
		var buffer = "", mupdata;
		res.on('data', function (d) { buffer += d; });
		res.on('end', function (err) { 
			mupdata = JSON.parse(buffer); 
			for (var i=0; i < mupdata.length; i++){
			bot.reply(message, ":loudspeaker: " + mupdata[i].name + " :loudspeaker:\n" + mupdata[i].link + "\n");
			}
		});

	}).on('error', function (e) {
		console.error(e);
	}); 	
});