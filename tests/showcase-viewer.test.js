const test = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const { chromium } = require('/Users/peng/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

test('showcase opens by double click, switches images, closes with Escape and restores focus', async () => {
  const browser = await chromium.launch({headless:true, executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(__dirname, '..', 'index.html')).href);
    const shot = page.locator('[data-showcase-src]').first();
    await shot.dblclick();
    assert.equal(await page.locator('.image-viewer').evaluate(e => e.open), true);
    assert.match(await page.locator('.image-viewer__image').getAttribute('src'), /jd-guojue-01/);
    await page.keyboard.press('ArrowRight');
    assert.match(await page.locator('.image-viewer__image').getAttribute('src'), /jd-guojue-02/);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.image-viewer').evaluate(e => e.open), false);
    assert.equal(await shot.evaluate(e => e === document.activeElement), true);
    await page.keyboard.press('Enter');
    await page.locator('[data-image-close]').click();
    assert.equal(await page.locator('.image-viewer').evaluate(e => e.open), false);
    for (const index of [1, 2]) assert.ok(await page.locator('.experience-card').nth(index).locator('.detail-list li').count() >= 6);
    const mobile = await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    await mobile.goto(pathToFileURL(path.join(__dirname, '..', 'index.html')).href);
    await mobile.locator('[data-showcase-src]').first().tap();
    assert.equal(await mobile.locator('.image-viewer').evaluate(e => e.open), true);
    await mobile.locator('[data-image-close]').tap();
    assert.equal(await mobile.locator('.image-viewer').evaluate(e => e.open), false);
  } finally { await browser.close(); }
});
