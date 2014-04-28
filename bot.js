var irc = require('fwilson-irc-fork');
var config = require('./config.json');
var bot = new irc.Client('chat.freenode.net', config.nick, {channels: [config.chan], sasl: "true", userName: "olympicsbot", password: config.pass});
var trusted = config.trusted
console.log("Starting bot.");

bot.on('raw', function(msg) {
    if (msg.rawCommand == "PRIVMSG") {
        var text = msg.args[1].split(" ");
	var nick = msg.nick;
	var cloak = msg.host;
	var chan = msg.args[0];
	var cmd = text[1]
	
	if(text[0] == config.nick + ":") {
	    if(trusted.cmd.indexOf(cmd) >= 0 && trusted.cloaks.indexOf(cloak) >= 0 ) {
                if(cmd = "trustedcheck") {
		   console.log("hi!");// bot.say(msg.args[0], nick + ": Yes! You are trusted!");
		}
		else if(cmd = "msg") {
		    bot.say(text[2], msg.args[1].split(" ", 2)[2]);
		}
	    }
	 else {   
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
	}
    }
});
        
