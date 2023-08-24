const {timeouts, WaitHelper} = require('../utils/wait-helper');
const waitHelper = new WaitHelper();

/**
 * concat error stacks and throws an error
 * @param {Object} err - error object to be thrown
 */
 function throwNiceError(err) {
    err.stack += `\n Locator: ${this.selector}\n STACK: ${this.frStack}`;
    throw err;
}

class ActionHelper {

    /**
     * Launches a native app in the driver
     *
     */
    static async launchApp() {
        await driver.launchApp();
    }

    /**
     * Launches a fresh native app in the driver
     *
     */
     static async launchFreshApp() {
        await driver.resetApp();
        await this.launchApp();
    }     

    /**
     * Switches the driver to native context
     *
     */
    static async switchToNativeContext() {
        await browser.switchContext('NATIVE_APP');
    }

    /**
     * Stops the driver for a given amount of time
     *
     * @param timeout
     *
     */
    static async pause(timeout = 2000) {
        await browser.pause(timeout);
    }

    /**
     * Scrolls from center of the screen to element's location
     * @returns {Promise<void>}
     */
    static async scrollTo() {
        const initialLocation = {x: 0, y: 0};
        initialLocation.y = (await browser.getWindowSize()).height/2;
        const finalLocation = await this.getLocation();
    
        await driver.touchPerform([
            { action: 'press', options: initialLocation},
            { action: 'wait', options: { ms: 100 },},
            { action: 'moveTo', options: {x: 0, y: finalLocation.y}},
            { action: 'release' }
        ]);
        await this.pause(100);
    }

    /**
     * Waits for an element to be visible or static, and scrolls to it
     * @param {Element} element - Element to wait for and scroll to
     * @param {Object} [options] - Options
     * @param {boolean} [options.waitForDisplayed = false] - True to wait for the element to be displayed
     * @param {boolean} [options.waitForStatic = false] - True to wait for the element to be static
     * @param {number} [options.timeout = timeouts.S15] - Time to wait
     * @param {Function} errorHandler - Function to call to when something fails
     * @returns {Promise<void>}
     */
    static async waitForElementAndScroll(
        element,
        {
            waitForDisplayed = false,
            waitForStatic = false,
            timeout = timeouts.S15
        } = {},
        errorHandler
    ) {
        await waitHelper.waitForExist(element, timeout).then(undefined, errorHandler);
        if (waitForDisplayed && !await element.isDisplayed()) {
            await ActionHelper.scrollTo.call(element).then(undefined, errorHandler);
            await waitHelper.waitForDisplayed(element, timeout).then(undefined, errorHandler);
        }
        if (waitForStatic)
            await waitHelper.waitForStatic(element, timeout).then(undefined, errorHandler);
    }  
    
    /**
     * Performs additional checks and waits (depending on passed options) before executing click action on web element.
     * @param {Object} [options] - Options
     * @param {boolean} [options.waitForDisplayed = false] - True to wait for the element to be displayed
     * @param {boolean} [options.waitForStatic = false] - True to wait for the element to be static
     * @param {number} [options.timeout = timeouts.S15] - Time to wait
     * @param {number} [options.pauseTimeout = 0] - Time to pause the driver for
     * @param {Function} errorHandler - Function to call to when something fails
     * @returns {Promise<void>}
     */
    static async click(
        origClickFunction, 
        { 
            waitForDisplayed = false,
            waitForStatic = false,
            timeout = timeouts.S15,
            pauseTimeout = 0
        } = {}
    ){
        const errorHandler = throwNiceError.bind(this);
        this.frStack = new Error().stack;
        await ActionHelper.waitForElementAndScroll(this, {waitForDisplayed, waitForStatic, timeout}, errorHandler);
        await origClickFunction().then(undefined, errorHandler);
        if (pauseTimeout > 0)
            await ActionHelper.pause({pauseTimeout});
    }
    
