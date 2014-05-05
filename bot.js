var irc = require('fwilson-irc-fork');
var config = require('./config.json');
var bot = new irc.Client('chat.freenode.net', config.nick, {channels: config.chan, sasl: "true", userName: config.user, password: config.pass});
var fs = require('fs');
var exec = require('child_process').exec;
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
        


