'use strict';

let chai = require('chai');
let expect = chai.expect;
let WeatherHearer = require('./../services/weather_hearer');

describe('WeatherHearer', () => {
  describe('match', () => {
    [
      ['Austin weather', { locale: 'Austin', timeScope: ''}],
      ['Austin forecast', { locale: 'Austin', timeScope: ''}],
      ['Austin TX weather', { locale: 'Austin TX', timeScope: ''}],
      ['Austin weather now', { locale: 'Austin', timeScope: 'now'}],
      ['Austin weather this week', { locale: 'Austin', timeScope: 'this week'}]
    ].forEach(example => {
      it(`should match ${example[0]}`, () => {
        let hearer = new WeatherHearer(example[0]);
        expect(hearer.locale).to.eql(example[1].locale);
        expect(hearer.timeScope).to.eql(example[1].timeScope);
      });
    });
  });
});