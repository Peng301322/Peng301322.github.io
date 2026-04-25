# 个人简历网站

入口文件是 `index.html`，内容数据集中放在 `data.js`，原始作品文件放在 `assets/`。

后续如果你要补作品链接，优先改 `data.js` 里的 `portfolioProjects`，格式如下：

```js
portfolioProjects: [
  {
    title: "项目名称",
    type: "项目类型",
    tagline: "一句话定位",
    summary: "项目摘要",
    role: "你负责什么",
    highlights: ["亮点1", "亮点2"],
    files: [{ label: "查看 PDF", href: "./assets/xxx.pdf" }]
  }
]
```

如果你要补新的实习、项目、奖项，也直接改 `experience`、`portfolioProjects`、`awards` 这几个数组即可。
