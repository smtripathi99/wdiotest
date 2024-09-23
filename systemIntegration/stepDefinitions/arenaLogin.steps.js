import {When} from "@wdio/cucumber-framework";
import arenaLogin from '../pageObjects/arenaLogin'
import Constants from '../utils/constants';

//Login Code
When(/^User logs in to Horizon using username "([^"]*)" and password "([^"]*)"$/, async (username, password) => {
    await arenaLogin.login(username, password);
    await browser.pause(Constants.WAIT_CONSTANT_5_SECS);
    const currentUrl = await browser.getUrl();
    if (currentUrl.includes('two-step-verification')) {
        await arenaLogin.completeAuthNFlowLogin();
    } else {
        console.log('No Auth Flow Required.');
    }
   

});

