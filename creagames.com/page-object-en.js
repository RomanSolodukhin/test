const {By, Key, until} = require('selenium-webdriver');

export default class Page {
	constructor() {
		this._driver = driver;
		this.url = 'https://creagames.com/';
		this.title = 'CreaGames — browser MMORPGs';
		this.facebookUrl = 'https://www.facebook.com/creagamesworld/';
	}
	open(this.url) {
		this._driver.get(url);
	}
	maintenance() {
		title: new TextString(By.css('body > div > h1'), 'Maintenance'),
		apeal: new TextString(By.css('body > div > div.text-preview'), 'Dear friends,'),
		text: new TextString(By.css('body > div > div.text'), 'The CreaGames portal is temporarily unavailable due to maintenance. When the website is back and better than ever, we will announce it in the Facebook groups of our projects.'),
		conclusion: new TextString(By.css('body > div > div.text2'), 'Stay tuned!'),
		socialText: new TextString(By.css('body > div > div.social_text'), 'Follow us on social media:'),
		social() {
			facebook: new Button(By.css('.fb'), function(selector) {
				return this._driver.findElement(selector).getAttribute('href') == this.facebookUrl;
			});
		}
	}
	header() {
		lang() {
			list: new Button(By.css('.lang-list'), ),
			ru: new Button(By.css('.icon icon-ru'), function(selector) {
				return this._driver.findElement(selector).getAttribute('href') == this.url+'/ru';
			}),
			en: new Button(By.css('.icon icon-en'), function(selector) {
				return this._driver.findElement(selector).getAttribute('href') == this.url+'/en';
			}),
			fr: new Button(By.css('.icon icon-fr'), function(selector) {
				return this._driver.findElement(selector).getAttribute('href') == this.url+'/fr';
			}),
			de: new Button(By.css('.icon icon-de'), function(selector) {
				return this._driver.findElement(selector).getAttribute('href') == this.url+'/de';
			}),
			get current() {
				return this._driver.findElement(By.css('html')).getAttribute('lang');
			}
		}
	}
	setLang(targetLang) {
		let setLangPromise = new Promise(function(resolve, reject) {
			if(targetLang == this.header.lang.current) reject(new Error('Выбранный язык уже установлен.'));
			async function() {
				driver.actions().move({origin: driver.findElement(this.header.lang.list)}).perform();
				await driver.wait(until.elementIsVisible(driver.findElement(this.header.lang[targetLang])));
				driver.findElement(this.header.lang[targetLang]).click();
				await driver.wait(this.header.lang.current == targetLang);
				resolve(true);
			}
		})
		setLangPromise.then(function(value) {
			return true;
		});
		setLangPromise.catch(function(error) {
			return error;
	}

}

class TextString(selector, text) {
	constructor() {
		this.selector = selector;
	}
	check() {
		return Page._driver.findElement(this.selector).getText() == text;
	}
}

class Button(selector, result) {
	constructor() {
		this.selector = selector;
	}
	press() {
		Page._driver.findElement(this.selector).click();
	}
	check() {
		return result(this.selector);
	}
}
