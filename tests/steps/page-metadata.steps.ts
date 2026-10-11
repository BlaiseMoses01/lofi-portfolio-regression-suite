import { Then, expect } from "../baseTest";

/**
 * @domain page metadata
 * @description checks the document title
 * @prereq the portfolio is open
 * @uses page
 */
Then("the page title is {string}", async ({ page }, title: string) => {
  await expect(page).toHaveTitle(title);
});

/**
 * @domain page metadata
 * @description checks the meta description content
 * @prereq the portfolio is open
 * @uses page
 */
Then("the page description is {string}", async ({ page }, description: string) => {
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", description);
});

/**
 * @domain page metadata
 * @description checks the og:title content that link previews show
 * @prereq the portfolio is open
 * @uses page
 */
Then("the link preview title is {string}", async ({ page }, title: string) => {
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
});
