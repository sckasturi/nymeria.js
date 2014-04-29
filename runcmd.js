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
	    var send = msg.args[1].replace("{0}: msg {1} ".format(config.nick, text[2]), "");
	    bot.say(chan, send);
	}
	else if(cmd == "act") {
        var send = msg.args[1].replace("{0}: act {1} ".format(config.nick, text[2]), "");
	    bot.action(chan, send);
	}
	else if(cmd == "op") {
	    bot.send('MODE', chan, '+o', nick);
	}
	else if(cmd == "deop") {
	    bot.send('MODE', chan, '-o', nick);
	}
	else if(cmd == "mode") {
	    var send = msg.args[1].replace("{0}: mode".format(config.nick) , "");
	    bot.conn.write("MODE " + chan + send + "\n");
	}
	else if(cmd == "do") {
	    var send = msg.args[1].replace("{0}: do".format(config.nick) , "");
	    console.log(send);
	    bot.conn.write(send + "\n");
	}
	else if(cmd == "ddate") {
	    //bot.say(chan, function(reply, data, args) { run("ddate", [], reply); })'
	    exec("ddate", function(error, stdout, stderr) { bot.say(chan, stdout); });
	}
	else if(cmd == "memo") {
	    var memo = msg.args[1].replace(config.nick + ": memo " + text[2] + " ", "");
	    if(text[2].split(",").length == 1) {
	        bot.say(chan, "okay, sending your memo");
	        exec("echo {0},{1},{2} >> memo.txt".format(text[2], nick, memo), 
	            function(error, stdout, stderr) { log("[{0}] {1} sends a memo to {2}: {3}".format(chan, nick, text[2], memo)); });
	    }
	}
	else if(cmd == "oracle") {
	    var morgan = fs.readFileSync('./morganstarot.txt').toString().split("\n");
            bot.say(chan, morgan[Math.floor(Math.random() * morgan.length)]);
	}
}
