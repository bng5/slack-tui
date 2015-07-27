'use strict';
var welcome_msgs = [
    "Have a great day at work today.",
    "What good shall I do this day?",
    "Remember to get up & stretch\nonce in a while.",
    "We’re all in this together.",
    "You look nice today.",
    "Thank you for using Slack.\nWe appreciate it!",
    "Please enjoy Slack responsibly.",
    "Be cool. But also be warm.",
    "The mystery of life isn't a problem to solve, but a reality to experience.",
    "We like you.",
    "Please consider the environment before printing this Slack.",
    "Always get plenty of sleep, if you can.",
    "You're here! The day just got better.",
    "Alright world, time to take you on!",
    "Each day will be better than the last. This one especially.",
    "What a day! What cannot be accomplished on such a splendid day?",
    "Sometimes you eat the bear and sometimes the bear, well, he eats you.",
    "More \"holy moly!\""
];

exports.getMessage = function() {
    return welcome_msgs[Math.round(Math.random() * (welcome_msgs.length - 1))];
};
