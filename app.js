'use strict';
require('dotenv').config();

let requiredSettings = ['WEATHER_API_KEY'];
if (!process.env.BEEPBOOP_ID)
  requiredSettings.push('SLACK_TOKEN');

let missingSettings = requiredSettings.filter(setting => !process.env[setting]);
if (missingSettings.length > 0) {
  console.log([
    'Error, required settings missing:',
    missingSettings.join('\n'),
    `Env: ${JSON.stringify(process.env)}`].join('\n'));
  process.exit(1);
}

let Botkit = require('botkit');
let os = require('os');
let WeatherForecast = require('./models/weather_forecast');
let WeatherAssistant = require('./services/weather_assistant');

let controller = Botkit.slackbot({
  debug: process.env.DEBUG == 1
});

if (process.env.BEEPBOOP_ID) {
  console.log('Starting in Beep Boop multi-team mode');
  require('beepboop-botkit').start(controller, {
    debug: true
  });
} else {
  console.log('Starting in single-team mode');
  controller.spawn({
    token: process.env.SLACK_TOKEN
  }).startRTM(function(err,bot,payload) {
    if (err)
      throw new Error(err);
  });
}

controller.hears(WeatherAssistant.matchers, 'direct_message, direct_mention, mention', (bot, message) => {
  controller.storage.users.get(message.user, (err, user) => {
    let assistant = new WeatherAssistant(message.text, user);
    assistant.reply(answer => {
      bot.reply(message, answer);
    });
  });
});

controller.hears(['home is (.*)', 'my home (.*)', 'i live in (.*)', '(.*) is home'],'direct_message,direct_mention,mention', (bot, message) => {
  var locale = message.match[1];
  controller.storage.users.get(message.user, (err, user) => {
    if (!user)
      user = { id: message.user };
    user.locale = locale;
    controller.storage.users.save(user, (err, id) => {
      bot.reply(message,`Got it. When don't specifiy a locale, I'll assume you mean ${locale}.`);
    });
  });
});

controller.hears(['hello', 'hi', 'howdy', 'yo'], 'direct_message, direct_mention, mention', (bot, message) => {
  controller.storage.users.get(message.user, function(err, user) {
    let answer = `Hi, I'm your Weatherbot! You can ask me things like:\n\n${WeatherAssistant.example_questions.join('\n')}\n\n`
    if (user && user.locale)
      answer += `I see you live in ${user.locale}. `
    answer += `You can ${user && user.locale ? 'change' : 'tell me'} where you live:\n\nHome is Seattle`
    bot.reply(message, answer);
  });
});