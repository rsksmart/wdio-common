import config from 'config';

class MetamaskAddNetworkPage{
	get lnkAddNewNetwork() { return $('[data-testid="add-network-manually"]'); }
	get formAddNewNetwork() { return $('.networks-tab__add-network-form-body'); }
	get btnSave() { return $('button.btn-primary*=Save'); }
	get textSuccessNotification() { return $('.actionable-message--success'); }
	get btnCloseSuccessNotification() { return $('.home__new-network-notification-close'); }
	get inputFormField() { return 'input.form-field__input'; }
	get labelForm() {return 'h6.box--margin-top-1'; }
	get inputsList() {return '.form-field'; }

	async addNewNetworkAndVerifySuccess(){
		let fields = await (this.formAddNewNetwork).$$(this.inputsList);
		const network = config.get('network');
		for(let i = 0; i < fields.length; i++){
			switch(await fields[i].$(this.labelForm).getText()){
			case 'Network name':
				await fields[i].$(this.inputFormField).setValue(network.netWorkName);
				break;
			case 'New RPC URL':
				await fields[i].$(this.inputFormField).setValue(network.rpcUrl);
				break;
			case 'Chain ID':
				await fields[i].$(this.inputFormField).setValue(network.id);
				break;
			case 'Currency symbol':
				await fields[i].$(this.inputFormField).setValue(network.symbol);
				break;
			case 'Block explorer URL':
				await fields[i].$(this.inputFormField).setValue(network.explorer);
				break;
			
			}
		}
		await this.btnSave.click({waitForEnabled: true});
		await this.textSuccessNotification.isDisplayed();
		await this.btnCloseSuccessNotification.click({waitForEnabled: true});
	}
}
export default new MetamaskAddNetworkPage(); 