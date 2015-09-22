var parse = require('../util/messageParser');
var Message   = require('../models/Message');

module.exports = {
    hello: function (data) {
        this.ui.welcomeMessage(null);
    },
    message: function (data) {
        var channel = this.teamInfo.channels[data.channel];
        var username = null;
        if(data.user && !(channel.latest && channel.latest.user === data.user)) {
            username = this.teamInfo.users[data.user].name;
        }
        var textmessage;
        if(data.subtype) {
            switch (data.subtype) {
                case 'message_changed':
                    textmessage = '{bold}(edited){/bold} '+parse(data.message.text, this.teamInfo)+' ('+channel.name+')';
                    if(data.message.attachments) {
                        var attachment = data.message.attachments[0];
                        if(attachment.title) {
                            textmessage = '{bold}'+attachment.title+'{/bold}\n';
                        }
                        if(attachment.text) {
                            textmessage = attachment.text;
                        }
                    }
                    textmessage = '{bold}(edited){/bold} '+parse(data.message.text, this.teamInfo)+' ('+channel.name+')';
                    break;
                case 'channel_join':
                    //this.teamInfo.channels[data.channel].members.push(data.user);
                    textmessage = parse(data.text, this.teamInfo)+' (#'+channel.name+')';
                    break;
                default:
                    textmessage = '{bold}('+data.subtype+'){/bold} '+parse(data.text, this.teamInfo)+' ('+channel.name+')';
                    break;
            }
        }
        else {
            textmessage = parse(data.text, this.teamInfo)+' ('+channel.name+')';
        }
        this.ui.addMessage(new Message(data, this.teamInfo));
        channel.latest = data;
    },
    user_typing: function (data) {
        if(data.channel != this.current) {
            return;
        }
        var username = this.teamInfo.users[data.user].name;
        var i = this.usersTyping[0].indexOf(username);
        if(i > -1) {
            clearTimeout(this.usersTyping[1][i]);
        }
        else {
            this.usersTyping[0].push(username);
            i = this.usersTyping[1].length;
            this.updateUsersTyping();
        }
        this.usersTyping[1][i] = setTimeout(function(username, app) {
            var i = app.usersTyping[0].indexOf(username);
            app.usersTyping[0].splice(i, 1);
            app.usersTyping[1].splice(i, 1);
            app.updateUsersTyping();
        }, 7000, username, this);
    },
    /*
    // Your channel read marker was updated
    channel_marked: function (data) {
        console.error(data);
        /*
        {
            type: 'channel_marked',
            channel: 'C047D7YLE',
            ts: '1441077312.000002',
            unread_count: 0,
            unread_count_display: 0,
            num_mentions: 0,
            num_mentions_display: 0,
            mention_count: 0,
            mention_count_display: 0
        }
         *\/
    },
    channel_created: function (data) {
        console.error(data);
    },
    // You joined a channel
    channel_joined: function (data) {
        console.error(data);
    },
     */
    // You left a channel
    channel_left: function (data) {
        var channel = this.teamInfo.channels[data.channel];
        var k;
        if(channel.members && (k = channel.members.indexOf(this.teamInfo.self.id)) !== -1) {
            channel.members.splice(k, 1);
        }
    },
    /*
    // A team channel was deleted
    channel_deleted: function (data) {
    },
    // A team channel was renamed
    channel_rename: function (data) {
    },
    // A team channel was archived
    channel_archive: function (data) {
    },
    // A team channel was unarchived
    channel_unarchive: function (data) {
    },
    // Bulk updates were made to a channel's history
    channel_history_changed: function (data) {
    },
    // A direct message channel was created
    im_created: function (data) {
    },
    // You opened a direct message channel
    im_open: function (data) {
    },
    // You closed a direct message channel
    im_close: function (data) {
    },
    // A direct message read marker was updated
    im_marked: function (data) {
    },
    // Bulk updates were made to a DM channel's history
    im_history_changed: function (data) {
    },
    // You joined a private group
    group_joined: function (data) {
    },
    // You left a private group
    group_left: function (data) {
    },
    // You opened a group channel
    group_open: function (data) {
    },
    // You closed a group channel
    group_close: function (data) {
    },
    // A private group was archived
    group_archive: function (data) {
    },
    // A private group was unarchived
    group_unarchive: function (data) {
    },
    // A private group was renamed
    group_rename: function (data) {
    },
    // A private group read marker was updated
    group_marked: function (data) {
    },
    // Bulk updates were made to a group's history
    group_history_changed: function (data) {
    },
    // A file was created
    file_created: function (data) {
        console.error(data);
    },
    // A file was shared
    file_shared: function (data) {
    },
    // A file was unshared
    file_unshared: function (data) {
    },
    // A file was made public
    file_public: function (data) {
    },
    // A file was made private
    file_private: function (data) {
    },
    // A file was changed
    file_change: function (data) {
    },
    // A file was deleted
    file_deleted: function (data) {
    },
    // A file comment was added
    file_comment_added: function (data) {
    },
    // A file comment was edited
    file_comment_edited: function (data) {
    },
    // A file comment was deleted
    file_comment_deleted: function (data) {
    },
    // A pin was added to a channel
    pin_added: function (data) {
    },
    // A pin was removed from a channel
    pin_removed: function (data) {
    },
     */
    // A team member's presence changed
    presence_change: function (data) {
        this.teamInfo.users[data.user].presence = data.presence;
        // TODO Notificar a la vista
    },
    /*
    // You manually updated your presence
    manual_presence_change: function (data) {
    },
    // You have updated your preferences
    pref_change: function (data) {
    },
     */
    user_change: function (data) {
        this.teamInfo.users[data.user.id] = data.user;
    },
    // A new team member has joined
    team_join: function (data) {
        // FIXME Reutilizar creación de search
        data.user.search = ' '+data.user.name+' '+data.user.profile.real_name+' '+data.user.profile.real_name_normalized;
        this.teamInfo.users[data.user.id] = data.user;
    },
    /*
    // A team member has starred an item
    star_added: function (data) {
    },
    // A team member removed a star
    star_removed: function (data) {
    },
    // A team member has added an emoji reaction to an item
    reaction_added: function (data) {
    },
    // A team member removed an emoji reaction
    reaction_removed: function (data) {
    },
    // A team custom emoji has been added or changed
    emoji_changed: function (data) {
    },
    // A team slash command has been added or changed
    commands_changed: function (data) {
    },
    // The team billing plan has changed
    team_plan_change: function (data) {
    },
    // A team preference has been updated
    team_pref_change: function (data) {
    },
    // The team name has changed
    team_rename: function (data) {
    },
    // The team domain has changed
    team_domain_change: function (data) {
    },
    // The team email domain has changed
    email_domain_changed: function (data) {
    },
    // An integration bot was added
    bot_added: function (data) {
    },
    // An integration bot was changed
    bot_changed: function (data) {
    },
    // The list of accounts a user is signed into has changed
    accounts_changed: function (data) {
    },
    // The team is being migrated between servers
    team_migration_started: function (data) {
    },
     */
    // TODO Controlar desconexiones del websocket
    pong: function(data) {

    }
};
