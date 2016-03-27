'use strict';

let request = require('request');
let qs = require('qs');

let weather_endpoint = 'http://api.openweathermap.org/data/2.5/'
let weather_forecast_url = weather_endpoint + 'forecast'
let base_weather_query = {
  appid: process.env.weather_api_key,
  units: 'imperial'
}

module.exports.fiveDayForecast = (locale, callback) => {
  let query = Object.assign(base_weather_query, {q: locale})
  let url = weather_forecast_url + '?' + qs.stringify(query);
  request(url, (error, response, body) => {
    let data = JSON.parse(body);
    callback(data);
  });
};