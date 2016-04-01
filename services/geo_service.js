'use strict';

let request = require('request');
let qs = require('qs');

let endpoint = 'https://maps.googleapis.com/maps/api/timezone/json'
let base_query = {
  key: process.env.GEO_API_KEY
}

module.exports.timezone = (time, lat, lon, callback) => {
  let query = Object.assign(base_query, {
    location: `${lat},${lon}`,
    timestamp: time})
  let url = `${endpoint}?${qs.stringify(query)}`;
  request(url, (error, response, body) => {
    let data = JSON.parse(body);
    callback(data);
  });

};