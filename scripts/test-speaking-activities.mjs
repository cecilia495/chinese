import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.STUDENT_TEST_URL || "http://127.0.0.1:3755/chinese";
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});

try {
  for (const width of [375, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 860 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const button = name => page.getByRole("button", { name, exact: true });
    const activity = title => page.locator("article").filter({
      has: page.getByRole("heading", { name: title, exact: true }),
    });
    const openHub = async () => {
      await page.getByRole("link", { name: "口语活动", exact: true }).click();
      await page.waitForURL("**/activities/");
    };

    await page.goto(base + "/");
    assert.equal(await page.locator("main a.button").count(), 1);
    await openHub();
    assert.equal(await page.locator("article").count(), 3);

    const titles = ["想吃什么、想喝什么", "数量与价格练习", "说明原因与换饮料"];
    await activity(titles[0]).getByRole("link", { name: "开始活动" }).click();
    await button("播放普通话").click();
    await page.waitForFunction(() => document.querySelector("audio")?.currentTime > .1);
    await button("我想喝茶。").click();
    assert.equal(await button("继续").isDisabled(), true);
    await button("我想吃面条儿。").click();
    await button("继续").click();
    await button("我想喝茶。").click();
    await button("完成活动").click();
    await openHub();
    await activity(titles[0]).getByText("情景选择已核对", { exact: true }).waitFor();

    await activity(titles[1]).getByRole("link", { name: "开始活动" }).click();
    await button("两个包子").click();
    await button("多少钱？").click();
    await button("九元").click();
    assert.equal(await page.evaluate(() => sessionStorage.getItem("zhongwenban:activity:order")), null);
    await button("六元").click();
    await openHub();
    await activity(titles[1]).getByText("情景选择已核对", { exact: true }).waitFor();

    await activity(titles[2]).getByRole("link", { name: "开始活动" }).click();
    await button("这个饮料太甜了，可以给我换成水吗？").click();
    await button("不是茶，是水。谢谢！").click();
    await openHub();
    await page.reload();
    await page.getByText("情景选择已核对", { exact: true }).last().waitFor();
    assert.equal(await page.getByText("情景选择已核对", { exact: true }).count(), 3);

    await page.locator(".header-controls select").selectOption("ar");
    await page.getByRole("heading", { name: "أنشطة التحدّث", exact: true }).waitFor();
    await page.waitForFunction(() => document.documentElement.dir === "rtl");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    console.log(`${width}px: homepage, three activities, audio, progress across refresh, and Arabic RTL passed`);
    await page.close();
  }
} finally {
  await browser.close();
}
