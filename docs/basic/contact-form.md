---
title: 联系表单
tags:
  - 帮助支持
icon: material/card-account-mail
hide:
  - feedback
  - tags
---

# 联系表单

???+ tip "在留言前请阅读"

    欢迎与我联系！为了提高沟通效率，请参考以下说明：

    === "🔗 申请友链"
        如果您想申请交换友链，请在留言中包含以下信息：

        ```yaml title="友链格式示例/本站信息"
        站点名称: Suffine Hub
        站点地址 (URL): https://sufine.top
        站点描述: 分享学习路程，表态生活。
        图标地址 (Avatar/Logo): https://pic1.imgdb.cn/item/681ad56458cb8da5c8e1f5aa.webp
        ```

    === "📝 文章反馈"
        如果您发现文章有错误或有建议，请注明：
        
        *   **文章标题** 或 **链接**
        *   具体的问题描述或修正建议

    === "👋 商务/其他"
        欢迎任何形式的友好交流或合作咨询。

<!-- 表单容器 -->
<div class="md-typeset form-container">
  <form id="contactForm">
    
    <div class="form-grid">
      <!-- 主题：全宽 -->
      <div class="grid-item full-width">
        <label for="subject">主题</label>
        <div class="select-wrapper">
          <select id="subject" name="subject" required>
            <option value="general" selected>👋 一般留言 / 交流</option>
            <option value="friend_link">🔗 申请友链</option>
            <option value="article_feedback">📝 文章反馈 / 捉虫</option>
          </select>
        </div>
      </div>

      <!-- 姓名 -->
      <div class="grid-item">
        <label for="name">称呼</label>
        <input type="text" id="name" name="name" placeholder="我该如何称呼您？" required>
      </div>
      
      <!-- 邮箱 -->
      <div class="grid-item">
        <label for="email">邮箱</label>
        <input type="email" id="email" name="email" placeholder="接收回复用（不会公开）" required>
      </div>
      
      <!-- 内容：全宽 -->
      <div class="grid-item full-width">
        <label for="message">内容</label>
        <textarea id="message" name="message" rows="5" placeholder="请在此输入留言..." required></textarea>
      </div>
    </div>
    
    <!-- 底部栏 -->
    <div class="form-footer">
      <div class="footer-quote" id="randomQuote">
        保持热爱，奔赴山海。
      </div>
      <div class="footer-actions">
        <span id="statusMsg" class="status-text"></span>
        <button type="submit" id="submitBtn" class="md-button md-button--primary compact-btn">
          <span>发送</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>

  </form>
</div>

<style>
  /* 1. 表单容器 */
  .form-container {
    width: 100%;
    /* 使用负边距抵消主题默认的段落间距 */
    margin-top: -0.3rem; 
    padding-top: 0;
    padding-bottom: 0.5rem;
  }

  /* 2. 网格布局 */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem 0.8rem;
    margin-bottom: 0.4rem;
  }

  .full-width { grid-column: span 2; }

  /* 3. 元素样式 */
  .grid-item label {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 0.2rem;
    color: var(--md-default-fg-color--light);
  }

  .grid-item input,
  .grid-item textarea,
  .grid-item select {
    width: 100%;
    box-sizing: border-box;
    padding: 7px 10px;
    font-size: 0.9rem;
    border: 1px solid var(--md-default-fg-color--lighter);
    border-radius: 4px;
    background: var(--md-default-bg-color);
    color: var(--md-default-fg-color);
    transition: all 0.2s;
  }

  .grid-item input:focus,
  .grid-item textarea:focus,
  .grid-item select:focus {
    border-color: var(--md-primary-fg-color);
    box-shadow: 0 0 0 3px var(--md-primary-fg-color--transparent);
    outline: none;
  }

  /* 4. 底部栏 */
  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--md-default-fg-color--lighter);
    padding-top: 0.6rem;
    gap: 1rem;
  }

  .footer-quote {
    font-size: 0.8rem;
    color: var(--md-default-fg-color--light);
    font-style: italic;
    opacity: 0.8;
    max-width: 60%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex-shrink: 0;
  }

  /* 5. 发送按钮 */
  .compact-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 12px;
    font-size: 0.8rem;
    font-weight: bold;
    border-radius: 50px;
    height: auto;
    min-height: 28px;
    line-height: 1.2;
  }
  
  .compact-btn svg { 
    width: 17px;
    height: 17px;
    transform: translateY(1.5px);
    fill: currentColor; 
  }
  
  .compact-btn:active { transform: scale(0.96); }

  /* 6. 状态信息 */
  .status-text {
    font-size: 0.75rem;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .status-text.visible { opacity: 1; }
  .status-success { color: var(--md-code-hl-string-color); }
  .status-error { color: var(--md-code-hl-function-color); }

  /* 7. 移动端适配 */
  @media screen and (max-width: 600px) {
    .form-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    .full-width { grid-column: span 1; }
    
    .form-footer {
      flex-direction: column-reverse;
      align-items: flex-end;
      padding-top: 0.5rem;
    }
    .footer-quote {
      max-width: 100%;
      text-align: right;
    }
  }
</style>

<script>
  const quotes = [
    "保持热爱，奔赴山海。",
    "Code is poetry.",
    "Stay hungry, stay foolish.",
    "凡是过往，皆为序章。",
    "Talk is cheap. Show me the code.",
    "星光不问赶路人。",
    "知行合一。",
    "Less is more."
  ];

  function loadQuote() {
    const quoteEl = document.getElementById('randomQuote');
    if(quoteEl) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      quoteEl.innerText = randomQuote;
    }
  }
  loadQuote();

  document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('statusMsg');
    const originalBtnContent = btn.innerHTML;
    
    const WORKER_URL = "https://form.9420000.xyz";

    const formData = {
      subject: document.getElementById('subject').value,
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    btn.disabled = true;
    btn.innerHTML = "<span>...</span>"; 
    msg.innerText = "";
    msg.className = "status-text";

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        msg.innerText = "✅ 已发送";
        msg.className = "status-text visible status-success";
        document.getElementById('contactForm').reset();
        loadQuote();
      } else {
        throw new Error(result.error || "未知错误");
      }
    } catch (error) {
      console.error(error);
      msg.innerText = "❌ 发送失败";
      msg.className = "status-text visible status-error";
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalBtnContent;
      setTimeout(() => { msg.classList.remove('visible'); }, 5000);
    }
  });
</script>