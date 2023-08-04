import {timeouts, WaitHelper} from '../../../helpers/utils/wait-helper.js';
const waitHelper = new WaitHelper();

class MetamaskSigningPage{
	get textHeaderMetamask() { return $('.rlogin-header3*=Metamask'); }
	get btnNext() { return $('.btn-primary*=Next'); }
	get btnConnect() { return $('.btn-primary*=Connect'); }
	get textLoading() { return $('.loading');}
	get metamaskWindowsTitle() { return 'Metamask Notification'; }
	get textContainer () { return $('.notification'); }
	get btnScrollDown() { return $('i[aria-label="Scroll down"]'); }
	get btnSign() { return $('[data-testid="signature-sign-button"]'); }
	get btnReject() { return $('[data-testid="signature-cancel-button"]'); }

	async switchToMetamaskModalAndConnect(){
		await this.textHeaderMetamask.click({waitForEnabled: true});
		await this.textLoading.waitForExist();
		await this.switchToModal();
		await this.btnNext.click({waitForEnabled: true});
		await this.btnConnect.click({waitForEnabled: true});
	}
	
	async signTxn(){
		await this.switchToModal();
		await this.btnScrollDown.click({waitForEnabled: true});
		await this.btnSign.click({waitForEnabled: true});
	}

	async switchToModal(){
		await waitHelper.waitForNewTab();
		await browser.switchWindow(this.metamaskWindowsTitle);
		await waitHelper.waitForExist(this.textContainer, timeouts.S3);
	}
}
export default new MetamaskSigningPage(); 