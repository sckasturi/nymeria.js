nymeria.js
==========

It's Nymeria! But in `node.js`! Okay, now you're probably wondering, what is Nymeria :P Nymeria is a bot owned by @ishanyx written by using a lot of `irssi`'s `trigger.pl` scripts. However, I decided that I wanted to try out making my own IRC bot that I originally called `pointlessbot`. After a bit of thought I decided to write my own implementation of Nymeria, but in `node.js`. The biggest features are the simple permission levels (trusted, channel.op, owner), and the easy method of enabling/disabling config files.

Live Demo
---------

A live demo of nymeria.js can be found on `chat.freenode.net/6667` in the channel `##techfilmer` (web chat: [here](https://kiwiirc.com/client/irc.freenode.net/?nick=skasvisitor%7C?##techfilmer)) under the nick nagano.

How to run
----------
```
$ git clone https://github.com/sckasturi/nymeria.js
$ cd nymeria.js
$ ./setup
$ nano config.json # feel free to edit to your needs
$ node bot.js # note, it is advised to run in screen/tmux
```
