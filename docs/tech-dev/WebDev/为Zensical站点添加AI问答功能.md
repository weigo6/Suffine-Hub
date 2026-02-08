---
title: 为 Zensical 站点添加AI问答功能
tags:
  - Web
  - Zensical
  - Cloudflare
icon: material/creation
comments: true
status: new
---

# 为 Zensical 站点添加 ASK AI 问答功能

本文讲述如何在 Zensical 中基于 Cloudflare Workers 和 SiliconFlow (硅基流动) 部署 AI 问答助手功能。

如果需要同时部署 ASK AI 聊天功能与音乐播放器功能，请参考[为 Zensical 站点添加音乐播放器功能](为Zensical站点添加音乐播放器功能.md#ask-ai)。

!!! tip "为什么两个功能不能各自单独部署？"

    因为两个功能按钮都设计在站点右下角，且在移动端屏幕空间有限。如果不做互斥处理，打开 AI 聊天窗口时，音乐播放器的悬浮按钮或窗口可能会遮挡输入框或聊天内容，影响用户体验。因此我们需要在代码中添加逻辑，确保同一时间只显示其中一个主要界面。

## 第一步：部署后端 (Cloudflare Worker)

后端采用 Cloudflare Worker 转发请求，隐藏 API Key 并处理跨域问题。

1.  登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2.  进入 **Workers & Pages** -> **Create Application** -> **Create Worker**。
3.  命名您的 Worker （此处命名无要求） 并点击 **Deploy**。
4.  点击 **Edit code**，复制下文的 `ai-worker.js` 内容完整复制并覆盖默认代码。
5.  保存并部署。
6.  返回 Worker 详情页，进入 **Settings** -> **Variables and Secrets**。
7.  添加变量：
    -   **Variable name**: `SILICONFLOW_API_KEY`
    -   **Value**: 您的 SiliconFlow API Key (以 `sk-` 开头)
    -   点击 **Encrypt** 加密存储。
8.  记录下您的 Worker URL (例如 `https://nav-hub-ai.username.workers.dev`)。

部署在 Cloudflare Worker 的代码 `ai-worker.js` ，记得将`const ALLOWED_ORIGINS`修改为您自己的站点地址：

```javascript
/**
 * Cloudflare Worker for AI Chat (SiliconFlow Adapter)
 * 
 * Deployment Instructions:
 * 1. Log in to Cloudflare Dashboard -> Workers & Pages -> Create Application -> Create Worker.
 * 2. Name it (e.g., 'nav-hub-ai').
 * 3. Copy-paste this code into the editor (main.js or worker.js).
 * 4. Go to Settings -> Variables -> Add Variable:
 *    - Variable name: SILICONFLOW_API_KEY
 *    - Value: Your SiliconFlow API Key (sk-...)
 *    - Encrypt: Yes
 * 5. Save and Deploy.
 * 6. Copy the Worker URL (e.g., https://nav-hub-ai.username.workers.dev) and update your frontend config.
 */

export default {
  async fetch(request, env, ctx) {
    // === CONFIGURATION ===
    const ALLOWED_ORIGINS = [
      "*" // For development/testing. In production, change this to your specific domain(s), e.g., "https://nav.example.com"
      // "https://another-site.com" 
    ];
    
    // Default model (can be overridden by client if allowed, but hardcoded here for safety)
    const MODEL_NAME = "deepseek-ai/DeepSeek-V3";
    const API_URL = "https://api.siliconflow.cn/v1/chat/completions";

    // === CORS HANDLING ===
    const origin = request.headers.get("Origin");
    const isAllowedOrigin = ALLOWED_ORIGINS.includes("*") || ALLOWED_ORIGINS.includes(origin);
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    // === API KEY CHECK ===
    const apiKey = env.SILICONFLOW_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server Configuration Error: API Key missing." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    try {
      // === REQUEST PROCESSING ===
      const { messages } = await request.json();

      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: "Invalid request body" }), { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        });
      }

      // === UPSTREAM REQUEST ===
      const upstreamResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: messages,
          stream: true
        })
      });

      if (!upstreamResponse.ok) {
        const errorText = await upstreamResponse.text();
        return new Response(JSON.stringify({ error: `Upstream API Error: ${upstreamResponse.statusText}`, details: errorText }), {
          status: upstreamResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // === STREAMING RESPONSE ===
      const { readable, writable } = new TransformStream();
      upstreamResponse.body.pipeTo(writable);

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          ...corsHeaders
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: `Worker Error: ${error.message}` }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
};
```

## 第二步：配置项目文件 (zensical.toml)

确保您的 `zensical.toml` 文件中正确引入了必要的样式和脚本：

```toml
extra_css = [
    "stylesheets/ask_ai.css", # ASK AI 样式
]

extra_javascript = [
    "https://cdn.jsdelivr.net/npm/marked/marked.min.js", # 用于 Markdown 渲染
    "javascripts/ask_ai.js", # ASK AI 核心逻辑
    "javascripts/extra.js" # 界面交互优化（可选，按钮避让页脚功能）
]
```

### 创建 CSS 样式表

创建 `stylesheets/ask_ai.css` 文件，将以下 ASK AI 功能的样式表代码填入：

```css
/* Chat Toggle Button - Style matched to #sidebar-toggle */
#ask-ai-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px; /* Reduced to match sidebar toggle */
    height: 40px;
    border-radius: 50%;
    
    /* Native Material Theme Styling */
    background-color: var(--md-default-bg-color);
    border: 1px solid var(--md-default-fg-color--lightest);
    color: var(--md-default-fg-color);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 101;
    transition: all 0.3s;
    opacity: 0.6; /* Match sidebar toggle initial state */
}

#ask-ai-toggle:hover {
    opacity: 1;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    transform: scale(1.05);
}

#ask-ai-toggle svg {
    width: 20px;
    height: 20px;
    fill: currentColor; /* Use text color */
}

/* Chat Window */
#ask-ai-window {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 400px; /* Slightly wider */
    height: 600px; /* Slightly taller */
    background-color: var(--md-default-bg-color, #fff);
    border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12); /* Softer, deeper shadow */
    display: none;
    flex-direction: column;
    z-index: 100;
    overflow: hidden;
    font-family: inherit;
    transition: width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease, right 0.3s ease, bottom 0.3s ease;
    max-height: 80vh;
}

#ask-ai-window.expanded {
    width: 800px;
    max-width: calc(100vw - 52px);
    height: 80vh;
}

#ask-ai-window.open {
    display: flex;
}

/* Header - Clean Style */
.ask-ai-header {
    padding: 10px 12px 10px 18px;
    /* Remove accent background, use default */
    background-color: var(--md-default-bg-color); 
    color: var(--md-default-fg-color);
    border-bottom: 1px solid var(--md-default-fg-color--lightest);
    
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.ask-ai-title {
    font-weight: 700;
    font-size: 1.3em;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.5px;
}

.ask-ai-title svg {
    color: var(--md-accent-fg-color); /* Keep icon colored for MKDocs recognition */
    transform: translateY(-0.6px); /* 向上移动，调整对齐 */
}

.ask-ai-controls {
    display: flex;
    align-items: center;
    gap: 4px;
}

.ask-ai-controls button svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
}

.ask-ai-close,
.ask-ai-expand {
    background: none;
    border: none;
    color: var(--md-default-fg-color--light);
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    transition: background-color 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ask-ai-close:hover,
.ask-ai-expand:hover {
    background-color: var(--md-default-fg-color--lightest);
    color: var(--md-default-fg-color);
}

/* Messages Area */
.ask-ai-messages {
    flex: 1;
    overflow-y: auto;
    /* 防止滚动链传播到父容器 */
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: var(--md-default-bg-color, #fff);
}

/* 自定义滚动条样式 */
.ask-ai-messages::-webkit-scrollbar {
  width: 6px;
}

.ask-ai-messages::-webkit-scrollbar-track {
  background: transparent;
}

.ask-ai-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.ask-ai-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.ask-ai-message {
    max-width: 88%;
    padding: 12px 16px;
    border-radius: 16px;
    line-height: 1.5;
    font-size: 16px;
    word-wrap: break-word;
}

.ask-ai-message.user {
    align-self: flex-end;
    background-color: var(--md-accent-fg-color, #0052cc);
    color: white;
    border-bottom-right-radius: 4px;
}

.ask-ai-message.assistant {
    align-self: flex-start;
    background-color: var(--md-default-fg-color--lightest, #f5f5f5);
    color: var(--md-default-fg-color, #333);
    border-bottom-left-radius: 4px;
}

/* Dark Mode Adjustments */
[data-md-color-scheme="slate"] .ask-ai-message.assistant {
    background-color: rgba(255,255,255,0.08);
    color: var(--md-default-fg-color);
}
[data-md-color-scheme="slate"] #ask-ai-window {
    border-color: rgba(255,255,255,0.1);
}

/* 深色模式下的滚动条 */
[data-md-color-scheme="slate"] .ask-ai-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

[data-md-color-scheme="slate"] .ask-ai-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Input Area */
.ask-ai-input-area {
    padding: 10px 12px;
    border-top: 1px solid var(--md-default-fg-color--lightest, #eee);
    display: flex;
    gap: 10px;
    background-color: var(--md-default-bg-color, #fff);
}

.ask-ai-input {
    flex: 1;
    border: 1px solid var(--md-default-fg-color--lightest, #ddd);
    border-radius: 24px;
    padding: 10px 18px;
    outline: none;
    background-color: transparent;
    color: var(--md-default-fg-color);
    font-size: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.ask-ai-input:focus {
    border-color: var(--md-accent-fg-color, #0052cc);
    box-shadow: 0 0 0 2px rgba(var(--md-accent-fg-color--rgb), 0.1);
}

.ask-ai-send {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: var(--md-accent-fg-color, #0052cc);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.ask-ai-send:disabled {
    background-color: var(--md-default-fg-color--lightest, #ccc);
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.7;
}

.ask-ai-send:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Markdown Content Styling */
.ask-ai-message.assistant p {
    margin: 0 0 10px 0;
}
.ask-ai-message.assistant p:last-child {
    margin: 0;
}
.ask-ai-message.assistant code {
    background-color: rgba(127,127,127,0.15);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: var(--md-code-font-family, monospace);
}
.ask-ai-message.assistant pre {
    background-color: rgba(127,127,127,0.1);
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 10px 0;
}
.ask-ai-message.assistant pre > code {
    background: transparent;
    padding: 0;
}
.ask-ai-message.assistant ul, .ask-ai-message.assistant ol {
    margin: 0 0 10px 0;
    padding-left: 20px;
}
.ask-ai-message.assistant li {
    margin-bottom: 4px;
}

/* Typing Indicator */
.typing-indicator {
    display: flex;
    gap: 5px;
    padding: 6px 10px;
}
.typing-dot {
    width: 8px;
    height: 8px;
    background-color: currentColor;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out both;
    opacity: 0.6;
}
.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}

/* Mobile Responsiveness */
@media (max-width: 480px) {
    #ask-ai-window {
        width: calc(100% - 30px); /* More margin */
        height: 70vh;
        bottom: 80px;
        right: 15px;
    }

    #ask-ai-window.expanded {
        width: 100% !important;
        height: 100% !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        border-radius: 0;
        z-index: 102; /* Ensure it covers everything */
        max-width: none !important;
        max-height: none !important;
    }
}
```

### 创建 JS 脚本实现功能逻辑

创建 `javascripts/ask_ai.js` 文件，用于实现 ASK AI 的逻辑功能：

```javascript
// Cloudflare Worker URL - REPLACE THIS WITH YOUR DEPLOYED WORKER URL
// Example: "https://nav-hub-ai.your-username.workers.dev"
const WORKER_URL = "https://ask.009420.xyz"; //本站的 URL 请求地址，自行部署必须替换为您自己的地址

const CHAT_ICON = `<svg viewBox="0 0 24 24"><path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20" /></svg>`;
const COLLAPSE_ICON = `<svg viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>`;
const EXPAND_ICON = `<svg viewBox="0 0 24 24"><path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z" /></svg>`;
const COMPRESS_ICON = `<svg viewBox="0 0 24 24"><path d="M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z" /></svg>`;

document.addEventListener("DOMContentLoaded", function () {
    // Only initialize if the toggle button doesn't exist yet
    if (document.getElementById("ask-ai-toggle")) return;

    createChatUI();
    initializeChatEvents();
});

function createChatUI() {
    // Create Toggle Button
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "ask-ai-toggle";
    toggleBtn.title = "Ask AI";
    toggleBtn.innerHTML = CHAT_ICON;
    document.body.appendChild(toggleBtn);

    // Create Chat Window
    const chatWindow = document.createElement("div");
    chatWindow.id = "ask-ai-window";
    chatWindow.innerHTML = `
        <div class="ask-ai-header">
            <div class="ask-ai-title">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
                </svg>
                Ask AI
            </div>
            <div class="ask-ai-controls">
                <button class="ask-ai-expand" title="Expand">
                    ${EXPAND_ICON}
                </button>
                <button class="ask-ai-close" title="Close">
                    <svg viewBox="0 0 24 24">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                </button>
            </div>
        </div>
        
        <div class="ask-ai-messages" id="ask-ai-messages">
            <div class="ask-ai-message assistant">
                <p>你好！我是本站的 AI 助手。有什么我可以帮你的吗？</p>
            </div>
        </div>
        
        <div class="ask-ai-input-area">
            <input type="text" class="ask-ai-input" id="ask-ai-input" placeholder="输入你的问题..." autocomplete="off">
            <button class="ask-ai-send" id="ask-ai-send" disabled>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                </svg>
            </button>
        </div>
    `;
    document.body.appendChild(chatWindow);
}

// Conversation History (Max 5 rounds = 10 messages)
let conversationHistory = [];
const MAX_HISTORY = 10;

function initializeChatEvents() {
    const toggleBtn = document.getElementById("ask-ai-toggle");
    const chatWindow = document.getElementById("ask-ai-window");
    const closeBtn = chatWindow.querySelector(".ask-ai-close");
    const expandBtn = chatWindow.querySelector(".ask-ai-expand");
    const input = document.getElementById("ask-ai-input");
    const sendBtn = document.getElementById("ask-ai-send");
    const messagesContainer = document.getElementById("ask-ai-messages");

    // Toggle Window
    toggleBtn.addEventListener("click", () => {
        chatWindow.classList.toggle("open");
        const isOpen = chatWindow.classList.contains("open");
        
        if (isOpen) {
            input.focus();
            toggleBtn.innerHTML = COLLAPSE_ICON;
        } else {
            toggleBtn.innerHTML = CHAT_ICON;
        }
    });

    closeBtn.addEventListener("click", () => {
        chatWindow.classList.remove("open");
        toggleBtn.innerHTML = CHAT_ICON;
    });

    expandBtn.addEventListener("click", () => {
        chatWindow.classList.toggle("expanded");
        const isExpanded = chatWindow.classList.contains("expanded");
        expandBtn.innerHTML = isExpanded ? COMPRESS_ICON : EXPAND_ICON;
        expandBtn.title = isExpanded ? "Collapse" : "Expand";
    });

    // Input Handling
    input.addEventListener("input", () => {
        sendBtn.disabled = !input.value.trim();
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && !sendBtn.disabled) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener("click", sendMessage);

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Clear input and disable
        input.value = "";
        input.disabled = true;
        sendBtn.disabled = true;

        // 1. Add User Message
        appendMessage("user", text);
        
        // Update history
        conversationHistory.push({ role: "user", content: text });
        if (conversationHistory.length > MAX_HISTORY) {
            conversationHistory = conversationHistory.slice(-MAX_HISTORY);
        }

        // 2. Add Assistant Message Placeholder with Typing Indicator
        const assistantMsgDiv = document.createElement("div");
        assistantMsgDiv.className = "ask-ai-message assistant";
        assistantMsgDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(assistantMsgDiv);
        scrollToBottom();

        // Check if Worker URL is configured
        if (WORKER_URL === "YOUR_CLOUDFLARE_WORKER_URL_HERE") {
             assistantMsgDiv.innerHTML = `<p style="color:red">⚠️ 错误: 请先配置 Worker URL。</p><p>请编辑 <code>docs/javascripts/ask_ai.js</code> 并填入您部署的 Cloudflare Worker 地址。</p>`;
             input.disabled = false;
             return;
        }

        try {
            // 3. Send Request to Cloudflare Worker
            const response = await fetch(WORKER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }

            // 4. Handle Streaming Response
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let assistantText = "";
            assistantMsgDiv.innerHTML = ""; // Clear typing indicator

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const jsonStr = line.slice(6);
                        if (jsonStr === "[DONE]") break;

                        try {
                            const data = JSON.parse(jsonStr);
                            const content = data.choices[0]?.delta?.content || "";
                            
                            assistantText += content;
                            
                            // Real-time Markdown Rendering (using marked.js)
                            // If marked is not available, fallback to plain text
                            if (typeof marked !== 'undefined') {
                                assistantMsgDiv.innerHTML = marked.parse(assistantText);
                            } else {
                                assistantMsgDiv.innerText = assistantText;
                            }
                            
                            scrollToBottom();
                        } catch (e) {
                            console.warn("Parse error", e);
                        }
                    }
                }
            }

            // Update history with full response
            conversationHistory.push({ role: "assistant", content: assistantText });
            if (conversationHistory.length > MAX_HISTORY) {
                conversationHistory = conversationHistory.slice(-MAX_HISTORY);
            }

        } catch (error) {
            console.error(error);
            assistantMsgDiv.innerHTML = `<p style="color:red">请求失败: ${error.message}</p>`;
        } finally {
            input.disabled = false;
            input.focus();
            scrollToBottom();
        }
    }

    function appendMessage(role, text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `ask-ai-message ${role}`;
        
        // Simple escape for user input to prevent HTML injection locally
        // (Though marked handles this for the AI response)
        if (role === 'user') {
            msgDiv.innerText = text; 
        } else {
            msgDiv.innerHTML = text;
        }
        
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}
```

### （可选）按钮自动避让页脚

创建或在 `docs/javascripts/extra.js` 文件中添加以下程序，实现 ASK AI 功能按钮自动避让页脚功能：

```javascript
/* ASK AI按钮自动避让页脚 */
document.addEventListener("DOMContentLoaded", function () {
    // 按钮避让页脚逻辑 (Footer Avoidance Logic)
    function updateButtonPosition() {
        const footer = document.querySelector(".md-footer") || document.querySelector("footer");
        if (!footer) return;

        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const distanceToFooter = viewportHeight - footerRect.top;

        // 基础底部距离 (Base bottom offset)
        const baseBottom = 20;
        let newBottom = baseBottom;

        if (distanceToFooter > 0) {
            newBottom = baseBottom + distanceToFooter;
        }

        // 更新 Ask AI 按钮位置
        const askAiToggle = document.getElementById("ask-ai-toggle");
        if (askAiToggle) {
            askAiToggle.style.bottom = `${newBottom}px`;
        }
    }

    window.addEventListener("scroll", updateButtonPosition);
    window.addEventListener("resize", updateButtonPosition);
    
    // 初始化检查 (延时一小段时间以确保动态元素已加载)
    setTimeout(updateButtonPosition, 100);
});
```

## 第三步：配置前端 (ask_ai.js)

1.  打开 `docs/javascripts/ask_ai.js` 文件。
2.  找到文件顶部的配置项：
    ```javascript
    // Cloudflare Worker URL
    const WORKER_URL = "https://your-worker-url.workers.dev"; 
    ```
3.  将 `WORKER_URL` 的值替换为您在第一步中获取的 Worker URL。
4.  保存文件。

## 第四步：验证效果

重新运行 `zensical serve` 或 `zensical build`，在站点右下角应出现 ASK AI 的悬浮按钮。点击即可开始对话。

> **注意**: 默认模型配置为 `deepseek-ai/DeepSeek-V3`，您可以在 `ai-worker.js` 中修改 `MODEL_NAME` 变量来切换其他模型。

最终部署效果如下：

![image-20260208222204957](为Zensical站点添加AI问答功能.assets/image-20260208222204957.png)

移动端支持全屏显示 AI 聊天窗口：

<div style="display: flex; justify-content: center; gap: 20px;">
  <img src="../为Zensical站点添加AI问答功能.assets/image-20260208222347333.png" style="width: 45%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" alt="Mobile View 1">
  <img src="../为Zensical站点添加AI问答功能.assets/image-20260208222407631.png" style="width: 45%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" alt="Mobile View 2">
</div>
---