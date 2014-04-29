var irc = require('fwilson-irc-fork');
var config = require('./config.json');
var bot = new irc.Client('chat.freenode.net', config.nick, {channels: config.chan, sasl: "true", userName: config.user, password: config.pass});
var fs = require('fs');
var exec = require('child_process').exec;

bot.addListener('error', function(message) {
    console.log('error: ', message);
});


function sendmemo(msg) {
    var memoarr = {
        "nick": [],
        "send": [],
	"memo": []
    }
    var nick = msg.nick;
    var chan = msg.args[0];
    var i;

    var memos = fs.readFileSync('./memo.txt').toString().split("\n");

    for (i = 0; i < memos.length; i++) {
        var memo = memos[i].split(",", 2);
	memoarr.nick.push(memo[0]);
	memoarr.send.push(memo[1]);
	memoarr.memo.push(memos[i].replace(memo[0] + "," + memo[1] + ",", ""));
    }
    
    var memonum = memoarr.nick.indexOf(nick);
    if(memonum >= 0) {
        bot.say(chan, nick + ", you have a memo: <" + memoarr.send[memonum] + "> " + memoarr.memo[memonum]);
	var rm = "sed -i\".bak\" \'" + (i - 1) + "d\' memo.txt";
	console.log(rm);
	exec(rm, function(error, stdout, stderr) {});
	
    }   
}

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
	else if(cmd == "mode") {
	    var send = msg.args[1].replace(config.nick + ": mode" , "");
	    bot.conn.write("MODE " + chan + send + "\n");
	}
	else if(cmd == "do") {
	    var send = msg.args[1].replace(config.nick + ": do " , "");
	    console.log(send);
	    bot.conn.write(send + "\n");
	}
	else if(cmd == "ddate") {
	    //bot.say(chan, function(reply, data, args) { run("ddate", [], reply); })'
	    exec("ddate", function(error, stdout, stderr) { bot.say(chan, stdout); });
	}
	else if(cmd == "memo") {
	    var memo = msg.args[1].replace(config.nick + ": memo " + text[2] + " ", "");
	    bot.say(chan, "okay, sending your memo");
	    exec("echo " + text[2] + "," + nick + "," + memo + " >> memo.txt", 
	        function(error, stdout, stderr) { log("[" + chan + "] " + nick + " sends a memo to " + text[2] + ": " + memo ); });
	}
}

function log(msg) {
    bot.say(config.logchan, msg);
}

console.log("Starting bot.");


bot.addListener('pm', function (nick, msg) {
    log("<" + nick + "> " + msg);
});


bot.on('raw', function(msg) {
    if (msg.rawCommand == "NOTICE" && msg.args[0][0] != "#") {
		log("-" + msg.nick + "- " + msg.args[1]);
    }

    if (msg.rawCommand == "PRIVMSG") {
	var nick = msg.nick;
	var cloak = msg.host;
	var chan = msg.args[0];
	
	if(msg.args[1][0] == config.prefix) {
	    msg.args[1] = msg.args[1].replace(config.prefix, config.nick + ": ");
	}
	
	var text = msg.args[1].split(" ");
	var cmd = text[1]
        
	sendmemo(msg);

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
	        runcmd(cmd, msg);
	    }}
	    else {
	        bot.say(chan, nick + ": You're not the boss of me!");
	    }}
            if(config.owner.cmd.indexOf(cmd) >= 0) {
            if(config.owner.cloaks.indexOf(cloak) >= 0) {
                runcmd(cmd, msg);
            }
            else {
                bot.say(chan, nick + ": You're not the boss of me!");
            }}
            if(config.cmd.indexOf(cmd) >= 0) {
                 runcmd(cmd, msg);
            }
	}
    }
});
        

