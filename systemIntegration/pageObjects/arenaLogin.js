import Constants from '../utils/constants';

const USER_NAME_INPUT = '#eliloUserID';
const PASSWORD_INPUT = '#eliloPassword';
const SUBMIT_BUTTON = '#loginSubmit';
const LOG_IN_BUTTON = '//*[contains(@class,"axp-global-header__dls-module__btn")][contains(@class,"NavLoginBtn")]';
const EMAIL_BUTTON = '//*[contains(@value,"EMAIL")]//following-sibling::label';
const CONTINUE_BUTTON = "//*[contains(@class,'group-primary')]//*[contains(@type,'submit')]";
const VERIFICATION_CODE_INPUT = '(//*[@id="question-input"])|(//*[@id="question-value"])';
const DEVICE_NAME = '#device-name-input';
const TRUST_DEVICE_TICK_BOX = '//*[@id="trustDevice"]//following-sibling::label';
const CONTINUE_BUTTON_1 = '//*[contains(@type,"submit")]';
//(//*[contains(@class,"one-identity-two-step-verification")]//*[contains(@type,"submit")])|
const acceptAllCookiesButton='#user-consent-management-granular-banner-accept-all-button';
class arenaLogin {
    get userNameInput() {return $(USER_NAME_INPUT);}
    get passwordInput() {return $(PASSWORD_INPUT);}
    get submitButton() {return $(SUBMIT_BUTTON);}
    get logInButton() {return $(LOG_IN_BUTTON);}
    get emailSelectButton() {return $(EMAIL_BUTTON);}
    get continueButton() {return $(CONTINUE_BUTTON);}
    get verificationCodeInput() {return $(VERIFICATION_CODE_INPUT);}
    get deviceName() {return $(DEVICE_NAME);}
    get trustDeviceTickBox() {return $(TRUST_DEVICE_TICK_BOX);}
    get continueButton1() {return $(CONTINUE_BUTTON_1);}

    get acceptAllCookiesButton() {return $(acceptAllCookiesButton);}
    async login(userName, password) {
        await browser.pause(Constants.WAIT_CONSTANT_60_SECS);
        if (!await this.userNameInput.isDisplayed()) {
            await this.logInButton.waitForExist({timeout: Constants.WAIT_CONSTANT_60_SECS});
            await this.logInButton.click();
        }
        await browser.pause(Constants.WAIT_CONSTANT_15_SECS);
        await this.userNameInput.setValue(userName);
        await this.passwordInput.setValue(password);
        await this.submitButton.click();
    }

    async completeAuthNFlowLogin() {
        await browser.pause(Constants.WAIT_CONSTANT_5_SECS);
        if (await this.emailSelectButton.isExisting()) {
            await this.emailSelectButton.click();
            await this.continueButton.click();
        }
        await this.verificationCodeInput.waitForExist({timeout: Constants.WAIT_CONSTANT_60_SECS});
        await this.verificationCodeInput.setValue('111111');
        await this.continueButton.click();
        await browser.pause(Constants.WAIT_CONSTANT_5_SECS);
        if (await this.trustDeviceTickBox.isExisting()) {
            await this.trustDeviceTickBox.click();
            await this.deviceName.waitForExist({timeout: Constants.WAIT_CONSTANT_60_SECS});
            await this.deviceName.setValue('Windows');
            await this.continueButton1.click();
        } else {
            console.log('Trusted device not required for await this log in');
        }
    }
   
}
module.exports = new arenaLogin();
