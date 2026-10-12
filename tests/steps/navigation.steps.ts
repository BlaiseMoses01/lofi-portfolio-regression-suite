import { Given, When, Then, expect } from "../baseTest";
import { BootScreen } from "../pages/BootScreen";
import { Hud } from "../pages/Hud";
import { ReadingPanel } from "../pages/ReadingPanel";

/**
 * @domain navigation
 * @description opens the menu with its hamburger button
 * @prereq the room is showing
 * @uses page
 */
When("I open the menu", async ({ page }) => {
  await new Hud(page).openMenu();
});

/**
 * @domain navigation
 * @description closes the menu with its hamburger button
 * @prereq the menu is open
 * @uses page
 */
When("I close the menu", async ({ page }) => {
  await new Hud(page).closeMenu();
});

/**
 * @domain navigation
 * @description clicks the backdrop outside the menu entries
 * @prereq the menu is open
 * @uses page
 */
When("I click outside the menu", async ({ page }) => {
  await new Hud(page).clickOutsideMenu();
});

/**
 * @domain navigation
 * @description picks an entry of the open menu by its label
 * @prereq the menu is open
 * @uses page
 */
When("I choose {string} from the menu", async ({ page }, label: string) => {
  await new Hud(page).chooseMenuEntry(label);
});

/**
 * @domain navigation
 * @description opens a group through the menu and waits for its panel
 * @prereq the room is showing with the menu closed
 * @uses page
 */
Given("I have opened the {string} group", async ({ page }, label: string) => {
  const hud = new Hud(page);
  await hud.openMenu();
  await hud.chooseMenuEntry(label);
  await expect(new ReadingPanel(page).roomLink).toBeVisible();
});

/**
 * @domain navigation
 * @description clicks the computer screen in the room
 * @prereq the room is showing on a landscape screen
 * @uses page
 */
When("I click the computer screen in the room", async ({ page }) => {
  await new BootScreen(page).clickComputerScreen();
});

/**
 * @domain navigation
 * @description checks the menu button reports the menu as open
 * @prereq none
 * @uses page
 */
Then("the menu button is expanded", async ({ page }) => {
  await expect(new Hud(page).menuButton).toHaveAttribute("aria-expanded", "true");
});

/**
 * @domain navigation
 * @description checks the menu button reports the menu as closed
 * @prereq none
 * @uses page
 */
Then("the menu button is collapsed", async ({ page }) => {
  await expect(new Hud(page).menuButton).toHaveAttribute("aria-expanded", "false");
});

/**
 * @domain navigation
 * @description checks the open menu lists exactly the given comma-separated labels, in that order
 * @prereq the menu is open
 * @uses page
 */
Then("the menu lists {string} in that order", async ({ page }, labels: string) => {
  const expected = labels.split(",").map((label) => new RegExp(`^\\s*▸?\\s*${label.trim()}\\s*$`));
  await expect(new Hud(page).menuEntries).toHaveText(expected);
});

/**
 * @domain navigation
 * @description checks the group panel shows a piece of text such as its blurb
 * @prereq a group is open
 * @uses page
 */
Then("the group panel shows {string}", async ({ page }, text: string) => {
  await expect(new ReadingPanel(page).text(text)).toBeVisible();
});
