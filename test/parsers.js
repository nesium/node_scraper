var scraper = require('../index');

module.exports = {

  test_github_parser: function(assert) {
    scraper('https://github.com/nesium/node_scraper', function(err, url, type, meta) {
      assert.equals('https://github.com/nesium/node_scraper', url);
      assert.equals(meta.repo_name, 'nesium/node_scraper');
      assert.done();
    });
  }
}