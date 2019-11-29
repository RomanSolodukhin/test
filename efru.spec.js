const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
var request = require('request')
var jObject = require('./executor-allure.js');
/*
var jenkinsEnv = {
  jenkins_url: process.env.JENKINS_URL,
  build_url: process.env.BUILD_URL,
  build_number: process.env.BUILD_NUMBER,
  build_display_name: process.env.BUILD_DISPLAY_NAME,
  job_name: process.env.JOB_NAME,
  git_branch: process.env.GIT_BRANCH,
  git_commit: process.env.GIT_COMMIT,
  git_committer_name: process.env.GIT_COMMITTER_NAME,
  git_committer_email: process.env.GIT_COMMITTER_EMAIL
};
console.log(JSON.stringify(jenkinsEnv))
*/
describe('Eternal Fury RU', function() {
  this.timeout(10000)
  this.slow(1000)
  let driver
  let site = "https://www.creagames.com/"
  let MAX_SERVERS = 1
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
    //session.id = await session.getId()
    console.log(session.id_)
})

  beforeEach(function () {

  })
  after(async function() {
    if(driver) await driver.quit()
    if(removeVideo) await RemoveVideo(session.id_)
    /*if(!this.currentTest.err) {

    }*/
    //allure.addEnvironment('log: ', 'http://104.248.2.157:4444/logs/'+session.id_+'.log')
})
  afterEach(async function() {

    let currentCapabilities = await session.getCapabilities()
    await allure.addEnvironment('platformName: ', String(currentCapabilities.getPlatform()))
    await allure.addEnvironment('OS:','Ubuntu 18.04')
    await allure.addEnvironment('resolution:', '1920x1080')
    await allure.addEnvironment('browserName: ', String(currentCapabilities.getBrowserName()))
    await allure.addEnvironment('browserVersion: ', String(currentCapabilities.getBrowserVersion()))
    await allure.addEnvironment('session id: ', String(session.id_))
    //allure.addExecutor('jenkins')
    //console.log('Запуск addExecutor')
    let execName = 'Jenkins (manual)'
    if(process.env.GIT_BRANCH) execName = 'Jenkins (from Git commit)\n'+'branch: '+process.env.GIT_BRANCH+'\ncommit: '+process.env.GIT_COMMIT+'\nAuthor: '+process.env.GIT_COMMITTER_NAME+'('+process.env.GIT_COMMITTER_EMAIL+')'
    var jenkinsEnv = {
      name: execName,
      type: "jenkins",
      url: process.env.JENKINS_URL,
      buildOrder: process.env.BUILD_NUMBER,
      buildName: process.env.JOB_NAME+' '+process.env.BUILD_DISPLAY_NAME,
      buildUrl: process.env.BUILD_URL,
      reportUrl: process.env.GIT_URL,
      reportName: process.env.GIT_BRANCH+'/'+process.env.GIT_COMMIT+'/'+process.env.GIT_COMMITTER_NAME
    };
    var fs = require('fs-extra'),
        path = require('path');
        fs.outputFileSync('./allure-results/executor.json', JSON.stringify(jenkinsEnv));
  })

