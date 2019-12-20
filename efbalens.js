console.info("_Start");
var scriptName = 'efbalens';
var { testData, times, baseUrl } = require('./efbalens_ddt.js');
//default data
var iBrowser = 0, iUser = 8, iServer = 0, iAmount = 5, iRes = 0;

var browserName = testData.browsers[iBrowser];
var login = testData.users.username[iUser], pass = testData.users.pass[iUser];
var dataServerId = testData.server_data_id[iServer];
var targetamount = testData.paymentset[iAmount]
var resolution = testData.resolutions[iRes];

const readline = require('readline');
const colors = require('colors/safe');
const {Builder, By, Key, until, Capabilities, Options, Remote} = require('selenium-webdriver');
const fs = require('fs');
const assert = require('assert');
const {performance} = require('perf_hooks');
var paymentset = By.css("a.b-translation-table-item__btn.im-popup-link");

var driver;
var lineNum = 1;

(async () => {
    try {
        report('_Loading test: '+scriptName);
		await testRunner();
		//await resolutionsEnum();
		report("_End");
	}
	catch(error) {
		console.log(error);
	}
})();

async function testRunner(){
	try{
    lineNum=1;
    var capabilities = {
      browserName: 'opera',
      version: '64.0',
      enableVNC: true,
      enableVideo: false
    };
driver = await new Builder()
.usingServer('http://localhost:4444/wd/hub')
.withCapabilities(capabilities)
.setAlertBehavior()
.build();
		report("*** Browser is launched ***");
		var time = performance.now();
		await test();
	}
	catch(error){
		throw new Error(error);
	}
  finally{
    await driver.quit();
    time = performance.now() - time;
    report('*** Browser is closed. Session time: '+parseFloat(time/1000).toPrecision(3)+'s ***');
    /*xvfb.stopSync();*/
  }
}

