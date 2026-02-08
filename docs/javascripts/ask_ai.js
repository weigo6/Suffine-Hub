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
        
        // Dynamic Query for Music Player Elements (fix race condition)
        const musicToggleBtn = document.getElementById("music-player-toggle");
        const musicContainer = document.getElementById("music-player-container");
        
        if (isOpen) {
            input.focus();
            toggleBtn.innerHTML = COLLAPSE_ICON;
            
            // Hide Music Player UI
            if (musicToggleBtn) {
                musicToggleBtn.style.display = 'none';
                musicToggleBtn.classList.remove("active");
            }
            if (musicContainer && musicContainer.classList.contains("show")) {
                musicContainer.classList.remove("show");
            }

        } else {
            toggleBtn.innerHTML = CHAT_ICON;
            
            // Restore Music Player UI
            if (musicToggleBtn) {
                musicToggleBtn.style.display = '';
            }
        }
    });

    closeBtn.addEventListener("click", () => {
        chatWindow.classList.remove("open");
        toggleBtn.innerHTML = CHAT_ICON;
        
        // Dynamic Query for Music Player Elements
        const musicToggleBtn = document.getElementById("music-player-toggle");

        // Restore Music Player UI
        if (musicToggleBtn) {
            musicToggleBtn.style.display = '';
        }
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
