const { promisify } = require('util');
const fs = require('fs');

const { Builder, By, Key, promise, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

promise.USE_PROMISE_MANAGER = false;
process.env.MOZ_HEADLESS = "1";

let driver = new Builder()
.forBrowser('firefox')
.setFirefoxOptions(new firefox.Options().setBinary(firefox.Channel.NIGHTLY))
.build();

async function main() {
  await driver.get('https://developer.mozilla.org/');
  await driver.findElement(By.id('home-q')).sendKeys('testing', Key.RETURN);
  await driver.wait(until.titleIs('Search Results for "testing" | MDN'));
  await driver.wait(async () => {
    return await driver.executeScript('return document.readyState') === 'complete';
  });

  const data = await driver.takeScreenshot();
  await promisify(fs.writeFile)('screenshot.png', data, 'base64');
  driver.quit();
}

main();
