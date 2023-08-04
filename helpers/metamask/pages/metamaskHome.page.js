import config from 'config';
import {timeouts, WaitHelper} from '../../../helpers/utils/wait-helper.js';
const waitHelper = new WaitHelper();

class MetamaskHomePage{
	get btnImportWallet(){ return $('button[data-testid="onboarding-import-wallet"]'); }
	get btnCreateWallet(){ return $('button[data-testid="onboarding-create-wallet"]'); }
	get languages() { return $('.dropdown__select'); }
	get textHeaderText(){ return $('h2=*Help us improve Metamask'); }
	get btnIAgree(){ return $('button[data-testid="metametrics-i-agree"]'); }
	get btnNoThanks(){ return $('button[data-testid="metametrics-no-thanks"'); }
	get headerOnboarding() { return $('.onboarding-app-header'); }

	async selectLanguage(language){
		await this.languages.selectByAttribute('value', language);
	}

	async selectEngLanguage(){
		await this.selectLanguage('en');
	}

	async closeTabIfNotMetamask(){
		let title = await browser.getTitle();
		if(!title.includes(config.get('extensionUrl'))){
			await browser.closeWindow();
		}
	}

	async switchToMetamaskTab(url){
		await browser.switchWindow(url);
		await waitHelper.waitForExist(this.headerOnboarding, timeouts.S10);
	}

	async startAndAgreeWalletImport(){
		await this.selectEngLanguage();
		await this.btnImportWallet.click({waitForEnabled: true});
		await this.btnIAgree.click({waitForEnabled: true});
	}

	async switchToMetamaskModal(){
		await waitHelper.waitForNewTab();
		await this.switchToMetamaskTab('Metamask');
	}
}
export default new MetamaskHomePage(); 