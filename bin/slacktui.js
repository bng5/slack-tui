#!/usr/bin/env node

//var profiles  = require('../profiles.js');
//var store     = require('../storage');
var ui        = require('../ui')();
var Api       = require('../api');
var util      = require('util');
var loading   = require('../slack/loadingMessages.js');
var _         = require('underscore');
var app = {"ui": ui, "teamInfo": {}, current: null, usersTyping: [[],[]]};
var rtmEvents    = require('../api/rtmEvents.js');//(app);

var Message   = require('../models/Message');

var api = new Api(process.env.SLACK_TOKEN);

//events(api, ui, teamInfo);

app.updateUsersTyping = function() {
    var count = this.usersTyping[0].length;
    var text;
    switch (count) {
        case 0:
            text = '';
            break;
        case 1:
            text = '{bold}'+this.usersTyping[0][0]+'{/bold} is typing';
            break;
        case 2:
            text = '{bold}'+this.usersTyping[0][0]+'{/bold} and {bold}'+this.usersTyping[0][1]+'{/bold} are typing';
            break;
        case 3:
            text = '{bold}'+this.usersTyping[0][0]+'{/bold}, {bold}'+this.usersTyping[0][1]+'{/bold} and {bold}'+this.usersTyping[0][2]+'{/bold} are typing';
            break;
        default:
            text = '{bold}'+this.usersTyping[0][0]+'{/bold}, {bold}'+this.usersTyping[0][1]+'{/bold} and '+(count -2 )+' more are typing';
            break;
    }
    this.ui.setStatusbar(text);
//    this.ui.setStatusbar('{bold}'+this.teamInfo.users[data.user].name+'{/bold} is typing');
}

api.on('rtm:error', function(error) {
    console.error("Connection Error: " + error.toString());
    console.error(error);
})
.on('rtm:connectFailed', function(error) {
    console.error('connectFailed '+error.toString());
    /*
    connect ECONNREFUSED
    {
      [Error: connect ECONNREFUSED]
      code: 'ECONNREFUSED',
      errno: 'ECONNREFUSED',
      syscall: 'connect'
    }
  */
})
.on('rtm:close', function() {
    console.error('echo-protocol Connection Closed');
})
.on('rtm:message', function(data) {
    try {
    //if(rtmEvents[data.type]) {
        rtmEvents[data.type].call(app, data);
    //}
    } catch (err) {
        console.error(err);
        console.error(data);
    }
})
.on('rtm:connect', function() {

});





ui.on('quickSwitcher:open', function() {
    ui.quickSwitcher(app.teamInfo);
});

ui.welcomeMessage(loading.getMessage());
api.getTeamInfo(process.env.SLACK_TOKEN, function(data) {
    data.users = _.chain(data.users)
        //.reject('deleted')
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
        //}, _.keys(data.users))
        }, _.chain(data.users).reject('deleted').indexBy('id').keys().value())
        .value();
    app.teamInfo = data;
    //console.error(JSON.stringify(app.teamInfo, null, 2));
    ui.setTeam(app.teamInfo.team)
      .setUser(data.self);
    if(data.team.prefs.default_channels && util.isArray(data.team.prefs.default_channels) && data.team.prefs.default_channels.length) {
        var channel = data.channels[data.team.prefs.default_channels[0]];
        app.current = channel.id;
        ui.setChannel(data.channels[data.team.prefs.default_channels[0]]);
        api.getChannelHilstory(function(data) {
            //console.error(JSON.stringify(data, null, 2));
            for(var i = (data.messages.length - 1); i >= 0; i--) {
                ui.addMessage(new Message(data.messages[i], app.teamInfo));
            }
            //_(data.messages).each(function(message) {
            //});

        }, app.current);
    }
    api.rtmConnect(data.url);
});

/*
    var patt = new RegExp(" nic", "i");
    var user;
    for(var k in data.refs) {
        if(patt.test(k)) {
            user = data.refs[k];
            console.log('@'+user.name+' · '+user.profile.real_name);
        }
    }
 */

/*
+-----------+-------------------------------------------------------------------+
| TEAM      | #CHANNEL Topic                                         usersCount |
| · user    |                                                                   |
|           |                                                                   |
|           |                                                                   |
|           |                                                                   |
|           |                                                                   |
|           | +---------------------------------------------------------------+ |
|           | |                                                               | |
|           | +---------------------------------------------------------------+ |
|           | USER is typping(?)                                                |
+-------------------------------------------------------------------------------+
 */
//profiles.add({});


/*
var teams = [];
store.open();
store.getTeams(function(err, rows) {
    if(err) {
        throw err;
    }
    teams = rows;
    if(teams.length == 1) {
        getTeamInfo(teams[0].token);
    }
});
*/
