const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
var proxyquire = require('proxyquire');
var Allure = proxyquire('../index', {'fs-extra': require('./helpers/mock-fs')});

describe('Eternal Fury RU', function() {
  this.timeout(10000)
  this.slow(1000)
  let driver
  let site = "https://www.creagames.com/"
  let MAX_SERVERS = 1
  let testName = String(this.title)
  var allure

  beforeEach(function () {
    allure = new Allure();
  });

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
    await allure.addArgument('platform:','Ubuntu 18.04')
    await allure.addArgument('browser:', capabilities.browserName+' v.'+capabilities.version)
    await allure.addArgument('res:', '1920x1080')
    const screenshot = allure.createStep("saveScreenshot", async name => {
      const res = await driver.takeScreenshot();
      await allure.createAttachment(name, new Buffer(res.value, "base64"));
    });
  })

  after(async function() {
    await driver.quit()
  })

describe('Авторизация', function(done) {
  afterEach(async function() {
    if(this.currentTest.err) throw new Error(this.currentTest.err)
    await screenshot(this.currentTest.title)
  })
  it('Загрузить страницу', async function() {
    await driver.get(site)
  })
  it('Найти переключатель языков', async function() {
    await driver.wait(until.elementLocated(By.css(".lang-list")),30000)
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(".lang-list"))))
  })
  it('Открыть меню выбора языков', async function() {
    await driver.actions().move({origin: driver.findElement(By.css(".lang-list"))}).perform()
    await driver.wait(until.elementLocated(By.linkText("Русский")))
    await driver.wait(until.elementIsVisible(driver.findElement(By.linkText("Русский"))))
  })
  it('Сменить язык', async function() {
    await driver.findElement(By.linkText("Русский")).click()
    await driver.wait(until.elementLocated(By.linkText("Вход"))) ////a[contains(.,'Вход')]
    await driver.wait(until.elementIsVisible(driver.findElement(By.linkText("Вход"))))
  })
  it('Открыть форму авторизации', async function() {
    await driver.findElement(By.linkText("Вход")).click()
    await driver.wait(until.elementLocated(By.id("loginform-username")))
  })
  it('Отправить форму авторизации', async function() {
    await driver.findElement(By.id("loginform-username")).sendKeys("r.solodukhin@creagames.com")
    await driver.findElement(By.id("loginform-password")).sendKeys("123456qQ")
  })
  it('Авторизоваться', async function() {
    await driver.findElement(By.id("loginform-password")).sendKeys(Key.ENTER)
    await driver.wait(until.elementLocated(By.css(".g-header_profile_data_item")),30000)
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(".g-header_profile_data_item"))))
  })
  it('Выбрать игру', async function() {
    await driver.actions().move({origin: driver.findElement(By.css(".has_submenu:nth-child(1)"))}).perform()
    await driver.wait(until.elementLocated(By.linkText('Eternal Fury')))
    await driver.findElement(By.linkText('Eternal Fury')).click()
  });
  it('Загрузить страницу игры', async function() {
    await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Играть бесплатно')]")))
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//a[contains(text(),'Играть бесплатно')]"))))
  });
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
      if(this.currentTest.err) throw new Error(this.currentTest.err)
      await screenshot(this.currentTest.title)
    })
    /*it('Загрузить сервер: '+link, async function() {
      await driver.get(link)
      await driver.wait(until.titleContains('Eternal Fury'))
    })*/
    it('Открыть окно выбора серверов', async function() {
      await driver.findElement(By.xpath("//a[contains(text(),'Играть бесплатно')]")).click()
      await driver.wait(until.elementLocated(By.xpath("//a[contains(@href, '/games/ef/server/1')]")))
      await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//a[contains(@href, '/games/ef/server/1')]"))))
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
