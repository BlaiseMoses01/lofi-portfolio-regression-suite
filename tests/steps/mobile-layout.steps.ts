import { When, Then, expect } from "../baseTest";
import { Hud } from "../pages/Hud";
import { RoomPage } from "../pages/RoomPage";
import { pointKey } from "./pointKeys";

/**
 * @domain mobile layout
 * @description checks the drag hint with the given text is showing
 * @prereq the room is showing on a portrait screen
 * @uses page
 */
Then("I see the hint {string}", async ({ page }, text: string) => {
  await expect(new Hud(page).hint(text)).toBeVisible();
});

/**
 * @domain mobile layout
 * @description checks the drag hint with the given text is gone
 * @prereq the room is showing on a portrait screen
 * @uses page
 */
Then("the hint {string} disappears", async ({ page }, text: string) => {
  // a short timeout: the hint also retires itself after a few seconds, which must not pass this
  await expect(new Hud(page).hint(text)).toHaveCount(0, { timeout: 2000 });
});

/**
 * @domain mobile layout
 * @description drags across the middle of the room
 * @prereq the room is showing
 * @uses page
 */
When("I drag across the room", async ({ page }) => {
  await new RoomPage(page).dragAcrossRoom();
});

/**
 * @domain mobile layout
 * @description drags across the room with the gesture starting on a point's hotspot
 * @prereq the room is showing on a portrait screen with the point on screen
 * @uses page
 */
When("I drag across the room starting on the {string} point", async ({ page }, title: string) => {
  const room = new RoomPage(page);
  const hotspot = room.hotspot(pointKey(title), title);
  await room.panIntoView(hotspot);
  const moved = await room.dragFromHotspot(hotspot);
  // proves the gesture really was a drag, so the "no panel" check that follows is meaningful
  expect(moved, "the drag should have panned the room").toBeGreaterThanOrEqual(100);
});

/**
 * @domain mobile layout
 * @description taps the room below the open reading panel, away from any point
 * @prereq a point's reading panel is open on a portrait screen
 * @uses page
 */
When("I tap the room behind the reading panel", async ({ page }) => {
  // the open sheet sits at the top, so the lower part of the room host is free of it
  await new RoomPage(page).tapRoomAt(0.5, 0.9);
});
