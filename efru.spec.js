const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
var request = require('request')
require('jest-image-snapshot')
require('jest')

describe('Eternal Fury RU', function() {
  this.timeout(10000)
  this.slow(1000)
  let driver
  let site = "https://www.creagames.com/"
  let MAX_SERVERS = 0
  let testName = String(this.title)
  let session
  let removeVideo = true

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
    .setAlertBehavior()
    .build();
    await driver.manage().window().setRect(1920, 1080)
    await driver.manage().window().maximize()
    session = await driver.getSession()
    console.log(session.id_)
})

  beforeEach(function () {
    this.currentTest.severity = 'normal'
  })
  after(async function() {
    if(driver) await driver.quit()
    if(removeVideo) await RemoveVideo(session.id_)
})
  afterEach(async function() {
    let currentCapabilities = await session.getCapabilities()
    await allure.addEnvironment('platformName: ', String(currentCapabilities.getPlatform()))
    await allure.addEnvironment('OS:','Ubuntu 18.04')
    await allure.addEnvironment('resolution:', '1920x1080')
    await allure.addEnvironment('browserName: ', String(currentCapabilities.getBrowserName()))
    await allure.addEnvironment('browserVersion: ', String(currentCapabilities.getBrowserVersion()))
    await allure.addEnvironment('session id: ', String(session.id_))
    let execName = 'Jenkins (manual)'
    if(process.env.GIT_BRANCH) {
      execName = 'Jenkins (from Git commit)'
      await allure.addEnvironment('git branch: ', process.env.GIT_BRANCH)
      await allure.addEnvironment('commit: ', process.env.GIT_COMMIT)
      await allure.addEnvironment('Author: ', process.env.GIT_COMMITTER_NAME+' ('+process.env.GIT_COMMITTER_EMAIL+')')
    }
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
let scriptBlocker = false

describe('Авторизация', function(done) {
  let lang
  let setlang = it
  let testSteps = []

  beforeEach(function() {
    if(scriptBlocker) this.skip()
  })

  afterEach(async function() {
    testSteps.length = 0
    if(this.currentTest.err) {
    let name = String(this.currentTest.title)
      var res = await driver.takeScreenshot()
      allure.createAttachment(name, new Buffer(res, 'base64'))
      allure.createAttachment('Отчёт', String(this.currentTest.err))
      allure.severity(this.currentTest.severity)
      removeVideo = false
      if(this.currentTest.severity == 'blocker') scriptBlocker = true
    }
  })
  let image
  it('Загрузить страницу', async function() {
    this.test.severity = 'blocker'
    await allure.createStep('Открыть страницу: '+site, await driver.get(site))
    testSteps.push('Открыть страницу: '+site)
  })
  it('Проверка языка', async function() {
    image = await driver.takeScreenshot()
    lang = await driver.wait(until.elementLocated(By.xpath("/html/body/header/div/div/div/a/b"))).getAttribute('class')
    if(lang == 'icon icon_ru') setlang = it.skip
  })
  setlang('Найти переключатель языков', async function() {
    await driver.wait(until.elementLocated(By.css(".lang-list")),30000)
    testSteps.push('Найти элемент css=.lang-list')
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(".lang-list"))))
    testSteps.push('Проверить видимость элемента css=.lang-list')
  })
  setlang('Открыть меню выбора языков', async function() {
    await driver.actions().move({origin: driver.findElement(By.css(".lang-list"))}).perform()
    await driver.wait(until.elementLocated(By.linkText("Русский")))
    await driver.wait(until.elementIsVisible(driver.findElement(By.linkText("Русский"))))
  })
  setlang('Сменить язык', async function() {
    await driver.findElement(By.linkText("Русский")).click()
    await driver.wait(until.elementLocated(By.linkText("Вход")),30000) ////a[contains(.,'Вход')]
    await driver.wait(until.elementIsVisible(driver.findElement(By.linkText("Вход"))))
  })
  it('Авторизация', function() {
    this.test.severity = 'blocker'
    function step(description, fnBody) {
      let newStep = new Promise(function (resolve, reject) {
        let fnResult = allure.createStep(description, fnBody)
          if(fnResult) {
            console.log(fnResult)
            resolve(fnResult)
          }
        })
    newStep.then(function(value) {
      console.log('Промис передал значение')
      return value()
    })
  }
      step('Открыть форму авторизации', async() => {
        await driver.findElement(By.linkText("Вход")).click()
        await driver.wait(until.elementLocated(By.id("loginModal")))
        await driver.wait(until.elementIsVisible(driver.findElement(By.id("loginModal"))))
      });
      step('Ввести логин', async() => {
        await driver.wait(until.elementLocated(By.id("loginform-username")))
        await driver.findElement(By.id("loginform-username")).sendKeys("r.solodukhin@creagames.com")
      });
      step('Ввести пароль', async function() {
        await driver.findElement(By.id("loginform-password")).sendKeys("123456qQ")
      });
      step('Отправить форму', async function() {
        await driver.findElement(By.id("loginform-password")).sendKeys(Key.ENTER)
      });
      step('Авторизация успешна', async function() {
        await driver.wait(until.elementLocated(By.css(".g-header_profile_data_name")),30000)
        await driver.wait(until.elementIsVisible(driver.findElement(By.css(".g-header_profile_data_name"))))
      });
  })

  it('Выбрать игру', async function() {
    //expect(image).toMatchImageSnapshot()
    await driver.actions().move({origin: driver.findElement(By.css(".has_submenu:nth-child(1)"))}).perform()
    await driver.wait(until.elementLocated(By.linkText('Eternal Fury')))
    await driver.findElement(By.linkText('Eternal Fury')).click()
  })
  it('Открыть страницу игры', async function() {
    await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Играть бесплатно')]")))
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//a[contains(text(),'Играть бесплатно')]"))))
  })
})

