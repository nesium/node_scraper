var scraper = require('../index');

module.exports = {

  test_github_parser: function(assert) {
    scraper('https://github.com/nesium/node_scraper')
      .then(function(result) {
        assert.equals('https://github.com/nesium/node_scraper', result.url);
        assert.equals(result.meta.repo_name, 'nesium/node_scraper');
        assert.done();
      })
      .catch(function(err) {
        assert.ifError(err);
        assert.done();
      });
  }
}