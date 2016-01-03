var request = require('request');

module.exports.hosts = ['github.com'];

module.exports.handleURL = function(url, cb) {
  var paths = url.path.split('/');
  
  var username = paths[1];
  var repo = paths[2];
  
  var options = {
    url: 'https://api.github.com/repos/' + username + '/' + repo, 
    headers: {
      'User-Agent': 'Shoebox v1.0'
    }
  };
  
  request(options, function (err, response, body) {
    if (err) {
      return cb(err);
    }
    
    var json = JSON.parse(body);
    var meta = {
      repo_name: json['full_name'], 
      repo_description: json['description'], 
      repo_forks_count: json['forks_count'], 
      repo_stargazers_count: json['stargazers_count'], 
      repo_watchers_count: json['watchers_count'], 
      repo_language: json['language']
    };
    
    cb(null, json['html_url'], 'github_repo', meta);
  });
};