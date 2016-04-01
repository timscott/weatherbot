'use strict';

let request = require('request');
let qs = require('qs');
let WeatherForecast = require('../models/weather_forecast');
let WeatherInfo = require('../models/weather_info');
let geoService = require('../services/geo_service');

let endpoint = 'http://api.openweathermap.org/data/2.5/'
let base_query = {
  appid: process.env.WEATHER_API_KEY,
  units: 'imperial'
}

let get_weather = (method, locale, callback) => {
  let query = Object.assign(base_query, {q: locale})
  let url = `${endpoint}/${method}?${qs.stringify(query)}`;
  request(url, (error, response, body) => {
    let data = JSON.parse(body);
    callback(data);
  });
};

module.exports.forecast = (locale, callback) => {
  get_weather('forecast', locale, data => {
    let date = data.list.length > 0 ? data.list[0].dt : new Date().getTime()
    geoService.timezone(date, data.city.coord.lat, data.city.coord.lon, tzData => {
      callback(new WeatherForecast(data, tzData.timeZoneId))
    });
  });
};

module.exports.weather = (locale, callback) => {
  get_weather('weather', locale, data => {
    geoService.timezone(data.dt, data.coord.lat, data.coord.lon, tzData => {
      callback(new WeatherInfo(data, tzData.timeZoneId));
    });
  });
};