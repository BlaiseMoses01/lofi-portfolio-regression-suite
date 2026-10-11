import { When, Then, expect } from "../baseTest";
import { BootScreen } from "../pages/BootScreen";

/**
 * @domain boot gate
 * @description checks the boot screen shows, or has typed out, some text (retries while it types)
 * @prereq the portfolio is open
 * @uses page
 */
Then("the boot screen shows/types {string}", async ({ page }, text: string) => {
  await expect(new BootScreen(page).text(text)).toBeVisible();
});

/**
 * @domain boot gate
 * @description checks the boot screen does not show some text, or that it has left the screen (a regex step, because the two phrasings differ by more than one word)
 * @prereq the portfolio is open
 * @uses page
 */
Then(
  /^the boot screen (?:does not show|no longer shows) "([^"]*)"$/,
  async ({ page }, text: string) => {
    await expect(new BootScreen(page).text(text)).toHaveCount(0);
  },
);

/**
 * @domain boot gate
 * @description clicks (taps) the boot screen to wake it
 * @prereq the boot screen is waiting
 * @uses page
 */
When("I click/wake the boot screen", async ({ page }) => {
  await new BootScreen(page).click();
});
