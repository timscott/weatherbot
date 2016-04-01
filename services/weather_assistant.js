'use strict';

let weatherService = require('../services/weather_service');

module.exports = class WeatherAssistant {

  static get matchers() {
    return ['(.*) (weather|forecast|temp|temperature)(\s*)(.*)'];
  }

  constructor(message) {
    let matches = message.match(RegExp(WeatherAssistant.matchers[0], 'i'));
    this._locale = matches[1].trim();
    this._object = matches[2].trim();
    this._timeScope = matches[4].trim();
  }

  get object() {
    return this._object;
  }

  get locale() {
    return this._locale;
  }

  get timeScope() {
    return this._timeScope;
  }

  get isNow() {
    return this._timeScope == 'now';
  }

  get isTemp() {
    return (this._object == 'temp' || this._object == 'temperature') && this._timeScope == '';
  }

  reply(callback) {
    if (this.isNow || this.isTemp) {
      weatherService.weather(this.locale, weather => {
        callback(this.isTemp ? weather.tempFormatted : weather.toString());
      });
    } else {
      weatherService.forecast(this.locale, forecast => {
        callback(forecast.toString(this.timeScope));
      });
    }
  }

}