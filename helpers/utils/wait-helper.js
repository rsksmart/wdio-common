const timeouts = {
    // All timeouts here are in milliseconds
    S1: 1000,
    S2: 2000,
    S3: 3000,
    S5: 5000,
    S10: 10000,
    S15: 15000,
    S30: 30000,
    S45: 45000,
    S60: 60000,
    S90: 90000,
    S120: 120000,
    S180: 180000
};

class WaitHelper {

    /**
     * Waits for the given amount of milliseconds
     * @param {number} milliseconds
     * @returns {Promise<void>}
     */
    async waitStaticPause(milliseconds) {
        await browser.pause(milliseconds);
    }

    /**
     * Wait for element to be displayed
     * @param {Element} element - element to check
     * @param {number} [timeout=timeouts.S15] - time to wait
     * @param {string} [message='ELEMENT DISPLAYED TIMEOUT ERROR'] - message to give on failure
     * @returns {Promise<void>}
     */
    async waitForDisplayed(element, timeout = timeouts.S15, message = 'ELEMENT DISPLAYED TIMEOUT ERROR') {
        await element.waitForDisplayed({
            timeout: timeout,
            timeoutMsg: `${message}. LOCATOR: ${element.selector} \n ${new Error().stack}`
        });
    }

    /**
     * Wait for element to exist
     * @param {Element} element - element to check
     * @param {number} [timeout=timeouts.S45] - time to wait
     * @param {string} [message='ELEMENT EXIST TIMEOUT ERROR'] - message to give on failure
     * @returns {Promise<void>}
     */
    async waitForExist(element, timeout = timeouts.S30, message = 'ELEMENT EXIST TIMEOUT ERROR') {
        await element.waitForExist({
            timeout: timeout,
            timeoutMsg: `${message}. LOCATOR: ${element.selector} \n ${new Error().stack}`
        });
    }

    /**
     * Wait for element to be enabled
     * @param {Element} element - element to check
     * @param {number} [timeout=timeouts.S45] - time to wait
     * @param {string} [message='ELEMENT PRESENCE TIMEOUT ERROR'] - message to give on failure
     * @returns {Promise<void>}
     */
     async waitForEnabled(element, timeout = timeouts.S30, message = 'ELEMENT ENABLE TIMEOUT ERROR') {
        await element.waitForEnabled({
            timeout: timeout,
            timeoutMsg: `${message}. LOCATOR: ${element.selector} \n ${new Error().stack}`
        });
    }    

    /**
     * Wait until element contains given text
     * @param {Element} element - element to check
     * @param {string} text - text that should be present in element
     * @param {number} [timeout=timeouts.S45] - timeout for the wait
     * @param {string} [message='TEXT NOT PRESENT IN ELEMENT ERROR'] - message to give on failure
     * @returns {Promise<void>}
     */
    async waitForElementToContainText(element, text, timeout = timeouts.S15, message = 'TEXT NOT PRESENT IN ELEMENT ERROR') {
        await element.waitUntil(async function () {
            return (await element.getText()).includes(text)
        }, {
            timeout: timeout,
            timeoutMsg: `${message}. LOCATOR: ${element.selector} \n ${new Error().stack}`
        });
    }

    /**
     * Wait until element doesn't contain given text
     * @param {Element} element - element to check
     * @param {string} text - text that should not be present in element
     * @param {number} [timeout=timeouts.S45] - timeout for the wait
     * @param {string} [message='TEXT IS PRESENT IN ELEMENT ERROR'] - message to give on failure
     * @returns {Promise<void>}
     */
    async waitForElementNotToContainText(element, text, timeout = timeouts.S45, message = 'TEXT IS PRESENT IN ELEMENT ERROR') {
        await element.waitUntil(async function () {
            return !(await element.getText()).includes(text)
        }, {
            timeout: timeout,
            timeoutMsg: `${message}. LOCATOR: ${element.selector} \n ${new Error().stack}`
        });
    }

     /**
     * Wait until element does not exist
     * @param {Element} element - element to check
     * @param {number} [timeout=timeouts.S30] - time to wait
     * @param {string} [message='ELEMENT SHOULD NOT EXIST, TIMEOUT ERROR'] - message to give on failure
     * @returns {Promise<void>}
     */
      async waitForNotExist(element, timeout = timeouts.S30, message = 'ELEMENT SHOULD NOT EXIST, TIMEOUT ERROR') {
        await element.waitForExist({
            timeout: timeout,
            reverse: true,
            timeoutMsg: `${message}. LOCATOR: ${element.selector} \n ${new Error().stack}`
        });
    }

    /**
     * Wait until element is not enabled
     * @param {Element} element - element to check
     * @param {number} [timeout=timeouts.S30] - time to wait
     * @param {string} [message='ELEMENT SHOULD NOT BE ENABLED, TIMEOUT ERROR'] - message to give on failure
     * @returns {Promise<void>}
     */
    async waitForNotEnabled(element, timeout = timeouts.S30, message = 'ELEMENT SHOULD NOT BE ENABLED, TIMEOUT ERROR') {
        await element.waitForEnabled({
            timeout: timeout,
            reverse: true,
            timeoutMsg: `${message}. LOCATOR: ${element.selector} \n ${new Error().stack}`
        });
    }

