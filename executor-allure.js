'use strict';
var fs = require('fs-extra'),
    path = require('path');

exports = {
  Executor: function(targetDir, execData) {
    fs.outputFileSync(path.join(targetDir, 'executor.json'), JSON.stringify(execData));
  }
};
