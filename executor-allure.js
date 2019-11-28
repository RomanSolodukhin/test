'use strict';
var fs = require('fs-extra'),
    path = require('path'),

exports = {
  Executor: function(targetDir, execData) {
    console.log('executor-allure вызван')
    if(execData.jenkins_url) {
      fs.outputFileSync(path.join(targetDir, 'executor.json'), JSON.stringify(execData));
    }
  }
};
