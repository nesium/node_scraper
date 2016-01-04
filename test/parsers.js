var scraper = require('../index');
var path = require('path');

function testFileURL(filename) {
  return "file://" + path.join(__dirname, 'test_files', filename);
}

module.exports = {

  test_github_parser: function(assert) {
    scraper('https://github.com/nesium/node_scraper')
      .then(function(result) {
        assert.equals('https://github.com/nesium/node_scraper', result.url);
        assert.equals(result.meta.repo_name, 'nesium/node_scraper');
        assert.done();
      });
  },

  test_all_og_tags: function(assert) {
    scraper(testFileURL("all_og.html"))
      .then(function(result) {
        assert.equals("The Title", result.meta.title);
        assert.done();
      });
  },

  test_remote_url: function(assert) {
    scraper('http://www.google.com')
      .then(function(result) {
        assert.equals("Google", result.meta.title);
        assert.done();
      });
  },

  test_some_og_tags: function(assert) {
    scraper(testFileURL("some_og.html"))
      .then(function(result) {
        // FIXME
        //assert.equals("The Title", result.meta.title);
        assert.done();
      });
  }
}