Installing
----------

Clone the repository and cd into it:
```bash
$ git clone git@github.com:bng5/slack-tui.git
$ cd slack-tui
```

Install dependencies:
```bash
$ npm install
```

Optional, install it globally.
```bash
$ npm install . -g
```
Note: You may need to prefix this command with `sudo`

Usage
-----

Obtain your Slack API Token from https://api.slack.com/web#authentication  
(Provisionally) Run `slacktui` with your API Token:
```bash
$ SLACK_TOKEN='xoxp-1111111111-2222222222-3333333333-123456' slacktui
```
or
```bash
$ SLACK_TOKEN='xoxp-1111111111-2222222222-3333333333-123456' node bin/slacktui.js
```
