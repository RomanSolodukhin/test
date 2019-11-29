'use strict';
var fs = require('fs-extra'),
    path = require('path');

exports = {
  Executor: function(targetDir, execData) {
    fs.outputJsonSync(path.join(targetDir, 'executor.json'), execData);
  }
};
