'use strict';


let WeatherInfo = require('./weather_info');
let moment = require('moment');
require('moment-timezone');

module.exports = class WeatherInterval extends WeatherInfo {

  constructor(data) {
    super(data);
  }

  get date() {
    return new Date(this.data.dt * 1000);
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
      super.toString()
    ].join(' | ');
  };

}