var cheerio = require('cheerio');
var request = require('request');

module.exports.hosts = ['*'];

module.exports.handleURL = function(url, cb) {
  var options = {
    url: url.href, 
    headers: {
      'User-Agent': 'Shoebox v1.0', 
      'Content-Type': 'text/html; charset=UTF-8', 
      'Accept-encoding': 'identity'
    }
  };
  
  request(options, function (err, response, body) {
    if (err) {
      return cb(err);
    }
    
    console.log('Status: ' + response.statusCode);
    console.log(response.headers);
    
    var $ = cheerio.load(body);
    var $meta = $('head meta');
    
    var ogData = {};
    ogData.images = [];
    var data = {};
    data.images = [];
    
    var foundOGData = false;
    
    function absImgURL(imgURL) {
      if (imgURL.indexOf('http') == 0) {
        return imgURL;
      }
      
      if (imgURL.indexOf('/') == 0) {
        return url.protocol + '//' + url.host + imgURL;
      } else {
        return url.href + '/' + imgURL;
      }
    }
    
    $meta.each(function(index, value) {
      var $meta = $(value);
      var name = $meta.attr('name');
      var content = $meta.attr('content');
      var property = $meta.attr('property');
      
      if (property && property.indexOf('og:') == 0) {
        foundOGData = true;
        
        if (property == 'og:image') {
          ogData.images.push(absImgURL(content));
        } else if (property == 'og:description') {
          ogData.description = content;
        } else if (property == 'og:title') {
          ogData.title = content;
        } else if (property == 'og:site_name') {
          ogData.siteName = content;
        }
      } else {
        if (name == 'title') {
          data.title = content;
        } else if (name == 'description') {
          data.description = content;
        }
      }
    });
    
    if (!foundOGData) {
      data.title = $('head').find('title').first().text().trim();
      
      var $img = $('body img');
      $img.each(function(index, value) {
        data.images.push(absImgURL($(value).attr('src')));
      });
    }
    
    cb(null, url.href, 'open_graph', foundOGData ? ogData : data);
  });
};