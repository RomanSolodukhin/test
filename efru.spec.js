// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
var Xvfb = require('xvfb')
const fs = require('fs');

describe('Eternal Fury RU', function() {
  this.timeout(30000)
  let driver
  let vars
  let xvfb
  let site = "https://creagames.com/ru"
  before(async function() {
    var capabilities = {
      browserName: 'chrome',
      version: '76.0',
      enableVNC: true,
      enableVideo: false
    };
    driver = await new Builder()
    .usingServer('http://localhost:4444/wd/hub')
    .withCapabilities(capabilities)
    .setAlertBehavior()
    .build();
    vars = {}
  })
  after(async function() {
    await shot('screen finish', driver)
    await driver.quit()
  })
  afterEach(function() {
    //shot(String(this.currentTest.title)+'. Отчёт', driver)
  })

it('Авторизация', async function () {
  try {
    await driver.get(site)
    await driver.manage().window().setRect(1920,1080)
    await driver.manage().window().maximize()
    await driver.wait(until.elementLocated(By.linkText("Вход"))) ////a[contains(.,'Вход')]
    await driver.wait(until.elementIsVisible(driver.findElement(By.linkText("Вход"))))
    await driver.findElement(By.linkText("Вход")).click()
    await driver.wait(until.elementLocated(By.id("loginform-username")))
    await driver.wait(until.elementIsVisible(driver.findElement(By.id("loginform-username"))))
    await driver.findElement(By.id("loginform-username")).sendKeys("r.solodukhin@creagames.com")
    await driver.findElement(By.id("loginform-password")).sendKeys("123456qQ")
    await driver.findElement(By.id("loginform-password")).sendKeys(Key.ENTER)
    await driver.wait(until.elementLocated(By.css(".g-header_profile_data_name")))
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(".g-header_profile_data_name"))))
    assert.ok(true)
  }
  catch(error) {
      assert.fail(error)
  }
  return
})
describe('Серверы', function() {
  let MAX_SERVERS = 10
  for(i = 1; i <= MAX_SERVERS; i++) {
    let it_ = i > 8 ? it : it.skip
    let link = site+"games/ef/server/"+i
    it_('s'+i, async function() {
      try {
        await driver.wait(until.elementLocated(By.css(".g-header_profile_data_name")))
        await driver.get(link)
        await driver.wait(until.elementLocated(By.id('container')))
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('container'))),10000)
        await driver.wait(until.elementLocated(By.css('[id*="easyXDM_default"]')))
        let frame = await driver.findElement(By.css('[id*="easyXDM_default"]'))
        await driver.switchTo().frame(frame)
        frame = await driver.findElement(By.id('gameFrame'))
        await driver.switchTo().frame(frame)
        await driver.wait(until.elementLocated(By.id('GameCanvas')),10000)
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('GameCanvas'))),10000)
        await driver.findElement(By.id('GameCanvas')).click()
        assert.ok(true)
      }
      catch(error) {
        /*обработка ошибок
        if(error.includes('waiting'))
        if(error.includes('located'))*/
        if(await driver.wait(until.titleContains('404'))) {
          console.log(error)
          assert.fail('Страница не найдена: "'+driver.getTitle()+'"')
        }
        else if(await driver.wait(until.elementIsVisible(driver.findElement(By.id("loginform-username"))))){
          console.log(error)
          assert.fail('Авторизация не была выполнена.')
        }
        else assert.fail(error)
      }
      return
      })
  }
})

});

async function shot(name, target) {
	target ? target : target = driver; //default param
	try{
		var fileName = String(name)+'.png';
		fs.writeFile(fileName, await target.takeScreenshot(), 'base64',
    function(){/*console.log("*** Screenshot "+fileName+' ***')*/});
		return true;
	}
	catch(error){
		throw new Error(error);
	}
};
