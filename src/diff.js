const fs = require("fs");
const looksSame = require("looks-same");

const getDirectoriesOrderedByName = (path) => {
  return fs
    .readdirSync(path)
    .filter((file) => fs.statSync(`${path}/${file}`).isDirectory())
    .sort()
    .reverse();
};

/**
 * Check if the latest screenshot is identical to the previous screenshot.
 * It renders a diff image if they are not identical.
 *
 * @param {string} domain Domain of the checked URL to use in the directory name
 * @param {string} file Name of the page/screenshot we are checking
 * @returns {boolean|null} True if the two screenshots are identical, false if they are different, null if an error occurred
 */
const checkIfIdentical = (latest, previous) => {
  let result = false;

  looksSame(previous, latest, (error, diff) => {
    if (error) {
      console.log(
        `Something went wrong comparing ${latest} and ${previous}: `,
        error
      );
      result = null;
    } else if (diff.equal === false) {
      console.log(`Different: ${latest} & ${previous}`);
      createDiff(latest, previous);
      result = false;
    } else if (diff.equal === true) {
      console.log(`Identical: ${latest} & ${previous}`);
      result = true;
    } else {
      console.log(`Unknown result comparing ${latest} and ${previous}`);
      result = null;
    }
  });
  return result;
};

/**
 * Create a diff image between two screenshots if they are not identical.
 *
 * @param {string} latest File path & name of the current (latest) screenshot
 * @param {string} previous File path & name of the reference (previous) screenshot
 */
const createDiff = (latest, previous) => {
  looksSame.createDiff(
    {
      reference: previous,
      current: latest,
      diff: `${latest}.diff.png`,
      highlightColor: "#ff00ff",
      strict: false,
      tolerance: 2.5,
      antialiasingTolerance: 0,
      ignoreAntialiasing: true,
      ignoreCaret: true,
    },
    (error) => {
      if (error) {
        console.log(`Error comparing ${previous} and ${latest}: `);
        console.log(error);
      } else {
        console.log(
          `Diff created: ${latest}.diff.png`
        );
      }
    }
  );
};

/**
 * Check if the pages in urls.json have changed since the last run.
 * It will generate diff images if they have changed.
 *
 * @param {string} domain Domain of the checked URL to use in the directory name
 * @returns {array} Result of the comparison of the latest screenshots with the previous ones
 */
const diffLatestandPrevious = (domain) => {
  const directories = getDirectoriesOrderedByName(`screenshots/${domain}`);

  if (directories.length < 2) {
    console.log("No previous screenshots to compare");
    return;
  }
  const results = [];
  const latest = directories[0];
  const previous = directories[1];

  fs.readdirSync(`screenshots/${domain}/${latest}`)
    .filter((file) => !file.includes("diff"))
    .forEach((file) => {
      results.push(
        checkIfIdentical(
          `screenshots/${domain}/${latest}/${file}`,
          `screenshots/${domain}/${previous}/${file}`
        )
      );
    });

  return results;
}
module.exports = diffLatestandPrevious
