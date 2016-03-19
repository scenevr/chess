var fs = require('fs');

/**
 * This loader is designed to be passed to SceneDOM.setLoader(). It will use Node's fs library to load XML
 * files from disk.
 */
module.exports = {
  syncLoader: function (filename) {
    return fs.readFileSync(filename, 'utf8');
  },

  asyncLoader: function (filename, callback) {
    fs.readFile(filename, 'utf8', callback);
  }
};
