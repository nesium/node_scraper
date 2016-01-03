module.exports.hosts = ['youtube.com'];

module.exports.handleURL = function(url, cb) {
  cb(null, url.query['v'], 'youtube', {});
};