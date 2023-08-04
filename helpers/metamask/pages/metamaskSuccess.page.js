class MetamaskSuccessPage{
	get btnGotIt() { return $('button[data-testid="onboarding-complete-done"]'); }
	get btnNext() { return $('button[data-testid="pin-extension-next"]'); }
	get btnDone() { return $('button[data-testid="pin-extension-done"]'); }
	get textPhraseReminder() { return $('.recovery-phrase-reminder'); }
	get textNetworksList() { return $('[data-testid="network-display"]'); }
	get btnAddNetwork() {return $('.btn-secondary*=Add network'); }
	get btnDismissModal() {return $('button.btn-primary'); }

	async completeImportProcessAndDismiss(){
		await this.btnGotIt.click({waitForEnabled: true});
		await this.btnNext.click({waitForEnabled: true});
		await this.btnDone.click({waitForEnabled: true});
		if(await this.textPhraseReminder.isDisplayed())
			this.btnDismissModal.click({waitForEnabled: true});
	}

	async startAddNetworkProcess(){
		await this.textNetworksList.click({waitForDisplayed: true});
		await this.btnAddNetwork.click({waitForEnabled: true});
	}
}
export default new MetamaskSuccessPage(); 