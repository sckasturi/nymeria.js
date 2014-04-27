var irc = require('fwilson-irc-fork');
var config = require('./config.json');
var bot = new irc.Client('chat.freenode.net', config.nick, {channels: [config.chan], sasl: "true", userName: "olympicsbot", password: config.pass});

bot.on('message##techfilmer', function(nick, msg) {
    var text = msg.split(" ");
    if(text[0] == config.nick + ":") {
        if(text[1] == "help") {
            bot.say("##techfilmer", nick + ": commands: join, part, quit, say, help");
	}
        if(text[1] == "join" && text[2] != "0") {
	    bot.join(text[2]);
	}
        else if(text[1] == "join") {
            bot.say("##techfilmer", nick + ": No! I refuse to join channel \"0\"!");
        }
        if(text[1] == "part") {
	    bot.part(text[2]);
	}
	if(text[1] == "quit" && nick == "skasturi") {
	    bot.disconnect("ily2 skasturi!");
	}
        else if(text[1] == "quit") {
	    bot.say("##techfilmer", nick + ": I am not going to quit since you are not my owner!");
        }
	if(text[1] == "say") {
            var send = text.slice(2).toString();
            var i = 0;
            while(i != text.length) {
                send = send.replace(",", " ");
                i++;
	    }
	    bot.say("##techfilmer", send);
	}
    }
});
        
