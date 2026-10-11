import { When } from "../baseTest";

/**
 * @domain deep links
 * @description changes the hash of the loaded page, as following an in-page link would
 * @prereq the portfolio is open
 * @uses page
 */
When("I follow a link to {string}", async ({ page }, hash: string) => {
  // Setting location.hash is exactly what an in-page anchor click does, and fires the hashchange the site listens for.
  await page.evaluate((target) => {
    window.location.hash = target;
  }, hash);
});
