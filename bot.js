var irc = require('fwilson-irc-fork');
var config = require('./config.json');
var bot = new irc.Client('chat.freenode.net', config.nick, {channels: config.chan, sasl: "true", userName: "olympicsbot", password: config.pass});
var trusted = config.trusted;
var op = config.op;

bot.addListener('error', function(msg) {
    console.log('error: ' +  msg);
});

function runcmd(cmd, msg) {
	var nick = msg.nick;
	var cloak = msg.host;
	var chan = msg.args[0];
	var text = msg.args[1].split(" ");
	var cmd = text[1];

    if(cmd == "trustedcheck" || cmd == "tcheck") {
	   bot.say(chan, nick + ": Yes! You are trusted!");
	}
	else if(cmd == "msg") {
		var send = msg.args[1].replace(config.nick + ": msg " + text[2] + " ", "");
		bot.say(chan, send);
	}
	else if(cmd == "act") {
		var send = msg.args[1].replace(config.nick + ": act " + text[2] + " ", "");
		bot.action(chan, send);
	}
	else if(cmd == "op") {
		bot.send('MODE', chan, '+o', nick);
	}
	else if(cmd == "deop") {
	    bot.send('MODE', chan, '-o', nick);
    }
}

function log(msg) {
    bot.say(config.logchan.chan, msg);
}

console.log("Starting bot.");


bot.addListener('pm', function (nick, msg) {
    log("<" + nick + "> " + msg);
});

//setTimeout(function() {}, 2000);
//bot.join(config.logchan.chan + config.logchan.key);
//console.log("Joining logchan");

bot.on('raw', function(msg) {
    if (msg.rawCommand == "NOTICE" && msg.args[0][0] != "#") {
		log("-" + msg.nick + "- " + msg.args[1]);
	//console.log("Notice has been sent by " + msg.args[0] + ", logging it to log chan");
    }

    if (msg.rawCommand == "PRIVMSG") {
	var nick = msg.nick;
	var cloak = msg.host;
	var chan = msg.args[0];
	
	/*if(msg.args[0][0] != "#") {
	    bot.say(config.logchan.chan, "<" + chan + "> " + msg.args[1]);
	    console.log("Private Message has been sent, logging it to log chan");
	}*/
	if(msg.args[1][0] == config.prefix) {
	    msg.args[1] = msg.args[1].replace(config.prefix, config.nick + ": ");
	}
	
	var text = msg.args[1].split(" ");
	var cmd = text[1]

	if(text[0] == config.nick + ":" || text[0] == config.nick + ",") {
	    if(config.trusted.cmd.indexOf(cmd) >= 0) {
	    if(config.trusted.cloaks.indexOf(cloak) >= 0) {
        	runcmd(cmd, msg);      
	    }
	    else {
	        bot.say(chan, nick + ": You're not the boss of me!");
	    }}

	    else if(config.op.cmd.indexOf(cmd) >= 0) {
	    if(Object.keys(config.op.cloaks).indexOf(cloak) >= 0) {
	    if(config.op.cloaks[cloak].indexOf(chan) >= 0) {
	        if(cmd == "opcheck" || cmd == "ocheck") {
		    bot.say(chan, nick + ": Yes! You are an op in " + chan + "!");
		}
		else if(cmd == "op") {
		    bot.send('MODE', chan, '+o', nick);
		}
		else if(cmd == "deop") {
		    bot.send('MODE', chan, '-o', nick);
                }
	    }}
	    else {
	        bot.say(chan, nick + ": You're not the boss of me!");
	    }}
	}
    }
});
        

