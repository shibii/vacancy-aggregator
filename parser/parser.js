"strict";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const sources = require("./sites/sources");
const { database } = require("../database");
const log = require("./log");

const cleanHeader = str => {
  return str
    .replace(/<br\/>|\\n|\\t/gm, " ")
    .replace(/\s\s+/gm, " ")
    .trim();
};

const cleanContent = strs => {
  return strs
    .join(" ")
    .replace(/[^\wäö.:\-+\/]/gim, " ")
    .replace(/\s\s+/gm, " ")
    .trim();
};

const filterIncomplete = vacancies => {
  filtered = vacancies.filter(
    vacancy => vacancy.contents !== undefined && vacancy.header !== undefined
  );
  if (filtered.length < vacancies.length) {
    const incomplete = vacancies.length - filtered.length;
    const source = vacancies[0].source;
    log.info("filtered " + incomplete + " incomplete vacancies from " + source);
  }
  return filtered;
};

const scrape = async (page, config) => {
  try {
    await page.goto(config.url, {
      timeout: process.env.PUPPETEER_NAVIGATION_TIMEOUT
    });
  } catch (err) {
    log.info("Unable to go to page: " + config.url);
    log.error(err);
  }

  // call entry function if present
  try {
    if (config.onEntry) {
      await config.onEntry(page);
    }
  } catch (err) {
    log.info("Unable to execute entry function on page: " + config.url);
    log.error(err);
  }

  // begin constructing the vacancy objects by collect urls
  await page.waitForXPath(config.linkSelector);
  let linkHandles = await page.$x(config.linkSelector);
  let vacancies = await Promise.all(
    linkHandles.map(handle =>
      page.evaluate(handle => ({ url: handle.href }), handle)
    )
  );

  // clean url
  if (config.cleanUrl) {
    vacancies.map(vacancy => (vacancy.url = config.cleanUrl(vacancy.url)));
  }

  // leave only new vacancies
  try {
    vacancies = await database.vacancies.getUnparsedUrls(vacancies);
  } catch (err) {
    log.error("Unable to query database for unparsed urls");
    throw err;
  }

  for (let i = 0; i < vacancies.length; i++) {
    try {
      await page.goto(vacancies[i].url, {
        timeout: process.env.PUPPETEER_NAVIGATION_TIMEOUT
      });
      // call prep function if present
      if (config.beforeContent) {
        await config.beforeContent(page);
      }

      // add source
      vacancies[i].source = config.source;

      // get header
      await page.waitForXPath(config.headerSelector);
      const [headerHandle] = await page.$x(config.headerSelector);
      const header = await page.evaluate(
        header => header.textContent,
        headerHandle
      );
      vacancies[i].header = cleanHeader(header);

      // get content
      await page.waitForXPath(config.contentSelector);
      let contentHandles = await page.$x(config.contentSelector);
      let contents = await Promise.all(
        contentHandles.map(handle =>
          page.evaluate(handle => handle.textContent, handle)
        )
      );
      vacancies[i].contents = cleanContent(contents);
    } catch (err) {
      log.info("unable to parse " + vacancies[i].url);
      log.error(err);
    }
  }
  return filterIncomplete(vacancies);
};

(async () => {
  log.info("start parsing");
  const start = new Date();
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(process.env.PUPPETEER_GLOBAL_TIMEOUT);

  // parse vacancies from sources
  let vacancies = [];
  for (let i = 0; i < sources.length; i++) {
    try {
      vacancies = vacancies.concat(await scrape(page, sources[i]));
      log.info("succesfully parsed " + sources[i].source);
    } catch (err) {
      log.info("failed parsing " + sources[i].source);
      log.error(err);
    }
  }
  log.info(vacancies.length + " new vacancies parsed");

  if (vacancies.length > 0) {
    try {
      await database.vacancies.insert(vacancies);
    } catch (err) {
      log.error("unable to insert new vacancies to database");
    }
  }

  const end = new Date() - start;
  log.info("finished parsing with total time taken: " + end / 1000);
  await browser.close();
})();
