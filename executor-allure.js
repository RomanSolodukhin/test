'use strict';
var fs = require('fs-extra'),
    path = require('path'),
    jenkinsEnv = {
      name: 'Jenkins',
      type: "jenkins",
      url: process.env.JENKINS_URL,
      buildOrder: process.env.BUILD_NUMBER,
      buildName: process.env.JOB_NAME+' '+process.env.BUILD_DISPLAY_NAME,
      buildUrl: process.env.BUILD_URL,
      reportName: process.env.GIT_BRANCH+'/'+process.env.GIT_COMMIT+'/'+process.env.GIT_COMMITTER_NAME,
      reportUrl: process.env.GIT_URL
  };
module.exports = {
  addExecutor: function(targetDir, execName) {
    jenkinsEnv.name = execName
    fs.outputFileSync(path.join(targetDir, 'executor.json'), JSON.stringify(jenkinsEnv));
  }
};
