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
let WeatherAssitant = require('./services/weather_assistant');

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

controller.hears(WeatherAssitant.matchers, 'direct_message, direct_mention, mention', (bot, message) => {
  let assistant = new WeatherAssitant(message.text);
  assistant.reply(answer => {
    bot.reply(message, answer);
  });
});

controller.hears(['hello', 'hi'], 'direct_message, direct_mention, mention', (bot, message) => {
  controller.storage.users.get(message.user, function(err, user) {
    let greeting = user && user.name ? 'Hello ' + user.name + '!' : 'Hello.';
    let examples = `
Austin weather
Austin weather now
Austin temp
Chicago weather today
Chicago weather tomorrow
New York weather Wednedsay
Athens GA weather this weekend`
    bot.reply(message, `${greeting} You can ask me things like:${examples}`);
  });
});