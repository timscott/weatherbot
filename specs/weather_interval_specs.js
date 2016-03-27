'use strict';

let chai = require('chai');
let expect = chai.expect;
let WeatherInterval = require('./../models/weather_interval');

chai.use(require('chai-datetime'));

describe('WeatherInterval', () => {
  let subject = new WeatherInterval({
    "dt": 1458939600,
    "main": {
      "temp_min": 50,
      "temp_max": 100,
    },
    "weather": [{
      "description": "scattered clouds",
      "icon": "03d"
    }]
  });
  describe('date', () => {
    it('should be the interval date', () => {
      expect(subject.date).to.equalDate(new Date('3/25/2016 16:00:00 -0500'));
    });
  });
  describe('avgTemp', () => {
    it('should be the average temp', () => {
      expect(subject.avgTemp).to.equal(75);
    });
  });
  describe('toString', () => {
    it('should return the formatted interval', () => {
      expect(subject.toString()).to.equal('Fri 05:00 PM EDT - 75° F - :barely_sunny: scattered clouds');
    });
  });
  describe('matches', () => {
    context('when occurs today', () => {
      let subject = new WeatherInterval({
        "dt": (new Date().getTime()/1000)
      });
      it('should be true', () => {
        expect(subject.inToday()).to.equal(true);
      });
    });
  });
  describe('inTomorrow', () => {
    context('when occurs tomorrow', () => {
      let subject = new WeatherInterval({
        "dt": ((new Date().getTime()/1000) + (24*60*60))
      });
      it('should be true', () => {
        expect(subject.inTomorrow()).to.equal(true);
      });
    });
  });
  describe('inDay', () => {
    context('when occurs Tuesday', () => {
      let subject = new WeatherInterval({
        "dt": 1459278850
      });
      it('should be true for 2', () => {
        expect(subject.inDay(2)).to.equal(true);
      });
    });
  });
});