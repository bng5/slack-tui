var https           = require('https');
var WebSocketClient = require('websocket').client;
var util            = require('util');
var EventEmitter    = require('events').EventEmitter;
var _               = require('underscore');

function Api(token) {
    this.token = token;
}

util.inherits(Api, EventEmitter);

Api.prototype.getTeamInfo = function(token, callback) {
    _request(callback, 'GET', '/api/rtm.start', {token: this.token});
}

Api.prototype.getChannelHilstory = function(callback, channel) {
    _request(callback, 'GET', '/api/channels.history', {"channel": channel, token: this.token});
}

function _request(callback, method, path, params) {
    path += '?'+serialize(params);
    var options = {
        hostname: 'slack.com',
        port: 443,
        "path": path,
        "method": method
    };
    var req = https.request(options, function(res) {
        var spool = '';
        res.on('data', function(chunk) {
            spool += chunk;
        });
        res.on('end', function() {
            var data = JSON.parse(spool);
            callback(data);
        });
    });
    req.end();
    req.on('error', function(e) {
        console.error(e);
    });
}

function serialize(obj) {
    var str = [];
    for(var p in obj)
    if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
}

function read(body, callback) {
    var data = JSON.parse(body);
    data.users = _.chain(data.users)
        .reject('deleted')
        .indexBy('id')
        .each(function(user) {
            user.search = ' '+user.name+' '+user.profile.real_name+' '+user.profile.real_name_normalized;
        })
        .value();
    if(data.groups) {
        data.channels = data.channels.concat(data.groups);
        delete data.groups;
    }
    if(data.ims) {
        data.channels = data.channels.concat(data.ims);
        delete data.ims;
    }
    data.channels = _.chain(data.channels)
        .reject('is_archived')
        .indexBy('id')
        .each(function(channel) {
            if(channel.members) {
                channel.members = _.intersection(channel.members, this);
            }
        }, _.keys(data.users))
        .value();
    callback(data);
}

Api.prototype.rtmConnect = function(wssUrl) {
    var wss = new WebSocketClient();
    wss.on('connectFailed', function(o_O) {
        self.emit('rtm:connectFailed', o_O);
    });
    var self = this;
    wss.on('connect', function(connection) {
        var ping = {
            timer: null,
            increment: 1
        };
        connection.on('error', function(o_O) {
            console.error(o_O);
            self.emit('rtm:error', o_O);
        });
        connection.on('close', function() {
            console.error(o_O);
            self.emit('rtm:close');
        });
        connection.on('message', function(message) {
            var data = JSON.parse(message.utf8Data);
            self.emit('rtm:message', data);
        });
        self.emit('rtm:connect');
        ping.timer = setInterval(function(connection, ping) {
            // this intervalObject
            connection.sendUTF(JSON.stringify({
                type: "ping",
                id: ping.increment,
                time: (new Date).getTime()
            }));
            ping.increment++;
        }, 10000, connection, ping);
        //clearInterval(intervalObject)
    });
    wss.connect(wssUrl);
}

module.exports = Api;
