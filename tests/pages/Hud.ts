import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * @description the HUD over the room: menu, sound and lights buttons, the footer and the drag hint
 */
export class Hud extends BasePage {
  /** the hamburger button; aria-expanded tells whether the menu is open */
  readonly menuButton: Locator = this.page.getByRole("button", { name: "Menu" });
  /** the speaker button; aria-pressed is true while sound is on */
  readonly soundButton: Locator = this.page.getByRole("button", { name: /^Sound (on|off)$/ });
  /** the HUD lights switch; aria-checked is true while it is day */
  readonly lightsSwitch: Locator = this.page.getByRole("switch", { name: /^Lights (on|off)$/ });
  /** the copyright span of the footer, which only renders once the room is entered */
  readonly footer: Locator = this.page.getByText(/^© \d{4} /);
  /** the mailto link in the footer */
  readonly footerEmail: Locator = this.page.getByRole("link", { name: /@/ });
  /** the GitHub link in the footer */
  readonly footerGithub: Locator = this.page.getByRole("link", { name: /^github\.com\// });

  /** every entry of the open menu, in DOM order; the label filter excludes the CRT, back links and headings */
  readonly menuEntries: Locator = this.page
    .locator("[data-focus]")
    .filter({ hasText: /^\s*▸?\s*(HOME|EXPERIENCE|PROJECTS|CONTENT|INTERESTS)\s*$/ });

  /** open the menu when it is closed */
  async openMenu() {
    if ((await this.menuButton.getAttribute("aria-expanded")) !== "true") await this.toggleMenu();
  }

  /** close the menu with its hamburger button */
  async closeMenu() {
    if ((await this.menuButton.getAttribute("aria-expanded")) === "true") await this.toggleMenu();
  }

  /** pick one entry of the open menu by its label */
  async chooseMenuEntry(label: string) {
    await this.menuEntries.filter({ hasText: label }).click();
  }

  /** click the menu's full-screen backdrop, away from the menu entries */
  async clickOutsideMenu() {
    await this.host.click({ position: { x: 5, y: 400 } });
  }

  /** the drag hint containing this text */
  hint(text: string): Locator {
    return this.page.getByText(text);
  }

  /** click the speaker button */
  async toggleSound() {
    await this.soundButton.click();
  }

  /** click the HUD lights switch */
  async toggleLights() {
    await this.lightsSwitch.click();
  }

  /** click the hamburger button */
  async toggleMenu() {
    await this.menuButton.click();
  }
}