async function test(){
try {
	 report("UserAgent: "+String(await driver.executeScript("return navigator.userAgent;")));
   await driver.manage().window().setRect(resolution.x,resolution.y);
	 await driver.manage().window().maximize();
	 resolution = await driver.manage().window().getRect();
	 await report("*** Current resolution: "+resolution.width+"x"+resolution.height+" ***");
	 await report("*** User: "+login+"/"+pass+" data_server_id: "+dataServerId+" ***");
	 await process.stdout.write(lineNum+". *** Page ("+baseUrl+") loading ...");
	 var time = performance.now();
   await driver.get(baseUrl);
	 time = performance.now() - time;
	 writeWaiting(colors.green("Passed. ")+"performance: "+parseFloat(time/1000).toPrecision(3)+"s ***");
	 //await writeWaiting(lineNum+". *** Page ("+baseUrl+") loading: "+colors.green("Passed. ")+"performance: "+parseFloat(time/1000).toPrecision(3)+"s ***\n");
	  await WaitForDisplay(By.css("a.g-header_profile_data_item:nth-child(1)"),60000);
	  await Click(By.css("a.g-header_profile_data_item:nth-child(1)"));
	  await WaitForDisplay(By.id("loginform-username"),'',"Authorization attempt");
	  await Type(By.id("loginform-username"),login);
	  await Type(By.id("loginform-password"),pass);
	  await Click(By.xpath("//*[.='Войти']"));
	  await WaitForDisplay(By.css('.g-header_profile_data_name'),false,colors.green("Authorization: SUCCESS"));
	  await Click(By.css('.g-header_profile_data_name'));
      for(let i = 0; i < times; i++) {
		  console.log("Circle: "+(i+1));
		  var cgvar1 = await ExtractInt(await GetString(By.id("balanceInGame")));
		  await console.log("*** Balance: "+cgvar1+" CG");
		  await WaitForDisplay(By.xpath("//*[.='Пополнить баланс игры']"));
		  var gamelinks = await driver.findElements(By.css(".c-game-link"));
		  var gamesMsg = 'Games: ';
		  for(let a = 0; a < gamelinks.length; a++) {
			  let gameMsg = await gamelinks[a].getText();
			  gamesMsg+=gameMsg+'//';
		  }
		  console.log(gamesMsg);
		  var gamebtns = await driver.findElements(By.xpath("//*[.='Пополнить баланс игры']"));
		  var targetelement = await findByAttr(gamebtns,'data-server_id',dataServerId);
		  await ClickElement(gamebtns[targetelement]);
		  await WaitForDisplay(By.id("paymentModal"));
		  await WaitForDisplay(paymentset);
		  var psets = await driver.findElements(By.css("a.b-translation-table-item__btn.im-popup-link"));
		  targetelement = await findByAttr(psets,'data-real-money',targetamount);
		  {
			  let psetsMsg = 'PaymentSets (';
			  let cAmount;
			  for(let a = 0; a < psets.length; a++) {
				  cAmount = await psets[a].getAttribute('data-real-money');
				  cAmount == targetamount ? cAmount = cAmount+colors.green(' — selected') : cAmount;
				  psetsMsg = psetsMsg+"#"+(a+1)+": "+cAmount+". ";
			  }
			  console.log(psetsMsg+').');
		  }
		  await ClickElement(psets[targetelement]);
		  await driver.wait(until.elementIsNotVisible(driver.findElement(By.id('paymentModal'))),30000);
		  /*await WaitForDisplay(By.id("paymentSuccessModal"));
	      await WaitForDisplay(By.xpath("//*[.='OK']"),'',colors.green("Payment: SUCCESS"));
		  console.log("successMessage: "+await GetString(By.css("#successMessage")));
		  await Click(By.xpath("//*[.='OK']"));*/
		  cgvar2 = await ExtractInt(await GetString(By.id("balanceInGame")));
		  var cgvar = cgvar2-cgvar1;
		  await console.log("Balance: "+cgvar2+" CG. Amount: "+cgvar+" CG\n");
		  //await driver.wait(until.elementIsNotVisible(driver.findElement(By.id("paymentSuccessModal"))),60000);
    }
} catch(error) {
	await shot('screenerror');
	console.error(colors.red("===== Bug Report ====="));
	console.error("Exeption: "+String(await driver.executeScript("return navigator.userAgent;"))+". Resolution: "+
  resolution.width+"x"+resolution.height);
	console.error(String(error));
}
};

async function WaitForDisplay(el, timeout, description) {
	var time = performance.now();
	timeout ? timeout : timeout = 30000; //default param1
	description ? description : description = ""; //default param2
	try{
		process.stdout.write(lineNum+". *** Searching for an element: "+colors.gray(String(el))+". "+description+"... ");
		await driver.wait(until.elementLocated(el),timeout);
		await driver.wait(until.elementIsVisible(driver.findElement(el)),timeout);
		time = performance.now() - time;
		writeWaiting(colors.green("Passed. "));
		//writeWaiting(lineNum+". *** Searching for an element: "+colors.green("Passed. ")+"("+colors.gray(String(el)+"). Performance: "+parseFloat(time/1000).toPrecision(3)+" s ***"));
		return true;
	}
	catch(error) {
		time = performance.now() - time;
		writeWaiting(colors.red("FAIL! Element isn't display. ")+"Timeout: "+parseFloat(time/1000).toPrecision(3)+" s");
		//writeWaiting(lineNum+". *** Searching for an element: "+colors.red("FAIL! Element isn't display ")+"("+colors.gray(String(el))+"). "+description+"Timeout: "+parseFloat(time/1000).toPrecision(3)+" s ***");
		if(timeout < 60000) {
			console.log("*** Let's try to increase the timeout! ***");
			timeout*=2;
			return WaitForDisplay(el,timeout,"(retry with timeout: "+timeout+" ms). ");
		}
		throw new Error(colors.red("CRIT: ")+error.message+" ("+error.lineNumber+"):"+colors.gray(findElement(el)));
	}
	finally {
		lineNum++;
	}
};