    /**
     * Wait until element is not displayed
     * @param {Element} element - element to check
     * @param {number} [timeout=timeouts.S30] - time to wait
     * @param {string} [message='ELEMENT SHOULD NOT BE DISPLAYED, TIMEOUT ERROR'] - message to give on failure
     * @returns {Promise<void>}
     */
    async waitForNotDisplayed(element, timeout = timeouts.S30, message = 'ELEMENT SHOULD NOT BE DISPLAYED, TIMEOUT ERROR') {
        await element.waitForDisplayed({
            timeout: timeout,
            reverse: true,
            timeoutMsg: `${message}. LOCATOR: ${element.selector} \n ${new Error().stack}`
        });
    }

    /**
     * Wait until page is loaded
     * @returns {Promise<void>}
     */
    async waitForPageToBeLoaded() {
        await browser.wait(
            async () => await browser.executeScript('return document.readyState==="complete"'),
            timeouts.S45
        );
    }

    /**
     * Be careful when using this function!!! It increases execution time
     * Wait for element to be static
     * @param {Element} element - element to check
     * @param {number} [timeout=timeouts.S15] - time to wait
     * @param {string} [message='Element is not static error'] - message to give on failure
     * @returns {Promise<void>}
     */
    async waitForStatic(element, timeout = timeouts.S15, message = 'Element is not static error') {
        const prevLocation = {x: 0, y: 0};
        let stabilityLevel = 0;
        await browser.waitUntil(async () => {
            const location = await element.getLocation();
            if (prevLocation.y === location.y && prevLocation.x === location.x) {
                stabilityLevel++;
            } else if (stabilityLevel > 0) {
                stabilityLevel = 0;
            }
            prevLocation.y = location.y;
            prevLocation.x = location.x;
            if (stabilityLevel === 3) {
                return true;
            }
            return await browser.pause(100).then(() => false);
        }, timeout, `${message}. LOCATOR: ${element.selector} \n ${new Error().stack}`);
    }

    /**
     * Waits for element attribute to not contain a text.
     * @param {Element} element - element to check
     * @param {string} attribute - element attribute to check
     * @param {string} text - text to look for in attribute
     * @param {number} [timeout=timeouts.S5] - time to wait
     * @param {string} [message] - custom error message
     * @returns {Promise<void>}
     */
    async waitForAttributeNotToContainText(
        element,
        attribute,
        text,
        timeout = timeouts.S5,
        message = `'${attribute}' attribute still contains '${text}' after ${timeout}`
    ) {
        await browser.wait(
            async () => !(await element.getAttribute(attribute)).includes(text),
            timeout,
            `${message}. LOCATOR: ${element.locator().value} \n ${new Error().stack}`
        );
    }

    /**
     * Waits for element attribute to contain some text
     * @param {Element} element - element to check
     * @param {string} attribute - element attribute to check
     * @param {string} text - text to look for in attribute
     * @param {number} [timeout=timeouts.S5] - time to wait
     * @param {string} [message] - custom error message
     * @returns {Promise<void>}
     */
    async waitForAttributeToContainText(
        element,
        attribute,
        text,
        timeout = timeouts.S5,
        message = `'${attribute}' attribute does not contain '${text}' after ${timeout}`
    ) {
        await browser.wait(
            async () => (await element.getAttribute(attribute)).includes(text),
            timeout,
            `${message}. LOCATOR: ${element.locator().value} \n ${new Error().stack}`
        );
    }

    /**
     *  Waits for a new tab to be loaded by considering an increment of 1 to the list of window handles if
     *  no parameter is sent then the method will wait for the second tab to be open
     *  Handles need to be sent as an integer number e.g. await browser.getWindowHandles().length
     * 
     * @param {number} [handles = 1] - Number of window handles open at the moment of waiting for a new tab
     * @param {number} [timeout = timeouts.S5] - time to wait
     */
    async waitForNewTab(handles = 1, timeout = timeouts.S5){
		await browser.waitUntil(
			async function () {
				const openTabs = await browser.getWindowHandles();
				return ( openTabs.length > handles ) ; },
			{
				timeout: timeout,
				timeoutMsg: 'Failed while waiting for New Tab'
			}
		);
	}

    /**
     * Waits for an Alert to be displayed
     * @param {number} [timeout = timeouts.S3] - time to wait
     * 
     */
    async waitForAlert(timeout = timeouts.S3){
		await browser.waitUntil(
			async function (){ 
                return ( await browser.isAlertOpen() ) ; 
            },
			async function (){ 
                return ( await browser.isAlertOpen() ) ; 
            },
			{
				timeout: timeout,
				timeout: timeout,
				timeoutMsg: 'Failed while waiting for Alert to show up'
			}
		);
	}
}

module.exports = {
    timeouts,
    WaitHelper
};
