'use strict';
var fs = require('fs-extra'),
    path = require('path'),


module.exports = {
  Executor: function(targetDir, execData) {
    if(exec.jenkins_url) {
      fs.outputFileSync(path.join(targetDir, 'executor.json'), JSON.stringify(execData));
    }
  }
};
