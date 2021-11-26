const puppeteer = require("puppeteer");
const fs = require("fs");

/**
 * Take a screenshot of a specific page
 *
 * @param {object} page The puppeteer Page object
 * @param {string} filename The name of the url we want to take a screenshot of, used for naming the screenshot
 * @param {string} url The url we want to take a screenshot of
 */
const takePageScreenshot = async (page, filename, url) => {
  await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });
  console.log(`Screenshotting ${url}`)
  await page.screenshot({
    path: filename,
    fullPage: true,
  });
  console.log(`Screenshot placed in ${filename}`)
};

const prepareDirectoryStructure = (path) => {
  fs.mkdirSync(path, { recursive: true });
};

/**
 * Get the date and time in the format YYYY-MM-DD-HH-MM-SS
 */
const getDateTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${year}${month}${day}-${hour}${minute}`;
};

/**
 * Loop through the pages and take a screenshot of each page
 *
 * @param {string} domain The domain name that our urls belong to
 * @param {array} pages The array of pages we want to loop through to take screenshots of
 */
 const screenshotPages = async (domain, pages) => {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 100000,
  });

  const page = await browser.newPage();
  const datetime = getDateTime();

  prepareDirectoryStructure(`screenshots/${domain}/${datetime}`);

  for (const [name, url] of Object.entries(pages)) {
    const filename = `screenshots/${domain}/${datetime}/${name}.png`;
    await takePageScreenshot(page, filename, url);
  }

  browser.close();
}

module.exports = screenshotPages;
