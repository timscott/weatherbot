'use strict';

module.exports = class WeatherHearer {

  static get matchers() {
    return ['(.*) (weather|forecast)(\s*)(.*)'];
  }

  constructor(message) {
    let matches = message.match(RegExp(WeatherHearer.matchers[0], 'i'));
    this._locale = matches[1].trim();
    this._timeScope = matches[4].trim();
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

}