    /**
     * Performs additional checks and waits before executing get text action on web element.
     * @param {Object} [options] - options
     * @param {boolean} [options.waitForDisplayed] - specifies to wait for element visibility
     * @param {boolean} [options.waitForStatic] - specifies to wait for element to be static
     * @param {number} [options.timeout] - amount of time to wait before throwing an error for every wait function
     * @returns {Promise<string>}
     */
    static async getText(origGetTextFunction, {waitForDisplayed = false, waitForStatic = false, timeout = timeouts.S5} = {}) {
        const errorHandler = throwNiceError.bind(this);
        this.frStack = new Error().stack;
        await ActionHelper.waitForElementAndScroll(this, {waitForDisplayed, waitForStatic, timeout}, errorHandler);
        return await origGetTextFunction().then(undefined, errorHandler);
    };        

    /**
     * Performs additional checks and waits before executing send keys action on web element.
     * @param {string} value - value to be typed into input element
     * @param {Object} [options] - options
     * @param {boolean} [options.waitForDisplayed] - specifies to wait for element visibility
     * @param {boolean} [options.waitForStatic] - specifies to wait for element to be static
     * @param {number} [options.timeout] - amount of time to wait before throwing an error for every wait function
     * @returns {Promise<void>}
     */
    static async setValue(origSetValueFunction, value, {waitForDisplayed = false, waitForStatic = false, timeout = timeouts.S5} = {}) {
        const errorHandler = throwNiceError.bind(this);
        this.frStack = new Error().stack;
        await ActionHelper.waitForElementAndScroll(this, {waitForDisplayed, waitForStatic, timeout}, errorHandler);
        await origSetValueFunction(value).then(undefined, errorHandler);
    };

    /**
     * Returns array of texts from ElementArray
     * @returns {Promise<string[]|null[]>}
     */
    static async getElementsText() {
        const elementArray = await $$(this.selector);
        //here this is just a selector, not an element
        //const elementArray = await $$(this);
        const elementValues = [];
        for (const element of elementArray) {
            elementValues.push(await element.getText());
        }
        return elementValues;
    };

    /**
     * Returns array of attribute values from ElementArray
     * @param {string} attribute - specify attribute which value should be returned
     * @returns {Promise<string|null[]>}
     */
     static async getElementsAttribute(attribute) {
        const elementArray = await $$(this.selector);
        const elementAttributes = [];
        for (const element of elementArray) {
            elementAttributes.push(await element.getAttribute(attribute));
        }
        return elementAttributes;
    };

    /**
     * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
     *
     * @param {object} from Example { x: 50, y: 50 }
     * @param {object} to Example { x: 25, y: 25 }
     *
     */
    static async swipe (from, to) {
        await driver.touchPerform([
            { action: 'press', options: from},
            { action: 'wait', options: { ms: 100 },},
            { action: 'moveTo', options: to},
            { action: 'release' }
        ]);
        await this.pause(100);
    }

    /**
     * Method to add browser/element wdio custom commands
     * @param {Browser} browser - browser/driver global var
     * @returns {Promise<void>}
     */
    static async addCommands(browser) {
        await browser.overwriteCommand('click', this.click, true);
        await browser.overwriteCommand('getText', this.getText, true);
        await browser.overwriteCommand('setValue', this.setValue, true);
        await browser.addCommand('getElementsText', this.getElementsText, true);
        await browser.addCommand('getElementsAttribute', this.getElementsAttribute, true);
    }

    /**
     * This method work to scroll forward horizontally in android
     */
    static async scrollForward() {
        await $('android=new UiScrollable(new UiSelector().scrollable(true)).setAsHorizontalList().scrollForward()');
    }

    /**
     * This method work to scroll Backward horizontally in android
     */
    static async scrollBackward() {
        await $('android=new UiScrollable(new UiSelector().scrollable(true)).setAsHorizontalList().scrollBackward()');
    }
}

module.exports = ActionHelper;
