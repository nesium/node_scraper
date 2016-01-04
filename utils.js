var Promise = require("bluebird");
var fs = require("fs");
var request = require('request');

module.exports.loadURL = function(options) {
  if (options.url.indexOf('file://') == 0) {
    return new Promise(function(resolve, reject) {
      fs.readFile(options.url.substr('file://'.length), 'utf8', function(err, data) {
        if (err != null) {
          reject(err);
        } else {
          resolve([{statusCode: 200, headers: {}}, data.toString()]);
        }
      });
    });
  }

  return new Promise(function(resolve, reject) {
    request(options, function (err, response, body) {
      if (err != null) {
        reject(err);
      }
      resolve([response, body]);
    });
  });

  return request(options);
};