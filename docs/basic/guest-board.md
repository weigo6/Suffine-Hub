---
title: 留言板
hide:
  - navigation
  - toc
  - footer
  - feedback
icon: material/forum
comments: false
---

<div class="pure-excerpt-container">
  <div class="pure-header">
    <span class="line"></span>
    <h1 class="pure-h1-title">留言板</h1>
    <span class="line"></span>
  </div>

  <div class="pure-content-wrapper">
    <span class="pure-quote-mark left">“</span>
    <div class="pure-main-text">落霞与孤鹜齐飞，秋水共长天一色</div>
    <div class="pure-author">王勃 <small>《滕王阁序》</small></div>
    <span class="pure-quote-mark right">”</span>
  </div>

  <div class="pure-tips-toolbar">
    <div class="tips-text">
       <span class="icon">💬</span> 请文明留言，内容将公开显示
    </div>
    
    <span class="toolbar-separator">/</span>

    <div class="comment-switch-wrapper" id="switch-wrapper" data-tip="当前正在使用 GitHub 登录评论">
      <button id="comment-switch-btn" onclick="toggleCommentSystem()">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
        </svg>
        <span>切换模式</span>
      </button>
    </div>
  </div>
</div>

<div class="guestbook-comments-wrapper">
  <div id="giscus-container">
    <script src="https://giscus.app/client.js"
            data-repo="weigo6/sufine-giscus"
            data-repo-id="R_kgDOQvA4xA"
            data-category="General"
            data-category-id="DIC_kwDOQvA4xM4C0P1S"
            data-mapping="pathname"
            data-strict="0"
            data-reactions-enabled="1"
            data-emit-metadata="0"
            data-input-position="top"
            data-theme="preferred_color_scheme"
            data-lang="zh-CN"
            data-loading="lazy"
            crossorigin="anonymous"
            async>
    </script>
  </div>

  <div id="twikoo-container" style="display: none;">
    <div id="twikoo"></div>
  </div>
</div>

<style>
/* --- 1. 基础布局 --- */
.md-content__button { display: none !important; }
.pure-excerpt-container {
    max-width: 800px;
    margin: 1rem auto 2rem auto;
    text-align: center;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.pure-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
    width: 100%;
}
.md-typeset .pure-h1-title {
    font-size: 1.1rem !important; 
    letter-spacing: 0.5em !important;
    text-indent: 0.5em !important;
    font-weight: 700 !important;
    color: var(--md-typeset-color);
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    display: inline-block;
    line-height: 1.2;
    opacity: 0.7;
}
.pure-header .line {
    height: 1px;
    width: 45px;
    background: var(--md-typeset-color);
    opacity: 0.2;
}
.pure-content-wrapper {
    position: relative;
    padding: 40px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.pure-quote-mark {
    position: absolute;
    font-family: "Georgia", serif;
    font-size: 8rem;
    color: var(--md-primary-fg-color);
    opacity: 0.12;
    line-height: 1;
    user-select: none;
    pointer-events: none;
}
.pure-quote-mark.left { top: 0; left: 2%; }
.pure-quote-mark.right { bottom: 0; right: 2%; }
.pure-main-text {
    font-size: 1.8rem;
    font-family: "Noto Serif SC", "Source Han Serif CN", serif;
    color: var(--md-typeset-color);
    line-height: 1.6;
    margin-bottom: 15px;
    font-weight: 500;
    text-wrap: balance;
}
.pure-author {
    font-size: 1rem;
    color: var(--md-typeset-color--light);
    opacity: 0.8;
}

/* --- 2. 整合后的工具栏样式 --- */
.pure-tips-toolbar {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px; /* 元素间距 */
    font-size: 0.85rem;
    color: var(--md-typeset-color--light);
    opacity: 0.8; /* 整体稍微淡一点 */
}

/* 提示文字区 */
.tips-text {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* 分隔符 */
.toolbar-separator {
    opacity: 0.3;
    font-weight: 300;
}

/* 按钮样式重置：去边框、去背景、融入文本 */
#comment-switch-btn {
    background: transparent;
    border: none; /* 移除边框 */
    padding: 0;   /* 移除内边距 */
    color: var(--md-typeset-color--light); /* 与文字同色 */
    cursor: pointer;
    font-size: 0.85rem; /* 保持与文字一致 */
    display: flex;
    align-items: center;
    gap: 4px;
    line-height: 1;
    transition: color 0.2s ease;
}

/* 悬停效果：仅文字变色，不加背景 */
#comment-switch-btn:hover {
    color: var(--md-accent-fg-color); /* 悬停高亮色 */
    background: transparent;
    border: none;
}

