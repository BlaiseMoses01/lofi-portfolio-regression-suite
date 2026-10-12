import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * @description the CRT gate: the computer screen that waits to be woken and then types its boot lines
 */
export class BootScreen extends BasePage {
  /** the CRT screen while it still shows the gate prompt or boot lines */
  readonly screen: Locator = this.page
    .locator('[data-focus="projects"]')
    .filter({ hasText: /PRESS ENTER|TAP TO BEGIN|SENIOR AI ENGINEER/ });

  /** the computer screen in the room (the CRT has no title, unlike the hotspots and menu entries) */
  readonly computerScreen: Locator = this.page.locator('[data-focus="projects"]:not([title])');

  /** the gate prompt, which is only shown until the machine is woken */
  readonly gatePrompt: Locator = this.page.getByText(/PRESS ENTER|TAP TO BEGIN/);

  /** a piece of text on the CRT screen, matched as a substring */
  text(text: string): Locator {
    return this.computerScreen.getByText(text);
  }

  /** wake the machine with a click or tap on the screen */
  async click() {
    // The CRT is continuously transformed by the scene camera, so it never reports as stable.
    await this.screen.click({ force: true });
  }

  /** click the computer screen to open the Projects group */
  async clickComputerScreen() {
    // The CRT is continuously transformed by the scene camera, so it never reports as stable.
    await this.computerScreen.click({ force: true });
  }
}
