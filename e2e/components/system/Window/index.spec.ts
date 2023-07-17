import { expect, test } from "@playwright/test";
import {
  TASKBAR_SELECTOR,
  WINDOW_SELECTOR,
  WINDOW_TITLEBAR_SELECTOR,
} from "e2e/constants";

const isMaximized = ([windowSelector, taskbarSelector]: string[]): boolean =>
  window.innerWidth ===
    (document.querySelector(windowSelector) as HTMLElement)?.clientWidth &&
  window.innerHeight -
    ((document.querySelector(taskbarSelector) as HTMLElement)?.clientHeight ||
      0) ===
    (document.querySelector(windowSelector) as HTMLElement)?.clientHeight;

test.describe("window", () => {
  test.beforeEach(async ({ page }) => page.goto("/?app=FileExplorer"));

  test("has title", async ({ page }) => {
    await expect(page.locator(WINDOW_TITLEBAR_SELECTOR)).toContainText(
      /^My PC$/
    );
  });

  test("has minimize", async ({ page }) => {
    const windowElement = page.locator(WINDOW_SELECTOR);

    await expect(windowElement).toHaveCSS("opacity", "1");

    await page
      .locator(WINDOW_TITLEBAR_SELECTOR)
      .getByLabel(/^Minimize$/)
      .click();

    await expect(windowElement).toHaveCSS("opacity", "0");
  });

  test.describe("has maximize", () => {
    test("on button", async ({ page }) => {
      await page
        .locator(WINDOW_TITLEBAR_SELECTOR)
        .getByLabel(/^Maximize$/)
        .click();

      expect(
        await page.waitForFunction(isMaximized, [
          WINDOW_SELECTOR,
          TASKBAR_SELECTOR,
        ])
      ).toBeTruthy();
    });

    test("on double click", async ({ page }) => {
      await page.locator(WINDOW_TITLEBAR_SELECTOR).dblclick();

      expect(
        await page.waitForFunction(isMaximized, [
          WINDOW_SELECTOR,
          TASKBAR_SELECTOR,
        ])
      ).toBeTruthy();
    });
  });

  test.describe("has close", () => {
    test.beforeEach(async ({ page }) =>
      expect(page.locator(WINDOW_SELECTOR)).toBeVisible()
    );

    test("on button", async ({ page }) => {
      await page
        .locator(WINDOW_TITLEBAR_SELECTOR)
        .getByLabel(/^Close$/)
        .click();

      await expect(page.locator(WINDOW_SELECTOR)).toBeHidden();
    });

    // eslint-disable-next-line playwright/no-skipped-test
    test.skip("on double click", async ({ page }) => {
      await page.locator(`${WINDOW_TITLEBAR_SELECTOR}>button`).dblclick();

      await expect(page.locator(WINDOW_SELECTOR)).toBeHidden();
    });
  });

  test("has drag", async ({ page }) => {
    await page
      .locator(WINDOW_SELECTOR)
      .evaluate((element) =>
        Promise.all(
          element.getAnimations().map((animation) => animation.finished)
        )
      );

    const titlebarElement = page.locator(WINDOW_TITLEBAR_SELECTOR);
    const initialBoundingBox = await titlebarElement.boundingBox();

    await titlebarElement.dragTo(page.locator("main"), {
      targetPosition: {
        x: (initialBoundingBox?.width || 0) / 2,
        y: (initialBoundingBox?.height || 0) / 2,
      },
    });

    const finalBoundingBox = await titlebarElement.boundingBox();

    expect(initialBoundingBox?.x).not.toEqual(finalBoundingBox?.x);
    expect(initialBoundingBox?.y).not.toEqual(finalBoundingBox?.y);

    const mainBoundingBox = await page.locator("main").boundingBox();

    expect(finalBoundingBox?.y).toEqual(mainBoundingBox?.y);
    expect(finalBoundingBox?.x).toEqual(mainBoundingBox?.x);
  });
});