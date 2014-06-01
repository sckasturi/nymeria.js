var fs = require('fs');
var exec = require('child_process').exec;

function in_set(set, inside) {
	if (set.indexOf(inside) >= 0) {
		return true;
	}
	else {
		return false;
	}
}

function send_memo(msg, bot) {
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

function help(cfg) {
	return "Normal Commands: [{0}], Trusted Commands: [{1}], Op Commands: [{2}], Owner Commands: [{3}]".format(cfg.cmd.join(", "),
	 cfg.trusted.cmd.join(", "), cfg.op.cmd.join(", "), cfg.owner.cmd.join(", "));
}

function msg(msg, bot, text) {
	if(text[2].split(",").length === 1 && text[2][0] === "#") {
        var send = msg.args[1].replace("{0}: msg {1} ".format(cfg.nick, text[2]), "");
        bot.say(text[2], send);
    }
}

function memo(msg, bot, text, cfg) {
	var nick = msg.nick;
	var chan = msg.args[0]
	var memo = msg.args[1].replace(cfg.nick + ": memo " + text[2] + " ", "");
    if(text[2].split(",").length === 1) {
        bot.say(chan, "okay, sending your memo");
        exec("echo {0},{1},{2} >> memo.txt".format(text[2], nick, memo), 
        function(error, stdout, stderr) { 
            var send = "[{0}] {1} sends a memo to {2}: {3}".format(chan, nick, text[2], memo);
            console.log(send);
            bot.say(cfg.logchan, send); 
        });
    }   
}

module.exports = {
	"in_set": in_set,
	"send_memo": send_memo,
	"help": help,
	"msg": msg,
	"memo": memo
}