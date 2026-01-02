---
title: 友链
icon: material/hand-heart
tags:
  - 友链
  - 网站导航
hide:
  - feedback
  - tags
comments: true
---

<style>
  /* 移除链接下划线 */
  .md-typeset a {
    text-decoration: none;
  }

  /* 卡片网格容器：自适应列数，最小 300px */
  .friend-links-block-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin: 1.5em 0;
    width: 100%;
    box-sizing: border-box;
  }

  /* 卡片主体 */
  .friend-card-block {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    text-decoration: none !important;
    cursor: pointer;

    /* 显示外边框：默认边框色 */
    border: 1px solid var(--md-default-fg-color--lightest);
    background-color: var(--md-default-bg-color);

    /* 动效 */
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    z-index: 1;
    min-width: 0;
  }

  /* 悬停效果 */
  .friend-card-block:hover {
    transform: translateY(-2px) scale(1.01);
    border-color: var(--md-primary-fg-color);
    box-shadow: 0 6px 20px -6px rgba(0, 0, 0, 0.15);
    z-index: 2;
  }

  /* 暗色模式适配 */
  [data-md-color-scheme="slate"] .friend-card-block:hover {
    border-color: var(--md-primary-fg-color--dark);
  }

  /* 头像 */
  .friend-card-block .ava {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-right: 20px;
    object-fit: cover;
    flex-shrink: 0;
    background-color: var(--md-default-fg-color--lighter);
    transition: transform 0.4s ease;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }

  .friend-card-block:hover .ava {
    transform: rotate(8deg) scale(1.1);
  }

  /* 文本区域 */
  .block-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    flex: 1;
  }

  /* 标题 */
  .block-content .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--md-primary-fg-color);
    margin-bottom: 6px;
    line-height: 1.3;
    word-wrap: break-word;
    transition: color 0.2s;
  }

  .friend-card-block:hover .title {
    color: var(--md-accent-fg-color);
    text-decoration: underline;
  }

  /* 描述：限制两行 */
  .block-content .desc {
    font-size: 14px;
    color: var(--md-default-fg-color--light);
    line-height: 1.6;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>

# 友情链接

## 朋友们

- [x] [查看如何加入友链](../basic/friendly-links-guide)
- [x] **定期** 回访，来踩一脚。

<div class="friend-links-block-grid">

  <a class="friend-card-block" href="https://wcowin.work/" target="_blank" rel="noopener">
    <img class="ava" src="https://s1.imagehub.cc/images/2025/12/06/28380affd86b014a6dcaf082fcc97064.png" loading="lazy" alt="Wcowin头像" />
    <div class="block-content">
      <div class="title">Wcowin's Blog</div>
      <div class="desc">循此苦旅，以达星辰</div>
    </div>
  </a>

  <a class="friend-card-block" href="https://hongjun.vip/" target="_blank" rel="noopener">
    <img class="ava" src="https://hongjun.vip/assets/avatar.png" loading="lazy" alt="极简主义" />
    <div class="block-content">
      <div class="title">极简主义</div>
      <div class="desc">文档即产品</div>
    </div>
  </a>

  <a class="friend-card-block" href="https://www.pearworld.online/" target="_blank" rel="noopener">
    <img class="ava" src="https://www.pearworld.online/images/avatar.jpg" loading="lazy" alt="PearWorld_Hub" />
    <div class="block-content">
      <div class="title">PearWorld_Hub</div>
      <div class="desc">分享日常科研、学习、运动</div>
    </div>
  </a>

  <a class="friend-card-block" href="https://blog.mxdyeah.com" target="_blank" rel="noopener">
    <img class="ava" src="https://res.mxdyeah.com/favicon.webp" loading="lazy" alt="mxd's Blog" />
    <div class="block-content">
      <div class="title">mxd's Blog</div>
      <div class="desc">以技术为翼，以生活为魂。Empowered by technology, inspired by life.</div>
    </div>
  </a>

  <a class="friend-card-block" href="https://blog.alexma.top" target="_blank" rel="noopener">
    <img class="ava" src="https://imgproxy.alexma.top/XXKGpBkD10-GDrWn5b8asJspKs16xZz2AUxQE9VY4pI/rs:fit:512:512/f:webp/q:80/plain/s3://blog-pics/avatar.webp" loading="lazy" alt="AlexMa's Blog" />
    <div class="block-content">
      <div class="title">AlexMa's Blog</div>
      <div class="desc">Create things with love.</div>
    </div>
  </a>

</div>