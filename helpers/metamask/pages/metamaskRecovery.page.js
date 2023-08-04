
class MetamaskRecoveryPage{
	get listNumberOfWords(){ return $('.import-srp__number-of-words-dropdown').$('.dropdown__select'); }
	get textListOfWords() { return $('.import-srp__srp'); } //Getting the outer div to go deeper later
	get btnConfirmSecretRecovery() { return $('[data-testid="import-srp-confirm"]');}
	get wordField() { return '#import-srp__srp-word-';}

	async seedWalletImport(recoveryWords){
		await this.listNumberOfWords.selectByAttribute('value', recoveryWords.length);

		const wordsNumber = recoveryWords.length; //Getting the total of words to be entered
		for(let i = 0; i < wordsNumber; i++){
			await this.textListOfWords.$(this.wordField + i ).setValue(recoveryWords[i]); //Setting work by word
		}
		await this.btnConfirmSecretRecovery.click({waitForEnabled: true});
	}
}
export default new MetamaskRecoveryPage(); 