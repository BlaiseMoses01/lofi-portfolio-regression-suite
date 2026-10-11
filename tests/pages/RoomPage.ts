import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * @description the artwork: the clickable hotspots, the letterbox around the plate and portrait panning
 */
export class RoomPage extends BasePage {
  /** the hotspot of one point, by its POI key and its title */
  hotspot(key: string, title: string): Locator {
    return this.page
      .locator(`[data-focus="${key}"]`)
      .and(this.page.getByTitle(title, { exact: true }));
  }

  /** the light switch drawn on the wall; it has no role, only a title, unlike the HUD switch */
  readonly wallLightSwitch: Locator = this.page.locator('[title^="Lights "]:not([role="switch"])');

  /** whether the viewport is portrait, where the plate is cropped and panned by dragging */
  async isPortrait(): Promise<boolean> {
    const size = this.page.viewportSize();
    return !!size && size.height > size.width;
  }

  /** drag horizontally across the room at the given height */
  async dragHorizontally(fromX: number, y: number, dx: number) {
    await this.page.mouse.move(fromX, y);
    await this.page.mouse.down();
    await this.page.mouse.move(fromX + dx / 2, y, { steps: 6 });
    await this.page.mouse.move(fromX + dx, y, { steps: 6 });
    await this.page.mouse.up();
  }

  /** portrait only: pan the room until the hotspot's centre sits inside the safe, tappable zone */
  async panIntoView(hotspot: Locator) {
    // the layout viewport can be shorter than the emulated device height, so measure it in the page
    const size = await this.page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
    const midX = size.width / 2;
    for (let attempt = 0; attempt < 4; attempt++) {
      const box = await hotspot.boundingBox();
      if (!box) return;
      const cx = box.x + box.width / 2;
      // only horizontal drags are possible, so the vertical position is not part of the test
      if (cx >= 40 && cx <= size.width - 40) return;
      const dx = Math.max(-330, Math.min(330, midX - cx));
      const startX = dx > 0 ? 40 : size.width - 40;
      await this.dragHorizontally(startX, size.height / 2, dx);
      // the camera follows the drag on the next frames; wait for the hotspot to settle
      await this.settle();
    }
  }

  /** wait two animation frames, so the scene and its panels have rendered what the last input caused */
  private async settle() {
    await this.page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
  }

  /** open a point by clicking its hotspot, panning it into view first when in portrait */
  async openPoint(key: string, title: string) {
    const hotspot = this.hotspot(key, title);
    if (await this.isPortrait()) await this.panIntoView(hotspot);
    // The camera keeps easing by a fraction of a pixel (always in portrait, and on desktop right
    // after a deep link), so the hotspot never reports as stable, and neighbouring hotspots can
    // overlap its centre: tap a point that really hits it.
    const offset = await this.tappableSpot(hotspot);
    if (!offset) throw new Error(`no tappable spot on the "${title}" hotspot`);
    await hotspot.click({ position: offset, force: true });
  }

  /** an offset inside the element where it is the topmost element, relative to its top-left corner, or null */
  private async tappableSpot(target: Locator) {
    await target.waitFor({ state: "visible" });
    return target.evaluate((el) => {
      const r = el.getBoundingClientRect();
      for (let fy = 0.3; fy <= 0.9; fy += 0.2) {
        for (let fx = 0.3; fx <= 0.9; fx += 0.2) {
          const x = r.left + r.width * fx;
          const y = r.top + r.height * fy;
          if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
          if (el.contains(document.elementFromPoint(x, y)))
            return { x: r.width * fx, y: r.height * fy };
        }
      }
      return null;
    });
  }

  /** click in the left letterbox bar, outside the artwork */
  async clickLetterbox() {
    await this.host.click({ position: { x: 5, y: 360 } });
  }

  /** flip the light switch on the wall; the scene keeps repainting, so click a spot that really hits it */
  async flipWallLightSwitch() {
    const offset = await this.tappableSpot(this.wallLightSwitch);
    if (!offset) throw new Error("the wall light switch is not on screen");
    await this.wallLightSwitch.click({ position: offset, force: true });
  }

  /** drag across the room horizontally in the middle of the screen */
  async dragAcrossRoom() {
    const size = await this.page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
    await this.dragHorizontally(size.width - 40, size.height / 2, -300);
  }

  /**
   * start a horizontal drag on a hotspot's own element and release away from it, then wait for the
   * scene to render; returns how far the hotspot moved on screen, in px, so the caller can tell a real drag
   */
  async dragFromHotspot(hotspot: Locator): Promise<number> {
    const offset = await this.tappableSpot(hotspot);
    const before = await hotspot.boundingBox();
    if (!offset || !before) throw new Error("no draggable spot on the hotspot");
    await this.dragHorizontally(before.x + offset.x, before.y + offset.y, -150);
    await this.settle();
    const after = await hotspot.boundingBox();
    if (!after) throw new Error("the hotspot left the screen after the drag");
    return Math.abs(after.x - before.x);
  }

  /** tap the room host at a position relative to its box, as a fraction of its width and height */
  async tapRoomAt(fx: number, fy: number) {
    const box = await this.host.boundingBox();
    if (!box) throw new Error("the room host has no box");
    await this.host.click({ position: { x: box.width * fx, y: box.height * fy } });
  }

  /** press Tab up to `limit` times until the hotspot has keyboard focus; returns whether it got focus */
  async tabTo(key: string, title: string, limit = 40): Promise<boolean> {
    const hotspot = this.hotspot(key, title);
    for (let press = 0; press < limit; press++) {
      await this.page.keyboard.press("Tab");
      const focused = await hotspot
        .evaluate((el) => el === document.activeElement)
        .catch(() => false);
      if (focused) return true;
    }
    return false;
  }
}
