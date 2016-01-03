var cheerio = require('cheerio');
var request = require('request');

module.exports.hosts = ['weeatfine.com'];

module.exports.handleURL = function(url, cb) {
  var options = {
    url: url.href, 
    headers: {
      'User-Agent': 'Shoebox v1.0'
    }
  };
  
  request(options, function (err, response, body) {
    if (err) {
      return cb(err);
    }
    
    var $ = cheerio.load(body);
    var $content = $('body div.content');
    var $ps = $content.find('p');
    var $divs = $content.find('div');
    
    var title = $content.find('h1').first().text();
    var steps = [];
    var ingredients = findIngredientsInNodes($ps, $);
    
    if (ingredients.length == 0) {
      ingredients = findIngredientsInNodes($divs, $);
      
      $content.children().each(function(index, child) {
        if (child.name != 'div' && child.name != 'p') {
          return true;
        }
        
        var $child = $(child);
        
        if (child.name == 'p' && $child.attr('class') == 'p-comment') {
          return false;
        }
        
        var text = $child.text().trim();
        if (text.length > 0 && text.indexOf('|') == -1) {
          steps.push(text);
        }
      });
    } else {
      $content.children().each(function(index, child) {
        $(child).remove();
      });
      steps.push($content.text().trim());
    }
    
    cb(null, url.href, 'recipe', {title: title, ingredients: ingredients, steps: steps});
  });
};


function findIngredientsInNodes($nodes, $) {
  var ingredients = [];
  
  $nodes.each(function(index, node) {
    var $node = $(node);
    
    if ($node.attr('class') != null) {
      return true;
    }
    
    var text = $node.text();
    
    if (text.indexOf('|') != -1) {
      var components = text.split('|');
      components.forEach(function(component) {
        component = component.trim();
        if (component.length > 0) {
          ingredients.push(component);
        }
      });
      return false;
    }
  });
  
  return ingredients;
}