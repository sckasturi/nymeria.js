var cfg = require('./config.json')
var exec = require('child_process').exec;
var fs = require('fs');

function runcmd(cmd, msg, bot) {
    var nick = msg.nick;
    var cloak = msg.host;
    var chan = msg.args[0];
    var text = msg.args[1].split(" ");
    var cmd = text[1].toLowerCase();
    
    if(chan === cfg.nick) {
        chan = nick;
    }
    switch(cmd) {
    case "help":
        bot.say(chan, "Normal Commands: [{0}], Trusted Commands: [{1}], Op Commands: [{2}], Onwer Commands: [{3}]".format(cfg.cmd.join(", "), cfg.trusted.cmd.join(", "), cfg.op.cmd.join(", "), cfg.owner.cmd.join(", ")));
        break;
    case "list":
        bot.say(chan, "Normal Commands: [{0}], Trusted Commands: [{1}], Op Commands: [{2}], Onwer Commands: [{3}]".format(cfg.cmd.join(", "), cfg.trusted.cmd.join(", "), cfg.op.cmd.join(", "), cfg.owner.cmd.join(", ")));
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
        if(text[2].split(",").length === 1 && text[2][0] === "#") {
            var send = msg.args[1].replace("{0}: msg {1} ".format(cfg.nick, text[2]), "");
            bot.say(text[2], send);
        }
        break;
    case "act":
        if(text[2].split(",").length === 1 && text[2][0] === "#") {
            var send = msg.args[1].replace("{0}: act {1} ".format(cfg.nick, text[2]), "");
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
        var send = msg.args[1].replace("{0}: mode".format(cfg.nick) , "");
        bot.conn.write("MODE " + chan + send + "\n");
        break;
    case "do":
        var send = msg.args[1].replace("{0}: do".format(cfg.nick) , "");
        console.log(send);
        bot.say(cfg.logchan, send)
        bot.conn.write(send + "\n");
        break;
    case "ddate":
        exec("ddate", function(error, stdout, stderr) { bot.say(chan, stdout); });
        break;
    case "memo":
        var memo = msg.args[1].replace(cfg.nick + ": memo " + text[2] + " ", "");
        if(text[2].split(",").length === 1) {
            bot.say(chan, "okay, sending your memo");
            exec("echo {0},{1},{2} >> memo.txt".format(text[2], nick, memo), 
                function(error, stdout, stderr) { 
                    var send = "[{0}] {1} sends a memo to {2}: {3}".format(chan, nick, text[2], memo);
                    console.log(send);
                    bot.say(cfg.logchan, send); 
                }
            );
        }
        break;
    case "oracle":
        var morgan = fs.readFileSync('./morganstarot.txt').toString().split("\n");
        bot.say(chan, morgan[Math.floor(Math.random() * morgan.length)]);
        break;
    case "coffee":
        if(text.length === 2) { bot.action(chan, "hands {0} a steaming cup of delicious coffee".format(nick)); }
        else { bot.action(chan, "hands {0} a steaming cup of delicious coffee".format(text[2])); }
        break;
    case "tea":
        if(text.length === 2) { bot.action(chan, "hands {0} a nice cup of tea.".format(nick)); }
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
        cfg.nick = text[2]
        bot.send("NICK", text[2]);
        break;
    case "botsnack":
        bot.action(chan, "noms happily :3");
    break;
    }
}

module.exports = runcmd;
