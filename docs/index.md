---
title: Welcome to my blog! 👋
icon: material/home
hide:
  - navigation
  - toc
  - footer
  - feedback
---

<style>
/*消除页面右上角的查看与编辑按钮*/
.md-content__button {
    display: none !important;
}

/* 增加权重并强制隐藏锚点链接 */
.md-typeset .headerlink {
  display: none !important;
  pointer-events: none;
}

/* 基础容器 */
.home-container {
    max-width: 950px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* 英雄区 */
.hero-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2.3rem 2.3rem;
    margin: 0.5rem 0;
    position: relative;
    background-image: radial-gradient(var(--md-default-fg-color--lightest) 1.2px, transparent 1.2px);
    background-size: 18px 18px;
    border-radius: 16px;
}

.hero-content {
    flex: 1;
    text-align: left;
    z-index: 2;
}

.hero-title {
    font-size: 2.3rem !important;
    font-weight: 800;
    margin: 0;
    color: var(--md-default-fg-color);
    line-height: 1.3;
}

/* 加上 .md-typeset 确保优先级最高，博客介绍语 */
.md-typeset .hero-intro {
    font-size: 1.8rem !important;
    margin: 0.8rem 0 1.5rem 0 !important;
    color: var(--md-default-fg-color--light);
    font-weight: 500;
}

/* 马克笔涂抹高亮背景 */
.marker-highlight {
    background: linear-gradient(to bottom, transparent 60%, rgba(100, 108, 255, 0.25) 0%);
    padding: 0 6px;
    border-radius: 4px;
    color: var(--md-primary-fg-color);
}

/* 打字机样式 */
.typewriter-container {
    height: 1.8rem;
    margin: 1.2rem 0;
    display: flex;
    align-items: center;
}
#typewriter-text {
    font-family: 'JetBrains Mono', 'Segoe UI', monospace;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--md-default-fg-color--light);
}
.cursor {
    display: inline-block;
    width: 3px;
    height: 1.4rem;
    background-color: var(--md-primary-fg-color);
    margin-left: 5px;
    animation: blink 0.8s infinite;
}
@keyframes blink { 50% { opacity: 0; } }

/* 头像 */
.avatar-glow {
    width: 250px;
    height: 250px;
    border-radius: 50%;
    padding: 6px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);   
    box-shadow: 0 10px 30px rgba(118, 75, 162, 0.4);
    flex-shrink: 0;
    margin-right: 0.3rem;
}
.avatar-glow img {
    width: 100%; height: 100%;
    border-radius: 50%; object-fit: cover;
    background: var(--md-default-bg-color);
}

/* 按钮组 */
.hero-btns {
    display: flex;
    gap: 15px;
    margin-top: 1.5rem;
}
.custom-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 0.5rem 1.0rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none !important;
    transition: all 0.2s;
}
.btn-primary {
    background-color: var(--md-primary-fg-color);
    color: var(--md-primary-bg-color) !important;
}
.btn-secondary {
    background-color: var(--md-default-fg-color--lightest);
    color: var(--md-default-fg-color) !important;
}
.custom-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* 调整按钮内图标大小 */
.custom-btn .twemoji {
    width: 1.1rem;
    height: 1.1rem;
}

/* 四格磁贴布局 - 极简文字风格 */
.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 1.5rem 0;
}

