var Botkit = require("botkit");
var controller = Botkit.slackbot();
var https = require("https");

var meetupKey = process.env.MEETUP_KEY;
var bot = controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM()
var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

controller.hears('Hi', ['direct_message', 'direct_mention', 'mention'], function (bot, message)
{
  https.get("https://api.meetup.com/self/calendar" + "?key=" + meetupKey + "&page=5&fields=plain_text_description", function (res)
  {
    var buffer = "", mupdata;
    res.on('data', function (d) { buffer += d; });
    res.on('end', function (err) {
      mupdata = JSON.parse(buffer);
      for (var i=0; i < mupdata.length; i++){
        var date = new Date(mupdata[i].time);
        bot.reply(message, {
          // *Meteor Hack Night*
          // Thursday, Oct 27, 2016, 6:00 PM
          // Paperless Post (115 Broadway)
          // ========================================
          text: "*" + mupdata[i].name + "*\n" +
                date.toLocaleTimeString("en-us", options) + "\n" +
                mupdata[i].venue.name + " (" + mupdata[i].venue.address_1 + ")\n" +
                mupdata[i].link + "\n" +
                "========================================",
          unfurl_links: false,
          unfurl_media: false
        });
      }
    });

  }).on('error', function (e) {
    console.error(e);
  });
});