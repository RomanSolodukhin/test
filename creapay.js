var scriptName = 'paymentTest';
var {testData,times,baseUrl} = require('./efbalens_ddt.js');

//default data
var iBrowser = 0, iUser = 6, iServer = 0, iAmount = 5, iRes = 0;
var paymentSetId = 17;
var paymentSet = "a.c-pay-col:nth-child("+paymentSetId+")";
var browserName = testData.browsers[iBrowser];
var login = testData.users.username[iUser], pass = testData.users.pass[iUser];
var resolution = testData.resolutions[iRes];

const readline = require('readline');
const colors = require('colors/safe');
const {Builder, By, Key, until, Capabilities, Options} = require('selenium-webdriver');
const fs = require('fs');
const assert = require('assert');
const {performance} = require('perf_hooks');

let driver
//var paymentset = By.css("a.b-translation-table-item__btn.im-popup-link");

var lineNum = 1;

describe('dev.creagames.ru — Пополнение счёта ЛК', function() {
	  this.timeout(30000)
	  //let driver
	  let vars
	  let site = "https://creagames.com/ru"
	  before(async function() {
	    var capabilities = {
	      browserName: 'chrome',
	      version: '78.0',
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

		it('Авторизация', async function(){
		try {
					report("UserAgent: "+String(await driver.executeScript("return navigator.userAgent;")));
				  await driver.manage().window().setRect(resolution.x,resolution.y);
					await driver.manage().window().maximize();
					resolution = await driver.manage().window().getRect();
					await report("*** Current resolution: "+resolution.width+"x"+resolution.height+" ***");
					await logWaiting("*** Page loading ...");
					var time = performance.now();
				  result = await driver.get(baseUrl);
					time = performance.now() - time;
		      await logResult("...Page is loaded. Perfomance: "+parseFloat(time/1000).toPrecision(3)+"s ***");
			    await WaitForDisplay(By.css("a.g-header_profile_data_item:nth-child(1)"),60000);
			    await Click(By.css("a.g-header_profile_data_item:nth-child(1)"));
			    await WaitForDisplay(By.id("loginform-username"),'',"Authorization attempt");
			    await Type(By.id("loginform-username"),login);
			    await Type(By.id("loginform-password"),pass);
			    await Click(By.xpath("//*[.='Войти']"));
			    await WaitForDisplay(By.css('.g-header_profile_data_name'));
					assert.ok(true)
					return true
				}
		catch(error)
				{
					assert.fail(error)
					return false
				}
			});
	 describe('Пополнение', function() {
		  for(let i = 0; i < times; i++) {
				it(' '+i, async function() {
					try {
						await WaitForDisplay(By.css('.g-header_profile_data_name'));
						await Click(By.css('.g-header_profile_data_item'));
						await WaitForDisplay(By.css(paymentSet));
						await Click(By.css(paymentSet));
						await WaitForDisplay(By.css(".b-translation-tabs-pay-tabl-item__btn"));
						await Click(By.css(".b-translation-tabs-pay-tabl-item__btn"),"Visa/Mastercard. ");
						await WaitForDisplay(By.css(".b-translation-tabs-confirm-form__row > .b-btn"));
						await Click(By.css(".b-translation-tabs-confirm-form__row > .b-btn"));
						await WaitForDisplay(By.id("iframePaymentContainer"));
						await driver.switchTo().frame(0);
						await WaitForDisplay(By.id("tiCNumber"));
						await Type(By.id("tiCNumber"),"4652035440667037");
						await Click(By.id("cbExpMounth"));
						await WaitForDisplay(By.css("#cbExpMounth > option:nth-child(9)"));
						await Click(By.css("#cbExpMounth > option:nth-child(9)"));
						await Click(By.id("cbExpYear"));
						await WaitForDisplay(By.css("#cbExpYear > option:nth-child(3)"));
						await Click(By.css("#cbExpYear > option:nth-child(3)"));
						await Type(By.id("cvv2"),"971");
						await Type(By.id("nameoncard"),"Tester");
						await WaitForDisplay(By.id("AuthorizeButton"));
						await Click(By.id("AuthorizeButton"));
						await driver.switchTo().defaultContent();
						var cgvar1 = ExtractInt(await GetString(By.id("balanceInGame")));
						await WaitForDisplay(By.linkText("OK"));
						await Click(By.linkText("OK"));
						var cgvar2 = ExtractInt(await GetString(By.id("balanceInGame")));
						var cgvar = cgvar2-cgvar1;
						assert.ok(colors.gray("Баланс: "+cgvar1+" + "+cgvar+" = "+cgvar2+"\n"))
						return true
					}
		    catch(error) {
					console.error(colors.red("===== Fail Report ====="));
					console.error("Exeption: "+String(await driver.executeScript("return navigator.userAgent;"))+". Resolution: "+resolution.width+"x"+resolution.height);
					console.error(String(error));
					assert.fail(error)
					return false
				}
		});
	}
});

/*
	try{
		report('_Loading test: '+scriptName);
		await testRunner();
		//await resolutionsEnum();
		report("_End");
	}
	catch(error){
		report(error);
	}*/
});
/*
async function testRunner(){
	try{
		//var options = {xvfb_args: ['-screen'+' 0 '+WxHxD]};
		lineNum=1;
		var XARGS = ['-screen','0',testData.resolutions[iRes].x+'x'+testData.resolutions[iRes].y+'x'+'24'];
		var options = new Object();
		options = {
			server_Num: 99,
			xvfb_args: XARGS
			};
		report(options);
		xvfb = new Xvfb(options);
		xvfb.startSync();
		driver = new Builder()
			.forBrowser(browserName)
			.build();
		report("*** Browser is launched ***");
		await test();
		await driver.quit();
		xvfb.stopSync();
	}
	catch(error){
		throw new Error(error);
	}
}
*/

async function WaitForDisplay(el, timeout, description) {
	//var time = performance.now();
	timeout ? timeout : timeout = 30000; //default param1
	description ? description : description = ""; //default param2
	try{
		//logResult(lineNum+". *** Searching for an element: "+colors.gray(String(el))+". "+description+"...");
		await driver.wait(until.elementLocated(el),timeout);
		await driver.wait(until.elementIsVisible(driver.findElement(el)),timeout);
		//time = performance.now() - time;
		//logResult(lineNum+". *** Searching for an element: "+colors.green("Passed. ")+"("+colors.gray(String(el)+"). Performance: "+parseFloat(time/1000).toPrecision(3)+" s ***\n"));
		return true;
	}
	catch(error) {
		//time = performance.now() - time;
		//await logResult(lineNum+". *** Searching for an element: "+colors.red("FAIL! Element isn't display ")+"("+colors.gray(String(el))+"). "+description+"Timeout: "+parseFloat(time/1000).toPrecision(3)+" s ***\n");
		if(timeout < 60000) {
			//console.log("*** Let's try to increase the timeout! ***");
			timeout*=2;
			return WaitForDisplay(el,timeout,"(retry with timeout: "+timeout+" ms). ");
		}
		throw new Error(colors.red("CRIT: ")+error.message+"("+error.lineNumber+")");
	}
	finally {
		lineNum++;
	}
};

async function Click(el, description, timeout) {
	timeout ? timeout : timeout = 30000; //default param1
	description ? description : description = ""; //default param2
	try{
		//var time = performance.now();
		await driver.wait(until.elementIsVisible(driver.findElement(el)),timeout);
		await driver.findElement(el).click();
		//time = performance.now() - time;
		//await console.log(lineNum+". *** "+colors.green("Action successful:")+" Clicked at the element: "+colors.gray(String(el)+". "+description+"performance: "+parseFloat(time/1000).toPrecision(3)+" s ***"));
		return true;
		}
	catch(error) {
		//console.error(colors.red(lineNum+". *** FAIL. Element is not clickable: ")+colors.gray(String(el))+". "+description+colors.red("Check the selector or use WaitForDisplay(). ***"));
		throw new Error(colors.red("CRIT: ")+error.message+"("+error.lineNumber+")");
	}
	finally {
		lineNum++;
	}
};

async function ClickElement(el,description) {
	description ? description : description = ""; //default param2
	try{
		//var time = performance.now();
		await el.click();
		//time = performance.now() - time;
		//await console.log(lineNum+". *** "+colors.green("Action successful:")+" Clicked at the element: "+colors.gray('class: '+String(await el.getAttribute('class'))+". "+description+"performance: "+parseFloat(time/1000).toPrecision(3)+" s ***"));
		return true;
		}
	catch(error) {
		//onsole.error(colors.red(lineNum+". *** FAIL. Element is not clickable: ")+colors.gray(String(await el.getAttribute('class')))+". "+description+colors.red("Check the selector or use WaitForDisplay(). ***"));
		throw new Error(colors.red("CRIT: ")+error.message+"("+error.lineNumber+")");
	}
	finally {
		lineNum++;
	}
};

async function Type(el, string, timeout, description) {
	timeout ? timeout : timeout = 30000; //default param1
	description ? description : description = ""; //default param2
	try{
		//var time = performance.now();
		await driver.wait(until.elementIsVisible(driver.findElement(el)),timeout);
		await driver.findElement(el).sendKeys(string);
		//time = performance.now() - time;
		//await console.log(lineNum+". *** Action: Typed to the input field: "+colors.gray(String(el)+". "+description+"Content: '"+colors.gray(string)+"'. "+"performance: "+parseFloat(time/1000).toPrecision(3)+" s ***"));
		return true;
		}
	catch(error) {
		//console.error(colors.yellow(lineNum+". *** WARN! Input failed: ")+colors.gray(String(el))+". "+description+colors.yellow("Check the selector or use WaitForDisplay(). ***"));
		throw new Error(colors.yellow("WARN: ")+error.message+"("+error.lineNumber+")");
	}
	finally {
		lineNum++;
	}
};

async function GetString(el, timeout, description) {
	timeout ? timeout : timeout = 30000; //default param1
	description ? description : description = ""; //default param2
	try{
		var string = await driver.findElement(el).getText();
		return string;
		}
	catch(error) {
		//console.error(colors.yellow("*** WARN! Failed to get string: ")+colors.gray(String(el))+". "+description+colors.yellow("Check the selector or use WaitForDisplay(). ***"));
		throw new Error(colors.yellow("WARN: ")+error.message+"("+error.lineNumber+")");
	}
};

async function shot(name,target) {
	target ? target : target = driver; //default param
	try{
		var fileName = String(name)+testData.resolutions[iRes].x+'x'+testData.resolutions[iRes].y+'.png';
		fs.writeFile(fileName,await target.takeScreenshot(), 'base64', function(){});
		return true;
	}
	catch(error){
		throw new Error(error);
	}
};

function ExtractInt(string) {
	return parseInt(String(string).replace(/ /g, ''),10);
};

function report(message) {
	//console.log(colors.white(message));
	return true;
};

function logResult(string) {
    /*readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0, null);
    let text = string;
    process.stdout.write(text);*/
};

function logWaiting(string) {
	//process.stdout.write(string);
};

async function findByAttr(elems,attribute,target) {
	try{
		for(let i = 0; i < elems.length; i++) {
		if(await elems[i].getAttribute(attribute) == target) {
			return i;
			}
		}
		throw new Error("Element not found");
	}
	catch(error){
		throw new Error(error);
	}
};

async function resolutionsEnum(){
	try{
		for(let i = 0; i < testData.resolutions.length; i++){
			iRes = i;
			resolution = testData.resolutions[i];
			console.log(iRes,testData.resolutions[i].x,testData.resolutions[i].y);
			await testRunner();
		}
		console.log('resolutions over');
	}
	catch(error){
		console.log(error);
	}
}
