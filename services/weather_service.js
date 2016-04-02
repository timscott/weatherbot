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

let get_weather = (method, locale, onSuccess, onError) => {
  let query = Object.assign(base_query, {q: locale})
  let url = `${endpoint}/${method}?${qs.stringify(query)}`;
  request(url, (error, response, body) => {
    let data = JSON.parse(body);
    if (data.cod >= 400) {
      console.log(`ERROR: ${url}\n${body}`);
      onError(data.message);
    } else {
      onSuccess(data);
    }
  });
};

module.exports.forecast = (locale, onSuccess, onError) => {
  get_weather('forecast', locale, data => {
    let date = data.list.length > 0 ? data.list[0].dt : new Date().getTime()
    geoService.timezone(date, data.city.coord.lat, data.city.coord.lon, tzData => {
      onSuccess(new WeatherForecast(data, tzData.timeZoneId))
    });
  }, onError);
};

module.exports.weather = (locale, onSuccess, onError) => {
  get_weather('weather', locale, data => {
    geoService.timezone(data.dt, data.coord.lat, data.coord.lon, tzData => {
      onSuccess(new WeatherInfo(data, tzData.timeZoneId));
    });
  }, onError);
};