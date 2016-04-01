'use strict';
let WeatherInfo = require('./weather_info');
let moment = require('moment');

module.exports = class WeatherForecast {

  constructor(data, timezoneId) {
    this.data = data;
    this._infos = data.list.map(infoData => new WeatherInfo(infoData, timezoneId));
  }

  infos(criteria) {
    switch (criteria ? criteria.toLowerCase().trim() : null) {
      case 'now':
        return this._infos.length > 0 ? [this._infos[0]] : [];
      case 'today':
        return this._infos.filter(info => info.inToday());
      case 'tomorrow':
        return this._infos.filter(info => info.inTomorrow());
      case 'this weekend':
        return this._infos.filter(info => info.inWeekend());
      case null:
      case undefined:
      case '5 day':
        return this._infos;
      default:
        let weekdayIndex = moment.localeData().weekdaysParse(criteria);
        return this._infos.filter(info => weekdayIndex ? info.inDay(weekdayIndex) : false);
    }

    return this._infos.filter(filter);
  }

  get cityName() {
    return this.data.city.name;
  }

  toString(criteria) {
    let infosText = this.infos(criteria).map(info => info.toString()).join('\n');
    return `${this.cityName} weather:\n${infosText}`;
  }
}