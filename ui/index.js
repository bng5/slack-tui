var blessed = require('blessed');
var figures = require('figures');
var util         = require('util');
var EventEmitter = require("events").EventEmitter;
var _       = require('underscore');

var time  = require('../util/time');

var usersTyping = {
    users: [],
    timeOut: null
};

function Ui() {
    this.channel;
    this.team;
    this.teamName;
    this.prompt;

    this.screen = blessed.screen({
        autoPadding: true,
        bg: 'black',
        style: {
            bg: 'black'
        }
    });
    //        content: '{bold}Team{/bold}\n{green-fg}'+figures.radioOn+'{/green-fg} User',
    this.panel = blessed.box({
        top: 0,
        left: 0,
        width: 20,
        height: '100%',
        tags: true,
        padding: 0,
        style: {
            fg: 'white',
            bg: 'magenta'
        }
    });
    this.screen.append(this.panel);

    var layout = blessed.box({
        top: 0,
        left: 20,
        width: '100%',
        height: '100%',
        padding: 0,
        style: {
            fg: 'white',
            bg: 'gray'
        }
    });
    this.screen.append(layout);

    this.board = blessed.box({
        top: 0,
        left: 0,
        width: '70%',
        height: 1,
        tags: true,
        padding: 0,
        style: {
            fg: 'white',
            bg: 'gray'
        }
    });
    layout.append(this.board);

    this.usersCount = blessed.box({
        top: 0,
        right: 0,
        width: '30%',
        height: 1,
        tags: true,
        padding: 0,
        style: {
            fg: 'white',
            bg: 'gray'
        }
    });
    layout.append(this.usersCount);
    /*
    this.contentArea = blessed.box({
        top: 1,
        fg: 'white',
        left: 0,
        width: '100%',
        height: '100%-4',
        tags: true,
        padding: 0,
        valign: 'bottom',
        style: {
            fg: 'white',
            bg: 'gray',
            scrollbar: {
                ch: '|',
                inverse: true
            }
        },
        mouse: true,
        keys: true,
        vi: true,
        alwaysScroll: true,
        scrollbar: {
          ch: ' ',
          inverse: true
        }
    });
     */
    this.contentArea = blessed.scrollabletext({
        parent: layout,
        mouse: true,
        keys: true,
        vi: true,
        style: {
            fg: 'white',
            bg: 'gray'
        },
        scrollbar: {
            ch: ' ',
            inverse: true
        },
        padding: {
            top: 1,
            left: 1
        },
        width: '100%-20',
        height: '100%-5',
        top: 1,
        left: 0,
        valign: 'bottom',
        //content: 'Loading...',
        tags: true
    });
    //layout.append(this.contentArea);

    this.input = blessed.textarea({
        bottom: 1,
        left: 0,
        height: 3,
        width: '100%-20',
        inputOnFocus: true,
        padding: {
            top: 0,
            left: 2
        },
        border: {
            type: 'line'
        },
        style: {
            fg: '#353535',
            bg: '#f6f6f6',
            border: {
                fg: 'blue',
                bg: '#f6f6f6'
            }
        }
    });
    layout.append(this.input);

    this.statusBar = blessed.box({
        bottom: 0,
        left: 0,
        width: '100%-20',
        height: 1,
        tags: true,
        padding: 0,
        style: {
            fg: 'white',
            bg: 'gray'
        }
    });
    layout.append(this.statusBar);

    //input.focus();
    var self = this;
    this.screen.key('q', function() {
        process.exit(0);
    });
    this.screen.key('C-k', function() {
        self.quickSwitcherOpen();
    });
    this.screen.key('/', function() {
        self.input.focus();
        if(self.input.value.length === 0) {
            self.input.setValue('/');
        }
        //screen.append(box);
        //screen.log(list.items);
        // list.pick(function() {});
        //screen.append(list);
        //list.select(0);
        //list.focus();
            this.render();
    });
    this.screen.render();
}

util.inherits(Ui, EventEmitter);

Ui.prototype.setTitle = function() {
    this.screen.title = this.channel.name+' '+this.teamName+' SlackTui';
    return this;
};
Ui.prototype.setTeam = function(team) {
    this.teamName = team.name;
    this.panel.setLine(0, '{bold}'+team.name+'{/bold}');
    this.screen.render();
    return this;
};
Ui.prototype.setChannel = function(channel) {
    this.channel = channel;
    var line = '{bold}{gray-fg}#{/gray-fg}'+channel.name+'{/bold} '+(channel.topic ? channel.topic.value : '');
    this.board.setLine(0, line);
    this.usersCount.setLine(0, ' Users: '+(channel.members ? channel.members.length : 0));
    this.screen.render();
    this.setTitle();
    return this;
};
Ui.prototype.setUser = function(user) {
    this.panel.setLine(1, (user.manual_presence == "active" ? '{green-fg}'+figures.radioOn+'{/green-fg}' : figures.radioOff)+' '+user.name);
    this.screen.render();
    return this;
};
/**
 * TODO Settear un timeOut para remover al usuario de la pila
 */
