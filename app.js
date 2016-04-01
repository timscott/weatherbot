'use strict';
require('dotenv').config();

let missingSettings = ['SLACK_TOKEN', 'WEATHER_API_KEY'].filter(setting => !process.env[setting]);
if (missingSettings.length > 0) {
  console.log([
    'Error, required settings missing:',
    missingSettings.join('\n'),
    `Env: ${JSON.stringify(process.env)}`].join('\n'));
  process.exit(1);
}

let Botkit = require('botkit');
let os = require('os');
let weatherService = require('./services/weather_service');
let WeatherForecast = require('./models/weather_forecast');
let WeatherHearer = require('./services/weather_hearer');

let controller = Botkit.slackbot({
  debug: process.env.DEBUG == 1
});

let bot = controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM();

controller.hears(WeatherHearer.matchers, 'direct_message, direct_mention, mention', (bot, message) => {
  let hearer = new WeatherHearer(message.text);
  if (hearer.isNow) {
    weatherService.weather(hearer.locale, forecast => {
      bot.reply(message, `${forecast.toString()}`)
    });
  } else {
    weatherService.forecast(hearer.locale, forecast => {
      bot.reply(message, `${forecast.toString(hearer.timeScope)}`)
    });
  }
});

controller.hears(['hello', 'hi'], 'direct_message, direct_mention, mention', (bot, message) => {
  controller.storage.users.get(message.user, function(err, user) {
    let greeting = user && user.name ? 'Hello ' + user.name + '!' : 'Hello.';
    let examples = `
Austin weather
Austin weather now
Chicago weather today
Chicago weather tomorrow
New York weather Wednedsay
Athens GA weather this weekend`
    bot.reply(message, `${greeting} You can ask me things like:${examples}`);
  });
});