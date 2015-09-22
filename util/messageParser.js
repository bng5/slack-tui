var _ = require('underscore');

function mentions(message, teamInfo) {
    var patt = /<@([0-9A-Z]+)(\|([a-z0-9][-_.a-z0-9]*))?>/gm;
    var res;
    var m = '';
    var index = 0;
    var username;
    while(res = patt.exec(message)) {
        username = res[3] ? res[3] : teamInfo.users[res[1]].name;
        m += message.substring(index, res.index);
        m += '{blue-fg}@'+username+'{/blue-fg}';
        message = message.substring(res.index + res[0].length);
    }
    m += message;
    return m;
}

function urls(message) {
    return message.replace(/<|>/g, '');
}

// TODO
function channels(message) {
    return message;
}

module.exports = function(message, teamInfo) {
    message = channels(message);
    message = mentions(message, teamInfo);
    message = urls(message);
    message = _.unescape(message);
    return message;
}
