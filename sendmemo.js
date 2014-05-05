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

module.exports = sendmemo;