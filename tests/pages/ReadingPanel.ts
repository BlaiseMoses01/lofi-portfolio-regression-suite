import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * @description the bottom panel: a group's heading and blurb, or a point's terminal-style reading panel
 */
export class ReadingPanel extends BasePage {
  /** the `~/group/point` path header; present only while a point is open */
  readonly pathHeader: Locator = this.page.getByText(/^~\/[a-z]+\/[a-z0-9-]+$/);
  /** the visible, still-typing body text; the aria-hidden sizer copy is deliberately excluded */
  readonly body: Locator = this.page.locator('div:has(> span:text-is("▍"))');
  /** the command prompt of an open point or entry (`$ vim x.md`, `$ whoami`); the listing's `$ ls -la` is excluded */
  readonly openPrompt: Locator = this.page.getByText(/^\$ (?!ls -la$)\S.*$/);
  /** the aria-hidden, invisible copy of the full body text that holds the panel's height */
  readonly sizer: Locator = this.page.locator(
    'div:has(> div[aria-hidden] + div > span:text-is("▍")) > div[aria-hidden]',
  );
  /** the VISIT link of a point or entry */
  readonly visitLink: Locator = this.page.getByRole("link", { name: /VISIT/ });
  /** the back link to the room, which only exists on a group panel */
  readonly roomLink: Locator = this.page.getByText("◂ ROOM", { exact: true });

  /** every numbered row of a listing (`01`, `02`, ...) */
  readonly listingRows: Locator = this.page.locator('div:has(> span:text-matches("^[0-9][0-9]$"))');
  /** the `◂ cd ..` link of an opened entry */
  readonly cdBack: Locator = this.page.getByText("◂ cd ..", { exact: true });

  /** the listing row with the given number, such as "01" */
  listingRow(number: string): Locator {
    return this.page.locator(`div:has(> span:text-is("${number}"))`);
  }

  /** the entry name of a listing row */
  listingName(number: string): Locator {
    return this.listingRow(number).locator("span > span").nth(0);
  }

  /** the summary line of a listing row */
  listingSummary(number: string): Locator {
    return this.listingRow(number).locator("span > span").nth(1);
  }

  /** open a listing entry by clicking its name */
  async openEntry(name: string) {
    await this.page.getByText(name, { exact: true }).click();
  }

  /** go back from an entry to the listing with `◂ cd ..` */
  async cdUp() {
    await this.cdBack.click();
  }

  /** an exact piece of panel text, such as a title, heading or prompt */
  text(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  /** the `◂ <label>` back link */
  backLink(label: string): Locator {
    return this.page.getByText(`◂ ${label}`, { exact: true });
  }

  /** the `~/group/point` header for one path */
  path(path: string): Locator {
    return this.page.getByText(path, { exact: true });
  }

  /** go back using the `◂ <label>` link */
  async goBack(label: string) {
    await this.backLink(label).click();
  }

  /** the typed so far and the full text of the open body, or null while no body is showing */
  async typingProgress(): Promise<{ typed: string; full: string } | null> {
    if ((await this.sizer.count()) === 0 || (await this.body.count()) === 0) return null;
    const full = (await this.sizer.textContent()) ?? "";
    const typed = ((await this.body.textContent()) ?? "").replace("▍", "");
    return { typed, full };
  }

  /** click the body to skip the typing */
  async skipTyping() {
    await this.body.click();
  }
}
