'use strict';
let WeatherInterval = require('./weather_interval');
let moment = require('moment');

module.exports = class WeatherForecast {

  constructor(data) {
    this.data = data;
    this._intervals = data.list.map(interval => new WeatherInterval(interval));
  }

  intervals(criteria) {
    switch (criteria ? criteria.toLowerCase().trim() : null) {
      case 'now':
        return this._intervals.length > 0 ? [this._intervals[0]] : [];
      case 'today':
        return this._intervals.filter(interval => interval.inToday());
      case 'tomorrow':
        return this._intervals.filter(interval => interval.inTomorrow());
      case 'this weekend':
        return this._intervals.filter(interval => interval.inWeekend());
      case null:
      case undefined:
      case '5 day':
        return this._intervals;
      default:
        let weekdayIndex = moment.localeData().weekdaysParse(criteria);
        return this._intervals.filter(interval => weekdayIndex ? interval.inDay(weekdayIndex) : false);
    }

    return this._intervals.filter(filter);
  }

  get cityName() {
    return this.data.city.name;
  }

  toString(criteria) {
    let intervalsText = this.intervals(criteria).map(interval => interval.toString()).join('\n');
    return `${this.cityName} weather:\n${intervalsText}\nNOTE: All times Eastern.`;
  }
}