var fs = require('fs');
var path = require('path');
var url = require('url');
var Promise = require('bluebird');

var parserDir = path.join(__dirname, 'parsers');
var parsers = {};
var validFileTypes = ['js'];

fs.readdirSync(parserDir).forEach(function(file) {
  if (file === 'index.js') {
    return;
  }
  
  if (validFileTypes.indexOf(path.extname(file).substring(1)) === -1) {
    return;
  }
  
  var parser = require(path.join(parserDir, file));
  parser.hosts.forEach(function(host) {
    parsers[host] = parser;
  });
});


module.exports = function(theURL) {
  var parsedURL = url.parse(theURL, true);
  
  var host = parsedURL.host.toLowerCase();
  if (host.indexOf('www.') == 0) {
    host = host.substr(4);
  }
  
  var parser = parsers[host];
  
  if (parser == null) {
    parser = parsers['*'];
  }

  return new Promise(function(resolve, reject) {
    parser.handleURL(parsedURL, function(err, url, type, meta) {
      if (err) {
        reject(err);
      } else {
        resolve({
          url: url,
          type: type,
          meta: meta
        });
      }
    });
  });
};