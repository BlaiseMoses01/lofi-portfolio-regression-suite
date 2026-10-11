import { Given, When, Then, expect } from "../baseTest";
import { ReadingPanel } from "../pages/ReadingPanel";

/**
 * @domain poi lists
 * @description checks how many entries the open listing shows
 * @prereq a listing point is open
 * @uses page
 */
Then("the listing has {int} entries", async ({ page }, count: number) => {
  await expect(new ReadingPanel(page).listingRows).toHaveCount(count);
});

/**
 * @domain poi lists
 * @description checks the name and the summary line of one numbered listing row
 * @prereq a listing point is open
 * @uses page
 */
Then(
  "listing entry {string} is {string} with the summary {string}",
  async ({ page }, number: string, name: string, summary: string) => {
    const panel = new ReadingPanel(page);
    await expect(panel.listingName(number)).toHaveText(name);
    await expect(panel.listingSummary(number)).toHaveText(summary);
  },
);

/**
 * @domain poi lists
 * @description opens one entry of the listing by its name
 * @prereq a listing point is open on its listing
 * @uses page
 */
When("I open the {string} entry", async ({ page }, name: string) => {
  await new ReadingPanel(page).openEntry(name);
});

/**
 * @domain poi lists
 * @description goes from an opened entry back to the listing with the cd .. link
 * @prereq a listing entry is open
 * @uses page
 */
When("I go back to the listing", async ({ page }) => {
  await new ReadingPanel(page).cdUp();
});

/**
 * @domain poi lists
 * @description opens a listing entry as a precondition and waits for the entry to be open (its cd .. link shows)
 * @prereq a listing point is open on its listing
 * @uses page
 */
Given("I have opened the {string} entry", async ({ page }, name: string) => {
  const panel = new ReadingPanel(page);
  await panel.openEntry(name);
  await expect(panel.cdBack).toBeVisible();
});
