const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const test = require("node:test");
const vm = require("node:vm");
const { pathToFileURL } = require("node:url");
const { chromium } = require("/Users/peng/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const projectRoot = path.join(__dirname, "..");
const dataSource = fs.readFileSync(path.join(projectRoot, "data.js"), "utf8");
const context = { window: {} };

vm.runInNewContext(dataSource, context);

const sha256 = (filePath) =>
  crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");

test("all portfolio projects expose one online preview and no APK link", () => {
  const previews = context.window.siteData.portfolioProjects.map((project) => project.preview);

  assert.deepEqual(JSON.parse(JSON.stringify(previews)), [
    { label: "在线查看", href: "./assets/yitai-rehab-system.pdf" },
    { label: "在线查看", href: "./assets/smart-sensing-solution-preview.pdf" },
    { label: "在线查看", href: "./assets/qijing-case-analysis.pdf" }
  ]);
  assert.doesNotMatch(dataSource, /\.apk/i);
});

test("cloud sensing project uses a three-page public preview PDF", async () => {
  const publicPreviewPath = path.join(projectRoot, "assets", "smart-sensing-solution-preview.pdf");
  const pdfInfo = execFileSync("pdfinfo", [publicPreviewPath], { encoding: "utf8" });

  assert.match(pdfInfo, /^Pages:\s+3$/m);

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  try {
    await page.goto(pathToFileURL(path.join(projectRoot, "index.html")).href);
    const previewButton = page.locator(".portfolio-card").nth(1).locator("[data-preview-src]");
    assert.equal(await previewButton.getAttribute("data-preview-src"), "./assets/smart-sensing-solution-preview.pdf");
    assert.match(await page.locator(".portfolio-card").nth(1).locator(".portfolio-confidentiality").innerText(), /仅支持在线查看前三页/);
  } finally {
    await browser.close();
  }
});

test("full cloud sensing deck stays outside the public site assets", () => {
  const publicOriginalPath = path.join(projectRoot, "assets", "smart-sensing-solution.pdf");
  const privateOriginalPath = path.join(projectRoot, "..", "个人网站私密材料", "smart-sensing-solution.pdf");

  assert.equal(fs.existsSync(publicOriginalPath), false);
  assert.equal(fs.existsSync(privateOriginalPath), true);
});

test("portfolio preview opens in the page and closes without navigating away", async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  try {
    await page.goto(pathToFileURL(path.join(projectRoot, "index.html")).href);
    const previewButtons = page.locator("[data-preview-src]");
    await assert.doesNotReject(() => previewButtons.first().waitFor({ timeout: 2000 }));
    assert.equal(await previewButtons.count(), 3);

    await previewButtons.first().click();
    const dialog = page.locator("#document-preview");
    assert.equal(await dialog.getAttribute("aria-hidden"), "false");
    assert.match(await page.locator("#document-preview-frame").getAttribute("src"), /yitai-rehab-system\.pdf/);
    assert.equal(await page.locator("#document-preview-title").textContent(), "易态｜个性化脊柱矫形系统");

    await page.locator(".document-preview__close").click();
    assert.equal(await dialog.getAttribute("aria-hidden"), "true");
    assert.equal(await page.locator("#document-preview-frame").getAttribute("src"), "about:blank");
  } finally {
    await browser.close();
  }
});

test("portfolio preview fills the viewport and locks background scrolling", async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  try {
    await page.goto(pathToFileURL(path.join(projectRoot, "index.html")).href);
    await page.locator("[data-preview-src]").first().click();

    const layout = await page.evaluate(() => {
      const dialog = document.querySelector("#document-preview");
      const frame = document.querySelector("#document-preview-frame");
      const panel = document.querySelector(".document-preview__panel");

      return {
        bodyOverflow: getComputedStyle(document.body).overflow,
        dialogPosition: getComputedStyle(dialog).position,
        dialogInset: getComputedStyle(dialog).inset,
        frameHeight: frame.getBoundingClientRect().height,
        panelWidth: panel.getBoundingClientRect().width
      };
    });

    assert.equal(layout.bodyOverflow, "hidden");
    assert.equal(layout.dialogPosition, "fixed");
    assert.equal(layout.dialogInset, "0px");
    assert.ok(layout.frameHeight >= 620, `expected a readable mobile frame, got ${layout.frameHeight}px`);
    assert.ok(layout.panelWidth <= 374, `expected mobile side margins, got ${layout.panelWidth}px`);
  } finally {
    await browser.close();
  }
});

