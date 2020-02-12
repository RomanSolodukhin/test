const {By, Key, until} = require('selenium-webdriver');

export class Page {
	constructor() {
		this._driver = driver,
		this.url = 'https://creagames.com/',
		this.currentLang = 'en',
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
			logo: new Button(By.css('.global-header-logo'), HyperLink.check(this.url)),
			menu: {
				selector: By.css('.global-header-menu'),
				games: {
					dropdown_arrow: new Button(By.css(this.header.menu.selector.value+' > '+'.has_submenu'), async function(selector) {
						await this._driver.wait(until.elementIsVisible(this._driver.findElement(By.css('.game-list'))));
						return true;
					}), //так себе локатор
					expand: this.header.menu.games.dropdown_arrow.hover,
					roa: new Game({
						selector: By.css(this.header.menu.dropdown_arrow.value+' > '+'[href='+this.url+'/'+this.currentLang+'/game/roa"]'),
						url: this.url+this.currentLang+'/game/roa',
						name: 'Rise Of Angels',
						genre: 'MMORPG',
						icon: '/uploads/images/game_logo_small/7/c/7c5637a539ccb791b6952ca1dc60e8b3.png'
					}),
					ef: new Game({
						selector: By.css(this.header.menu.dropdown_arrow.value+' > '+'[href='+this.url+'/'+this.currentLang+'/game/ef"]'),
						url: this.url+this.currentLang+'/game/ef',
						name: 'Eternal Fury',
						genre: 'MMORPG',
						icon: '/uploads/images/game_logo_small/0/2/x02b71f733136de2521a33e6e85e8cb4e.png.pagespeed.ic.HFc_E0uXG9.png'
					}),
					kr: new Game({
						selector: By.css(this.header.menu.dropdown_arrow.value+' > '+'[href='+this.url+'/'+this.currentLang+'/game/kr"]'),
						url: this.url+this.currentLang+'/game/kr',
						name: 'Keepers Of The Rift',
						genre: 'MMORPG',
						icon: '/uploads/images/game_logo_small/f/c/xfc5e1b622f9fc355ec5b104eb4c1e951.png.pagespeed.ic.a1sm-Pez0k.png'
					}),
					gm: new Game({
						selector: By.css(this.header.menu.dropdown_arrow.value+' > '+'[href='+this.url+'/'+this.currentLang+'/game/gm"]'),
						url: this.url+this.currentLang+'/game/gm',
						name: 'Guns’n’Magic',
						genre: 'MMORPG',
						icon: '/uploads/images/game_logo_small/5/c/x5cc31ca562bb66cdce48fb5d0a34e031.png.pagespeed.ic.7pYbeodUNM.png'
					}),
				},
				news: new Button(By.css('[href='+this.url+'/en/news]'))
			},
			lang: {
				dropdown_arrow: new Button(By.css('.lang-list'), async function(selector) {
					await this._driver.wait(until.elementIsVisible(this._driver.findElement(By.css('.global-header-sub-menu'))));
					return true;
				}),
				expand: this.header.lang.dropdown_arrow.hover,
				ru: new Button(By.css('.icon.icon-ru'), HyperLink.check(this.url+'/ru')),
				en: new Button(By.css('.icon.icon-en'), HyperLink.check(this.url+'/en')),
				fr: new Button(By.css('.icon.icon-fr'), HyperLink.check(this.url+'/fr')),
				de: new Button(By.css('.icon.icon-de'), HyperLink.check(this.url+'/de')),
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
	hover() {
		Page._driver.actions().move({origin: Page._driver.findElement(selector)}).perform();
	}
	check() {
		return this.result(this.selector);
	}
}

function HyperLink(url) {
	this.prototype.check = function() {
		return Page._driver.findElement(selector).getAttribute('href') == url;
	}
};
