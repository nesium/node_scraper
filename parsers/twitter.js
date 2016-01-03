module.exports.hosts = ['twitter.com'];

module.exports.handleURL = function(url, cb) {
  cb(null, url.href, 'tweet', {});
};