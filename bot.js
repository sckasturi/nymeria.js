var irc = require('fwilson-irc-fork');
var config = require('./config.json');
var bot = new irc.Client('chat.freenode.net', config.nick, {channels: config.chan, sasl: "true", userName: config.user, password: config.pass});
var fs = require('fs');
var exec = require('child_process').exec;

bot.addListener('error', function(message) {
    log('error: ' +  message);
});

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

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
    memoarr.memo.push(memos[i].replace("{0},{1},".format(memo[0], memo[1]), ""));
    }
    
    var memonum = memoarr.nick.indexOf(nick);
    if(memonum >= 0) {
        bot.say(chan, "{0}, you have a memo: <{1}> {2}".format(nick, memoarr.send[memonum], memoarr.memo[memonum]));
    var rm = "sed -i\".bak\" \'" + (i - 1) + "d\' memo.txt";
    exec(rm, function(error, stdout, stderr) {});
    
    }   
}

function runcmd(cmd, msg) {
    var nick = msg.nick;
    var cloak = msg.host;
    var chan = msg.args[0];
    var text = msg.args[1].split(" ");
    var cmd = text[1].toLowerCase();
    
    if(chan == config.nick) {
        chan = nick;
    }

    switch(cmd) {
    case "help":
        bot.say(chan, "Normal Commands: [{0}], Trusted Commands: [{1}], Op Commands: [{2}], Onwer Commands: [{3}]".format(config.cmd.join(", "), config.trusted.cmd.join(", "), config.op.cmd.join(", "), config.owner.cmd.join(", ")));
        break;
    case "list":
        bot.say(chan, "Normal Commands: [{0}], Trusted Commands: [{1}], Op Commands: [{2}], Onwer Commands: [{3}]".format(config.cmd.join(", "), config.trusted.cmd.join(", "), config.op.cmd.join(", "), config.owner.cmd.join(", ")));
        break;
    case "trustedcheck":
        bot.say(chan, nick + ": Yes! You are trusted!");
        break;
    case "tcheck":
        bot.say(chan, nick + ": Yes! You are trusted!");
        break;
    case "opcheck":
        bot.say(chan, nick + ": Yes! You are an op in {0}!".format(chan));
        break;
    case "ocheck":
        bot.say(chan, nick + ": Yes! You are my owner!");
        break;
    case "ownercheck":
        bot.say(chan, nick + ": Yes! You are my owner!");
        break;
    case "msg":
        if(text[2].split(",").length == 1 && text[2][0] == "#") {
            var send = msg.args[1].replace("{0}: msg {1} ".format(config.nick, text[2]), "");
            bot.say(text[2], send);
        }
        break;
    case "act":
        if(text[2].split(",").length == 1 && text[2][0] == "#") {
            var send = msg.args[1].replace("{0}: act {1} ".format(config.nick, text[2]), "");
            bot.action(text[2], send);
        }
        break;
    case "op":
        bot.send('MODE', chan, '+o', nick);
        break;
    case "deop":
        bot.send('MODE', chan, '-o', nick);
        break;
    case "mode":
        var send = msg.args[1].replace("{0}: mode".format(config.nick) , "");
        bot.conn.write("MODE " + chan + send + "\n");
        break;
    case "do":
        var send = msg.args[1].replace("{0}: do".format(config.nick) , "");
        console.log(send);
        bot.conn.write(send + "\n");
        break;
    case "ddate":
        exec("ddate", function(error, stdout, stderr) { bot.say(chan, stdout); });
        break;
    case "memo":
        var memo = msg.args[1].replace(config.nick + ": memo " + text[2] + " ", "");
        if(text[2].split(",").length == 1) {
            bot.say(chan, "okay, sending your memo");
            exec("echo {0},{1},{2} >> memo.txt".format(text[2], nick, memo), 
                function(error, stdout, stderr) { log("[{0}] {1} sends a memo to {2}: {3}".format(chan, nick, text[2], memo)); });
        }
        break;
    case "oracle":
        var morgan = fs.readFileSync('./morganstarot.txt').toString().split("\n");
            bot.say(chan, morgan[Math.floor(Math.random() * morgan.length)]);
        break;
    case "coffee":
        if(text.length == 2) { bot.action(chan, "hands {0} a steaming cup of delicious coffee".format(nick)); }
        else { bot.action(chan, "hands {0} a steaming cup of delicious coffee".format(text[2])); }
        break;
    case "tea":
        if(text.length == 2) { bot.action(chan, "hands {0} a nice cup of tea.".format(nick)); }
        else { bot.action(chan, "hands {0} a nice cup of tea".format(text[2])); }
        break;
    case "cookie":
        if(text.length >= 3) { bot.action(chan, "gets {0} a plate of cookies and a glass of milk".format(text[2])); }
        break;
    case "goat":
        if(text.length >= 3) { bot.say(chan, "{0}'s goat walks by and kicks {1}".format(nick, text[2])); }
        break;
    case "wolf":
        if(text.length >= 3) { bot.say(chan, "{0}'s wolf walks by and noms {1}".format(nick, text[2])); }
            break;
    case "bear":
        if(text.length >= 3) { bot.say(chan, "{0}'s bear walks by and gives {1} a huge bear hug".format(nick, text[2])); }
        break;
    case "kitty":
       if(text.length >= 3) { bot.say(chan, "{0}'s kitty climbs into {1}'s lap, curls up, and falls asleep".format(nick, text[2])); }
        break;
    case "penguin":
        if(text.length >= 3) { bot.say(chan, "{0}'s penguin waddles by and slaps {1}!".format(nick, text[2])); }
          break;
    case "kekse":
        if(text.length >= 3) { bot.action(chan, "holt {0}  einen Teller Kekse und ein Glas Milch".format(text[2])); }
        break;
    case "ping":
        bot.say(chan, "Pong!");
        break;
    case "quit":
        bot.quit();
        break;
    case "nick":
        config.nick = text[2]
        bot.send("NICK", text[2]);
        break;
    case "botsnack":
        bot.action(chan, "noms happily :    3");
    break;
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
    
    if(chan == config.nick) {
        chan = nick;
    }

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
        