Ui.prototype.userIsTyping = function(username) {

/*
var usersTyping = {
    users: [],
    timeOut: null
};
 */
    /*
    if(usersTyping.timeOut) {
        clearTimeout(usersTyping.timeOut);
        usersTyping.timeOut = null;
    }

    // FIXME
    if((var index = usersTyping.users.indexOf(username)) !== -1) {
        usersTyping.users.splice(index, 1);
    }

    var self = this;
    usersTyping.timeOut = setTimeout(function() {
        usersTyping.timeOut = null;


        self.screen.render();
    }, 5000);

    usersTyping.users.push(username);
    */
    this.setStatusbar(username+' is typing');
    return this;
};
Ui.prototype.setStatusbar = function(text) {
    this.statusBar.setLine(0, text);
    this.screen.render();
    return this;
};
Ui.prototype.addMessage = function(message) {
    addMessage.call(this, message);
    /*
    var text = blessed.text({
        autoPadding: true,
        content: '{bold}'+message.user+'{/bold} '+message.ts+'\n'+message.text
    });
    this.contentArea.append(text);
     */
    this.screen.render();
    console.error('Scroll: '+this.contentArea.getScroll());
    this.contentArea.scrollTo(this.contentArea.getScroll());
    this.screen.render();
};
Ui.prototype.addMessages = function(messages) {
    for(var i = 0; i < messages.length; i++) {
        addMessage.call(this, messages[i]);
    }
    this.screen.render();
};
Ui.prototype.quickSwitcher = function() {
    //Quick Switcher Ctrl+K
    var k = 0;
    var switcher = blessed.box({
        parent: this.screen,
        top: 'center',
        left: 'center',
        width: 60,
        height: 9,
        border: 'line',
        style: {
            //bg: 'red',
            border: {
                fg: 'blue'
            }
        },
        label: 'Jump to a conversation'
    });
    var input = blessed.textbox({
        inputOnFocus: true
    });

    input.on('submit', function(text) {
        console.error('submit', text);
    });
    var self = this;
    input.on('cancel', function(a) {
        switcher.destroy();
        self.screen.render();
        console.error('cancel', a);
    });
    switcher.append(input);
    input.focus();

    var list = blessed.list({
        parent: switcher,
        top: 1,
        width: '100%-2',
        height: 6,
        align: 'left',
        fg: 'blue',
        selectedBg: 'blue',
        // Allow mouse support
        mouse: true,
        // Allow key support (arrow keys + enter)
        keys: true,
        // Use vi built-in keys
        //vi: true//,
        autoCommandKeys: true
    });
    list.on('select', function(a, b) {
        console.error(a, b);
        //console.error('select', a, b);
    });
    var items = this.team.channels;
    var itemsLength = 0;
    var timeOut;
    input.on('key', function(ch, key) {
        console.error('key', ch, key);
    });
    input.on('keypress', function(ch, key) {
        console.error(ch, key);
        switch(key.full) {
            case 'tab':
            case 'down':
                k++;
                //list.down();
                break;
            case 'S-tab':
            case 'up':
                k--;
                //list.up();
                break;
            case 'enter':
                list.pick(function(a, b) {
                  self.screen.render();
                  console.error(a, b);
                });
                //list.getItemIndex(child)
                break;
            default:
                if(timeOut) {
                    clearTimeout(timeOut);
                    timeOut = null;
                }
                timeOut = setTimeout(function() {
                    //console.error('input.value');
                    //console.error(input.value);
                    timeOut = null;
                    list.clearItems();
                    itemsLength = 0;
                    var patt = new RegExp("^"+input.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "i");
                    for(var i = 0; i < items.length; i++) {
                        if(patt.test(items[i].name)) {
                            itemsLength++;
                            list.add(items[i].name);
                            //console.error(items[i].text);
                        }
                    }
                    k = 0;
                    list.select(k);
                    self.screen.render();
                }, 500);
        }
        if(k < 0) {
            k = (items.length - 1);
        }
        else if(k >= items.length) {
            k = 0;
        }
        console.error('k', k);
        list.select(k);
        self.screen.render();
        return false;
    });
    var initialItems = [];
    //for(var i = 0; i < items.length; i++) {
    for(var x in items) {
        itemsLength++;
        list.add('#'+items[x].name);
        //initialItems.push(items[i].text);
    }
    //list.setItems(initialItems);

    /*
    blessed.box({
        parent: switcher,
        width: '100%',
        height: 1,
        //border: 'line',
        tags: true,
        label: 'Jump to a conversation'
        //content: '{left}Jump to a conversation{/left}\n{right}tab or ↑ ↓ to navigate ↵ to select esc  to dismiss{/right}'
    });
     */
    this.screen.render();
};
Ui.prototype.quickSwitcherOpen = function() {
    this.emit('quickSwitcher:open');
};
Ui.prototype.welcomeMessage = function(message) {
    if(!message) {
        this.destroyPrompt();
        return this;
    }
    this.prompt = blessed.box({
        top: 'center',
        left: 'center',
        width: (message.length + 6),
        height: (((message.match(/\n/g) || []).length) + 5),
        align: 'center',
        padding: 1,
        content: message,
        border: {
            type: 'line'
        }
    });
    this.screen.append(this.prompt);
    this.screen.render();
    return this;
};
Ui.prototype.destroyPrompt = function() {
    if(this.prompt) {
        this.prompt.destroy();
        this.screen.render();
    }
    return this;
};

function addMessage(message) {
    //ui.contentArea.insertBottom('{bold}'+message.user+'{/bold} '+message.ts);
    //ui.contentArea.insertBottom(message.text+'\n');
    var ts = time(message.ts)
    if(message.user) {
        this.contentArea.pushLine('{bold}'+message.user+'{/bold} '+ts+'\n');
    }
    this.contentArea.pushLine(message.text+'\n');
}

//module.exports = Ui;
module.exports = function() {
    return new Ui();
}