/* 按钮图标微调 */
#comment-switch-btn svg {
    opacity: 0.8;
}

/* --- 3. Tooltip 样式 (玻璃磨砂风) --- */
.comment-switch-wrapper {
    position: relative;
    /* 修复 flex 布局下的定位基准 */
    display: flex;
    align-items: center;
}

.comment-switch-wrapper::after {
    content: attr(data-tip);
    position: absolute;
    bottom: 160%; /* 因为现在按钮在文本流中，稍微抬高一点防止遮挡 */
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    
    background: rgba(255, 255, 255, 0.75);
    color: var(--md-typeset-color);
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100; /* 确保浮在最上层 */
    pointer-events: none;
}

[data-md-color-scheme="slate"] .comment-switch-wrapper::after {
    background: rgba(20, 20, 20, 0.7);
    color: var(--md-typeset-color);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

[data-md-color-scheme="slate"] .tk-content {
    color: var(--md-typeset-color) !important;
}

.comment-switch-wrapper:hover::after {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}

/* 评论区最大宽度限制 */
.guestbook-comments-wrapper {
    max-width: 650px;
    margin: 0 auto;
    padding: 0 20px;
}

@media screen and (max-width: 768px) {
    .pure-h1-title { font-size: 1rem !important; }
    .pure-main-text { font-size: 1.4rem; }
    .pure-quote-mark { font-size: 5rem; }
    .pure-quote-mark.left { left: -10px; }
    .pure-quote-mark.right { right: -10px; }

    /* 修改容器内边距，给文字腾出更多空间 */
    .pure-excerpt-container {
        padding: 0 10px !important; /* 原为 20px，减小左右留白 */
    }
    
    /* 移动端将工具栏换行显示，避免拥挤 */
    .pure-tips-toolbar {
        flex-direction: column;
        gap: 8px !important;
    }
    .toolbar-separator {
        display: none; /* 换行后隐藏分隔符 */
    }

    .guestbook-comments-wrapper {
        padding: 0 0px;
    }
}
</style>

<script>
  var isTwikooLoaded = false;
  function toggleCommentSystem() {
    var giscusContainer = document.getElementById('giscus-container');
    var twikooContainer = document.getElementById('twikoo-container');
    var wrapper = document.getElementById('switch-wrapper');
    if (twikooContainer.style.display === 'none') {
      giscusContainer.style.display = 'none';
      twikooContainer.style.display = 'block';
      wrapper.setAttribute('data-tip', '当前正在使用 Twikoo 匿名评论');
      if (!isTwikooLoaded) { loadTwikooScript(); }
    } else {
      twikooContainer.style.display = 'none';
      giscusContainer.style.display = 'block';
      wrapper.setAttribute('data-tip', '当前正在使用 GitHub 登录评论');
    }
  }
  function loadTwikooScript() {
    var script = document.createElement('script');
    script.src = "https://unpkg.com/twikoo@latest/dist/twikoo.all.min.js";
    script.async = true;
    script.onload = function() {
      twikoo.init({
        envId: 'https://twikoo.sufine.top',
        el: '#twikoo',
        lang: 'zh-CN'
      }).catch(console.error);
      isTwikooLoaded = true;
    };
    document.body.appendChild(script);
  }
  var giscus = document.querySelector("script[src*=giscus]")
  var palette = __md_get("__palette")
  if (palette && typeof palette.color === "object") {
    var theme = palette.color.scheme === "slate" ? "transparent_dark" : "light"
    giscus.setAttribute("data-theme", theme) 
  }
  document.addEventListener("DOMContentLoaded", function() {
    var ref = document.querySelector("[data-md-component=palette]")
    if(ref){
        ref.addEventListener("change", function() {
            var palette = __md_get("__palette")
            if (palette && typeof palette.color === "object") {
            var theme = palette.color.scheme === "slate" ? "transparent_dark" : "light"
            var frame = document.querySelector(".giscus-frame")
            if (frame) {
                frame.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, "https://giscus.app")
            }
            }
        })
    }
  })
</script>