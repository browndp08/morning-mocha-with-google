'use strict';
var assert = require('assert');
var request = require('request');

var mockAddresses = require('./mock/addresses.js');
var utilApi = require('./util/api.js');

describe('geocode', function () {
  it('should return correct geocoding long, lat coordinates', function (done) {
    // Loop through our addresses.
    var i = mockAddresses.length;
    while (i--){
      // Create a closure so we don't lose i in the request.
      (function (i) {
        // Send address to Google to be geocoded.
        request(utilApi.url + '?key=' + utilApi.authKey + '&address=' + mockAddresses[i].address, function (error, response, body) {
          // Parse our response.
          var json = JSON.parse(response.body);
          if (!error && response.statusCode == 200) {
            // On return, verify lng, lat match our data.
            assert.equal(json.results[0].geometry.location.lat, mockAddresses[i].lat, mockAddresses[i].address + ': lat : ' + json.results[0].geometry.location.lat + ' received but expected ' + mockAddresses[i].lat);
            assert.equal(json.results[0].geometry.location.lng, mockAddresses[i].lng, mockAddresses[i].address + ': lng : ' + json.results[0].geometry.location.lng + ' received but expected ' + mockAddresses[i].lng);
          }
          
          if (i === 0) {
            // All done.
            done();
          }
        });
        
      })(i);
    }
  });
});
