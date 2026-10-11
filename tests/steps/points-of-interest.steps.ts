import { When, Then, expect } from "../baseTest";
import { ReadingPanel } from "../pages/ReadingPanel";
import { RoomPage } from "../pages/RoomPage";
import { pointKey } from "./pointKeys";

/**
 * @domain points of interest
 * @description waits until the visible body has started typing but has not finished: some text is showing, and it is a strict part of the full text
 * @prereq a point with a body has just opened
 * @uses page
 */
Then("the reading panel body is still typing", async ({ page }) => {
  const panel = new ReadingPanel(page);
  await expect
    .poll(async () => {
      const progress = await panel.typingProgress();
      if (!progress) return "no body yet";
      if (progress.typed.length === 0) return "not started";
      return progress.typed.length < progress.full.length ? "typing" : "finished";
    })
    .toBe("typing");
});

/**
 * @domain points of interest
 * @description clicks empty space in the letterbox beside the artwork
 * @prereq a point is open on a landscape screen
 * @uses page
 */
When("I click an empty part of the page outside the artwork", async ({ page }) => {
  await new RoomPage(page).clickLetterbox();
});

/**
 * @domain points of interest
 * @description presses Tab, up to 40 times, until the point's hotspot has keyboard focus, and fails if it never does
 * @prereq the room is showing with no point open
 * @uses page
 */
When("I tab to the {string} point", async ({ page }, title: string) => {
  const reached = await new RoomPage(page).tabTo(pointKey(title), title);
  expect(reached, `Tab never moved keyboard focus to the "${title}" hotspot`).toBe(true);
});
