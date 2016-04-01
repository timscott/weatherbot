'use strict';

let moment = require('moment');
require('moment-timezone');

module.exports = class WeatherInfo {

  constructor(data) {
    this.data = data;
  }

  get date() {
    return new Date(this.data.dt * 1000);
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

  inToday() {
    return moment(this.date).isSame(new Date(), 'day')
  }

  inTomorrow() {
    return moment(this.date).isSame(moment().add('days', 1), 'day');
  }

  inWeekend() {
    return this.inDay(6) || this.inDay(0);
  }

  inDay(dayIndex) {
    return moment(this.date).day() == dayIndex
  }

  toString() {
    return [
      moment(this.date).tz('America/New_York').format('ddd hh:mm A zz'),
      `${this.avgTemp}° F`,
      `${this.emoji} ${this.description}`
    ].join(' | ');
  };

}