import { When, Then, expect } from "../baseTest";
import { Hud } from "../pages/Hud";

/**
 * @domain sound
 * @description clicks the speaker button in the HUD
 * @prereq the room is showing
 * @uses world
 */
When("I toggle the sound", async ({ world }) => {
  await new Hud(world.activePage).toggleSound();
});

/**
 * @domain sound
 * @description checks the sound button is pressed, meaning sound is on
 * @prereq the room is showing
 * @uses world
 */
Then("the sound button is pressed", async ({ world }) => {
  await expect(new Hud(world.activePage).soundButton).toHaveAttribute("aria-pressed", "true");
});

/**
 * @domain sound
 * @description checks the sound button is not pressed, meaning sound is off
 * @prereq the room is showing
 * @uses world
 */
Then("the sound button is not pressed", async ({ world }) => {
  await expect(new Hud(world.activePage).soundButton).toHaveAttribute("aria-pressed", "false");
});

/**
 * @domain sound
 * @description checks the sound button's accessible label
 * @prereq the room is showing
 * @uses world
 */
Then("the sound button is labelled {string}", async ({ world }, label: string) => {
  await expect(new Hud(world.activePage).soundButton).toHaveAccessibleName(label);
});

/**
 * @domain sound
 * @description checks the voice recording was never requested
 * @prereq the portfolio was opened in this scenario
 * @uses page, world
 */
Then("the voice recording has not been downloaded", async ({ page, world }) => {
  // Let the page settle before a negative check; best effort, since a late lazy fetch could still follow.
  await page.waitForLoadState("networkidle");
  expect(world.requests.some((url) => url.endsWith("/hmm.mp3"))).toBe(false);
});

/**
 * @domain sound
 * @description waits for the voice recording to be requested
 * @prereq the portfolio was opened in this scenario
 * @uses world
 */
Then("the voice recording has been downloaded", async ({ world }) => {
  await expect.poll(() => world.requests.some((url) => url.endsWith("/hmm.mp3"))).toBe(true);
});
