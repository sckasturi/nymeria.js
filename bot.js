var irc = require('fwilson-irc-fork');
var cfg = require('./config.json');
var bot = new irc.Client('chat.freenode.net', cfg.nick, {channels: cfg.chan, sasl: "true", userName: cfg.user, password: cfg.pass});
var cmdrun = require('./run_cmd');
var utils = require('./utils')

bot.addListener('error', function(message) {
    log('error: ' +  JSON.stringify(message));
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

function run_cmd(cmd, msg) {
    if(cmd === "reload") {
        delete require.cache[require.resolve('./config.json')];
        delete require.cache[require.resolve('./utils')];
        delete require.cache[require.resolve('./run_cmd')];
        cfg = require('./config.json');
        utils = require('./utils');
        cmdrun = require('./run_cmd');
        bot.say(msg.args[0], "Okay! Reloading!");
    }
    else {
        cmdrun(cmd, msg, bot);
    }
}
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
        
    utils.send_memo(msg, bot);

    if(text[0] == cfg.nick + ":" || text[0] == cfg.nick + ",") {
        if(utils.in_set(cfg.trusted.cmd, cmd)) {
        if(utils.in_set(cfg.trusted.cloaks, cloak)) {
            run_cmd(cmd, msg, bot);
        }
        else {
            bot.say(chan, nick + ": You're not the boss of me!");
        }}

        else if(utils.in_set(cfg.op.cmd, cmd)) {
        if(Object.keys(utils.in_set(cfg.op.cloaks), cloak)) {
        if(utils.in_set(cfg.op.cloaks[cloak], chan)) {
            run_cmd(cmd, msg, bot);
        }}
        else {
            bot.say(chan, nick + ": You're not the boss of me!");
        }}
        if(utils.in_set(cfg.owner.cmd, cmd)) {
        if(utils.in_set(cfg.owner.cloaks, cloak)) {
            run_cmd(cmd, msg, bot);
        }
        else {
            bot.say(chan, nick + ": You're not the boss of me!");
        }}
        if(utils.in_set(cfg.cmd, cmd)) {
             run_cmd(cmd, msg, bot);
        }
    }
    }
});
        


