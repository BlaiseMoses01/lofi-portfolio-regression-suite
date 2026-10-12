import { Then, expect } from "../baseTest";
import { Hud } from "../pages/Hud";
import { ReadingPanel } from "../pages/ReadingPanel";

/**
 * @domain outbound links
 * @description checks the reading panel has a VISIT link with exactly this destination
 * @prereq a point or entry is open
 * @uses page
 */
Then("the reading panel has a VISIT link to {string}", async ({ page }, url: string) => {
  await expect(new ReadingPanel(page).visitLink).toHaveAttribute("href", url);
});

/**
 * @domain outbound links
 * @description checks the VISIT link opens a new tab and cannot reach back to this page (noopener)
 * @prereq a point with a VISIT link is open
 * @uses page
 */
Then("the VISIT link opens in a new tab without access to this page", async ({ page }) => {
  const link = new ReadingPanel(page).visitLink;
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
});

/**
 * @domain outbound links
 * @description checks the reading panel has no VISIT link
 * @prereq a point or entry is open
 * @uses page
 */
Then("the reading panel has no VISIT link", async ({ page }) => {
  const panel = new ReadingPanel(page);
  await expect(panel.openPrompt).toBeVisible();
  await expect(panel.visitLink).toHaveCount(0);
});

/**
 * @domain outbound links
 * @description checks the footer shows the owner's name with the year of the page's own clock
 * @prereq the room has been entered
 * @uses page
 */
Then("the footer shows {string} with the current year", async ({ page }, name: string) => {
  // the page's Date, not Node's: the scenario may have mocked the browser clock
  const year = await page.evaluate(() => new Date().getFullYear());
  await expect(new Hud(page).footer).toHaveText(`© ${year} ${name}`);
});

/**
 * @domain outbound links
 * @description checks the footer's email link points at the given mailto address
 * @prereq the room has been entered
 * @uses page
 */
Then("the footer has an email link to {string}", async ({ page }, href: string) => {
  await expect(new Hud(page).footerEmail).toHaveAttribute("href", href);
});

/**
 * @domain outbound links
 * @description checks the footer's GitHub link goes to the given URL and shows the given label
 * @prereq the room has been entered
 * @uses page
 */
Then(
  "the footer has a link to {string} labelled {string}",
  async ({ page }, href: string, label: string) => {
    const link = new Hud(page).footerGithub;
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveText(label);
  },
);
