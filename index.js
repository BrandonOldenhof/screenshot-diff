const fs = require('fs');
const diff = require('./src/diff.js')
const screenshot = require('./src/screenshot.js')
const core = require('@actions/core');
// const github = require('@actions/github');

const projectUrls = JSON.parse(fs.readFileSync(`${__dirname}/urls.json`));
const domain = new URL(projectUrls.pages.home).hostname

// console.log(screenshot)
try {
    screenshot(domain, projectUrls.pages).then(() => {
        diff(domain);
    });
} catch (error) {
    core.setFailed(error.message);
}