test("JD experience presents six compact product screenshots before results", async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  try {
    await page.goto(pathToFileURL(path.join(projectRoot, "index.html")).href);

    const jingdongCard = page.locator(".experience-card").first();
    const showcase = jingdongCard.locator(".experience-showcase");
    const screenshots = showcase.locator("img");

    assert.equal(await screenshots.count(), 6);
    assert.match(await showcase.textContent(), /果决应用实录/);
    assert.doesNotMatch(await showcase.textContent(), /产品界面/);

    const layout = await screenshots.evaluateAll((images) => {
      const showcase = images[0].closest(".experience-showcase");
      const results = images[0].closest(".experience-card").querySelector(".experience-grid");
      const boxes = images.map((image) => image.getBoundingClientRect());

      return {
        comesBeforeResults: Boolean(showcase.compareDocumentPosition(results) & Node.DOCUMENT_POSITION_FOLLOWING),
        widths: boxes.map((box) => box.width),
        heights: boxes.map((box) => box.height),
        topOffsets: boxes.map((box) => box.top)
      };
    });

    assert.equal(layout.comesBeforeResults, true);
    assert.ok(layout.widths.every((width) => width >= 150), `expected readable thumbnails, got ${layout.widths.join(", ")}`);
    assert.ok(layout.heights.every((height) => height >= 80), `expected visible thumbnails, got ${layout.heights.join(", ")}`);
    assert.ok(
      layout.topOffsets.every((top) => Math.abs(top - layout.topOffsets[0]) < 2),
      `expected one horizontal row, got vertical offsets ${layout.topOffsets.join(", ")}`
    );
  } finally {
    await browser.close();
  }
});

test("portfolio cards explain their interview-only details or public preview limit", async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  try {
    await page.goto(pathToFileURL(path.join(projectRoot, "index.html")).href);

    const notes = page.locator(".portfolio-confidentiality");
    assert.equal(await notes.count(), 3);
    assert.equal(await page.locator(".experience-confidentiality").count(), 0);
    assert.deepEqual((await notes.allTextContents()).map((text) => text.trim()), [
      "部分作品信息已脱敏处理，完整方案与产品细节可在面试中展开演示。",
      "仅支持在线查看前三页。",
      "部分作品信息已脱敏处理，完整方案与产品细节可在面试中展开演示。"
    ]);
  } finally {
    await browser.close();
  }
});

test("homepage exposes the public GitHub profile as a contact action", async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  try {
    await page.goto(pathToFileURL(path.join(projectRoot, "index.html")).href);

    const githubLink = page.getByRole("link", { name: "GitHub" }).first();
    assert.equal(await githubLink.isVisible(), true);
    assert.equal(await githubLink.getAttribute("href"), "https://github.com/Peng301322");
    assert.equal(await githubLink.getAttribute("target"), "_blank");
  } finally {
    await browser.close();
  }
});

test("mobile navigation keeps only experience, portfolio, and resume actions", async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  try {
    await page.goto(pathToFileURL(path.join(projectRoot, "index.html")).href);

    const links = page.locator(".site-nav .nav-link");
    const visibleLabels = await links.evaluateAll((nodes) =>
      nodes
        .filter((node) => getComputedStyle(node).display !== "none")
        .map((node) => node.textContent.trim())
    );

    assert.deepEqual(visibleLabels, ["经历", "作品", "下载简历"]);
  } finally {
    await browser.close();
  }
});

test("document preview keeps keyboard focus on its close control", async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  try {
    await page.goto(pathToFileURL(path.join(projectRoot, "index.html")).href);
    await page.locator("[data-preview-src]").first().click();

    const closeButton = page.locator(".document-preview__close");
    await closeButton.press("Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement?.classList.contains("document-preview__close")),
      true
    );

    await closeButton.press("Shift+Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement?.classList.contains("document-preview__close")),
      true
    );
  } finally {
    await browser.close();
  }
});

test("background cards show the revised graduation date, honors, and order", async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  try {
    await page.goto(pathToFileURL(path.join(projectRoot, "index.html")).href);

    const cards = page.locator(".info-grid .info-card");
    const labels = await cards.locator(".card-kicker").allTextContents();

    assert.match(await cards.nth(0).textContent(), /2025\.09 - 2028\.03/);
    assert.deepEqual(labels.slice(1, 3), ["校内荣誉", "政治面貌"]);
    assert.match(await cards.nth(1).textContent(), /同济优秀学生奖学金/);
  } finally {
    await browser.close();
  }
});

test("published resume is the approved latest file", () => {
  assert.equal(
    sha256(path.join(projectRoot, "assets", "resume-latest.pdf")),
    "d81cb63fdf5a119461e96dd41aa8be285f5000c94494d9de6d6cdd7d4f86b853"
  );
});

test("APK is not present in public site assets", () => {
  assert.equal(fs.existsSync(path.join(projectRoot, "assets", "yitai-app-demo.apk")), false);
});
