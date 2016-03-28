'use strict';

let chai = require('chai');
let expect = chai.expect;
let WeatherInfo = require('./../models/weather_info');

describe('WeatherInfo', () => {
  let subject = new WeatherInfo({
    "main": {
      "temp_min": 50,
      "temp_max": 100,
    },
    "weather": [{
      "description": "scattered clouds",
      "icon": "03d"
    }]
  });
  describe('avgTemp', () => {
    it('should be the average temp', () => {
      expect(subject.avgTemp).to.equal(75);
    });
  });
  describe('toString', () => {
    it('should return the formatted info', () => {
      expect(subject.toString()).to.equal('75° F | :barely_sunny: scattered clouds');
    });
  });
});