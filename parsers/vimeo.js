module.exports.hosts = ['vimeo.com'];

module.exports.handleURL = function(url, cb) {
  var paths = url.path.split('/');
  cb(null, paths[paths.length - 1], 'vimeo', {});
};