const { Builder, By, Key, until, Options, logging} = require('selenium-webdriver')
const assert = require('assert')
var request = require('request')
var Page = require('./page-object-en.js');

describe('Maintenance testing', function() {
  this.timeout(10000)
  this.slow(1000)
  let driver
  let testName = String(this.title)
  let session
  let removeVideo = true
  let execName = 'Jenkins (manual)'

  async function step(description, testBody) {
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

  before(async function() {

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
})

  beforeEach(function () {
    this.currentTest.severity = 'normal'
  })
  after(async function() {
    console.log(await driver.manage().logs().getAvailableLogTypes())
    if(driver) await driver.quit()
    let videoPath = 'http://localhost:4444/video/'+session.id_+'.mp4'
    if(removeVideo) await deleteVideo(videoPath)
  })
  afterEach(async function() {
    if(this.currentTest.err) {
    let name = String(this.currentTest.title)
      var res = await driver.takeScreenshot()
      allure.createAttachment(name, new Buffer(res, 'base64'))
      allure.createAttachment('Отчёт', String(this.currentTest.err))
      allure.severity(this.currentTest.severity)
      removeVideo = false
      if(this.currentTest.severity == 'blocker') scriptBlocker = true
    }
    let currentCapabilities = await session.getCapabilities()
    await allure.addEnvironment('platformName: ', String(currentCapabilities.getPlatform()))
    await allure.addEnvironment('OS:','Ubuntu 18.04')
    await allure.addEnvironment('resolution:', '1920x1080')
    await allure.addEnvironment('browserName: ', String(currentCapabilities.getBrowserName()))
    await allure.addEnvironment('browserVersion: ', String(currentCapabilities.getBrowserVersion()))
    await allure.addEnvironment('session id: ', String(session.id_))

    if(process.env.GIT_BRANCH) {
      execName = 'Jenkins (from Git commit)'
      await allure.addEnvironment('git branch: ', process.env.GIT_BRANCH)
      await allure.addEnvironment('commit: ', process.env.GIT_COMMIT)
      await allure.addEnvironment('Author: ', process.env.GIT_COMMITTER_NAME+' ('+process.env.GIT_COMMITTER_EMAIL+')')
    }
})

  describe('Проверка page-object', function(done) {
    Page.header.lang.list
  });
})

function deleteVideo(videoPath) {
  let sleep = 500,
  maxTime = sleep*10;
    let timer = setInterval(function () {
    request({method: 'DELETE', uri: videoPath}, function (error, response, body) {
          if(response.statusCode == 200) {
            clearInterval(timer);
            return true;
          }
          else if(0 >= maxTime) {
            clearInterval(timer);
            throw new Error('Ожидание в  '+sleep*10+'мс превышено.');
          }
          else maxTime-=sleep;
        });
  }, sleep);
};
