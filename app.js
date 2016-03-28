'use strict';
require('dotenv').config();

if (!process.env.SLACK_TOKEN) {
  console.log('Error: A Slackbot token is required.');
  process.exit(1);
}
if (!process.env.WEATHER_API_KEY) {
  console.log('Error: A weather API key is required.');
  process.exit(1);
}

let Botkit = require('botkit');
let os = require('os');
let weatherService = require('./services/weather_service');
let WeatherForecast = require('./models/weather_forecast');

let controller = Botkit.slackbot({
  debug: process.env.DEBUG == 1
});

let bot = controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM();

controller.hears(['(.*) weather(\s*)(.*)?'], 'direct_message, direct_mention, mention', (bot, message) => {
  let matches = message.text.match(/(.*) weather(\s*)(.*)?/i);
  let locale = matches[1];
  let timeScope = matches[3];
  weatherService.fiveDayForecast(locale, data => {
    let forecast = new WeatherForecast(data);
    bot.reply(message, `${forecast.toString(timeScope)}\nNOTE: All times Eastern.`);
  });
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

//
// controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function(bot, message) {
//
//   controller.storage.users.get(message.user, function(err, user) {
//     if (user && user.name) {
//       bot.reply(message, 'Your name is ' + user.name);
//     } else {
//       bot.reply(message, 'I don\'t know yet!');
//     }
//   });
// });
//
//
// controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {
//
//   bot.startConversation(message, function(err, convo) {
//
//     convo.ask('Are you sure you want me to shutdown?',[
//       {
//         pattern: bot.utterances.yes,
//         callback: function(response, convo) {
//           convo.say('Bye!');
//           convo.next();
//           setTimeout(function() {
//             process.exit();
//           },3000);
//         }
//       },
//     {
//       pattern: bot.utterances.no,
//       default: true,
//       callback: function(response, convo) {
//         convo.say('*Phew!*');
//         convo.next();
//       }
//     }
//     ]);
//   });
// });
//
// controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'direct_message,direct_mention,mention', function(bot, message) {
//
//   var hostname = os.hostname();
//   var uptime = formatUptime(process.uptime());
//
//   bot.reply(message, ':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');
//
// });
//
// function formatUptime(uptime) {
//   var unit = 'second';
//   if (uptime > 60) {
//     uptime = uptime / 60;
//     unit = 'minute';
//   }
//   if (uptime > 60) {
//     uptime = uptime / 60;
//     unit = 'hour';
//   }
//   if (uptime != 1) {
//     unit = unit + 's';
//   }
//
//   uptime = uptime + ' ' + unit;
//   return uptime;
// }

//
// var stub_forecast_body = `
// {
//   "city": {
//     "id": 4671654,
//     "name": "Austin",
//     "coord": {
//       "lon": -97.743057,
//       "lat": 30.267151
//     },
//     "country": "US",
//     "population": 0,
//     "sys": {
//       "population": 0
//     }
//   },
//   "cod": "200",
//   "message": 0.0039,
//   "cnt": 40,
//   "list": [{
//     "dt": 1458928800,
//     "main": {
//       "temp": 66.9,
//       "temp_min": 65.54,
//       "temp_max": 66.9,
//       "pressure": 997.66,
//       "sea_level": 1028.58,
//       "grnd_level": 997.66,
//       "humidity": 46,
//       "temp_kf": 0.76
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 9.26,
//       "deg": 167.01
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-25 18:00:00"
//   }, {
//     "dt": 1458939600,
//     "main": {
//       "temp": 71.87,
//       "temp_min": 70.58,
//       "temp_max": 71.87,
//       "pressure": 993.64,
//       "sea_level": 1024.31,
//       "grnd_level": 993.64,
//       "humidity": 37,
//       "temp_kf": 0.72
//     },
//     "weather": [{
//       "id": 802,
//       "main": "Clouds",
//       "description": "scattered clouds",
//       "icon": "03d"
//     }],
//     "clouds": {
//       "all": 32
//     },
//     "wind": {
//       "speed": 6.11,
//       "deg": 142
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-25 21:00:00"
//   }, {
//     "dt": 1458950400,
//     "main": {
//       "temp": 69.84,
//       "temp_min": 68.61,
//       "temp_max": 69.84,
//       "pressure": 992.69,
//       "sea_level": 1023.32,
//       "grnd_level": 992.69,
//       "humidity": 31,
//       "temp_kf": 0.68
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 9.84,
//       "deg": 155.001
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-26 00:00:00"
//   }, {
//     "dt": 1458961200,
//     "main": {
//       "temp": 58.84,
//       "temp_min": 57.69,
//       "temp_max": 58.84,
//       "pressure": 994.13,
//       "sea_level": 1025.2,
//       "grnd_level": 994.13,
//       "humidity": 42,
//       "temp_kf": 0.64
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 9.44,
//       "deg": 163.003
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-26 03:00:00"
//   }, {
//     "dt": 1458972000,
//     "main": {
//       "temp": 54.46,
//       "temp_min": 53.39,
//       "temp_max": 54.46,
//       "pressure": 994.93,
//       "sea_level": 1026.36,
//       "grnd_level": 994.93,
//       "humidity": 58,
//       "temp_kf": 0.6
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 9.64,
//       "deg": 171
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-26 06:00:00"
//   }, {
//     "dt": 1458982800,
//     "main": {
//       "temp": 50.38,
//       "temp_min": 49.37,
//       "temp_max": 50.38,
//       "pressure": 993.96,
//       "sea_level": 1025.58,
//       "grnd_level": 993.96,
//       "humidity": 74,
//       "temp_kf": 0.56
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 8.41,
//       "deg": 175.501
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-26 09:00:00"
//   }, {
//     "dt": 1458993600,
//     "main": {
//       "temp": 46.42,
//       "temp_min": 45.49,
//       "temp_max": 46.42,
//       "pressure": 994.35,
//       "sea_level": 1026.1,
//       "grnd_level": 994.35,
//       "humidity": 90,
//       "temp_kf": 0.52
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 6.51,
//       "deg": 178
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-26 12:00:00"
//   }, {
//     "dt": 1459004400,
//     "main": {
//       "temp": 59.99,
//       "temp_min": 59.13,
//       "temp_max": 59.99,
//       "pressure": 996.44,
//       "sea_level": 1027.61,
//       "grnd_level": 996.44,
//       "humidity": 67,
//       "temp_kf": 0.48
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 6.13,
//       "deg": 184.002
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-26 15:00:00"
//   }, {
//     "dt": 1459015200,
//     "main": {
//       "temp": 74.05,
//       "temp_min": 73.25,
//       "temp_max": 74.05,
//       "pressure": 995.85,
//       "sea_level": 1026.47,
//       "grnd_level": 995.85,
//       "humidity": 52,
//       "temp_kf": 0.44
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02d"
//     }],
//     "clouds": {
//       "all": 24
//     },
//     "wind": {
//       "speed": 8.28,
//       "deg": 179.001
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-26 18:00:00"
//   }, {
//     "dt": 1459026000,
//     "main": {
//       "temp": 80.37,
//       "temp_min": 79.66,
//       "temp_max": 80.37,
//       "pressure": 993.04,
//       "sea_level": 1023.37,
//       "grnd_level": 993.04,
//       "humidity": 44,
//       "temp_kf": 0.4
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "02d"
//     }],
//     "clouds": {
//       "all": 8
//     },
//     "wind": {
//       "speed": 7.83,
//       "deg": 161.006
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-26 21:00:00"
//   }, {
//     "dt": 1459036800,
//     "main": {
//       "temp": 78.89,
//       "temp_min": 78.24,
//       "temp_max": 78.89,
//       "pressure": 992.95,
//       "sea_level": 1023.31,
//       "grnd_level": 992.95,
//       "humidity": 38,
//       "temp_kf": 0.36
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02n"
//     }],
//     "clouds": {
//       "all": 24
//     },
//     "wind": {
//       "speed": 11.88,
//       "deg": 156.001
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-27 00:00:00"
//   }, {
//     "dt": 1459047600,
//     "main": {
//       "temp": 69.1,
//       "temp_min": 68.53,
//       "temp_max": 69.1,
//       "pressure": 994.22,
//       "sea_level": 1024.75,
//       "grnd_level": 994.22,
//       "humidity": 53,
//       "temp_kf": 0.32
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02n"
//     }],
//     "clouds": {
//       "all": 24
//     },
//     "wind": {
//       "speed": 8.9,
//       "deg": 147.5
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-27 03:00:00"
//   }, {
//     "dt": 1459058400,
//     "main": {
//       "temp": 66.16,
//       "temp_min": 65.66,
//       "temp_max": 66.16,
//       "pressure": 995.15,
//       "sea_level": 1026.03,
//       "grnd_level": 995.15,
//       "humidity": 72,
//       "temp_kf": 0.28
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02n"
//     }],
//     "clouds": {
//       "all": 12
//     },
//     "wind": {
//       "speed": 12.08,
//       "deg": 172.5
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-27 06:00:00"
//   }, {
//     "dt": 1459069200,
//     "main": {
//       "temp": 61.59,
//       "temp_min": 61.17,
//       "temp_max": 61.59,
//       "pressure": 994.99,
//       "sea_level": 1025.92,
//       "grnd_level": 994.99,
//       "humidity": 93,
//       "temp_kf": 0.24
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 9.15,
//       "deg": 191
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-27 09:00:00"
//   }, {
//     "dt": 1459080000,
//     "main": {
//       "temp": 59.65,
//       "temp_min": 59.29,
//       "temp_max": 59.65,
//       "pressure": 997.43,
//       "sea_level": 1028.37,
//       "grnd_level": 997.43,
//       "humidity": 95,
//       "temp_kf": 0.2
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10n"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 6.53,
//       "deg": 307.5
//     },
//     "rain": {
//       "3h": 0.09
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-27 12:00:00"
//   }, {
//     "dt": 1459090800,
//     "main": {
//       "temp": 60.96,
//       "temp_min": 60.68,
//       "temp_max": 60.96,
//       "pressure": 1001.49,
//       "sea_level": 1032.58,
//       "grnd_level": 1001.49,
//       "humidity": 63,
//       "temp_kf": 0.16
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10d"
//     }],
//     "clouds": {
//       "all": 20
//     },
//     "wind": {
//       "speed": 20.27,
//       "deg": 356.001
//     },
//     "rain": {
//       "3h": 0.72
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-27 15:00:00"
//   }, {
//     "dt": 1459101600,
//     "main": {
//       "temp": 66.13,
//       "temp_min": 65.92,
//       "temp_max": 66.13,
//       "pressure": 1002.72,
//       "sea_level": 1033.7,
//       "grnd_level": 1002.72,
//       "humidity": 46,
//       "temp_kf": 0.12
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 18.16,
//       "deg": 354.5
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-27 18:00:00"
//   }, {
//     "dt": 1459112400,
//     "main": {
//       "temp": 69.55,
//       "temp_min": 69.4,
//       "temp_max": 69.55,
//       "pressure": 1001.45,
//       "sea_level": 1032.33,
//       "grnd_level": 1001.45,
//       "humidity": 40,
//       "temp_kf": 0.08
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 15.26,
//       "deg": 358.5
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-27 21:00:00"
//   }, {
//     "dt": 1459123200,
//     "main": {
//       "temp": 66.92,
//       "temp_min": 66.85,
//       "temp_max": 66.92,
//       "pressure": 1001.22,
//       "sea_level": 1032.2,
//       "grnd_level": 1001.22,
//       "humidity": 33,
//       "temp_kf": 0.04
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 12.53,
//       "deg": 5.50467
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-28 00:00:00"
//   }, {
//     "dt": 1459134000,
//     "main": {
//       "temp": 56.04,
//       "temp_min": 56.04,
//       "temp_max": 56.04,
//       "pressure": 1003.01,
//       "sea_level": 1034.48,
//       "grnd_level": 1003.01,
//       "humidity": 39,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 7.94,
//       "deg": 22.0022
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-28 03:00:00"
//   }, {
//     "dt": 1459144800,
//     "main": {
//       "temp": 46.07,
//       "temp_min": 46.07,
//       "temp_max": 46.07,
//       "pressure": 1004.03,
//       "sea_level": 1035.95,
//       "grnd_level": 1004.03,
//       "humidity": 58,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 2.95,
//       "deg": 13.0019
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-28 06:00:00"
//   }, {
//     "dt": 1459155600,
//     "main": {
//       "temp": 40.92,
//       "temp_min": 40.92,
//       "temp_max": 40.92,
//       "pressure": 1003.19,
//       "sea_level": 1035.24,
//       "grnd_level": 1003.19,
//       "humidity": 68,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 3.15,
//       "deg": 19.0008
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-28 09:00:00"
//   }, {
//     "dt": 1459166400,
//     "main": {
//       "temp": 38.2,
//       "temp_min": 38.2,
//       "temp_max": 38.2,
//       "pressure": 1002.73,
//       "sea_level": 1034.98,
//       "grnd_level": 1002.73,
//       "humidity": 72,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 4.36,
//       "deg": 50.5002
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-28 12:00:00"
//   }, {
//     "dt": 1459177200,
//     "main": {
//       "temp": 57.44,
//       "temp_min": 57.44,
//       "temp_max": 57.44,
//       "pressure": 1003.82,
//       "sea_level": 1035.43,
//       "grnd_level": 1003.82,
//       "humidity": 43,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 4.94,
//       "deg": 98.0012
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-28 15:00:00"
//   }, {
//     "dt": 1459188000,
//     "main": {
//       "temp": 67.96,
//       "temp_min": 67.96,
//       "temp_max": 67.96,
//       "pressure": 1002.86,
//       "sea_level": 1033.87,
//       "grnd_level": 1002.86,
//       "humidity": 42,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 8.95,
//       "deg": 115.503
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-28 18:00:00"
//   }, {
//     "dt": 1459198800,
//     "main": {
//       "temp": 72.39,
//       "temp_min": 72.39,
//       "temp_max": 72.39,
//       "pressure": 999.53,
//       "sea_level": 1030.3,
//       "grnd_level": 999.53,
//       "humidity": 35,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 9.31,
//       "deg": 138.001
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-28 21:00:00"
//   }, {
//     "dt": 1459209600,
//     "main": {
//       "temp": 70.57,
//       "temp_min": 70.57,
//       "temp_max": 70.57,
//       "pressure": 997.75,
//       "sea_level": 1028.4,
//       "grnd_level": 997.75,
//       "humidity": 28,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 10.2,
//       "deg": 142.501
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-29 00:00:00"
//   }, {
//     "dt": 1459220400,
//     "main": {
//       "temp": 60.44,
//       "temp_min": 60.44,
//       "temp_max": 60.44,
//       "pressure": 998.6,
//       "sea_level": 1029.6,
//       "grnd_level": 998.6,
//       "humidity": 35,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 9.17,
//       "deg": 144.006
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-29 03:00:00"
//   }, {
//     "dt": 1459231200,
//     "main": {
//       "temp": 59.35,
//       "temp_min": 59.35,
//       "temp_max": 59.35,
//       "pressure": 998.42,
//       "sea_level": 1029.77,
//       "grnd_level": 998.42,
//       "humidity": 47,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 804,
//       "main": "Clouds",
//       "description": "overcast clouds",
//       "icon": "04n"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 12.77,
//       "deg": 164
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-29 06:00:00"
//   }, {
//     "dt": 1459242000,
//     "main": {
//       "temp": 56.78,
//       "temp_min": 56.78,
//       "temp_max": 56.78,
//       "pressure": 997.48,
//       "sea_level": 1028.73,
//       "grnd_level": 997.48,
//       "humidity": 68,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 802,
//       "main": "Clouds",
//       "description": "scattered clouds",
//       "icon": "03n"
//     }],
//     "clouds": {
//       "all": 32
//     },
//     "wind": {
//       "speed": 11.52,
//       "deg": 173.5
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-29 09:00:00"
//   }, {
//     "dt": 1459252800,
//     "main": {
//       "temp": 54.22,
//       "temp_min": 54.22,
//       "temp_max": 54.22,
//       "pressure": 997.13,
//       "sea_level": 1028.5,
//       "grnd_level": 997.13,
//       "humidity": 90,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "02n"
//     }],
//     "clouds": {
//       "all": 8
//     },
//     "wind": {
//       "speed": 10.45,
//       "deg": 174.006
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-29 12:00:00"
//   }, {
//     "dt": 1459263600,
//     "main": {
//       "temp": 60.62,
//       "temp_min": 60.62,
//       "temp_max": 60.62,
//       "pressure": 997.99,
//       "sea_level": 1028.96,
//       "grnd_level": 997.99,
//       "humidity": 81,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10d"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 10.4,
//       "deg": 157.501
//     },
//     "rain": {
//       "3h": 0.11
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-29 15:00:00"
//   }, {
//     "dt": 1459274400,
//     "main": {
//       "temp": 68.73,
//       "temp_min": 68.73,
//       "temp_max": 68.73,
//       "pressure": 997.23,
//       "sea_level": 1027.79,
//       "grnd_level": 997.23,
//       "humidity": 71,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10d"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 11.7,
//       "deg": 160.502
//     },
//     "rain": {
//       "3h": 0.09
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-29 18:00:00"
//   }, {
//     "dt": 1459285200,
//     "main": {
//       "temp": 76.56,
//       "temp_min": 76.56,
//       "temp_max": 76.56,
//       "pressure": 994.2,
//       "sea_level": 1024.45,
//       "grnd_level": 994.2,
//       "humidity": 59,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10d"
//     }],
//     "clouds": {
//       "all": 76
//     },
//     "wind": {
//       "speed": 13.27,
//       "deg": 171.001
//     },
//     "rain": {
//       "3h": 0.01
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-29 21:00:00"
//   }, {
//     "dt": 1459296000,
//     "main": {
//       "temp": 75.66,
//       "temp_min": 75.66,
//       "temp_max": 75.66,
//       "pressure": 992.93,
//       "sea_level": 1023.3,
//       "grnd_level": 992.93,
//       "humidity": 60,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10n"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 14.9,
//       "deg": 156.512
//     },
//     "rain": {
//       "3h": 0.01
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-30 00:00:00"
//   }, {
//     "dt": 1459306800,
//     "main": {
//       "temp": 73.6,
//       "temp_min": 73.6,
//       "temp_max": 73.6,
//       "pressure": 993.89,
//       "sea_level": 1024.45,
//       "grnd_level": 993.89,
//       "humidity": 63,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 804,
//       "main": "Clouds",
//       "description": "overcast clouds",
//       "icon": "04n"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 18.92,
//       "deg": 159
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-30 03:00:00"
//   }, {
//     "dt": 1459317600,
//     "main": {
//       "temp": 66.45,
//       "temp_min": 66.45,
//       "temp_max": 66.45,
//       "pressure": 994.21,
//       "sea_level": 1024.76,
//       "grnd_level": 994.21,
//       "humidity": 90,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10n"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 16.49,
//       "deg": 159.002
//     },
//     "rain": {
//       "3h": 0.64
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-30 06:00:00"
//   }, {
//     "dt": 1459328400,
//     "main": {
//       "temp": 66.73,
//       "temp_min": 66.73,
//       "temp_max": 66.73,
//       "pressure": 992.19,
//       "sea_level": 1022.78,
//       "grnd_level": 992.19,
//       "humidity": 95,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10n"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 15.28,
//       "deg": 159.002
//     },
//     "rain": {
//       "3h": 0.67
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-30 09:00:00"
//   }, {
//     "dt": 1459339200,
//     "main": {
//       "temp": 67.09,
//       "temp_min": 67.09,
//       "temp_max": 67.09,
//       "pressure": 991.74,
//       "sea_level": 1022.21,
//       "grnd_level": 991.74,
//       "humidity": 96,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10n"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 9.78,
//       "deg": 161.002
//     },
//     "rain": {
//       "3h": 0.79
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2016-03-30 12:00:00"
//   }, {
//     "dt": 1459350000,
//     "main": {
//       "temp": 69.53,
//       "temp_min": 69.53,
//       "temp_max": 69.53,
//       "pressure": 991.73,
//       "sea_level": 1022.19,
//       "grnd_level": 991.73,
//       "humidity": 94,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10d"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 11.77,
//       "deg": 168
//     },
//     "rain": {
//       "3h": 2.45
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2016-03-30 15:00:00"
//   }]
// }`