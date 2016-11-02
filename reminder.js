var Botkit = require("botkit");
var controller = Botkit.slackbot();
var https = require("https");

var meetupKey = process.env.MEETUP_KEY;

var today = new Date();
if (today.getDay() !== 1){
  process.exit();
}

var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};
var bot = controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM(function(){
  https.get("https://api.meetup.com/self/calendar" + "?key=" + meetupKey + "&page=5&fields=plain_text_description", function (res)
  {
    var buffer = "", mupdata;
    res.on('data', function (d) { buffer += d; });
    res.on('end', function (err) {
      mupdata = JSON.parse(buffer);
      for (var i=0; i < mupdata.length; i++){
        var date = new Date(mupdata[i].time);
        bot.send({text: "*" + mupdata[i].name + "*\n" +
                date.toLocaleTimeString("en-us", options) + "\n" +
                mupdata[i].venue.name + " (" + mupdata[i].venue.address_1 + ")\n" +
                mupdata[i].link.replace(/https?:\/\//,"") + "\n" +
                "========================================",
          unfurl_links: false,
          unfurl_media: false,
          channel: 'C25F7DFK9'
        });
      }
    });

  }).on('error', function (e) {
    console.error(e);
  });

});
