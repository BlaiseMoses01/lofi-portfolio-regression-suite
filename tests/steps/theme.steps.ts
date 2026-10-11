import { When, Then, expect } from "../baseTest";
import { BasePage } from "../pages/BasePage";
import { Hud } from "../pages/Hud";
import { RoomPage } from "../pages/RoomPage";

/** The plate file the site downloads for each theme. */
const PLATES: Record<string, string> = { day: "/src-day.webp", night: "/src-night.webp" };

/** The plate file for a theme; throws on a theme the site does not have, so a typo cannot pass vacuously. */
function plate(theme: string): string {
  const file = PLATES[theme];
  if (!file) throw new Error(`unknown theme "${theme}"`);
  return file;
}

/**
 * @domain theme
 * @description checks the HUD lights switch shows the given mode (checked means day)
 * @prereq the portfolio is open; afterwards only the theme, sound and reload steps act on the new tab
 * @uses world
 */
Then("the room is in {string} mode", async ({ world }, mode: string) => {
  const lights = new Hud(world.activePage).lightsSwitch;
  await expect(lights).toHaveAttribute("aria-checked", mode === "day" ? "true" : "false");
});

/**
 * @domain theme
 * @description checks the HUD lights switch is labelled with the action it offers
 * @prereq the portfolio is open; afterwards only the theme, sound and reload steps act on the new tab
 * @uses world
 */
Then("the lights switch offers {string}", async ({ world }, label: string) => {
  await expect(new Hud(world.activePage).lightsSwitch).toHaveAccessibleName(label);
});

/**
 * @domain theme
 * @description clicks the lights switch in the HUD
 * @prereq the room is showing
 * @uses world
 */
When("I toggle the lights from the HUD", async ({ world }) => {
  await new Hud(world.activePage).toggleLights();
});

/**
 * @domain theme
 * @description clicks the light switch drawn on the wall of the room
 * @prereq the room is showing
 * @uses world
 */
When("I flip the light switch on the wall", async ({ world }) => {
  await new RoomPage(world.activePage).flipWallLightSwitch();
});

/**
 * @domain theme
 * @description opens the portfolio in a fresh tab of the same browser, with the same clock and reduced motion, so the tab's sessionStorage is empty but local storage is kept
 * @prereq the portfolio is open; afterwards only the theme, sound and reload steps act on the new tab
 * @uses page, world
 */
When("I return in a new browser session", async ({ page, world }) => {
  // A new tab has its own sessionStorage, which is what ends "the tab" in the site's terms. The
  // clock is shared by the browser context, but reduced motion is per page.
  const fresh = await page.context().newPage();
  await fresh.emulateMedia({ reducedMotion: "reduce" });
  await new BasePage(fresh).goto("/");
  world.activePage = fresh;
});

/**
 * @domain theme
 * @description checks the artwork plate of a theme was requested
 * @prereq the portfolio was opened in this scenario
 * @uses world
 */
Then("the {string} room artwork has been downloaded", async ({ world }, theme: string) => {
  await expect.poll(() => world.requests.some((url) => url.endsWith(plate(theme)))).toBe(true);
});

/**
 * @domain theme
 * @description checks the artwork plate of a theme was never requested
 * @prereq the portfolio was opened in this scenario
 * @uses page, world
 */
Then(
  "the {string} room artwork has not been downloaded",
  async ({ page, world }, theme: string) => {
    // Let the page settle before a negative check; best effort, since a late lazy fetch could still follow.
    await page.waitForLoadState("networkidle");
    expect(world.requests.some((url) => url.endsWith(plate(theme)))).toBe(false);
  },
);
