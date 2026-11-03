const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const dataSource = fs.readFileSync(path.join(__dirname, "..", "data.js"), "utf8");
const context = { window: {} };

vm.runInNewContext(dataSource, context);

const experiences = context.window.siteData.experience;
const profileSummary = context.window.siteData.profile.summary;

test("homepage summary leads with JD AI Coding and removes campus projects", () => {
  assert.deepEqual(Array.from(profileSummary), [
    "在京东搭建采销报价 Agent，并围绕其以 AI Coding 方式完成 FastAPI、MySQL 与原生 JS 的全栈建设，贯通产品定义、前后端开发、自动化测试与容器化发布。",
    "在蔚来参与 AI 应用方向产品工作，围绕电池业务 Agent、Prompt、RAG 与 BaaS 规则系统推进产品落地。",
    "在华云面向国网复杂业务场景推进平台化设计与 RPA 自动化改造，做过跨层级、多角色、多约束系统重构。"
  ]);
  assert.doesNotMatch(profileSummary.join("\n"), /校园项目/);
});

test("JD experience precedes NIO and has complete display data", () => {
  const jingdong = experiences[0];

  assert.equal(jingdong.company, "京东集团股份有限公司");
  assert.equal(jingdong.title, "AI应用产品");
  assert.equal(jingdong.period, "2026.07 - 至今");
  assert.match(jingdong.headline, /苹果二手采销业务/);
  assert.match(jingdong.headline, /Agent 系统/);
  assert.match(jingdong.headline, /双工作台/);
  assert.match(jingdong.wins.join("\n"), /1,470/);
  assert.equal(jingdong.wins.length, 4);
  assert.equal(jingdong.modules.length, 4);
});

test("NIO title and period match the current resume", () => {
  const nio = experiences.find((item) => item.company === "上海\u851a来汽车有限公司");

  assert.ok(nio);
  assert.equal(nio.title, "AI产品经理（能源云）");
  assert.equal(nio.period, "2025.10 - 2026.04");
});
