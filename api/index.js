var https           = require('https');
var WebSocketClient = require('websocket').client;
var util            = require('util');
var EventEmitter    = require('events').EventEmitter;
var _               = require('underscore');

function Api() {

}

util.inherits(Api, EventEmitter);

Api.prototype.getTeamInfo = function(token, callback) {
    var options = {
        hostname: 'slack.com',
        port: 443,
        path: '/api/rtm.start?token='+token,
        method: 'GET'
    };
    var req = https.request(options, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            read(body, callback);
        });
    });
    req.end();
    req.on('error', function(e) {
        console.error(e);
    });
}

function read(body, callback) {
    var data = JSON.parse(body);
    data.users = _.indexBy(_.reject(data.users, function(user) {
        return user.deleted;
    }), function(user) {
        user.search = ' '+user.name+' '+user.profile.real_name+' '+user.profile.real_name_normalized;
        return user.id;
    });
    if(data.groups) {
        data.channels = data.channels.concat(data.groups);
        delete data.groups;
    }
    data.channels = _.indexBy(_.reject(data.channels, function(channel) {
        return channel.is_archived;
    }), function(channel) {
        if(channel.members) {
            channel.members = _.intersection(channel.members, this);
        }
        return channel.id;
    }, _.keys(data.users));
    callback(data);
}

Api.prototype.rtmConnect = function(wssUrl) {
    var wss = new WebSocketClient();
    wss.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });
    var self = this;
    wss.on('connect', function(connection) {
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('echo-protocol Connection Closed');
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                var data = JSON.parse(message.utf8Data);
                self.emit(data.type, data);
            }
            else {
                console.log('No es UTF-8. So?');
            }
        });
    });
    wss.connect(wssUrl);
}

module.exports = Api;
