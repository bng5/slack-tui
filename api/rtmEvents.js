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
                    /*
                    {
                        type: 'message',
                        channel: 'G076YHM24',
                        user: 'U048CM415',
                        text: '<http://www.w3schools.com/jsref/jsref_replace.asp>',
                        ts: '1441080748.000006',
                        team: 'T02HBH0D6'
                    }
                    --------------------------------------------------------
                    {
                        type: 'message',
                        message: {
                            type: 'message',
                            user: 'U048CM415',
                            text: '<http://www.w3schools.com/jsref/jsref_replace.asp>',
                            attachments: [
                                {
                                    title: 'Entrenamiento sinérgico - Doodle: easy scheduling',
                                    title_link: 'http://doodle.com/v7vazd7kadmceeh3?utm_source=Comunidad+Sinergia&utm_campaign=e6079ca4d8-Esta_semana_en_Sinergia8_20_2015&utm_medium=email&utm_term=0_d83691a3b9-e6079ca4d8-',
                                    text: 'Marcá los días que te queden mejor, para armar el grupo de entrenamiento. Si te da igual marcá las dos opciones! Poné tu nombre completo ;)',
                                    fallback: 'Entrenamiento sinérgico - Doodle: easy scheduling',
                                    from_url: 'http://doodle.com/v7vazd7kadmceeh3?utm_source=Comunidad+Sinergia&utm_campaign=e6079ca4d8-Esta_semana_en_Sinergia8_20_2015&utm_medium=email&utm_term=0_d83691a3b9-e6079ca4d8-',
                                    thumb_url: 'http://doodle.com/graphics/static/facebookSharingThumbnail.jpg',
                                    thumb_width: 100,
                                    thumb_height: 100,
                                    id: 1
                                }
                            ],
                            ts: '1441080748.000006'
                        },
                        subtype: 'message_changed',
                        hidden: true,
                        channel: 'G076YHM24',
                        event_ts: '1441080748.579788',
                        ts: '1441080748.000007'
                    }

                    ########################################################

                    message {
                        type: 'message',
                        channel: 'G076YHM24',
                        user: 'U048CM415',
                        text: 'lalala',
                        ts: '1441080944.000008',
                        team: 'T02HBH0D6'
                    }

                    --------------------------------------------------------

                    {
                        type: 'message',
                        message: {
                            type: 'message',
                            user: 'U048CM415',
                            text: 'pepepe',
                            edited: {
                                user: 'U048CM415',
                                ts: '1441080951.000000'
                            },
                            ts: '1441080944.000008'
                        },
                        subtype: 'message_changed',
                        hidden: true,
                        channel: 'G076YHM24',
                        event_ts: '1441080951.583046',
                        ts: '1441080951.000009'
                    }
                     */
                        textmessage = '{bold}(edited){/bold} '+parse(data.message.text, this.teamInfo)+' ('+channel.name+')';
                    break;
                case 'channel_join':
                    //this.teamInfo.channels[data.channel].members.push(data.user);
                    textmessage = parse(data.text, this.teamInfo)+' (#'+channel.name+')';
                    /*
                    {
                        user: 'U047D7YKY',
                        type: 'message',
                        subtype: 'channel_join',
                        text: '<@U047D7YKY|bng5> has joined the channel',
                        channel: 'C047D7YLE',
                        ts: '1441077312.000002'
                    }

                    // Fulano
                    // joined #comunidad. Also, @karina_kimota joined.
                     */
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
        /*
        this.ui.addMessage({
            user: username,
            text: textmessage,
            ts: data.ts
        });
        */
        channel.latest = data;
        /*
        {
            reply_to: 1115,
            type: 'message',
            channel: 'C03510Z05',
            user: 'U048CM415',
            text: '<https://twitter.com/KentBeck/status/634741725047615489>',
            ts: '1440441426.000009'
        }

        {
            type: 'message',
            channel: 'G076YHM24',
            user: 'U048CM415',
            text: 'nuevo',
            ts: '1440625990.000017',
            team: 'T02HBH0D6'
        }

        {
            type: 'message',
            message: {
                type: 'message',
                user: 'U048CM415',
                text: 'viejo',
                edited: { user: 'U048CM415', ts: '1440626006.000000' },
                ts: '1440625990.000017'
            },
            subtype: 'message_changed',
            hidden: true,
            channel: 'G076YHM24',
            event_ts: '1440626006.504971',
            ts: '1440626006.000018'
        }
         */
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
        /*
        {
            type: 'channel_joined',
            channel: {
                id: 'C047D7YLE',
                name: 'random',
                is_channel: true,
                created: 1427851220,
                creator: 'U047D7YKY',
                is_archived: false,
                is_general: false,
                is_member: true,
                last_read: '1441078637.000012',
                latest: {
                    user: 'U047D7YKY',
                    type: 'message',
                    subtype: 'channel_leave',
                    text: '<@U047D7YKY|bng5.> has left the channel',
                    ts: '1441078637.000012'
                },
                unread_count: 0,
                unread_count_display: 0,
                members: [ 'U047D7YKY', 'U0544TA4S' ],
                topic: { value: '', creator: '', last_set: 0 },
                purpose: {
                    value: 'A place for non-work-related flimflam, faffing, hodge-podge or jibber-jabber you\'d prefer to keep out of more focused work-related channels.',
                    creator: '',
                    last_set: 0
                }
            }
        }
         * /
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
        /*
        {
            type: 'im_open',
            user: 'U04K1LYMX',
            channel: 'D07PGHD33'
        }
         *\/
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
        /*
        {
          type: 'file_created',
          file: {
            id: 'F0ACTR882',
            created: 1441822546,
            timestamp: 1441822546,
            name: 'Getting_Started_with_Posts',
            title: 'Getting Started with Posts',
            mimetype: 'text/plain',
            filetype: 'space',
            pretty_type: 'Space',
            user: 'USLACKBOT',
            editable: true,
            size: 2497,
            mode: 'space',
            is_external: false,
            external_type: '',
            is_public: true,
            public_url_shared: false,
            display_as_bot: false,
            username: '',
            url: 'https://slack-files.com/files-pub/T02HBH0D6-F0ACTR882-0df3f16af3/getting_started_with_posts',
            url_download: 'https://slack-files.com/files-pub/T02HBH0D6-F0ACTR882-0df3f16af3/download/getting_started_with_posts',
            url_private: 'https://files.slack.com/files-pri/T02HBH0D6-F0ACTR882/getting_started_with_posts',
            url_private_download: 'https://files.slack.com/files-pri/T02HBH0D6-F0ACTR882/download/getting_started_with_posts',
            permalink: 'https://sinergiacowork.slack.com/files/slackbot/F0ACTR882/getting_started_with_posts',
            permalink_public: 'https://slack-files.com/T02HBH0D6-F0ACTR882-0df3f16af3',
            preview: '<document><p>Hi! Welcome to Posts, Slack\'s built-in document editor. Posts are a great way to share long-form content — like project plans, or documentation — directly in Slack. So how does one use Posts? Well, let\'s get right to it:</p><h1>Creating a new Post</h1><p>You can create a new Post from the <b>+</b> button in the Slack message input.</p><h1>Formatting text</h1><p>Text formatting in Posts was designed for simplicity, with just the right formatting options to help you get your thoughts organized.</p></document>',
            updated: 1441822546,
            channels: [],
            groups: [],
            ims: [],
            comments_count: 0
          },
          event_ts: '1441822546.476847'
        }
         *\/
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
        /*
        {
            "type":"team_join",
            "user": {
                "id":"U0A0EJH08",
                "name":"carlos",
                ...
            },
            "cache_ts":1441130660
        }
         */
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
