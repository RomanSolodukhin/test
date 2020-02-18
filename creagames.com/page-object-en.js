const {By, Key, until} = require('selenium-webdriver');

export class Page {
	constructor() {
		this._driver = driver,
		this.url = 'https://creagames.com/',
		this.currentLang = 'en',
		this.title = 'CreaGames — browser MMORPGs',
		this.facebookUrl = 'https://www.facebook.com/creagamesworld/',
		this.maintenance = {
				title: new TextString(By.css('body > div > h1'), 'Maintenance'),
				apeal: new TextString(By.css('body > div > div.text-preview'), 'Dear friends,'),
				text: new TextString(By.css('body > div > div.text'), 'The CreaGames portal is temporarily unavailable due to maintenance. When the website is back and better than ever, we will announce it in the Facebook groups of our projects.'),
				conclusion: new TextString(By.css('body > div > div.text2'), 'Stay tuned!'),
				socialText: new TextString(By.css('body > div > div.social_text'), 'Follow us on social media:'),
				social: {
					facebook: new Button(By.css('.fb'), HyperLink.check(this.facebookUrl))
				}
		},
		this.header = {
			logo: new Button(By.css('.global-header-logo'), HyperLink.check(this.url)),
			menu: {
				selector: By.css('.global-header-menu'),
				games: {
					dropdown_arrow: new Button(By.css(this.header.menu.selector.value++' .has-submenu'), async function(selector) {
						await this._driver.wait(until.elementIsVisible(this._driver.findElement(By.css('.game-list'))));
						return true;
					}), //так себе локатор
					expand: this.header.menu.games.dropdown_arrow.hover,
					roa: new Game({
						selector: By.css(this.header.menu.dropdown_arrow.value+' [href="'+this.url+'/'+this.currentLang+'/game/roa"]'),
						url: this.url+this.currentLang+'/game/roa',
						name: 'Rise Of Angels',
						genre: 'MMORPG',
						icon: '/uploads/images/game_logo_small/7/c/7c5637a539ccb791b6952ca1dc60e8b3.png'
					}),
					ef: new Game({
						selector: By.css(this.header.menu.dropdown_arrow.value+' [href="'+this.url+'/'+this.currentLang+'/game/ef"]'),
						url: this.url+this.currentLang+'/game/ef',
						name: 'Eternal Fury',
						genre: 'MMORPG',
						icon: '/uploads/images/game_logo_small/0/2/x02b71f733136de2521a33e6e85e8cb4e.png.pagespeed.ic.HFc_E0uXG9.png'
					}),
					kr: new Game({
						selector: By.css(this.header.menu.dropdown_arrow.value+' [href="'+this.url+'/'+this.currentLang+'/game/kr"]'),
						url: this.url+this.currentLang+'/game/kr',
						name: 'Keepers Of The Rift',
						genre: 'MMORPG',
						icon: '/uploads/images/game_logo_small/f/c/xfc5e1b622f9fc355ec5b104eb4c1e951.png.pagespeed.ic.a1sm-Pez0k.png'
					}),
					gm: new Game({
						selector: By.css(this.header.menu.dropdown_arrow.value+' [href="'+this.url+'/'+this.currentLang+'/game/gm"]'),
						url: this.url+this.currentLang+'/game/gm',
						name: 'Guns’n’Magic',
						genre: 'MMORPG',
						icon: '/uploads/images/game_logo_small/5/c/x5cc31ca562bb66cdce48fb5d0a34e031.png.pagespeed.ic.7pYbeodUNM.png'
					}),
				},
				news: new Button(By.css(this.header.menu.dropdown_arrow.value+' [href="'+this.url+this.currentLang+'/news"]'), HyperLink.check(this.url+this.currentLang+'/news]')),
				forum: new Button(By.css(this.header.menu.dropdown_arrow.value+' [href="'+this.url+this.currentLang+'/site/forums"]'), HyperLink.check(this.url+this.currentLang+'/site/forums"]')),
				support: new Button(By.css(this.header.menu.dropdown_arrow.value+' [href="'+this.url+this.currentLang+'/support"]'), HyperLink.check(this.url+this.currentLang+'/support"]'))
			},
			profile: {
				selector: By.css('.global-header-profile-data'),
				balance: new Button(By.css(this.header.profile.selector.value+' [href="'+this.url+this.currentLang+'/profile/balance"'), HyperLink.check(this.url+this.currentLang+'/profile/balance"')),
				amount: By.css('.wallet-amount'),
				icon: new Picture(By.css(this.header.profile.selector.value+' .icon-money')),
				recharge: new Button(By.css(this.header.profile.selector.value+' .button-small'), function() {
					let bgcolor = Page._driver.findElement(By.css(selector)).getCssValue('background-color');
						return {
							default:  bgcolor == '#FF1C51',
							hover: bgcolor == '#FF617E'
						}
					}),
				avatar: new Picture(By.css(this.header.profile.selector.value+' .global-header-profile-data-avatar')),
				nick: By.css(this.header.profile.selector.value+' .user-identity-username'),
				account: new Button(By.css(this.header.profile.selector.value+' [href="'+this.url+this.currentLang+'/profile/games"'), HyperLink.check(this.url+this.currentLang+'/profile/games"')),
				logout: new Button(By.css(this.header.profile.selector.value+' [data-href]'), HyperLink.check(this.url+this.currentLang+'site/logout?redirect_url=%2F'+this.currentLang)),
				authorization: {
					login: new Button(By.css(this.header.profile.selector.value+'.popup-trigger[data-popup="login"]'), async function() {
						await Page._driver.wait(until.elementLocated(By.css('*[id="popup-login"]')));
						await Page._driver.wait(until.elementIsVisible(Page._driver.findElement(By.css('*[id="popup-login"]')));
						return true;
					}),
					popup: {
						selector: By.css('*[id="popup-login"] .popup-content'),
						title: By.css(this.header.profile.authorization.popup.selector.value+' h2'),
						social: {
							facebook: new Button(By.css(this.header.profile.authorization.popup.selector.value+' .icon-sign-facebook'), HyperLink.check(this.url+this.currentLang+'/site/social-authorization?platform_code=facebook')),
							yahoo: new Button(By.css(this.header.profile.authorization.popup.selector.value+' .icon-sign-yahoo'), HyperLink.check(this.url+this.currentLang+'/site/social-authorization?platform_code=yahoo')),
							google: new Button(By.css(this.header.profile.authorization.popup.selector.value+' .icon-sign-google'), HyperLink.check(this.url+this.currentLang+'/site/social-authorization?platform_code=google')),
						},
						username: ,
						password: ,
						remember: ,
						recovery: ,
						submit: ,
						signup:
						/*
						<div class="popup-content" style="top: 247.5px;">
						<div class="popup-title">
						<h2>Authorization</h2>
						<b class="icon icon-close js-modal-close"></b>
						</div>
						<div class="popup-social-row">
						<p>Sign in with social networks</p>
						<span class="social-authorization-item icon-sign icon-sign-facebook" data-href="https://www.creagames.com/en/site/social-authorization?platform_code=facebook"></span>
						<span class="social-authorization-item icon-sign icon-sign-yahoo" data-href="https://www.creagames.com/en/site/social-authorization?platform_code=yahoo&amp;redirect_url=%2Fen"></span>
						<span class="social-authorization-item icon-sign icon-sign-google" data-href="https://www.creagames.com/en/site/social-authorization?platform_code=google"></span>
						<p class="popup-social-or">or</p>
						</div>
						<div class="global-form">
						<form action="" method="post">
						<label class="form-row">
						<input name="username" class="form-input" type="text" placeholder="Email / Username" maxlength="255">
						<span class="form-error"></span>
						</label>
						<label class="form-row">
						<input name="password" class="form-input" type="password" placeholder="Password" maxlength="255">
						<span class="form-error"></span>
						</label>
						<label class="form-row form-checkbox-row">
						<input class="form-checkbox" name="remember" value="1" type="checkbox" checked="checked">
						<b class="icon-checkbox"></b>
						Remember me <a class="a-solid popup-trigger float-right" data-popup="recovery">Forgot password?</a>
						</label>
						<div class="form-row">
						<button class="submit button button-medium" type="button">Login</button>
						</div>
						</form>
						</div>
						<div class="popup-bottom">
						Have no account? <a class="a-dashed js-modal-open popup-trigger" data-popup="signup">Sign up</a>
						</div>
						</div>
						*/
					}
				},
				registration: {
					singup: new Button(By.css(this.header.profile.selector.value+'.popup-trigger[data-popup="signup"]'), 'popup регистрации'),
					popup: {

					}
				},
				lang: {
					dropdown_arrow: new Button(By.css('.lang-list'), async function(selector) {
						await Page._driver.wait(until.elementIsVisible(this._driver.findElement(By.css('.global-header-sub-menu'))));
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
		return Page._driver.findElement(this.selector).getText().includes(this.text);
	}
        WebElement() {
                return Page._driver.findElement(this.selector);
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
        WebElement() {
                return Page._driver.findElement(this.selector);
        }
}

class Game {
	constructor({selector, url, name, genre, icon}) {
		this.selector = selector;
		this.url = url;
		this.name = new TextString(selector, name);
		this.genre = new TextString(selector, genre);
		this.icon = new Picture(By.css(selector.value+'[src="'+icon+']"'));
		this.button = new Button(selector, HyperLink.check(url));
	}
        WebElement() {
                return Page._driver.findElement(this.selector);
        }
}

class Picture(selector) {
	constructor(selector) {
		this.selector = selector;
	}
	check() {
		new pictureSize = Page._driver.findElement(selector).getRect();
		if(pictureSize.height != 0 && pictureSize.width != 0) return true;
	}
        WebElement() {
                return Page._driver.findElement(this.selector);
        }
}

function HyperLink(url) {
	this.prototype.check = function() {
		return Page._driver.findElement(selector).getAttribute('href') || Page._driver.findElement(selector).getAttribute('data-href') == url;
	}
};
