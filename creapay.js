var {testData,times,baseUrl} = require('./efbalens_ddt.js')
let iUser = 6
var login = testData.users.username[iUser], pass = testData.users.pass[iUser]

const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
var request = require('request')

describe('dev.creagames.ru — пополнение счёта', function() {
  this.timeout(10000)
  this.slow(1000)
  let driver
  let site = "https://crea:Deifiey3@dev.creagames.ru/"
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
  afterEach(async function() {
    if(this.currentTest.err) {
    let name = String(this.currentTest.title)
      var res = await driver.takeScreenshot();
      allure.createAttachment(name, new Buffer(res, 'base64'))
      allure.createAttachment('Отчёт', String(this.currentTest.err))
      allure.severity('blocker')
      removeVideo = false
      assert.fail('Тест остановлен. '+this.currentTest.err)
    }
  })
  it('Загрузить страницу', async function() {
    await driver.get(site)
		await driver.wait(until.elementLocated(By.linkText("Вход")), 30000)
  })
  it('Открыть форму авторизации', async function() {
    await driver.findElement(By.linkText("Вход")).click()
    await driver.wait(until.elementLocated(By.id("loginform-username")))
  })
  it('Ввести учетные данные', async function() {
    await driver.findElement(By.id("loginform-username")).sendKeys(login)
    await driver.findElement(By.id("loginform-password")).sendKeys(pass)
  })
  it('Авторизоваться', async function() {
    try {
      await driver.findElement(By.id("loginform-password")).sendKeys(Key.ENTER)
      await driver.wait(until.elementLocated(By.css(".g-header_profile_data_name")),30000)
      await driver.wait(until.elementIsVisible(driver.findElement(By.css(".g-header_profile_data_name"))),30000)
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
})

for(i = 1; i <= 2;i++) {
describe('Платёж '+i, function(done) {
    this.timeout(15000)
    this.slow(4000)
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

	    it('Открыть окно пополнения', async function() {
				await driver.wait(until.elementLocated(By.css(".g-header_profile_data .b-btn")))
				await driver.findElement(By.css(".g-header_profile_data .b-btn")).click()
				await driver.wait(until.elementLocated(By.css("a.c-pay-col:nth-child(13)")))
	    })
			it('Выбрать пакет 15 000', async function() {
				await driver.findElement(By.css("a.c-pay-col:nth-child(13)")).click()
				await driver.wait(until.elementLocated(By.css(".b-translation-tabs-pay-tabl-item__btn")))
				await driver.findElement(By.css(".b-translation-tabs-pay-tabl-item__btn")).click()
			})
			it('Подтвердить пакет', async function() {
				await driver.wait(until.elementLocated(By.css(".b-translation-tabs-confirm-form__row > .b-btn")))
				await driver.findElement(By.css(".b-translation-tabs-confirm-form__row > .b-btn")).click()
				await driver.wait(until.elementLocated(By.id("iframePaymentContainer")))
			})
			it('Перейти в окно платёжного партнера', async function() {
				await driver.switchTo().frame(0)
				await driver.wait(until.elementLocated(By.id("tiCNumber")))
			})
			it('Ввести номер карты', async function() {
				await driver.findElement(By.id("tiCNumber")).sendKeys("4652035440667037")
			})
			it('Выбрать месяц окончания срока действия', async function() {
				await driver.findElement(By.id("cbExpMounth")).click()
				await driver.wait(until.elementLocated(By.css("#cbExpMounth > option:nth-child(9)")))
				await driver.findElement(By.css("#cbExpMounth > option:nth-child(9)")).click()
			})
			it('Ввести год окончания срока действия', async function() {
				await driver.findElement(By.id("cbExpYear")).click()
				await driver.wait(until.elementLocated(By.css("#cbExpYear > option:nth-child(3)"))).click()
				await driver.findElement(By.css("#cbExpYear > option:nth-child(3)")).click()
			})
			it('Ввести защитный код', async function() {
				await driver.findElement(By.id("cvv2")).sendKeys("971")
			})
			it('Ввести имя держателя карты', async function() {
				await driver.findElement(By.id("nameoncard")).sendKeys("Tester")
			})
			it('Подтвердить данные и отправить форму', async function() {
				await driver.wait(until.elementLocated(By.id("AuthorizeButton")))
				await driver.findElement(By.id("AuthorizeButton")).click()
				await driver.switchTo().defaultContent()
			})
			it('Баланс CG пополнен на 15 000', async function() {
				var cgvar1 = ExtractInt(await GetString(By.id("balanceInGame")))
				await driver.wait(until.elementLocated(By.linkText("OK")))
				await driver.findElement(By.linkText("OK"))
				var cgvar2 = ExtractInt(await GetString(By.id("balanceInGame")))
				var cgvar = cgvar2-cgvar1;
				assert.equal(cgvar, 15000)
			})
  	})
  }
});

function ExtractInt(string) {
	return parseInt(String(string).replace(/ /g, ''),10);
};

async function GetString(el, timeout, description) {
	timeout ? timeout : timeout = 30000; //default param1
	description ? description : description = ""; //default param2
	try{
		var string = await driver.findElement(el).getText();
		return string;
		}
	catch(error) {
		console.error(colors.yellow("*** WARN! Failed to get string: ")+colors.gray(String(el))+". "+description+colors.yellow("Check the selector or use WaitForDisplay(). ***"));
		throw new Error(colors.yellow("WARN: ")+error.message+"("+error.lineNumber+")");
	}
};

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
