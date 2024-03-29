// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
var Xvfb = require('xvfb')
const fs = require('fs');

describe('Rise of Angels — проверка', function() {
  this.timeout(30000)
  let driver
  let vars
  let xvfb
  let site = "https://creagames.com/en"
  before(async function() {
    var capabilities = {
      browserName: 'firefox',
      version: '70.0',
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
    shot(String(this.currentTest.title)+'. Отчёт', driver)
  })

it('Открыть портал', async function () {
  await driver.get(site)
  await driver.manage().window().setRect(1920,1080)
  await driver.manage().window().maximize()
})
it('Авторизоваться', async function () {
  await driver.wait(until.elementLocated(By.xpath("//*[.='Login']")),30001)
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//*[.='Login']"))),30001)
  await driver.findElement(By.xpath("//*[.='Login']")).click()
  await driver.wait(until.elementLocated(By.name("username")),30002)
  await driver.wait(until.elementIsVisible(driver.findElement(By.name("username"))),30001)
  await driver.findElement(By.name("username")).sendKeys("r.solodukhin@creagames.com")
  await driver.findElement(By.name("password")).sendKeys("123456qQ")
  await driver.findElement(By.name("password")).sendKeys(Key.ENTER)
  /*await driver.wait(until.elementLocated(By.css(".g-header_profile_data_name")),30003)
  await driver.wait(until.elementIsVisible(driver.findElement(By.css(".g-header_profile_data_name"))),30001)*/
})
describe('Проверка серверов', function() {
  let MAX_SERVERS = 2
  for(i = 1; i <= MAX_SERVERS; i++) {
    let link = site+"/game/roa/S"+i
    it('s'+i, async function() {
      try {
        await driver.get(link)
        await driver.wait(until.elementLocated(By.id('container')),10000)
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('container'))),10000)
        console.log('t{найден контейнер с игрой}')
      }
      catch(error ){
        await FlashEnable(driver, driver.getCurrentUrl())
        await driver.get(link)
        await driver.wait(until.elementLocated(By.id('flash_instruction_close')),30000)
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('flash_instruction_close'))),30000)
        await driver.findElement(By.id('flash_instruction_close')).click()
        await driver.navigate().refresh()
        await driver.wait(until.elementLocated(By.id('container')),10000)
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('container'))),10000)
        console.log('c{найден контейнер}')
      }
      finally{
        //await driver.switchTo().frame(0)
        await driver.wait(until.elementLocated(By.xpath('//*[@id="index"]')),30000)
        await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//*[@id="index"]'))),30001)
        await driver.findElement(By.xpath('//*[@id="index"]')).click()
      }
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

async function FlashEnable(driver, fUrl) {
  try{
    await driver.get("chrome://settings/content/siteDetails?site="+fUrl)
    let root1 = await driver.findElement(By.tagName("settings-ui"))
    let shadow_root1 = await expandRootElement(driver, root1)
    let root2 = await shadow_root1.findElement(By.id("container"))
    let root3 = await root2.findElement(By.id("main"))
    let shadow_root3 = await expandRootElement(driver, root3)
    let root4 = await shadow_root3.findElement(By.className("showing-subpage"))
    let shadow_root4 = await expandRootElement(driver, root4)
    let root5 = await shadow_root4.findElement(By.id("advancedPage"))
    let root6 = await root5.findElement(By.tagName("settings-privacy-page"))
    let shadow_root6 = await expandRootElement(driver, root6)
    let root7 = await shadow_root6.findElement(By.id("pages"))
    let root8 = await root7.findElement(By.tagName("settings-subpage"))
    let root9 = await root8.findElement(By.tagName("site-details"))
    let shadow_root9 = await expandRootElement(driver, root9)
    let root10 = await shadow_root9.findElement(By.id("plugins"))
    let shadow_root10 = await expandRootElement(driver, root10)
    let root11 = await shadow_root10.findElement(By.id("permission"))
    await root11.click()
    await root11.findElement(By.id("allow")).click()
    await console.log(await root11.findElement(By.id("allow")).getText())
    await driver.get('chrome://settings/content/flash')
    root1 = await driver.findElement(By.tagName("settings-ui"))
    shadow_root1 = await expandRootElement(driver, root1)
    await shot('flash Enabled', driver)
    await console.log('flash включён')
  }
  catch(error) {
    throw new Error(error)
    await shot('flash error', driver)
  }
}

function expandRootElement(driver, element) {
  return driver.executeScript("return arguments[0].shadowRoot",element);
}
