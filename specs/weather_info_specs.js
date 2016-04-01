'use strict';

let chai = require('chai');
let expect = chai.expect;
let WeatherInfo = require('./../models/weather_info');

chai.use(require('chai-datetime'));

describe('WeatherInfo', () => {
  let subject = new WeatherInfo({
    "dt": 1458939600,
    "main": {
      "temp": 75,
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
  describe('toString', () => {
    it('should return the formatted interval', () => {
      expect(subject.toString()).to.equal('Fri 05:00 PM EDT | 75° F | :barely_sunny: scattered clouds');
    });
  });
  describe('matches', () => {
    context('when occurs today', () => {
      let subject = new WeatherInfo({
        "dt": (new Date().getTime()/1000)
      });
      it('should be true', () => {
        expect(subject.inToday()).to.equal(true);
      });
    });
  });
  describe('inTomorrow', () => {
    context('when occurs tomorrow', () => {
      let subject = new WeatherInfo({
        "dt": ((new Date().getTime()/1000) + (24*60*60))
      });
      it('should be true', () => {
        expect(subject.inTomorrow()).to.equal(true);
      });
    });
  });
  describe('inDay', () => {
    context('when occurs Tuesday', () => {
      let subject = new WeatherInfo({
        "dt": 1459278850
      });
      it('should be true for 2', () => {
        expect(subject.inDay(2)).to.equal(true);
      });
    });
  });
});