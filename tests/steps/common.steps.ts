import { Given, When, Then, expect } from "../baseTest";
import { BasePage } from "../pages/BasePage";
import { BootScreen } from "../pages/BootScreen";
import { Hud } from "../pages/Hud";
import { ReadingPanel } from "../pages/ReadingPanel";
import { RoomPage } from "../pages/RoomPage";
import { pointKey } from "./pointKeys";
import "dotenv/config";

/** Milliseconds of scene time the opening shot needs after the wake: boot lines, dwell and a margin. */
const INTRO_MS = 7000;

/**
 * @domain common steps
 * @description used to navigate to a path off of the currently set base URL
 * @prereq none
 * @uses page, baseURL
 */
Given("I navigate to path {string}", async ({ page, baseURL }, target: string) => {
  await new BasePage(page).goto(baseURL + target);
  expect(page.url()).toContain(baseURL + target);
});

/**
 * @domain common steps
 * @description sets the browser clock to today at the given local time so the day or night theme is predictable
 * @prereq runs before the portfolio is opened
 * @uses page, world
 */
Given("the visitor's local time is {string}", async ({ page, world }, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  await page.clock.install({ time: now });
  world.clockInstalled = true;
});

/**
 * @domain common steps
 * @description opens the portfolio with full motion so the boot screen is waiting; the page clock is installed first so the opening shot can be fast-forwarded
 * @prereq none
 * @uses page, world
 */
Given("I open the portfolio", async ({ page, world }) => {
  if (!world.clockInstalled) {
    await page.clock.install();
    world.clockInstalled = true;
  }
  world.opened = true;
  await new BasePage(page).goto("/");
});

/**
 * @domain common steps
 * @description opens the portfolio with prefers-reduced-motion, which skips the gate and the opening shot
 * @prereq runs before the portfolio is opened
 * @uses page, world
 */
Given("I open the portfolio with reduced motion", async ({ page, world }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  world.opened = true;
  await new BasePage(page).goto("/");
});

/**
 * @domain common steps
 * @description gets the visitor into the room: opens and wakes the portfolio with full motion and fast-forwards the opening shot
 * @prereq none
 * @uses page, world
 */
Given("I am in the room", async ({ page, world }) => {
  // The opening shot runs on the page clock, so fast-forwarding it is cheaper than waiting it out.
  if (!world.clockInstalled) {
    await page.clock.install();
    world.clockInstalled = true;
  }
  world.opened = true;
  await new BasePage(page).goto("/");
  await new BootScreen(page).click();
  await page.clock.runFor(INTRO_MS);
  await expect(new Hud(page).footer).toBeVisible();
  await expect(new BootScreen(page).gatePrompt).toHaveCount(0);
});

/**
 * @domain common steps
 * @description presses a key on the keyboard
 * @prereq the portfolio is open
 * @uses page
 */
When("I press {string}", async ({ page }, key: string) => {
  await new BasePage(page).press(key);
});

/**
 * @domain common steps
 * @description reloads the tab the visitor is looking at, keeping the same browser session
 * @prereq the portfolio is open
 * @uses world
 */
When("I reload the page", async ({ world }) => {
  await world.activePage.reload();
});

/**
 * @domain common steps
 * @description clicks a point's hotspot in the room, panning it into view first on a portrait screen
 * @prereq the room is showing with no point open
 * @uses page
 */
When("I open the {string} point", async ({ page }, title: string) => {
  await new RoomPage(page).openPoint(pointKey(title), title);
});

/**
 * @domain common steps
 * @description opens a point from the room and waits for its panel to show
 * @prereq the room is showing with no point open
 * @uses page
 */
Given("I have opened the {string} point", async ({ page }, title: string) => {
  await new RoomPage(page).openPoint(pointKey(title), title);
  await expect(new ReadingPanel(page).text(title)).toBeVisible();
});

/**
 * @domain common steps
 * @description clicks the back link of the open panel
 * @prereq a group or point panel is open
 * @uses page
 */
When("I go back to {string}", async ({ page }, label: string) => {
  await new ReadingPanel(page).goBack(label);
});

/**
 * @domain common steps
 * @description clicks the body of the open reading panel, which skips the typing
 * @prereq a point's body is showing
 * @uses page
 */
When("I skip the typing", async ({ page }) => {
  await new ReadingPanel(page).skipTyping();
});

/**
 * @domain common steps
 * @description checks the point's title is shown in the reading panel
 * @prereq a point is open
 * @uses page
 */
Then("the reading panel shows the title {string}", async ({ page }, title: string) => {
  await expect(new ReadingPanel(page).text(title)).toBeVisible();
});

/**
 * @domain common steps
 * @description checks the path header of the reading panel
 * @prereq a point is open
 * @uses page
 */
Then("the reading panel path is {string}", async ({ page }, path: string) => {
  await expect(new ReadingPanel(page).path(path)).toBeVisible();
});

/**
 * @domain common steps
 * @description checks the command prompt line of the reading panel
 * @prereq a point is open
 * @uses page
 */
Then("the reading panel prompt is {string}", async ({ page }, prompt: string) => {
  await expect(new ReadingPanel(page).text(prompt)).toBeVisible();
});

/**
 * @domain common steps
 * @description checks the visible (typed) body text of the reading panel contains some text
 * @prereq a point's body is showing
 * @uses page
 */
Then("the reading panel body contains {string}", async ({ page }, text: string) => {
  await expect(new ReadingPanel(page).body).toContainText(text);
});

/**
 * @domain common steps
 * @description checks no point is open, meaning no ~/group/point path header is on the page
 * @prereq none
 * @uses page
 */
Then("no reading panel is open", async ({ page }) => {
  await expect(new ReadingPanel(page).pathHeader).toHaveCount(0);
});

/**
 * @domain common steps
 * @description checks no group is open, meaning the group panel's ROOM back link is absent
 * @prereq none
 * @uses page
 */
Then("no group panel is open", async ({ page }) => {
  await expect(new ReadingPanel(page).roomLink).toHaveCount(0);
});

/**
 * @domain common steps
 * @description checks the group panel shows the given heading, together with its ROOM back link
 * @prereq a group is open
 * @uses page
 */
Then("the group panel shows the heading {string}", async ({ page }, heading: string) => {
  const panel = new ReadingPanel(page);
  await expect(panel.roomLink).toBeVisible();
  await expect(panel.text(heading)).toBeVisible();
});

/**
 * @domain common steps
 * @description checks the footer is showing
 * @prereq none
 * @uses page
 */
Then("the footer is visible", async ({ page }) => {
  await expect(new Hud(page).footer).toBeVisible();
});

/**
 * @domain common steps
 * @description checks the footer is not showing
 * @prereq none
 * @uses page
 */
Then("the footer is not visible", async ({ page }) => {
  await expect(new Hud(page).footer).toBeHidden();
});

/**
 * @domain common steps
 * @description lets the opening shot play out (on the page clock) and checks the room is entered: the footer shows and the gate prompt is gone
 * @prereq the portfolio is open and, with full motion, the machine has been woken
 * @uses page, world
 */
Then("I eventually enter the room", async ({ page, world }) => {
  // With full motion the opening shot runs on the page clock: let it play out instead of waiting it out.
  if (world.clockInstalled) await page.clock.runFor(INTRO_MS);
  await expect(new Hud(page).footer).toBeVisible();
  await expect(new BootScreen(page).gatePrompt).toHaveCount(0);
});
