/*async function step(description, testBody) {
  await allure.createStep(description, async() => {
    try {
      if(typeof testBody != 'function') throw new Error('Error: is not a function')
      await testBody()
      assert.ok(true)
    }
    catch(err) {
      allure.createAttachment('Отчёт', String(err))
      assert.fail('Error: '+description+' — не удалось. ')
    }
  })();
}


var prefs = await new logging.Preferences();
prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
prefs.setLevel(logging.Type.DRIVER, logging.Level.ALL);
prefs.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);

var capabilities = {
  browserName: 'chrome',
  version: '78.0',
  enableVNC: true,
  enableLog: true,
  name: testName,
  enableVideo: true
}

driver = await new Builder()
.usingServer('http://localhost:4444/wd/hub')
.withCapabilities(capabilities)
.setLoggingPrefs(prefs)
.setAlertBehavior()
.build();
await driver.manage().window().setRect(1920, 1080)
await driver.manage().window().maximize()
session = await driver.getSession()
console.log(session.id_)
try {
  jenkinsEnv = {
    name: execName,
    type: "jenkins",
    url: process.env.JENKINS_URL,
    buildOrder: process.env.BUILD_NUMBER,
    buildName: process.env.JOB_NAME+' '+process.env.BUILD_DISPLAY_NAME,
    buildUrl: process.env.BUILD_URL,
    reportName: process.env.GIT_BRANCH+'/'+process.env.GIT_COMMIT+'/'+process.env.GIT_COMMITTER_NAME,
    reportUrl: process.env.GIT_URL
};
  allure.createExecutor(jenkinsEnv)
}
catch(err) {
  console.warn(err)
}
*/
