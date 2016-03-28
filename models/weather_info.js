'use strict';

let moment = require('moment');
require('moment-timezone');

module.exports = class WeatherInfo {

  constructor(data) {
    this.data = data;
  }

  get emoji() {
    return {
      '01d': ':sunny:',
      '02d': ':mostly_sunny:',
      '03d': ':barely_sunny:',
      '04d': ':cloud:',
      '09d': ':rain_cloud:',
      '10d': ':partly_sunny_rain:',
      '11d': ':lightning:',
      '13d': ':snow_cloud:',
      '01n': ':full_moon:',
      '02n': ':mostly_sunny:',
      '03n': ':barely_sunny:',
      '04n': ':cloud:',
      '09n': ':rain_cloud:',
      '10n': ':partly_sunny_rain:',
      '11n': ':lightning:',
      '13n': ':snow_cloud:'
    }[this.data.weather[0].icon];
  }

  get avgTemp() {
    return Math.round((this.data.main.temp_min+this.data.main.temp_max)/2);
  }

  get description() {
    return this.data.weather[0].description;
  }

  toString() {
    return [
      `${this.avgTemp}° F`,
      `${this.emoji} ${this.description}`
    ].join(' | ');
  };

}