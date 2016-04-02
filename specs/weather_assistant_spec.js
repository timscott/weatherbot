'use strict';

let chai = require('chai');
let expect = chai.expect;
let WeatherAssitant = require('./../services/weather_assistant');

describe('WeatherAssitant', () => {
  describe('match', () => {
    [
      ['Austin weather', { locale: 'Austin', criteria: '', object: 'weather'}],
      ['Austin forecast', { locale: 'Austin', criteria: '', object: 'forecast'}],
      ['Austin TX weather', { locale: 'Austin TX', criteria: '', object: 'weather'}],
      ['Austin weather now', { locale: 'Austin', criteria: 'now', object: 'weather'}],
      ['Austin weather this week', { locale: 'Austin', criteria: 'this week', object: 'weather'}]
    ].forEach(example => {
      it(`should match ${example[0]}`, () => {
        let assistant = new WeatherAssitant(example[0]);
        expect(assistant.locale).to.eql(example[1].locale);
        expect(assistant.object).to.eql(example[1].object);
        expect(assistant.criteria).to.eql(example[1].criteria);
      });
    });
    context('when no locale specified', () => {
      it("should default to the user's locale", () => {
        let assistant = new WeatherAssitant('weather', { locale: 'Austin' });
        expect(assistant.locale).to.eql('Austin');
      });
    });
  });
});