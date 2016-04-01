'use strict';

let chai = require('chai');
let expect = chai.expect;
let WeatherForcast = require('./../models/weather_forecast');

describe('WeatherForcast', () => {
  let subject = new WeatherForcast({
    "city": {
      "name": "Austin",
    },
    "list": [{
      "dt": 1458939600,
      "main": {
        "temp_min": 50,
        "temp_max": 100,
      },
      "weather": [{
        "description": "scattered clouds",
        "icon": "03d"
      }]
    }]
  });
  describe('cityName', () => {
    it('should be the city name', () => {
      expect(subject.cityName).to.equal('Austin');
    });
  });
  describe('toString', () => {
    it('should return the city and formatted infos', () => {
      expect(subject.toString()).to.equal(`Austin weather:\n${subject.infos().map(interval => interval.toString())}`);
    });
  });
});