.grid-card {
    background: var(--md-default-bg-color);
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 10px;
    padding: 1rem 1.2rem;
    position: relative;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.grid-card:hover { 
    border-color: var(--md-primary-fg-color);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transform: translateY(-2px);
}

.grid-card h3 { 
    margin: 0 0 0.4rem 0 !important; 
    font-size: 1.05rem !important; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
    color: var(--md-default-fg-color);
}

.grid-card p { 
    margin: 0 !important; 
    font-size: 0.85rem; 
    line-height: 1.4; 
    color: var(--md-default-fg-color--light); 
    flex-grow: 1; 
}

/* 标签容器 */
.tag-box { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 15px;
    margin-top: 0.8rem; 
    align-items: center;
}

/* --- 普通标签：# 风格 --- */
.tag-box span { 
    font-size: 0.75rem; 
    color: var(--md-default-fg-color--light);
    background: none; 
    border: none; 
    padding: 0;   
    display: inline-flex;
    align-items: center;
    cursor: default;
    font-weight: 400;
    opacity: 0.8;
}

/* 伪元素添加 # 号 */
.tag-box span::before {
    content: "#";
    margin-right: 1px;
    color: var(--md-default-fg-color--light);
    font-family: var(--md-code-font-family);
    opacity: 0.6;
}

/* --- 链接标签：纯文字 + 动效 --- */
.tag-link {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: 0.75rem;
    color: var(--md-primary-fg-color) !important;
    background: none;
    border: none;
    padding: 0;
    text-decoration: none !important;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
}

/* 链接悬停：轻微透明度变化 */
.tag-link:hover {
    opacity: 0.8; 
}

/* 图标样式 */
.jump-icon {
    width: 13px;
    height: 13px;
    fill: currentColor;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 悬停时图标大幅度向右上弹出 */
.tag-link:hover .jump-icon {
    transform: translate(3px, -3px);
}

/* 推荐阅读部分标题 - 居中线条风格 */
.rec-title {
    margin: 2rem 0 1.5rem !important;
    font-weight: 700;
    color: var(--md-default-fg-color) !important;
    
    /* Flex布局实现居中和线条 */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    text-align: center;
}

/* 专门针对标题内的图标进行着色（使用主题色）*/
.rec-title .twemoji {
    color: var(--md-primary-fg-color);
    width: 1.2rem;
    height: 1.2rem;
}

/* 推荐阅读标题两侧的线条 */
.rec-title::before,
.rec-title::after {
    content: "";
    display: block;
    height: 1px;
    flex: 1; 
    max-width: 200px; 
    background: linear-gradient(90deg, transparent, var(--md-default-fg-color--light)); 
    opacity: 0.6;
}

/* 右侧线条反向渐变 */
.rec-title::after {
    background: linear-gradient(90deg, var(--md-default-fg-color--light), transparent);
}

/*卡片网格样式优化*/
/* 减少分隔线的边距 */
hr {
  margin: 0.5rem 0 !important;
}

/* 减少卡片网格的间距 */
.grid.cards {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

/* 减少卡片内部的间距 */
.grid.cards > ul > li {
  padding: 0.8rem !important;
}

.md-typeset a {
  text-decoration: none;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
    /* 布局调整 */
    .hero-wrapper { 
        flex-direction: column-reverse; 
        padding: 1.5rem 1rem; 
        gap: 1.5rem; 
        text-align: center; 
    }

    /* 内容区域居中 */
    .hero-content {
        text-align: center !important; 
        width: 100%; 
    }

    /* 头像区域 */
    .hero-avatar-area { 
        width: 100%;
        display: flex;
        justify-content: center; 
        align-items: center;
    }
    
    .avatar-glow { 
        width: 160px; 
        height: 160px;
        margin: 0 auto !important; 
    }

    /* 标题适配 */
    .hero-title { 
        font-size: 1.7rem !important; 
        text-align: center; 
        display: block; 
    }

    /* 介绍语适配 */
    .md-typeset .hero-intro {
        font-size: 1.35rem !important;
        margin: 0.5rem 0 1rem 0 !important;
        line-height: 1.3;
        text-align: center; 
    }

    /* 打字机适配 */
    #typewriter-text {
        font-size: 1.1rem; 
    }
    .typewriter-container {
        justify-content: center; 
        margin: 1rem 0;
    }

    /* 按钮组适配 */
    .hero-btns { 
        justify-content: center; 
        gap: 10px; 
        flex-wrap: wrap; 
    }

    .custom-btn {
        font-size: 0.75rem;   
    }

    /* 磁贴网格适配 */
    .grid-container { 
        grid-template-columns: 1fr; 
        gap: 0.7rem; 
    }
}

</style>

<div class="home-container" markdown="1">

<!-- 英雄区 -->
<div class="hero-wrapper">
<div class="hero-content">

<div class="hero-title">
Hi, I'm <span class="marker-highlight">Luwei</span>. 
</div>
<h1 class="hero-intro">
Welcome to my blog! 👋
</h1>

<div class="typewriter-container">
<span id="typewriter-text"></span><span class="cursor"></span>
</div>

<div class="hero-btns">
<a href="https://github.com/weigo6" class="custom-btn btn-primary">
    <span class="twemoji"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></span>
    Github
</a>
<a href="mailto:yang92636@qq.com" class="custom-btn btn-secondary">
    <span class="twemoji"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></span>
    Email me
</a>
</div>
</div>

<div class="hero-avatar-area">
<div class="avatar-glow">
<img src="https://bucket.rutno.com/d?sid=GmVLqQkMozg2U9xicP7krsXxEFIq&e=1769434119&sig=e75af40868e6730eead3bd617b88209e050a403790f559760c9215e9ce990275" alt="avatar">
</div>
</div>
</div>

<div class="grid-container" markdown="1">

<div class="grid-card" markdown="1">
### :octicons-mortar-board-24: 课程学习
轨道交通信号与控制专业本科生，大学期间考研与理工科课程笔记。
<div class="tag-box">
    <!-- 将主要入口设置为链接 -->
    <a href="college-study/" class="tag-link">
        进入专栏
        <svg class="jump-icon" viewBox="0 0 24 24"><path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z"/></svg>
    </a>
    <span>考研</span>
    <span>轨道信号</span>
    <span>STEM</span>
</div>
</div>

<div class="grid-card" markdown="1">
### :octicons-code-24: 技术开发
喜欢嵌入式开发与软件程序设计，记录实战经验与开发细节。
<div class="tag-box">
    <a href="tech-dev/" class="tag-link">
        浏览博文
        <svg class="jump-icon" viewBox="0 0 24 24"><path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z"/></svg>
    </a>
    <span>嵌入式</span>
    <span>Python</span>
    <span>Markdown</span>
</div>
</div>

<div class="grid-card" markdown="1">
### :octicons-people-24: 知行共济
与志同道合的朋友们共同进步，朝心中热爱的方向笃定前行。
<div class="tag-box">
    <a href="basic/friendly-links" class="tag-link">
        查看邻居
        <svg class="jump-icon" viewBox="0 0 24 24"><path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z"/></svg>
    </a>
        <a href="basic/contact-form" class="tag-link">
        友链申请
        <svg class="jump-icon" viewBox="0 0 24 24"><path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z"/></svg>
    </a>
    <span>链结同频</span>
</div>
</div>

<div class="grid-card" markdown="1">
### :octicons-star-24: 妙想春生
在GitHub上查看我的个人作品、本站源码。欢迎提交 Pull Request 或交流。
<div class="tag-box">
    <a href="https://github.com/weigo6" class="tag-link" target="_blank">
        GitHub
        <svg class="jump-icon" viewBox="0 0 24 24"><path d="M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19 5 17.59z"/></svg>
    </a>
    <span>Zensical</span>
    <span>EO Pages</span>
</div>
</div>

</div>

### :octicons-book-16: 推荐阅读 {.rec-title}

<div class="grid cards" markdown>

-   :octicons-bookmark-16:{ .lg .middle } __推荐的文章__{.middle}

    ---
    -   [基于 STM32 的四轮移动机器人设计](tech-dev/Embedded/基于STM32的四轮移动机器人设计.md)
    -   [基于 RFID 的智能仓储管理系统设计](tech-dev/Embedded/基于RFID的智能仓储管理系统设计.md)
    -   [在 Markdown 中编写数学公式](tech-dev/Markdown/LaTeX-math.md)
    -   [数字电压表制作课程设计](college-study/STEM/数字电压表课程设计.md)
    -   [在 Zensical 中使用 Markdown 高效写作](tech-dev/Markdown/zensical-markdown.md)

-   :octicons-code-16:{ .lg .middle } __技术开发__{.middle}

    ---
    -   [Markdown 5 分钟快速上手](tech-dev/Markdown/markdown-in-5min.md)
    -   [蓝桥杯嵌入式与 STM32 学习笔记](tech-dev/Embedded/蓝桥杯嵌入式学习笔记.md)
    -   [基于 AST 语义分析的 Python 文件查重工具](tech-dev/Software/基于AST语义分析的Python文件查重.md)
    -   [基于 Pyside6 与 FFmpeg 的视频旋转稳定工具](tech-dev/Software/旋转音律视频稳定工具.md)
    -   [2024年全国大学生电子设计竞赛H题参赛杂谈](tech-dev/Embedded/2024电赛H题参赛记录.md)

-   :octicons-mortar-board-16:{ .lg .middle } __课程学习__{.middle}

    ---
    -   [区间信号自动控制](college-study/RailSig/区间信号自动控制.md)
    -   [考研数二-高数知识点](college-study/Kaoyan/kaoyan-math-hm.md)
    -   [考研数二-线代知识点](college-study/Kaoyan/kaoyan-math-la.md)
    -   [Matlab 入门学习笔记](college-study/STEM/matlab-study.md)
    -   [交叉口信号配时课程设计](college-study/STEM/交叉口信号配时课程设计.md)

-   :octicons-info-16:{ .lg .middle } __关于 & 更多__{.middle}

    ---
    -   [:octicons-people-16: 友情链接](basic/friendly-links.md)
    -   [:octicons-paper-airplane-16: 友链申请指南](basic/friendly-links-guide.md)
    -   [:octicons-heart-16: 填写联系表单](basic/contact-form.md)
    -   [:octicons-device-desktop-16: 本站的Github仓库](https://github.com/weigo6/suffine-hub)

</div>

</div>

<script>
  (() => {
    const phrases = ["A College Student!", "A Tech Enthusiast!", 
                    "Creat U Young Story!","生如逆旅，一苇以航。","关关雎鸠，在河之洲。"];
    let typeTimeout = null; // 用于存储定时器ID，方便清理

    function runTypewriter() {
      const textElement = document.getElementById('typewriter-text');
      
      // 如果当前页面没有打字机容器（说明不在主页），直接退出
      if (!textElement) return;

      // 重置状态
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typeSpeed = 100;

      // 清除可能存在的旧定时器，防止冲突
      if (typeTimeout) clearTimeout(typeTimeout);

      function type() {
        // 安全检查：如果元素已经被移除（例如用户快速跳转），停止运行
        if (!document.body.contains(textElement)) return;

        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
          textElement.textContent = currentPhrase.substring(0, charIndex - 1);
          charIndex--;
          typeSpeed = 50;
        } else {
          textElement.textContent = currentPhrase.substring(0, charIndex + 1);
          charIndex++;
          typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
          isDeleting = true;
          typeSpeed = 2000; 
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typeSpeed = 500;
        }

        typeTimeout = setTimeout(type, typeSpeed);
      }

      type();
    }

    // 监听 MkDocs Material/Zensical 的页面加载事件
    // document$ 是主题提供的 RxJS 对象，每次页面内容更新时都会触发
    if (typeof document$ !== 'undefined') {
      document$.subscribe(function() {
        runTypewriter();
      });
    } else {
      // 降级处理：如果没有开启 Instant Loading，则使用原生事件
      document.addEventListener('DOMContentLoaded', runTypewriter);
    }
  })();
</script>