describe('Авторизация', function(done) {
  let lang
  let setlang = it
  let testSteps = []

  afterEach(async function() {
    for(let i = 0; i < testSteps.length; i++) {
      await allure.createStep(testSteps[i], function() {} )
    }
    testSteps.length = 0
    if(this.currentTest.err) {
    let name = String(this.currentTest.title)
      var res = await driver.takeScreenshot();
      allure.createAttachment(name, new Buffer(res, 'base64'))
      allure.createAttachment('Отчёт', String(this.currentTest.err))
      allure.severity('blocker')
      removeVideo = false
      /*await driver.quit()
      let file = await request('http://104.248.2.157:4444/video/'+session.id_+'.mp4').pipe()
      allure.createAttachment('video', new Buffer(file, 'video/mp4'))*/
      assert.fail('Тест остановлен. '+this.currentTest.err)
    }
  })
  it('Загрузить страницу', async function() {
    await allure.createStep('Открыть страницу: '+site, await driver.get(site))
    testSteps.push('Открыть страницу: '+site)
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
  it('Открыть форму авторизации', async function() {
    await driver.findElement(By.linkText("Вход")).click()
    await driver.wait(until.elementLocated(By.id("loginform-username")))
  })
  it('Ввести учетные данные', async function() {
    await driver.findElement(By.id("loginform-username")).sendKeys("r.solodukhin@creagames.com")
    await driver.findElement(By.id("loginform-password")).sendKeys("123456qQ_WRONG")
  })
  it('Авторизоваться', async function() {
    try {
      await driver.findElement(By.id("loginform-password")).sendKeys(Key.ENTER)
      await driver.wait(until.elementLocated(By.css(".g-header_profile_data_name")),30000)
      await driver.wait(until.elementIsVisible(driver.findElement(By.css(".g-header_profile_data_name"))))
    }
    catch(err) {

      assert.rejects(
        async() => {
          console.log('Обработка ошибки с неправильным паролем') //debug
          let classAttr = await driver.findElement(By.id('loginform-password')).getAttribute('class')
          if(classAttr) console.log('Найден элемент уведомления об ошибке в форме авторизации') //debug
          let titleAttr = await driver.findElement(By.id("loginform-password")).getAttribute('title')
          console.log(message)
          throw new Error({
                    name: 'Ошибка авторизации',
                    message: titleAttr
                  })
        },
        {
          name: 'NoSuchSessionError',
        }
      )
    }
  })
  it('Выбрать игру', async function() {
    await driver.actions().move({origin: driver.findElement(By.css(".has_submenu:nth-child(1)"))}).perform()
    await driver.wait(until.elementLocated(By.linkText('Eternal Fury')))
    await driver.findElement(By.linkText('Eternal Fury')).click()
  })
  it('Загрузить страницу игры', async function() {
    await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Играть бесплатно')]")))
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//a[contains(text(),'Играть бесплатно')]"))))
  })
})

for(i = 1; i <= MAX_SERVERS;i++) {
describe('Сервер '+i, function(done) {
    this.timeout(15000)
    this.slow(4000)
    let serverid = i
    let link = site+"games/ef/server/"+serverid
    let serverselector = "//a[contains(@href, '/games/ef/server/"+serverid+"')]"
    after(async function() {
      await driver.switchTo().defaultContent()
      await driver.navigate().back()
    })
    afterEach(async function() {
      if(this.currentTest.err) {
      let name = String(this.currentTest.title)
        var res = await driver.takeScreenshot();
        allure.createAttachment(name, new Buffer(res, 'base64'))
        allure.createAttachment('Отчёт', String(this.currentTest.err))
        allure.severity('blocker')
        removeVideo = false
        assert.fail('Прошлый тест должен быть выполнен', 'Тест остановлен', this.currentTest.err)
      }
    })
    /*it('Загрузить сервер: '+link, async function() {
      await driver.get(link)
      await driver.wait(until.titleContains('Eternal Fury'))
    })*/
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
      await driver.findElement(By.xpath(serverselector)).click()
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
      await driver.wait(until.elementLocated(By.css('[id*="easyXDM_default"]')),30000)
      await driver.wait(until.elementIsVisible(driver.findElement(By.css('[id*="easyXDM_default"]'))),30000)
      frame = await driver.findElement(By.css('[id*="easyXDM_default"]'))
      await driver.switchTo().frame(frame)
    });
    it('Переключиться в gameFrame', async function() {
      await driver.wait(until.elementLocated(By.id('gameFrame')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('gameFrame'))))
      frame = await driver.findElement(By.id('gameFrame'))
      await driver.switchTo().frame(frame)
    });
    it('Найти canvas', async function() {
      await driver.wait(until.elementLocated(By.id('GameCanvas')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('GameCanvas'))))
    });
    /*it('Игра загружается', async function() {
      await driver.wait(until.elementLocated(By.id('progress')))
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('progress'))))
    });
    it('Загрузка завершена', async function() {
      try {
        await driver.wait(until.elementLocated(By.id('progress')))
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('progress'))))
      }
      catch(error) {
        assert.ok(true)
      }
      assert.ok(true)
    });
    it.skip('Кликнуть по иконке Подземелья', async function() {
      await driver.sleep(10000)
      await driver.actions({bridge: true}).move({x: 1866, y: 850}).press().release().perform()
      await driver.sleep(2000)
    });
    it.skip('Кликнуть по кнопке пополнения счёта', async function() {
      await driver.actions({bridge: true}).move({x: 1557, y: 143}).press().release().perform()
      await driver.wait(until.elementLocated(By.css('.crea_buy_popup_overlay')))
    });*/
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
      await driver.wait(until.elementLocated(By.id('gameHeader')))
      await driver.findElement(By.css('.g-header_profile_data .b-btn')).click()

    })
    })
  }
});

function RemoveVideo(sessionId) {
  let runningTime = 0,
  sleep = 500,
  maxTime = 5000
    let timer = setInterval(function () {
    request({method: 'DELETE', uri: 'http://localhost:4444/video/'+sessionId+'.mp4'}, function (error, response, body) {
          if(response.statusCode == 200) {
            clearInterval(timer)
            return true
          }
        });
    runningTime+=sleep
    if(runningTime > maxTime) {
      clearInterval(timer)
      throw new Error('Ожидание в  '+counter+'мс превышено.')
    }
  }, sleep);
}
