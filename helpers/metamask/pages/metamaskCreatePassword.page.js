class MetamaskCreatePasswordPage{
	get inputTextNewPassword(){ return $('input[data-testid="create-password-new"]'); }
	get inputTextConfirmPassword(){ return $('input[data-testid="create-password-confirm"]'); }
	get checkboxAgreeTerms(){ return $('input[data-testid="create-password-terms"]'); }
	get btnImportMyWallet() { return $('button[data-testid="create-password-import"]');}

	async createNewPasswordForWallet(newPassword){
		await this.inputTextNewPassword.setValue(newPassword);
		await this.inputTextConfirmPassword.setValue(newPassword);
		await this.checkboxAgreeTerms.click({waitForEnabled: true});
		await this.btnImportMyWallet.click({waitForEnabled: true});
	}
}
export default new MetamaskCreatePasswordPage(); 