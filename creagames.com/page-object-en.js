const {By, Key, until} = require('selenium-webdriver');

export class Page {
	constructor() {
		this._driver = driver,
		this.url = 'https://creagames.com/',
		this.title = 'CreaGames — browser MMORPGs',
		this.facebookUrl = 'https://www.facebook.com/creagamesworld/',
		this.maintenance: {
				title: new TextString(By.css('body > div > h1'), 'Maintenance'),
				apeal: new TextString(By.css('body > div > div.text-preview'), 'Dear friends,'),
				text: new TextString(By.css('body > div > div.text'), 'The CreaGames portal is temporarily unavailable due to maintenance. When the website is back and better than ever, we will announce it in the Facebook groups of our projects.'),
				conclusion: new TextString(By.css('body > div > div.text2'), 'Stay tuned!'),
				socialText: new TextString(By.css('body > div > div.social_text'), 'Follow us on social media:'),
				social: {
					facebook: new Button(By.css('.fb'), HyperLink.check(this.facebookUrl)
				}
		},
		this.header: {
			lang: {
				list: new Button(By.css('.lang-list'), async function(selector) {
					await this._driver.wait(until.elementIsVisible(this._driver.findElement(By.css('.global-header-sub-menu'))));
					return true;
				}),
				ru: new Button(By.css('.icon icon-ru'), HyperLink.check(selector, this.url+'/ru')),
				en: new Button(By.css('.icon icon-en'), HyperLink.check(selector, this.url+'/en')),
				fr: new Button(By.css('.icon icon-fr'), HyperLink.check(selector, this.url+'/fr')),
				de: new Button(By.css('.icon icon-de'), HyperLink.check(selector, this.url+'/de')),
				current: function() {
					return this._driver.findElement(By.css('html')).getAttribute('lang');
				}
			}
		}
	}
	open(path) {
		this._driver.get(path);
	}
	setLang(targetLang) {
			if(targetLang == this.header.lang.current) throw new Error('Выбранный язык уже установлен.');
			async function() {
				try {
					this._driver.actions().move({origin: this._driver.findElement(this.header.lang.list)}).perform();
					await driver.wait(until.elementIsVisible(this._driver.findElement(this.header.lang[targetLang])));
					this._driver.findElement(this.header.lang[targetLang]).click();
					await this._driver.wait(this.header.lang.current == targetLang);
					return true;
				}
				catch(err) {
					throw err;
				}
			};
		}
};

class TextString {
	constructor(selector, text) {
		this.selector = selector;
		this.text = text;
	}
	check() {
		return Page._driver.findElement(this.selector).getText() == this.text;
	}
}

class Button {
	constructor(selector, result) {
		this.selector = selector;
		this.result = result;
	}
	press() {
		Page._driver.findElement(this.selector).click();
	}
	check() {
		return this.result(this.selector);
	}
}

static HyperLink(selector, url) {
	check() {
		return Page._driver.findElement(selector).getAttribute('href') == url;
	}
}
