'use strict';

let weatherService = require('../services/weather_service');

module.exports = class WeatherAssistant {

  static get matchers() {
    return ['(.*)(\s*)(weather|forecast|temp|temperature|next)(\s*)(.*)'];
  }

  static get example_questions() {
    return [
      'Austin weather',
      'Austin weather now',
      'Austin temp',
      'Chicago weather today',
      'Chicago weather tomorrow',
      'New York weather Wednedsay',
      'Athens GA weather this weekend',
      'Austin next rain',
      'Cleveland next clear'
    ]
  }

  constructor(text, user) {
    let matches = text.match(RegExp(WeatherAssistant.matchers[0], 'i'));
    this._locale = matches[1].trim() || (user ? user.locale : '');
    this._object = matches[3].trim();
    this._criteria = matches[5].trim();
  }

  get locale() {
    return this._locale;
  }

  get object() {
    return this._object;
  }

  get criteria() {
    return this._criteria;
  }

  reply(callback) {
    let wantsTemp = (this._object == 'temp' || this._object == 'temperature') && this._criteria == '';
    if (this._criteria == 'now' || wantsTemp) {
      weatherService.weather(this._locale, weather => {
        callback(`${weather.city} now:\n${wantsTemp ? weather.tempFormatted : weather.toString()}`);
      }, err => {
        callback(err);
      });
    } else {
      weatherService.forecast(this._locale, forecast => {
        callback(forecast.toString(this._object, this._criteria));
      }, err => {
        callback(err);
      });
    }
  }

}