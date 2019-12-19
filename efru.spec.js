const { Builder, By, Key, until, Options, logging} = require('selenium-webdriver')
const assert = require('assert')
var request = require('request')
require('jest-image-snapshot')
require('jest')

describe('Eternal Fury RU', function() {
  this.timeout(10000)
  this.slow(1000)
  let driver
  let site = "https://www.creagames.com/"
  let MAX_SERVERS = 1
  let testName = String(this.title)
  let session
  let removeVideo = true
  let scriptBlocker = false
  async function step(description, fnBody) {
    await allure.createStep(description, async() => {
      try {
        await fnBody()
        assert.ok(true)
      }
      catch(err) {
        console.log('ошибка в шаге')
        allure.createAttachment('Отчёт', String(err))
        assert.fail('Error: '+description+' — не удалось. ')
      }
    })();
  }

  before(async function() {
    var prefs = await new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    prefs.setLevel(logging.Type.DRIVER, logging.Level.ALL);
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
})

  beforeEach(function () {
    this.currentTest.severity = 'normal'
  })
  after(async function() {
    console.log(await driver.manage().logs().getAvailableLogTypes())
    if(driver) await driver.quit()
    let videoPath = 'http://localhost:4444/video/'+session.id_+'.mp4'
    if(removeVideo) await deleteVideo(videoPath)
    else {
      /*let videoFile = new Buffer(await getRemoteVideo(videoPath), 'base64')
      await allure.createStep(' /// Aerokube. Selenoid /// Видео сеанса', allure.createAttachment(session.id_, videoFile))*/
    }
  })
  afterEach(async function() {
    var attachLog = []
    await driver.executeScript(`console.info('test INFO level')`)
    await driver.manage().logs().get(logging.Type.BROWSER)
    .then(function(entries) {
      entries.forEach(function(entry) {
        attachLog.push(entry.level.name, entry.message, '<br>')
      });
      allure.description(attachLog)
      allure.createAttachment('console browser', String(attachLog), 'text/plain')
    });
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

describe('Авторизация', function(done) {
  let lang
  let setlang = it
  let testSteps = []

  beforeEach(function() {
    if(scriptBlocker) this.skip()
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
  it('Авторизация', async function() {
    this.test.severity = 'blocker'
      await step('Кликнуть по кнопке Входа', async function() {
        await driver.findElement(By.linkText("Вход")).click()
      });
      await step('Открыто окно авторизации', async function() {
        await driver.wait(until.elementLocated(By.id("loginModal")))
        await driver.wait(until.elementIsVisible(driver.findElement(By.id("loginModal"))))
      });
      await step('Отображается поле ввода логина', async function() {
        await driver.wait(until.elementLocated(By.id("loginform-username")))
        await driver.wait(until.elementIsVisible(driver.findElement(By.id("loginform-username"))))
      });
      await step('Ввести логин', async function() {
        await driver.findElement(By.id("loginform-username")).sendKeys("r.solodukhin@creagames.com")
      });
      await step('Ввести пароль', async function() {
        await driver.findElement(By.id("loginform-password")).sendKeys("123456qQ")
      });
      await step('Отправить форму', async function() {
        await driver.findElement(By.id("loginform-password")).sendKeys(Key.ENTER)
      });
      await step('Авторизация успешна', async function() {
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
      allure.severity('critical')
      await driver.wait(until.elementLocated(By.id('gameFrame')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('gameFrame'))))
      frame = await driver.findElement(By.id('gameFrame'))
      await driver.switchTo().frame(frame)
    });
    it('Найти canvas', async function() {
      allure.severity('critical')
      await driver.wait(until.elementLocated(By.id('GameCanvas')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('GameCanvas'))))
    });
    it('Вернуться в основной frame', async function() {
      await driver.switchTo().defaultContent()
      await driver.wait(until.elementLocated(By.id('container')))
      var res = await driver.takeScreenshot()
      allure.createAttachment('Скриншот', new Buffer(res, 'base64'))
    });
    it('Открыть gameHeader', async function() {
      await driver.findElement(By.id("hide-menu")).click()
      await driver.wait(until.elementLocated(By.id('gameHeader')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('gameHeader'))))
      var res = await driver.takeScreenshot()
      allure.createAttachment('Скриншот', new Buffer(res, 'base64'))
    });
    it('Открыть окно пополнения', async function() {
      allure.severity('critical')
      await driver.wait(until.elementLocated(By.id('gameHeader')))
      await driver.findElement(By.css('.g-header_profile_data .b-btn')).click()
      var res = await driver.takeScreenshot()
      allure.createAttachment('Скриншот', new Buffer(res, 'base64'))
      var attachLog = []
      await driver.manage().logs().get(logging.Type.DRIVER)
      .then(function(entries) {
        entries.forEach(function(entry) {
          attachLog.push(entry.level.name, entry.message)
          if(String(entry.message).includes('Create unpacker')) {
            if(String(entry.messge).includes('9bsSZKahhGL7VRphR+IJx2')) {
              allure.createAttachment('Найдена команда', String(entry.message), 'text/plain')
            }
          }
        });
        allure.createAttachment('DRIVER', String(attachLog), 'text/plain')
      });
    })
    })
  }
});

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
/*
function getRemoteVideo(videoPath) {
  let sleep = 500,
  videoFile,
  maxTime = sleep*10;
    let timer = setInterval(function () {
      request
        .get(videoPath)
        .on('response', function(response) {
          if(response.statusCode == 200) {
            clearInterval(timer);
          }
          else if(0 >= maxTime) {
            clearInterval(timer);
            throw new Error('Ожидание в  '+sleep*10+'мс превышено.');
          }
          else maxTime-=sleep;
        })
        .pipe(videoFile)
  }, sleep);
};
*/