async function Click(el, description, timeout) {
	timeout ? timeout : timeout = 30000; //default param1
	description ? description : description = ""; //default param2
	try{
		var time = performance.now();
		await driver.wait(until.elementIsVisible(driver.findElement(el)),timeout);
		await driver.findElement(el).click();
		time = performance.now() - time;
		await console.log(lineNum+". *** Action: Clicked at the element: "+colors.gray(String(el)+". "+
    description+"performance: "+parseFloat(time/1000).toPrecision(3)+" s ***"));
		return true;
		}
	catch(error) {
		console.error(colors.red(lineNum+". *** FAIL. Element is not clickable: ")+colors.gray(String(el))+". "+
    description+colors.red("Check the selector or use WaitForDisplay(). ***"));
		throw new Error(colors.red("CRIT: ")+error.message+"("+error.lineNumber+")"+el);
	}
	finally {
		lineNum++;
	}
};

async function ClickElement(el,description) {
	description ? description : description = ""; //default param2
	try{
		var time = performance.now();
		await el.click();
		time = performance.now() - time;
		await console.log(lineNum+". *** Action: Clicked at the element: "+colors.gray('class: '+
    String(await el.getAttribute('class'))+". "+description+"performance: "+parseFloat(time/1000).toPrecision(3)+" s ***"));
		return true;
		}
	catch(error) {
		console.error(colors.red(lineNum+". *** FAIL. Element is not clickable: ")+colors.gray(
      String(await el.getAttribute('class')))+". "+description+colors.red("Check the selector or use WaitForDisplay(). ***"));
		throw new Error(colors.red("CRIT: ")+error.message+"("+error.lineNumber+")"+el);
	}
	finally {
		lineNum++;
	}
};

async function Type(el, string, timeout, description) {
	timeout ? timeout : timeout = 30000; //default param1
	description ? description : description = ""; //default param2
	try{
		var time = performance.now();
		await driver.wait(until.elementIsVisible(driver.findElement(el)),timeout);
		await driver.findElement(el).sendKeys(string);
		time = performance.now() - time;
		await console.log(lineNum+". *** Action: Typed to the input field: "+colors.gray(String(el)+". "+
    description+"Content: '"+colors.gray(string)+"'. "+"performance: "+parseFloat(time/1000).toPrecision(3)+" s ***"));
		return true;
		}
	catch(error) {
		console.error(colors.yellow(lineNum+". *** WARN! Input failed: ")+colors.gray(String(el))+". "+
    description+colors.yellow("Check the selector or use WaitForDisplay(). ***"));
		throw new Error(colors.yellow("WARN: ")+error.message+"("+error.lineNumber+")"+el);
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
		console.error(colors.yellow("*** WARN! Failed to get string: ")+colors.gray(String(el))+". "+
    description+colors.yellow("Check the selector or use WaitForDisplay(). ***"));
		throw new Error(colors.yellow("WARN: ")+error.message+"("+error.lineNumber+")"+el);
	}
};

async function shot(name,target) {
	target ? target : target = driver; //default param
	try{
		var fileName = String(name)+testData.resolutions[iRes].x+'x'+testData.resolutions[iRes].y+'.png';
		fs.writeFile('./screens/'+scriptName+'/'+browserName+'/'+fileName,
    await target.takeScreenshot(), 'base64',
    function(){console.log("*** Screenshot "+colors.gray(fileName)+colors.white(' has been saved to ')
    +colors.gray('"/screens/'+scriptName+'/'+browserName+'/"')+colors.white(" ***"))});
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
	console.log(colors.white(message));
	return true;
};

function writeWaiting(string) {
    /*readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0, null);*/
    let text = string;
    process.stdout.write(text+'\n');
};

async function findByAttr(elems,attribute,target) {
	try{
		for(let i = 0; i < elems.length; i++) {
		if(await elems[i].getAttribute(attribute) == target) {
			return i;
			}
		}
		return new Error("Element not found");
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
