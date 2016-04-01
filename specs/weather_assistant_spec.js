'use strict';

let chai = require('chai');
let expect = chai.expect;
let WeatherAssitant = require('./../services/weather_assistant');

describe('WeatherAssitant', () => {
  describe('match', () => {
    [
      ['Austin weather', { locale: 'Austin', timeScope: '', object: 'weather'}],
      ['Austin forecast', { locale: 'Austin', timeScope: '', object: 'forecast'}],
      ['Austin TX weather', { locale: 'Austin TX', timeScope: '', object: 'weather'}],
      ['Austin weather now', { locale: 'Austin', timeScope: 'now', object: 'weather'}],
      ['Austin weather this week', { locale: 'Austin', timeScope: 'this week', object: 'weather'}]
    ].forEach(example => {
      it(`should match ${example[0]}`, () => {
        let hearer = new WeatherAssitant(example[0]);
        expect(hearer.locale).to.eql(example[1].locale);
        expect(hearer.object).to.eql(example[1].object);
        expect(hearer.timeScope).to.eql(example[1].timeScope);
      });
    });
  });
});