for(i = 1; i <= MAX_SERVERS;i++) {
describe('Сервер '+i, function(done) {
    this.timeout(15000)
    this.slow(4000)
    let scriptSkip = scriptBlocker
    let serverid = i
    let link = site+"games/ef/server/"+serverid
    let serverselector = "//a[contains(@href, '/games/ef/server/"+serverid+"')]"
    after(async function() {
      await driver.switchTo().defaultContent()
      await driver.navigate().back()
      scriptSkip = false
    })
    beforeEach(function() {
      if(scriptBlocker) this.skip()
    })
    afterEach(async function() {
      /*let consoleDTP = await driver.sendDevToolsCommand('Console.messageAdded')
      allure.createAttachment('DevTools console', String(consoleDTP))*/
      if(this.currentTest.err) {
      let name = String(this.currentTest.title)
        var res = await driver.takeScreenshot();
        allure.createAttachment(name, new Buffer(res, 'base64'))
        allure.createAttachment('Отчёт', String(this.currentTest.err))
        removeVideo = false
        if(this.currentTest.title == 'Выбрать сервер' || this.currentTest.title == 'Переключиться в XDM') scriptSkip = true
      }
    })
    it('Открыть окно выбора серверов', async function() {
      try {
        await driver.findElement(By.xpath("//a[contains(text(),'Играть бесплатно')]")).click()
        await driver.wait(until.elementLocated(By.xpath("//a[contains(@href, '/games/ef/server/1')]")))
        await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//a[contains(@href, '/games/ef/server/1')]"))))
      }
      catch(err) {
        assert.fail(err)
      }
    });
    it('Выбрать сервер', async function() {
      allure.severity('blocker')
      await driver.findElement(By.xpath(serverselector)).click()
      let pageTitle = await driver.getTitle()
      assert.notEqual('Bad request (#400)', pageTitle, pageTitle)
      await driver.wait(until.titleContains('Eternal Fury'))
    });
    it('Проверка загрузки container', async function() {
      allure.severity('blocker')
      await driver.wait(until.elementLocated(By.id('container')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('container'))))
    });
    it('Проверка gameHeader (creabar)', async function() {
      await driver.wait(until.elementLocated(By.id('gameHeader')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('gameHeader'))))
    });
    it('Скрыть gameHeader', async function() {
      await driver.switchTo().defaultContent()
      await driver.findElement(By.id("hide-menu")).click()
      try {
        await driver.wait(until.elementLocated(By.id('gameHeader')))
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('gameHeader'))))
      }
      catch(error) {
        assert.ok(true)
      }
    });
    it('Переключиться в XDM', async function() {
      allure.severity('blocker')
      await driver.wait(until.elementLocated(By.css('[id*="easyXDM_default"]')),30000)
      await driver.wait(until.elementIsVisible(driver.findElement(By.css('[id*="easyXDM_default"]'))),30000)
      frame = await driver.findElement(By.css('[id*="easyXDM_default"]'))
      await driver.switchTo().frame(frame)
    });
    it('Переключиться в gameFrame', async function() {
      allure.severity('high')
      await driver.wait(until.elementLocated(By.id('gameFrame')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('gameFrame'))))
      frame = await driver.findElement(By.id('gameFrame'))
      await driver.switchTo().frame(frame)
    });
    it('Найти canvas', async function() {
      allure.severity('high')
      await driver.wait(until.elementLocated(By.id('GameCanvas')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('GameCanvas'))))
    });
    it('Вернуться в основной frame', async function() {
      await driver.switchTo().defaultContent()
      await driver.wait(until.elementLocated(By.id('container')))
    });
    it('Открыть gameHeader', async function() {
      await driver.findElement(By.id("hide-menu")).click()
      await driver.wait(until.elementLocated(By.id('gameHeader')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('gameHeader'))))
    });
    it('Открыть окно пополнения', async function() {
      allure.severity('high')
      await driver.wait(until.elementLocated(By.id('gameHeader')))
      await driver.findElement(By.css('.g-header_profile_data .b-btn')).click()
    })
    })
  }
});

function RemoveVideo(sessionId) {
  let sleep = 500,
  maxTime = sleep*10;
    let timer = setInterval(function () {
    request({method: 'DELETE', uri: 'http://localhost:4444/video/'+sessionId+'.mp4'}, function (error, response, body) {
          if(response.statusCode == 200) {
            clearInterval(timer);
            return true;
          }
          else if(0 >= maxTime) {
            clearInterval(timer);
            throw new Error('Ожидание в  '+counter+'мс превышено.');
          }
          else maxTime-=sleep;
        });
  }, sleep);
};
