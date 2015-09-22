// TODO

var _         = require('underscore');

function Message(data, teamInfo) {
    this.type = data.type;
    //this.user = data.user;
    this.user = (data.user && teamInfo.users[data.user]) ?
        teamInfo.users[data.user].name :
        null;
    this.text = data.text ? this.parse(data.text, teamInfo) : null;
    this.ts = data.ts;
}

Message.prototype.parse = function(message, teamInfo) {
    message = channels(message);
    message = mentions(message, teamInfo);
    message = emails(message);
    message = urls(message);
    message = _.unescape(message);
    return message;
};

function mentions(message, teamInfo) {
    var patt = /<@([0-9A-Z]+)(\|([a-z0-9][-_.a-z0-9]*))?>/gm;
    return message.replace(patt, function myFunction(match, s1, s2, s3, offset, string) {
        return '{blue-fg}@'+(s3 ? s3 : teamInfo.users[s1].name)+'{/blue-fg}';
    });
}

function urls(message) {
    var patt = /<([^|>]+)(\|([^>]+))?>/g;
    return message.replace(patt, function(match, s1, s2, s3, offset, string) {
        return '{underline}'+(s3 ? s3 : s1)+'{/underline}';
    });
}

function emails(message) {
    var patt = /<mailto:[a-z0-9][-_.a-z0-9@]+\|([a-z0-9][-_.a-z0-9@]+)>/igm;
    var res;
    var m = '';
    var index = 0;
    var email;
    while(res = patt.exec(message)) {
        email = res[3];
        m += message.substring(index, res.index);
        m += '{blue-fg}'+email+'{/blue-fg}';
        message = message.substring(res.index + res[0].length);
    }
    m += message;
    return m;
}

function format(message) {

    return message;



    var patt = /\*( +.+)|(.+ +)\*/ig;
    var res;
    var m = '';
    var index = 0;
    var bold;
    while(res = patt.exec(message)) {
        bold = res[3];
        m += message.substring(index, res.index);
        m += '{blue-fg}'+email+'{/blue-fg}';
        message = message.substring(res.index + res[0].length);
    }
    m += message;
    return m;
}

// TODO
function channels(message) {
    return message;
}

module.exports = Message;
