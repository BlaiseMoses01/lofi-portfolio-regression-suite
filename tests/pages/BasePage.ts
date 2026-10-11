import type { Locator, Page } from "@playwright/test";

/**
 * @description shared behaviour for every page; extend it for each screen of the app
 */
export class BasePage {
  constructor(readonly page: Page) {}

  /** the full-screen host element of the scene; it also backs the open menu */
  get host(): Locator {
    return this.page.locator("#root > div");
  }

  /** navigate to a path relative to the configured baseURL, and wait for the DOM */
  async goto(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState("domcontentloaded");
  }

  /** press a key on the keyboard */
  async press(key: string) {
    await this.page.keyboard.press(key);
  }
}
