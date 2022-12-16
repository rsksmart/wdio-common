// This class is deprecated and just used for future possible functionalities
require('chai').should();
const {timeouts, WaitHelper} = require('../utils/wait-helper');
const waitHelper = new WaitHelper();

const SELECTORS = {
    ANDROID: {
        ALERT_TITLE: '*//android.widget.TextView[@resource-id="android:id/alertTitle"]',
    },
    IOS: {
        ALERT: '-ios predicate string:type == \'XCUIElementTypeAlert\'',
    },
};

class NativeAlert {
    /**
     * Wait for specific alert to exist
     * @param {String} alertTitle
     */
    static async waitForIsShown (alertTitle) {
        const selector = driver.isAndroid ? SELECTORS.ANDROID.ALERT_TITLE : SELECTORS.IOS.ALERT;
        await (await $(selector)).waitForExist({
            timeout: 11000
        });
        (await driver.getAlertText()).should.equal(alertTitle);
    }

    /**
     * Waits for specific popup to exist and dismisses it
     * @param {String} locator - locator to close the popup
     */
    static async dismissPopup(locator) {
		if (driver.isAndroid) {
            const element = $(locator);
            try{
                await waitHelper.waitForDisplayed(element, timeouts.S2);
                await element.click();
            } catch(error) {
                console.warn('The popup was not displayed');
            }
		}
	}
}

module.exports = NativeAlert;
