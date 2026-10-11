import type { Page } from "@playwright/test";
import { test as base, createBdd } from "playwright-bdd";

/*
 * I learned BDD in Cucumber ,so I'm used to having a world for scenario scoped variables , I usually
 * create this type to sim it using a playwright fixture. You can add any scenario scoped variables here and use them across steps
 */
type World = {
  baseUrl: string;
  // Auth credentials sourced from the environment (.env / CI secrets) so steps
  // can sign in without hardcoding secrets in .feature files. See the env docs.
  creds: { user: string; pass: string };
  // Every request URL the page made, recorded from before the first navigation, so network
  // oracles (artwork plates, hmm.mp3) can check absence as well as presence.
  requests: string[];
  // True once a Given has opened the portfolio in this scenario.
  opened: boolean;
  // True once page.clock has been installed in this scenario (it can only be installed once).
  clockInstalled: boolean;
  // The tab the visitor is looking at: the fixture page until a step opens a new browser session.
  // Only the theme, sound and reload steps follow it; other steps still act on the fixture page.
  activePage: Page;
};

// // add your custom fixtures, types , etc into the fixture type , then you will be able to customize and extend them below in the test config
type Fixtures = {
  world: World; // scenario-scoped global vars
};

// customize the test config to initalize and use the custom fixtures
export const test = base.extend<Fixtures>({
  world: async ({ page }, use) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await use({
      baseUrl: "",
      creds: {
        user: process.env.STANDARD_USER ?? "",
        pass: process.env.STANDARD_PASS ?? "",
      },
      requests,
      opened: false,
      clockInstalled: false,
      activePage: page,
    });
  },
});

export { expect } from "@playwright/test";
export const { Given, When, Then } = createBdd(test);
