# 发布清单：技术长文 → Dev.to → HN

**目的**：给 kyno.top 挣第一条真实外链。GSC 数据已确认两个域名都卡在「已发现 - 尚未编入索引」（kyno.top 168 页、商店 38 页），而「已抓取 - 未收录」是 3 和 0——**内容没问题，缺的是权重**。Dev.to 正文外链实测为 dofollow（`rel="noopener noreferrer"`，无 nofollow），所以这是目前唯一能直接传权重的动作。

原文：`docs/marketing/2026-09-24-generating-254-pages.md`

---

## 一、Dev.to

### 标题

```
I built a 254-page site out of 41 sentence templates
```

54 字符。不要改——Dev.to 的标题会进搜索结果，而这个标题具体、无营销词。

### 标签（最多 4 个，必须从 Dev.to 的列表里选）

```
webdev, seo, testing, programming
```

备用：`javascript`、`discuss`、`career`。

顺序有讲究：**第一个标签最重要**（Dev.to 用它做主要的归类展示）。`webdev` 是最大流量池，适合这篇。

### 封面图

非必需，但 Dev.to 上带封面的文章点击率明显更高。

最省事的做法：**从 kyno.top 仓库里挑一张现成的配对样张卡**——`E:/KYNO/web/kyno-top/public/og/pairings/` 下有 254 张 PNG。

Dev.to 推荐 1000×420，那些卡是 1200×630，会被裁剪，问题不大。

选一张样张文字好看、配色不刺眼的即可，别选纯文字密集的。

### 正文

把 `.md` 全文粘进编辑器。**不要加 Dev.to 的 front matter** —— 标题和标签在编辑器 UI 里填就行，手写 front matter 容易和 UI 冲突。

### 发布后的第一条评论（作者补充惯例）

Dev.to 的读者习惯看作者自己补一句。建议：

```
Some context I left out of the post.

The site is a free font-pairing tool I built and maintain. The checks
described above run as part of its build, in this order: lint the data,
generate, assert the output, check the links. A failure in any of them
fails the deploy, which is the only reason the store-link bug didn't
survive longer than it did.

Happy to go into detail on any of them — the density gate's ceiling and
the redirect-as-failure choice are the two I'd defend hardest.
```

**不要在评论里再放一次 kyno.top 的链接**（正文末尾已经有了）。重复链接看起来像刷，而且评论里的链接 Dev.to 是 nofollow。

---

## 二、Hacker News

**发 Dev.to 之后隔 1–2 小时**，等文章有内容了再提交。

### 提交方式

普通提交（**不是 Show HN** —— Show HN 是给「可以直接试用的东西」的，这是篇文章）。

- **Title**：`I built a 254-page site out of 41 sentence templates`
  HN 的规矩是**照抄原文标题**，不要改写成更抓眼球的版本——改了会被喷，也可能被改回去。
- **URL**：Dev.to 那篇的地址

### 时间

HN 的流量高峰是**美国东部工作日上午 8–11 点**（= 北京时间 20:00–23:00）。对应你今天是周二，周二到周四最好。

### 心态准备

- 大概率沉底。HN 每天几百篇，技术随笔能上首页的是少数
- 如果上去了，**前 2 小时必须盯着回复**。HN 对「作者本人不出现」很不耐烦
- 有人挑刺是常态。文章里主动写了自己那六次误报，这是好事——**先认错的人不会被围攻**
- **绝对不要**用小号顶帖或拉人来投票。HN 的检测很准，被封号得不偿失

---

## 三、发完之后

**立刻要做的一件事**：在 kyno.top 的 GSC 里看「链接数量」那一栏（左侧菜单有）。

它会在几天到几周内显示出 Dev.to 那条链接。**那就是这次发布是否成功的唯一硬指标**——不是阅读量，是有没有一条真实的 dofollow 链接指向你的域名。

然后：**等 3–4 周再回来看「网页」那一栏**。如果「已发现 - 尚未编入索引」的 168 页开始往「已编入索引」移动，说明权重在起作用。

---

## 四、可选的一个改进（发之前值得考虑）

这篇文章现在**没有一个代码块**。Dev.to 是个代码密集的平台，读者习惯看到代码；一篇讲「检查」的技术文章通篇是散文，会显得偏轻。

如果愿意加，我建议加**两段**（都是真实代码，不是示意）：

1. 模板密度门那 8 行 —— 文章的核心机制
2. 商店链接守卫里「把重定向当失败」那几行 —— 最反直觉的一处

大概增加 100 字和两个代码块。**加不加都能发**，你说一声我就改。
