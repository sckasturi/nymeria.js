var irc = require('fwilson-irc-fork');
var cfg = require('./config.json');
var bot = new irc.Client('chat.freenode.net', cfg.nick, {channels: cfg.chan, sasl: "true", userName: cfg.user, password: cfg.pass});
var sendmemo = require('./sendmemo');
var runcmd = require('./runcmd');


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




function log(msg) {
	console.log(msg);
    bot.say(cfg.logchan, msg);
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
    
    if(chan == cfg.nick) {
        chan = nick;
    }

    if(msg.args[1][0] == cfg.prefix) {
        msg.args[1] = msg.args[1].replace(cfg.prefix, cfg.nick + ": ");
    }
    
    var text = msg.args[1].split(" ");
    var cmd = text[1]
        
    sendmemo(msg, bot);

    if(text[0] == cfg.nick + ":" || text[0] == cfg.nick + ",") {
        if(cfg.trusted.cmd.indexOf(cmd) >= 0) {
        if(cfg.trusted.cloaks.indexOf(cloak) >= 0) {
            runcmd(cmd, msg, bot);
        }
        else {
            bot.say(chan, nick + ": You're not the boss of me!");
        }}

        else if(cfg.op.cmd.indexOf(cmd) >= 0) {
        if(Object.keys(cfg.op.cloaks).indexOf(cloak) >= 0) {
        if(cfg.op.cloaks[cloak].indexOf(chan) >= 0) {
            runcmd(cmd, msg, bot);
        }}
        else {
            bot.say(chan, nick + ": You're not the boss of me!");
        }}
        if(cfg.owner.cmd.indexOf(cmd) >= 0) {
        if(cfg.owner.cloaks.indexOf(cloak) >= 0) {
            runcmd(cmd, msg, bot);
        }
        else {
            bot.say(chan, nick + ": You're not the boss of me!");
        }}
        if(cfg.cmd.indexOf(cmd) >= 0) {
             runcmd(cmd, msg, bot);
        }
    }
    }
});
        


